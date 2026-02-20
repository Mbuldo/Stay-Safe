import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

const DB_PATH = process.env.DATABASE_PATH || join(__dirname, '../../data/stay-safe.db');

// Initialize database
export const db = new Database(DB_PATH);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Initialize schema
export function initializeDatabase() {
  const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
  db.exec(schema);
  console.log('Database initialized successfully');
}

// Graceful shutdown
process.on('exit', () => db.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));

export default db;