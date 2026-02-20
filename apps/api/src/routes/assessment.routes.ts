import { Router } from 'express';
import assessmentService from '../services/assessment.service';
import { validateBody, authenticate } from '../middleware/validate';
import { AssessmentSubmissionSchema } from '@stay-safe/shared';

const router = Router();

/**
 * POST /api/assessments
 * Submit a new assessment
 */
router.post('/', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    
    console.log('=== Assessment Submission ===');
    console.log('Authenticated userId:', userId);
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    // Override userId with authenticated user
    req.body.userId = userId;

    // Validate the data manually
    if (!req.body.category) {
      console.error('Missing category');
      return res.status(400).json({
        success: false,
        error: { message: 'Category is required' },
      });
    }

    if (!req.body.responses || !Array.isArray(req.body.responses)) {
      console.error('Invalid responses:', req.body.responses);
      return res.status(400).json({
        success: false,
        error: { message: 'Responses must be an array' },
      });
    }

    console.log('Validation passed, calling service...');
    const result = await assessmentService.submitAssessment(req.body);
    console.log('Assessment created successfully:', result.id);

    res.status(201).json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error: any) {
    console.error('Assessment submission error:', error.message);
    console.error('Stack:', error.stack);
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
 * GET /api/assessments
 * Get user's assessment history
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

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
 * GET /api/assessments/category/:category
 * Get assessments by category
 */
router.get('/category/:category', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const { category } = req.params;

    const assessments = assessmentService.getAssessmentsByCategory(userId, category);

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