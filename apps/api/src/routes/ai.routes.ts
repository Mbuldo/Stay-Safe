import { Router } from 'express';
import deepSeekService from '../services/deepseek.service';
import { authenticate } from '../middleware/validate';
import userService from '../services/user.service';
import { DeepSeekMessage } from '../services/deepseek.service';

const router = Router();

/**
 * POST /api/ai/chat
 * Chat with AI assistant
 */
router.post('/chat', authenticate, async (req, res, next) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: { message: 'Message is required' },
      });
    }

    const safeHistory: DeepSeekMessage[] = Array.isArray(history)
      ? history
          .filter(
            item =>
              item &&
              (item.role === 'user' ||
                item.role === 'assistant' ||
                item.role === 'system') &&
              typeof item.content === 'string'
          )
          .map(item => ({
            role: item.role as 'user' | 'assistant' | 'system',
            content: item.content,
          }))
      : [];

    const response = await deepSeekService.generateResponse(message, safeHistory);

    res.json({
      success: true,
      data: {
        message: response,
        timestamp: new Date().toISOString(),
      },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/ai/health-tips
 * Generate personalized health tips
 */
router.post('/health-tips', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).userId;

    // Get user profile
    const user = userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' },
      });
    }

    const tips = await deepSeekService.generateHealthTips({
      age: user.age,
      gender: user.gender,
    });

    res.json({
      success: true,
      data: { tips },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/ai/status
 * Lightweight endpoint for frontend diagnostics.
 */
router.get('/status', authenticate, async (_req, res, next) => {
  try {
    res.json({
      success: true,
      data: deepSeekService.getStatus(),
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
