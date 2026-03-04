import { Router } from 'express';
import userService from '../services/user.service';
import { validateBody, authenticate } from '../middleware/validate';
import {
  UserRegistrationSchema,
  UserLoginSchema,
  UserUpdateSchema,
} from '@stay-safe/shared';

const router = Router();

/**
 * POST /api/users/register
 * Register a new user
 */
router.post('/register', validateBody(UserRegistrationSchema), async (req, res, next) => {
  try {
    const result = await userService.register(req.body);

    res.status(201).json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      return res.status(409).json({
        success: false,
        error: { message: error.message },
      });
    }
    next(error);
  }
});

/**
 * POST /api/users/login
 * Login user
 */
router.post('/login', validateBody(UserLoginSchema), async (req, res, next) => {
  try {
    const result = await userService.login(req.body);

    res.json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error: any) {
    if (error.message.includes('Invalid')) {
      return res.status(401).json({
        success: false,
        error: { message: error.message },
      });
    }
    next(error);
  }
});

/**
 * GET /api/users/me
 * Get current user profile
 */
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const user = userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' },
      });
    }

    res.json({
      success: true,
      data: user,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/users/me
 * Update current user profile
 */
router.patch('/me', authenticate, validateBody(UserUpdateSchema), async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const user = await userService.updateUser(userId, req.body);

    res.json({
      success: true,
      data: user,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/users/me/preferences
 * Get user preferences
 */
router.get('/me/preferences', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const preferences = userService.getUserPreferences(userId);

    res.json({
      success: true,
      data: preferences,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/users/me/preferences
 * Update user preferences
 */
router.patch('/me/preferences', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const preferences = userService.updateUserPreferences(userId, req.body);

    res.json({
      success: true,
      data: preferences,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/users/me
 * Delete user account
 */
router.delete('/me', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    userService.deleteUser(userId);

    res.json({
      success: true,
      data: { message: 'Account deleted successfully' },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    next(error);
  }
});

export default router;