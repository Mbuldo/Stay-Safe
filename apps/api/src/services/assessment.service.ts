import { v4 as uuidv4 } from 'uuid';
import db from '../db/client';
import deepSeekService from './deepseek.service';
import {
  AssessmentCategory,
  AssessmentHistory,
  AssessmentResult,
  AssessmentSubmission,
  AssessmentQuestion,
} from '@stay-safe/shared';
import {
  buildDeterministicGuidance,
  calculateRiskScore,
  getAssessmentQuestions,
} from '../content/assessment-question-bank';

export class AssessmentService {
  getQuestions(category?: AssessmentCategory): AssessmentQuestion[] {
    return getAssessmentQuestions(category);
  }

  async submitAssessment(
    submission: AssessmentSubmission
  ): Promise<AssessmentResult> {
    const assessmentId = uuidv4();
    const userStmt = db.prepare('SELECT age, gender FROM users WHERE id = ?');
    const user = userStmt.get(submission.userId) as
      | { age: number; gender?: string | null }
      | undefined;

    if (!user) {
      throw new Error('User not found');
    }

    const scoreResult = calculateRiskScore(
      submission.category,
      submission.responses
    );
    const deterministicGuidance = buildDeterministicGuidance(
      submission.category,
      scoreResult
    );

    const aiResponse = await deepSeekService.analyzeAssessment({
      userAge: user.age,
      userGender: user.gender || undefined,
      assessmentCategory: submission.category,
      responses: submission.responses,
      computedRiskScore: scoreResult.score,
      computedRiskLevel: scoreResult.riskLevel,
      riskSignals: [...scoreResult.riskSignals, ...scoreResult.criticalSignals],
    });

    const finalAnalysis =
      aiResponse.analysis?.trim() || deterministicGuidance.analysis;
    const finalRecommendations = uniqueStrings([
      ...deterministicGuidance.recommendations,
      ...(aiResponse.recommendations || []),
    ]).slice(0, 8);
    const finalResources = uniqueResources([
      ...deterministicGuidance.resources,
      ...(aiResponse.resources || []),
    ]).slice(0, 6);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const stmt = db.prepare(`
      INSERT INTO assessments (
        id, user_id, category, risk_level, score, 
        responses, ai_analysis, recommendations, resources, expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      assessmentId,
      submission.userId,
      submission.category,
      scoreResult.riskLevel,
      scoreResult.score,
      JSON.stringify(submission.responses),
      finalAnalysis,
      JSON.stringify(finalRecommendations),
      JSON.stringify(finalResources),
      expiresAt.toISOString()
    );

    this.logInteraction(submission.userId, 'assessment', assessmentId);

    const result = this.getAssessmentById(assessmentId);
    if (!result) {
      throw new Error('Failed to create assessment');
    }

    return result;
  }

  getAssessmentById(assessmentId: string): AssessmentResult | null {
    const stmt = db.prepare('SELECT * FROM assessments WHERE id = ?');
    const row = stmt.get(assessmentId) as any;
    return row ? this.rowToAssessment(row) : null;
  }

  getUserAssessmentHistory(userId: string, limit = 10): AssessmentHistory {
    const stmt = db.prepare(`
      SELECT id, category, risk_level, score, created_at
      FROM assessments
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `);

    const rows = stmt.all(userId, limit) as any[];

    const assessments = rows.map(row => ({
      id: row.id,
      category: row.category,
      riskLevel: row.risk_level,
      score: row.score,
      completedAt: new Date(row.created_at),
    }));

    const countStmt = db.prepare(
      'SELECT COUNT(*) as count FROM assessments WHERE user_id = ?'
    );
    const result = countStmt.get(userId) as { count: number };

    return {
      userId,
      assessments,
      totalAssessments: result.count,
    };
  }

  getAssessmentsByCategory(
    userId: string,
    category: string
  ): AssessmentResult[] {
    const stmt = db.prepare(`
      SELECT * FROM assessments
      WHERE user_id = ? AND category = ?
      ORDER BY created_at DESC
    `);

    const rows = stmt.all(userId, category) as any[];
    return rows.map(row => this.rowToAssessment(row));
  }

  deleteAssessment(assessmentId: string): void {
    const stmt = db.prepare('DELETE FROM assessments WHERE id = ?');
    stmt.run(assessmentId);
  }

  getAssessmentStats(userId: string): Array<{
    category: string;
    count: number;
    averageScore: number;
    lastAssessment: Date;
  }> {
    const stmt = db.prepare(`
      SELECT 
        category,
        COUNT(*) as count,
        AVG(score) as avg_score,
        MAX(created_at) as last_assessment
      FROM assessments
      WHERE user_id = ?
      GROUP BY category
    `);

    const rows = stmt.all(userId) as Array<{
      category: string;
      count: number;
      avg_score: number;
      last_assessment: string;
    }>;

    return rows.map(row => ({
      category: row.category,
      count: row.count,
      averageScore: Math.round(row.avg_score * 10) / 10,
      lastAssessment: new Date(row.last_assessment),
    }));
  }

  private logInteraction(
    userId: string,
    type: string,
    resourceId?: string
  ): void {
    const stmt = db.prepare(`
      INSERT INTO user_interactions (id, user_id, interaction_type, resource_id)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(uuidv4(), userId, type, resourceId || null);
  }

  private rowToAssessment(row: any): AssessmentResult {
    return {
      id: row.id,
      userId: row.user_id,
      category: row.category,
      riskLevel: row.risk_level,
      score: row.score,
      responses: safeJsonParse(row.responses, []),
      aiAnalysis: row.ai_analysis || '',
      recommendations: safeJsonParse(row.recommendations, []),
      resources: safeJsonParse(row.resources, []),
      createdAt: new Date(row.created_at),
      expiresAt: row.expires_at ? new Date(row.expires_at) : undefined,
    };
  }
}

function uniqueStrings(values: string[]): string[] {
  const seen = new Set<string>();
  const output: string[] = [];

  for (const value of values) {
    const cleaned = value.trim();
    if (!cleaned) continue;
    const key = cleaned.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(cleaned);
  }

  return output;
}

function uniqueResources(
  resources: Array<{
    title: string;
    description: string;
    url?: string;
    type: string;
  }>
) {
  const seen = new Set<string>();
  const output: Array<{
    title: string;
    description: string;
    url?: string;
    type: 'article' | 'video' | 'tool' | 'hotline' | 'service';
  }> = [];
  const validTypes = new Set(['article', 'video', 'tool', 'hotline', 'service']);

  for (const resource of resources) {
    const title = resource.title?.trim();
    const description = resource.description?.trim();
    if (!title || !description) continue;

    const key = title.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    output.push({
      title,
      description,
      url: resource.url,
      type: validTypes.has(resource.type) ? (resource.type as 'article' | 'video' | 'tool' | 'hotline' | 'service') : 'service',
    });
  }

  return output;
}

function safeJsonParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch (_error) {
    return fallback;
  }
}

export default new AssessmentService();
