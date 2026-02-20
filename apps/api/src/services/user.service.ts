import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/client';
import { 
  UserProfile, 
  UserRegistration, 
  UserLogin,
  UserUpdate,
  UserPreferences 
} from '@stay-safe/shared';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export class UserService {
  async register(data: UserRegistration): Promise<{ user: UserProfile; token: string }> {
    const userId = uuidv4();
    const passwordHash = await bcrypt.hash(data.password, 10);

    try {
      const stmt = db.prepare(`
        INSERT INTO users (id, username, email, password_hash, age, gender)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        userId,
        data.username,
        data.email || null,
        passwordHash,
        data.age,
        data.gender || null
      );

      const prefStmt = db.prepare(`
        INSERT INTO user_preferences (user_id)
        VALUES (?)
      `);
      prefStmt.run(userId);

      const user = this.getUserById(userId);
      if (!user) {
        throw new Error('Failed to create user');
      }

      const token = this.generateToken(userId);

      return { user, token };
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        throw new Error('Username or email already exists');
      }
      throw error;
    }
  }

  async login(data: UserLogin): Promise<{ user: UserProfile; token: string }> {
    const stmt = db.prepare(`
      SELECT * FROM users WHERE username = ?
    `);

    const row = stmt.get(data.username) as any;

    if (!row) {
      throw new Error('Invalid username or password');
    }

    const isValidPassword = await bcrypt.compare(data.password, row.password_hash);

    if (!isValidPassword) {
      throw new Error('Invalid username or password');
    }

    const user = this.rowToUser(row);
    const token = this.generateToken(user.id);

    return { user, token };
  }

  getUserById(userId: string): UserProfile | null {
    const stmt = db.prepare(`
      SELECT * FROM users WHERE id = ?
    `);

    const row = stmt.get(userId) as any;

    return row ? this.rowToUser(row) : null;
  }

  async updateUser(userId: string, data: UserUpdate): Promise<UserProfile> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.username !== undefined) {
      updates.push('username = ?');
      values.push(data.username);
    }
    if (data.email !== undefined) {
      updates.push('email = ?');
      values.push(data.email);
    }
    if (data.age !== undefined) {
      updates.push('age = ?');
      values.push(data.age);
    }
    if (data.gender !== undefined) {
      updates.push('gender = ?');
      values.push(data.gender);
    }
    if (data.location !== undefined) {
      updates.push('location = ?');
      values.push(data.location);
    }

    if (updates.length === 0) {
      const user = this.getUserById(userId);
      if (!user) throw new Error('User not found');
      return user;
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(userId);

    const stmt = db.prepare(`
      UPDATE users SET ${updates.join(', ')} WHERE id = ?
    `);

    stmt.run(...values);

    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found');

    return user;
  }

  getUserPreferences(userId: string): UserPreferences | null {
    const stmt = db.prepare(`
      SELECT * FROM user_preferences WHERE user_id = ?
    `);

    const row = stmt.get(userId) as any;

    if (!row) return null;

    return {
      userId: row.user_id,
      notificationsEnabled: Boolean(row.notifications_enabled),
      dataSharing: Boolean(row.data_sharing),
      language: row.language,
      theme: row.theme,
      privacyLevel: row.privacy_level,
    };
  }

  updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): UserPreferences {
    const updates: string[] = [];
    const values: any[] = [];

    if (preferences.notificationsEnabled !== undefined) {
      updates.push('notifications_enabled = ?');
      values.push(preferences.notificationsEnabled ? 1 : 0);
    }
    if (preferences.dataSharing !== undefined) {
      updates.push('data_sharing = ?');
      values.push(preferences.dataSharing ? 1 : 0);
    }
    if (preferences.language !== undefined) {
      updates.push('language = ?');
      values.push(preferences.language);
    }
    if (preferences.theme !== undefined) {
      updates.push('theme = ?');
      values.push(preferences.theme);
    }
    if (preferences.privacyLevel !== undefined) {
      updates.push('privacy_level = ?');
      values.push(preferences.privacyLevel);
    }

    if (updates.length > 0) {
      values.push(userId);
      const stmt = db.prepare(`
        UPDATE user_preferences SET ${updates.join(', ')} WHERE user_id = ?
      `);
      stmt.run(...values);
    }

    const updated = this.getUserPreferences(userId);
    if (!updated) throw new Error('Preferences not found');

    return updated;
  }

  deleteUser(userId: string): void {
    const stmt = db.prepare(`DELETE FROM users WHERE id = ?`);
    stmt.run(userId);
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  verifyToken(token: string): { userId: string } {
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  private rowToUser(row: any): UserProfile {
    return {
      id: row.id,
      username: row.username,
      email: row.email || undefined,
      age: row.age,
      gender: row.gender || undefined,
      location: row.location || undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}

export default new UserService();