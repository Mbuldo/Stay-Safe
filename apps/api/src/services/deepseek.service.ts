import { AIPromptContext, AIResponse } from '@stay-safe/shared';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

interface DeepSeekMessage {
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

export class DeepSeekService {
  private apiKey: string;

  constructor() {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey || apiKey === 'placeholder' || apiKey.length < 20) {
      console.warn('DEEPSEEK_API_KEY is not configured - AI features will be limited');
      this.apiKey = 'placeholder';
    } else {
      console.log('DeepSeek API key loaded successfully');
      this.apiKey = apiKey;
    }
  }

  async analyzeAssessment(context: AIPromptContext): Promise<AIResponse> {
    const prompt = this.buildAssessmentPrompt(context);
    
    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: `You are a compassionate and knowledgeable sexual and reproductive health advisor. 
        Your role is to provide evidence-based, non-judgmental guidance to help people make informed 
        decisions about their health. Always maintain privacy, respect, and accuracy. 
        Provide responses in JSON format with the following structure:
        {
          "analysis": "detailed analysis",
          "riskLevel": "low|moderate|high|critical",
          "score": 0-100,
          "recommendations": ["recommendation1", "recommendation2"],
          "resources": [{"title": "", "description": "", "type": ""}]
        }`
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    try {
      const response = await this.callDeepSeek(messages, true);
      return this.parseAssessmentResponse(response);
    } catch (error) {
      console.error('DeepSeek API error:', error);
      throw new Error('Failed to generate AI analysis');
    }
  }

  async generateResponse(
    userMessage: string,
    conversationHistory: DeepSeekMessage[] = []
  ): Promise<string> {
    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: `You are a supportive and knowledgeable sexual and reproductive health assistant.
        Provide helpful, accurate, and empathetic responses. Always prioritize user safety and 
        well-being. If a question is beyond your scope or requires professional medical attention,
        recommend consulting with a healthcare provider.`
      },
      ...conversationHistory,
      {
        role: 'user',
        content: userMessage
      }
    ];

    try {
      const response = await this.callDeepSeek(messages);
      return response;
    } catch (error) {
      console.error('DeepSeek API error:', error);
      throw new Error('Failed to generate response');
    }
  }

  private async callDeepSeek(
    messages: DeepSeekMessage[],
    jsonMode = false
  ): Promise<string> {
    const requestBody: DeepSeekRequest = {
      model: 'deepseek-chat',
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    };

    if (jsonMode) {
      requestBody.response_format = { type: 'json_object' };
    }

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY || this.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`DeepSeek API error: ${error}`);
    }

    const data = await response.json() as {
      choices: { message: { content: string } }[];
    };
    return data.choices[0].message.content;
  }

  private buildAssessmentPrompt(context: AIPromptContext): string {
    const { userAge, userGender, assessmentCategory, responses } = context;

    let prompt = `Analyze the following sexual and reproductive health assessment:\n\n`;
    prompt += `User Profile:\n`;
    prompt += `- Age: ${userAge}\n`;
    prompt += `Based on this information, provide:\n`;
    prompt += `1. A comprehensive analysis of the user's health status and risks\n`;
    prompt += `2. A risk level (low, moderate, high, or critical)\n`;
    prompt += `3. A numerical score (0-100)\n`;
    prompt += `4. Specific, actionable recommendations\n`;
    prompt += `5. Relevant resources with ACTUAL URLs (must include real website links)\n\n`;
    prompt += `For resources, provide real, working URLs to reputable health websites like:\n`;
    prompt += `- Planned Parenthood (plannedparenthood.org)\n`;
    prompt += `- CDC (cdc.gov)\n`;
    prompt += `- WHO (who.int)\n`;
    prompt += `- National health organizations\n\n`;
    prompt += `Remember to be supportive, non-judgmental, and evidence-based.`;

    if (userGender) {
      prompt += `- Gender: ${userGender}\n`;
    }
    prompt += `- Assessment Category: ${assessmentCategory}\n\n`;
    prompt += `Responses:\n`;
    
    responses.forEach((response, index) => {
      prompt += `${index + 1}. ${response.question}\n`;
      prompt += `   Answer: ${JSON.stringify(response.answer)}\n\n`;
    });

    prompt += `Based on this information, provide:\n`;
    prompt += `1. A comprehensive analysis of the user's health status and risks\n`;
    prompt += `2. A risk level (low, moderate, high, or critical)\n`;
    prompt += `3. A numerical score (0-100)\n`;
    prompt += `4. Specific, actionable recommendations\n`;
    prompt += `5. Relevant resources and next steps\n\n`;
    prompt += `Remember to be supportive, non-judgmental, and evidence-based.`;

    return prompt;
  }

  private parseAssessmentResponse(jsonResponse: string): AIResponse {
    try {
      const parsed = JSON.parse(jsonResponse);
      
      return {
        analysis: parsed.analysis || '',
        riskLevel: parsed.riskLevel || 'moderate',
        score: parsed.score || 50,
        recommendations: parsed.recommendations || [],
        resources: parsed.resources || [],
        followUpQuestions: parsed.followUpQuestions || [],
      };
    } catch (error) {
      throw new Error('Failed to parse AI response');
    }
  }

  async generateHealthTips(userProfile: {
    age: number;
    gender?: string;
    interests?: string[];
  }): Promise<string[]> {
    const prompt = `Generate 3-5 personalized health tips for a ${userProfile.age}-year-old${
      userProfile.gender ? ` ${userProfile.gender}` : ''
    }. Focus on sexual and reproductive health, wellness, and preventive care. 
    Return as a JSON array of strings.`;

    try {
      const response = await this.callDeepSeek([
        { role: 'system', content: 'You are a health education expert.' },
        { role: 'user', content: prompt }
      ], true);
      
      const parsed = JSON.parse(response);
      return Array.isArray(parsed) ? parsed : parsed.tips || [];
    } catch (error) {
      console.error('Failed to generate health tips:', error);
      return [];
    }
  }
}

export default new DeepSeekService();