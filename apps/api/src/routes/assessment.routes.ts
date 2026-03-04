import { Router } from 'express';
import { z } from 'zod';
import assessmentService from '../services/assessment.service';
import { authenticate } from '../middleware/validate';
import { AssessmentCategorySchema, AssessmentSubmissionSchema } from '@stay-safe/shared';

const router = Router();
const AssessmentSubmissionBodySchema = AssessmentSubmissionSchema.omit({
  userId: true,
}).extend({
  timestamp: z
    .preprocess(
      value =>
        typeof value === 'string' || value instanceof Date
          ? new Date(value)
          : value,
      z.date()
    )
    .optional(),
});

/**
 * GET /api/assessments
 * Get user's assessment history
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

    const history = assessmentService.getUserAssessmentHistory(userId, limit);

    res.json({
      success: true,
      data: history,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/assessments/questions
 * Get all question sets
 */
router.get('/questions', authenticate, async (_req, res, next) => {
  try {
    const questions = assessmentService.getQuestions();

    res.json({
      success: true,
      data: questions,
      meta: { count: questions.length, timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/assessments/questions/:category
 * Get questions for a specific category
 */
router.get('/questions/:category', authenticate, async (req, res, next) => {
  try {
    const categoryValidation = AssessmentCategorySchema.safeParse(req.params.category);
    if (!categoryValidation.success) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid assessment category' },
      });
    }

    const questions = assessmentService.getQuestions(categoryValidation.data);
    res.json({
      success: true,
      data: questions,
      meta: { count: questions.length, timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/assessments/stats/me
 * Get assessment statistics
 */
router.get('/stats/me', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const stats = assessmentService.getAssessmentStats(userId);

    res.json({
      success: true,
      data: stats,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/assessments/category/:category
 * Get assessments by category
 */
router.get('/category/:category', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const categoryValidation = AssessmentCategorySchema.safeParse(req.params.category);

    if (!categoryValidation.success) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid assessment category' },
      });
    }

    const assessments = assessmentService.getAssessmentsByCategory(
      userId,
      categoryValidation.data
    );

    res.json({
      success: true,
      data: assessments,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/assessments
 * Submit a new assessment
 */
router.post('/', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const bodyValidation = AssessmentSubmissionBodySchema.safeParse(req.body);

    if (!bodyValidation.success) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: bodyValidation.error.errors.map((err: any) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
      });
    }

    const submission = AssessmentSubmissionSchema.parse({
      ...bodyValidation.data,
      userId,
      timestamp: bodyValidation.data.timestamp ?? new Date(),
    });

    const result = await assessmentService.submitAssessment(submission);

    res.status(201).json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/assessments/:id
 * Get assessment by ID
 */
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const assessment = assessmentService.getAssessmentById(req.params.id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: { message: 'Assessment not found' },
      });
    }

    // Ensure user can only access their own assessments
    const userId = (req as any).userId;
    if (assessment.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: { message: 'Access denied' },
      });
    }

    res.json({
      success: true,
      data: assessment,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/assessments/:id
 * Delete an assessment
 */
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const assessment = assessmentService.getAssessmentById(req.params.id);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: { message: 'Assessment not found' },
      });
    }

    // Ensure user can only delete their own assessments
    if (assessment.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: { message: 'Access denied' },
      });
    }

    assessmentService.deleteAssessment(req.params.id);

    res.json({
      success: true,
      data: { message: 'Assessment deleted successfully' },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
