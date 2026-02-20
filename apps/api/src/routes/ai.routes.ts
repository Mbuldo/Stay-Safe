import { Router } from 'express';
import deepSeekService from '../services/deepseek.service';
import { authenticate } from '../middleware/validate';

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

    const response = await deepSeekService.generateResponse(message, history || []);

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
    const userService = require('../services/user.service').default;
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

export default router;