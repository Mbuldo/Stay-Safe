import { v4 as uuidv4 } from 'uuid';
import db from '../db/client';
import deepSeekService from './deepseek.service';
import {
  AssessmentSubmission,
  AssessmentResult,
  AssessmentHistory,
  AIPromptContext,
} from '@stay-safe/shared';

export class AssessmentService {
  async submitAssessment(submission: AssessmentSubmission): Promise<AssessmentResult> {
    const assessmentId = uuidv4();

    const userStmt = db.prepare('SELECT age, gender FROM users WHERE id = ?');
    const user = userStmt.get(submission.userId) as any;

    if (!user) {
      throw new Error('User not found');
    }

    // Try to get AI analysis, but continue if it fails
    let aiResponse;
    let aiAnalysisFailed = false;

    try {
      const aiContext: AIPromptContext = {
        userAge: user.age,
        userGender: user.gender,
        assessmentCategory: submission.category,
        responses: submission.responses,
      };

      aiResponse = await deepSeekService.analyzeAssessment(aiContext);
      console.log('AI analysis successful');
    } catch (error) {
      console.warn('AI analysis failed, using defaults:', error);
      aiAnalysisFailed = true;
      
      // Fallback response when AI is not available
      aiResponse = {
        analysis: 'AI analysis is currently unavailable. Please consult with a healthcare provider for personalized advice.',
        riskLevel: 'moderate' as const,
        score: 50,
        recommendations: [
          'Schedule a consultation with a healthcare provider',
          'Keep track of your health concerns',
          'Stay informed about sexual and reproductive health',
        ],
        resources: [],
      };
    }

    // Calculate expiration (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Save assessment to database
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
      aiResponse.riskLevel,
      aiResponse.score,
      JSON.stringify(submission.responses),
      aiAnalysisFailed ? null : aiResponse.analysis,
      JSON.stringify(aiResponse.recommendations),
      JSON.stringify(aiResponse.resources),
      expiresAt.toISOString()
    );

    // Log user interaction
    this.logInteraction(submission.userId, 'assessment', assessmentId);

    // Retrieve and return the created assessment
    const result = this.getAssessmentById(assessmentId);
    if (!result) {
      throw new Error('Failed to create assessment');
    }

    return result;
  }

  getAssessmentById(assessmentId: string): AssessmentResult | null {
    const stmt = db.prepare(`
      SELECT * FROM assessments WHERE id = ?
    `);

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

    const countStmt = db.prepare(`
      SELECT COUNT(*) as count FROM assessments WHERE user_id = ?
    `);
    const { count } = countStmt.get(userId) as any;

    return {
      userId,
      assessments,
      totalAssessments: count,
    };
  }

  getAssessmentsByCategory(userId: string, category: string): AssessmentResult[] {
    const stmt = db.prepare(`
      SELECT * FROM assessments
      WHERE user_id = ? AND category = ?
      ORDER BY created_at DESC
    `);

    const rows = stmt.all(userId, category) as any[];

    return rows.map(row => this.rowToAssessment(row));
  }

  deleteAssessment(assessmentId: string): void {
    const stmt = db.prepare(`DELETE FROM assessments WHERE id = ?`);
    stmt.run(assessmentId);
  }

  getAssessmentStats(userId: string) {
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

    const rows = stmt.all(userId) as any[];

    return rows.map(row => ({
      category: row.category,
      count: row.count,
      averageScore: row.avg_score,
      lastAssessment: new Date(row.last_assessment),
    }));
  }

  private logInteraction(userId: string, type: string, resourceId?: string): void {
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
      responses: JSON.parse(row.responses),
      aiAnalysis: row.ai_analysis,
      recommendations: JSON.parse(row.recommendations),
      resources: JSON.parse(row.resources),
      createdAt: new Date(row.created_at),
      expiresAt: row.expires_at ? new Date(row.expires_at) : undefined,
    };
  }
}

export default new AssessmentService();