import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  CORS_ORIGIN: z
    .string()
    .min(1)
    .default('http://localhost:5173,http://127.0.0.1:5173'),
  DATABASE_PATH: z.string().min(1).default('./data/stay-safe.db'),
  JWT_SECRET: z.string().min(1).optional(),
  DEEPSEEK_API_KEY: z.string().min(1).optional(),
  ARTICLE_SYNC_ENABLED: z.enum(['true', 'false']).default('true'),
  ARTICLE_SYNC_INTERVAL_HOURS: z.coerce.number().int().min(1).max(168).default(12),
  ARTICLE_SYNC_LIMIT_PER_CATEGORY: z.coerce.number().int().min(1).max(20).default(4),
});

export type ApiEnv = z.infer<typeof EnvSchema>;

let cachedEnv: ApiEnv | null = null;
let envLoaded = false;

function loadEnvIfNeeded(): void {
  if (envLoaded) {
    return;
  }

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

  envLoaded = true;
}

export function getApiEnv(): ApiEnv {
  loadEnvIfNeeded();

  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.errors
      .map(issue => `${issue.path.join('.')}: ${issue.message}`)
      .join('; ');
    throw new Error(`Invalid API environment configuration: ${issues}`);
  }

  if (!parsed.data.JWT_SECRET && parsed.data.NODE_ENV !== 'production') {
    parsed.data.JWT_SECRET = 'stay-safe-dev-secret';
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}

export function assertServerEnv(): ApiEnv {
  const env = getApiEnv();
  if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required to start the API server');
  }
  return env;
}
