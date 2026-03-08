import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

// Load environment variables FIRST
const envCandidates = [
  resolve(process.cwd(), '.env'),
  resolve(process.cwd(), 'apps/api/.env'),
  resolve(__dirname, '../.env'),
];

for (const candidate of envCandidates) {
  if (existsSync(candidate)) {
    dotenv.config({ path: candidate, override: false });
  }
}

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { initializeDatabase } from './db/client';
import { errorHandler } from './middleware/validate';
import { assertServerEnv } from './config/env';

// Import routes
import userRoutes from './routes/user.routes';
import assessmentRoutes from './routes/assessment.routes';
import aiRoutes from './routes/ai.routes';
import articlesRoutes from './routes/articles.routes';
import resourcesRoutes from './routes/resources.routes';
import contentBootstrapService from './services/content-bootstrap.service';

const app = express();
const env = assertServerEnv();
const PORT = env.PORT;
const allowedCorsOrigins = env.CORS_ORIGIN.split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

// Middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedCorsOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    if (env.NODE_ENV !== 'production') {
      callback(null, true);
      return;
    }
    callback(null, false);
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/resources', resourcesRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      path: req.path,
    },
  });
});

// Error handler
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database
    initializeDatabase();
    contentBootstrapService.ensureSeedContent();
    void contentBootstrapService.refreshExternalArticlesIfNeeded();

    // Start server
    app.listen(PORT, () => {
      console.log('Stay-Safe API Server');
      console.log('Status: Running');
      console.log(`Port: ${PORT}`);
      console.log(`Environment: ${env.NODE_ENV}`);
      console.log('\nAvailable endpoints:');
      console.log('  POST /api/users/register');
      console.log('  POST /api/users/login');
      console.log('  GET  /api/users/me');
      console.log('  POST /api/assessments');
      console.log('  GET  /api/assessments');
      console.log('  POST /api/ai/chat');
      console.log('  GET  /api/articles');
      console.log('  GET  /api/resources');
      console.log('');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
