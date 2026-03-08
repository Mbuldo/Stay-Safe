import Database from 'better-sqlite3';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { getApiEnv } from '../config/env';

const DB_PATH = getApiEnv().DATABASE_PATH || join(__dirname, '../../data/stay-safe.db');

if (!existsSync(dirname(DB_PATH))) {
  mkdirSync(dirname(DB_PATH), { recursive: true });
}

// Initialize database
export const db = new Database(DB_PATH);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Initialize schema
export function initializeDatabase() {
  // Resolve schema for both source (`src/db`) and compiled (`dist/db`) runtime layouts.
  const schemaCandidates = [
    join(__dirname, 'schema.sql'),
    join(__dirname, '../db/schema.sql'),
    join(process.cwd(), 'src/db/schema.sql'),
    join(process.cwd(), 'apps/api/src/db/schema.sql'),
  ];

  const schemaPath = schemaCandidates.find(candidate => existsSync(candidate));
  if (!schemaPath) {
    throw new Error(
      `Unable to locate schema.sql. Checked: ${schemaCandidates.join(', ')}`
    );
  }

  const schema = readFileSync(schemaPath, 'utf-8');
  db.exec(schema);
  console.log('Database initialized successfully');
}

// Graceful shutdown
process.on('exit', () => db.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));

export default db;
