import { AIPromptContext, AIResponse } from '@stay-safe/shared';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekRequest {
  model: string;
  messages: DeepSeekMessage[];
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: 'json_object' };
}

interface DeepSeekApiResponse {
  choices?: Array<{ message?: { content?: string } }>;
}

export class DeepSeekService {
  private readonly apiKey: string | null;

  constructor() {
    const key = process.env.DEEPSEEK_API_KEY?.trim() || null;
    this.apiKey = key && key.length >= 20 ? key : null;

    if (this.apiKey) {
      console.log('DeepSeek API integration enabled');
    } else {
      console.warn(
        'DEEPSEEK_API_KEY not detected. AI analysis will use deterministic fallback.'
      );
    }
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  getStatus(): { configured: boolean; provider: string; model: string } {
    return {
      configured: this.isConfigured(),
      provider: 'deepseek',
      model: 'deepseek-chat',
    };
  }

  async analyzeAssessment(context: AIPromptContext): Promise<AIResponse> {
    if (!this.apiKey) {
      return this.fallbackAssessmentResponse(context);
    }

    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: `You are a sexual and reproductive health clinical assistant.
Return strict JSON only. Do not use markdown fences.
JSON schema:
{
  "analysis": "clear patient-friendly explanation",
  "recommendations": ["actionable item 1", "actionable item 2"],
  "resources": [
    { "title": "resource name", "description": "why it helps", "url": "https://...", "type": "article|video|tool|hotline|service" }
  ]
}
Rules:
- Be non-judgmental and safety-focused.
- Keep recommendations practical and specific.
- If severe risk is indicated, explicitly advise urgent in-person care.
- Do not invent medications, diagnosis, or impossible claims.`,
      },
      {
        role: 'user',
        content: this.buildAssessmentPrompt(context),
      },
    ];

    try {
      const response = await this.callDeepSeek(messages, true);
      const parsed = this.parseJsonObject(response);

      return {
        analysis:
          stringOrFallback(
            parsed.analysis,
            this.fallbackAssessmentResponse(context).analysis
          ),
        riskLevel: this.pickRiskLevel(
          parsed.riskLevel,
          context.computedRiskLevel || 'moderate'
        ),
        score: this.pickScore(parsed.score, context.computedRiskScore ?? 50),
        recommendations: this.parseRecommendationList(parsed.recommendations),
        resources: this.parseResourceList(parsed.resources),
      };
    } catch (error) {
      console.warn('DeepSeek assessment call failed, fallback will be used:', error);
      return this.fallbackAssessmentResponse(context);
    }
  }

  async generateResponse(
    userMessage: string,
    conversationHistory: DeepSeekMessage[] = []
  ): Promise<string> {
    if (!this.apiKey) {
      return 'AI support is temporarily unavailable. You can still use assessments and resource recommendations while configuration is restored.';
    }

    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content:
          'You are a supportive sexual and reproductive health assistant. Give concise, practical, non-judgmental guidance and recommend professional care for urgent symptoms.',
      },
      ...sanitizeHistory(conversationHistory),
      { role: 'user', content: userMessage },
    ];

    try {
      return await this.callDeepSeek(messages);
    } catch (error) {
      console.warn('DeepSeek chat call failed:', error);
      return 'I could not generate a live AI response right now. Please try again shortly, or contact a healthcare provider for urgent concerns.';
    }
  }

  async generateHealthTips(userProfile: {
    age: number;
    gender?: string;
    interests?: string[];
  }): Promise<string[]> {
    if (!this.apiKey) {
      return fallbackHealthTips(userProfile.age);
    }

    const prompt = `Generate exactly 5 short, practical sexual/reproductive health tips for a ${userProfile.age}-year-old${
      userProfile.gender ? ` (${userProfile.gender})` : ''
    }.
Respond as JSON:
{ "tips": ["tip1", "tip2", ...] }`;

    try {
      const response = await this.callDeepSeek(
        [
          { role: 'system', content: 'You are a preventive health education specialist.' },
          { role: 'user', content: prompt },
        ],
        true
      );
      const parsed = this.parseJsonObject(response);
      const tips = Array.isArray(parsed.tips)
        ? parsed.tips
            .map(item => (typeof item === 'string' ? item.trim() : ''))
            .filter(Boolean)
        : [];
      return tips.length > 0 ? tips.slice(0, 5) : fallbackHealthTips(userProfile.age);
    } catch (error) {
      console.warn('DeepSeek health tips call failed:', error);
      return fallbackHealthTips(userProfile.age);
    }
  }

  private async callDeepSeek(
    messages: DeepSeekMessage[],
    jsonMode = false
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('DeepSeek API key is not configured');
    }

    const requestBody: DeepSeekRequest = {
      model: 'deepseek-chat',
      messages,
      temperature: 0.35,
      max_tokens: 1200,
      ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`DeepSeek API error ${response.status}: ${errorText}`);
      }

      const data = (await response.json()) as DeepSeekApiResponse;
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('DeepSeek response did not include message content');
      }

      return content;
    } finally {
      clearTimeout(timeout);
    }
  }

  private buildAssessmentPrompt(context: AIPromptContext): string {
    const responseLines = context.responses
      .map((response, index) => {
        const answer =
          typeof response.answer === 'string'
            ? response.answer
            : JSON.stringify(response.answer);
        return `${index + 1}. ${response.question}\n   Answer: ${answer}`;
      })
      .join('\n');

    return `
Assessment category: ${context.assessmentCategory}
User age: ${context.userAge}
User gender: ${context.userGender || 'not specified'}
Deterministic score: ${context.computedRiskScore ?? 'n/a'} / 100
Deterministic risk level: ${context.computedRiskLevel ?? 'n/a'}
Key risk signals: ${(context.riskSignals || []).join(', ') || 'none reported'}

Assessment responses:
${responseLines}

Create:
1) analysis
2) recommendations (max 6, non-duplicate)
3) resources (max 4, with real URLs when possible)
`.trim();
  }

  private parseJsonObject(raw: string): Record<string, any> {
    const fencedMatch = raw.match(/```json\s*([\s\S]*?)```/i);
    const candidate = (fencedMatch?.[1] || raw).trim();
    return JSON.parse(candidate) as Record<string, any>;
  }

  private fallbackAssessmentResponse(context: AIPromptContext): AIResponse {
    const score = context.computedRiskScore ?? 50;
    const risk = context.computedRiskLevel ?? 'moderate';
    const severityLine =
      risk === 'critical'
        ? 'Urgent risk signals were detected. Seek immediate in-person care.'
        : risk === 'high'
          ? 'High-priority concerns were identified. Arrange clinical review soon.'
          : risk === 'moderate'
            ? 'Moderate concerns were identified and should be followed up.'
            : 'Current responses suggest lower immediate risk with ongoing prevention needed.';

    return {
      analysis: `${severityLine} This result is generated by a validated local scoring model while live AI personalization is unavailable.`,
      riskLevel: risk,
      score,
      recommendations: [
        'Follow the tailored recommendations in your assessment summary.',
        'Use trusted clinics or campus services for testing and treatment.',
        'Seek urgent help immediately if symptoms worsen or safety concerns escalate.',
      ],
      resources: [],
      followUpQuestions: [],
    };
  }

  private parseRecommendationList(raw: unknown): string[] {
    if (!Array.isArray(raw)) {
      return [];
    }

    return raw
      .map(item => (typeof item === 'string' ? item.trim() : ''))
      .filter(Boolean)
      .slice(0, 6);
  }

  private parseResourceList(raw: unknown): AIResponse['resources'] {
    if (!Array.isArray(raw)) {
      return [];
    }

    const allowedTypes = new Set(['article', 'video', 'tool', 'hotline', 'service']);
    const parsed: AIResponse['resources'] = [];

    for (const item of raw) {
      if (typeof item !== 'object' || item === null) {
        continue;
      }

      const value = item as Record<string, unknown>;
      const title = typeof value.title === 'string' ? value.title.trim() : '';
      const description =
        typeof value.description === 'string' ? value.description.trim() : '';
      const rawType = typeof value.type === 'string' ? value.type.trim() : 'service';
      const type = allowedTypes.has(rawType) ? rawType : 'service';
      const url = typeof value.url === 'string' ? value.url.trim() : undefined;

      if (!title || !description) {
        continue;
      }

      if (url && !isLikelyHttpUrl(url)) {
        continue;
      }

      parsed.push({ title, description, url, type });
    }

    return parsed.slice(0, 4);
  }

  private pickRiskLevel(raw: unknown, fallback: AIResponse['riskLevel']): AIResponse['riskLevel'] {
    const validLevels: AIResponse['riskLevel'][] = [
      'low',
      'moderate',
      'high',
      'critical',
    ];
    if (typeof raw === 'string' && validLevels.includes(raw as AIResponse['riskLevel'])) {
      return raw as AIResponse['riskLevel'];
    }
    return fallback;
  }

  private pickScore(raw: unknown, fallback: number): number {
    if (typeof raw === 'number' && Number.isFinite(raw)) {
      return Math.max(0, Math.min(100, Math.round(raw)));
    }
    return Math.max(0, Math.min(100, Math.round(fallback)));
  }
}

function sanitizeHistory(history: DeepSeekMessage[]): DeepSeekMessage[] {
  return history
    .filter(
      message =>
        (message.role === 'user' ||
          message.role === 'assistant' ||
          message.role === 'system') &&
        typeof message.content === 'string' &&
        message.content.trim().length > 0
    )
    .slice(-10);
}

function fallbackHealthTips(age: number): string[] {
  return [
    'Use barrier protection consistently to reduce STI risk.',
    'Schedule routine sexual health screening at least yearly, or sooner after new exposure.',
    'Track menstrual or reproductive symptoms so you can share clear details with clinicians.',
    age < 25
      ? 'Discuss HPV vaccination and preventive care during your next clinic visit.'
      : 'Review preventive screening timing with your healthcare provider.',
    'Seek urgent care immediately if you have severe pain, heavy bleeding, or safety concerns.',
  ];
}

function stringOrFallback(raw: unknown, fallback: string): string {
  return typeof raw === 'string' && raw.trim().length > 0 ? raw.trim() : fallback;
}

function isLikelyHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (_error) {
    return false;
  }
}

export default new DeepSeekService();
