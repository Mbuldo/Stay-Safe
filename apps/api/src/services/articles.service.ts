import { v4 as uuidv4 } from 'uuid';
import db from '../db/client';

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  subcategory?: string;
  content: string;
  summary: string;
  author: string;
  readTime: number;
  tags: string[];
  featured: boolean;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArticleBookmark {
  id: string;
  userId: string;
  articleId: string;
  createdAt: Date;
}

export class ArticlesService {
  getAllArticles(params?: {
    category?: string;
    featured?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Article[] {
    let query = 'SELECT * FROM articles WHERE 1=1';
    const queryParams: any[] = [];

    if (params?.category) {
      query += ' AND category = ?';
      queryParams.push(params.category);
    }

    if (params?.featured !== undefined) {
      query += ' AND featured = ?';
      queryParams.push(params.featured ? 1 : 0);
    }

    if (params?.search) {
      query += ' AND (title LIKE ? OR content LIKE ? OR tags LIKE ?)';
      const searchTerm = `%${params.search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY created_at DESC';

    if (params?.limit) {
      query += ' LIMIT ?';
      queryParams.push(params.limit);
    }

    if (params?.offset) {
      query += ' OFFSET ?';
      queryParams.push(params.offset);
    }

    const stmt = db.prepare(query);
    const rows = stmt.all(...queryParams) as any[];

    return rows.map(row => this.rowToArticle(row));
  }

  getArticleBySlug(slug: string): Article | null {
    const stmt = db.prepare('SELECT * FROM articles WHERE slug = ?');
    const row = stmt.get(slug) as any;

    return row ? this.rowToArticle(row) : null;
  }

  getArticleById(id: string): Article | null {
    const stmt = db.prepare('SELECT * FROM articles WHERE id = ?');
    const row = stmt.get(id) as any;

    return row ? this.rowToArticle(row) : null;
  }

  getFeaturedArticles(limit = 6): Article[] {
    const stmt = db.prepare(`
      SELECT * FROM articles 
      WHERE featured = 1 
      ORDER BY created_at DESC 
      LIMIT ?
    `);
    const rows = stmt.all(limit) as any[];

    return rows.map(row => this.rowToArticle(row));
  }

  getArticlesByCategory(category: string, limit = 10): Article[] {
    const stmt = db.prepare(`
      SELECT * FROM articles 
      WHERE category = ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `);
    const rows = stmt.all(category, limit) as any[];

    return rows.map(row => this.rowToArticle(row));
  }

  createArticle(article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'>): Article {
    const id = uuidv4();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO articles (
        id, title, slug, category, subcategory, content, summary, 
        author, read_time, tags, featured, image_url, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      article.title,
      article.slug,
      article.category,
      article.subcategory || null,
      article.content,
      article.summary,
      article.author,
      article.readTime,
      JSON.stringify(article.tags),
      article.featured ? 1 : 0,
      article.imageUrl || null,
      now,
      now
    );

    return this.getArticleById(id)!;
  }

  bookmarkArticle(userId: string, articleId: string): ArticleBookmark {
    const id = uuidv4();
    const now = new Date().toISOString();

    try {
      const stmt = db.prepare(`
        INSERT INTO article_bookmarks (id, user_id, article_id, created_at)
        VALUES (?, ?, ?, ?)
      `);

      stmt.run(id, userId, articleId, now);

      return {
        id,
        userId,
        articleId,
        createdAt: new Date(now),
      };
    } catch (error: any) {
      if (error.message.includes('UNIQUE constraint')) {
        throw new Error('Article already bookmarked');
      }
      throw error;
    }
  }

  removeBookmark(userId: string, articleId: string): void {
    const stmt = db.prepare(`
      DELETE FROM article_bookmarks 
      WHERE user_id = ? AND article_id = ?
    `);

    stmt.run(userId, articleId);
  }

  getUserBookmarks(userId: string): Article[] {
    const stmt = db.prepare(`
      SELECT a.* FROM articles a
      INNER JOIN article_bookmarks b ON a.id = b.article_id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `);

    const rows = stmt.all(userId) as any[];
    return rows.map(row => this.rowToArticle(row));
  }

  isBookmarked(userId: string, articleId: string): boolean {
    const stmt = db.prepare(`
      SELECT COUNT(*) as count FROM article_bookmarks
      WHERE user_id = ? AND article_id = ?
    `);

    const result = stmt.get(userId, articleId) as any;
    return result.count > 0;
  }

  private rowToArticle(row: any): Article {
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      category: row.category,
      subcategory: row.subcategory,
      content: row.content,
      summary: row.summary,
      author: row.author,
      readTime: row.read_time,
      tags: JSON.parse(row.tags || '[]'),
      featured: row.featured === 1,
      imageUrl: row.image_url,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}

export default new ArticlesService();