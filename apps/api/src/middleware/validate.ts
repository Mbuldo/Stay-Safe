import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Middleware to validate request body against Zod schema
 */
export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Validation failed',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
        });
      }
      next(error);
    }
  };
}

/**
 * Middleware to validate query parameters
 */
export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Invalid query parameters',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
        });
      }
      next(error);
    }
  };
}

/**
 * Middleware to validate URL parameters
 */
export function validateParams(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Invalid URL parameters',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
        });
      }
      next(error);
    }
  };
}

/**
 * Authentication middleware
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: 'Authentication required' },
      });
    }

    // Import userService here to avoid circular dependency
    const userService = require('../services/user.service').default;
    const { userId } = userService.verifyToken(token);

    // Attach user ID to request
    (req as any).userId = userId;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { message: 'Invalid or expired token' },
    });
  }
}

/**
 * Error handling middleware
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', error);

  res.status(500).json({
    success: false,
    error: {
      message: error.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    },
  });
}