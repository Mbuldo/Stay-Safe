import { Router } from 'express';
import articlesService from '../services/articles.service';
import { authenticate } from '../middleware/validate';

const router = Router();

// Get all articles (with filters)
router.get('/', async (req, res, next) => {
  try {
    const { category, featured, search, limit, offset } = req.query;

    const articles = articlesService.getAllArticles({
      category: category as string,
      featured: featured === 'true',
      search: search as string,
      limit: limit ? parseInt(limit as string) : 50,
      offset: offset ? parseInt(offset as string) : 0,
    });

    res.json({
      success: true,
      data: articles,
      meta: { count: articles.length },
    });
  } catch (error) {
    next(error);
  }
});

// Get featured articles
router.get('/featured', async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
    const articles = articlesService.getFeaturedArticles(limit);

    res.json({
      success: true,
      data: articles,
    });
  } catch (error) {
    next(error);
  }
});

// Get article by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const article = articlesService.getArticleBySlug(req.params.slug);

    if (!article) {
      return res.status(404).json({
        success: false,
        error: { message: 'Article not found' },
      });
    }

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    next(error);
  }
});

// Get user bookmarks (authenticated)
router.get('/bookmarks/me', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const bookmarks = articlesService.getUserBookmarks(userId);

    res.json({
      success: true,
      data: bookmarks,
    });
  } catch (error) {
    next(error);
  }
});

// Bookmark article (authenticated)
router.post('/:articleId/bookmark', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const { articleId } = req.params;

    const bookmark = articlesService.bookmarkArticle(userId, articleId);

    res.json({
      success: true,
      data: bookmark,
    });
  } catch (error: any) {
    if (error.message.includes('already bookmarked')) {
      return res.status(409).json({
        success: false,
        error: { message: error.message },
      });
    }
    next(error);
  }
});

// Remove bookmark (authenticated)
router.delete('/:articleId/bookmark', authenticate, async (req, res, next) => {
  try {
    const userId = (req as any).userId;
    const { articleId } = req.params;

    articlesService.removeBookmark(userId, articleId);

    res.json({
      success: true,
      data: { message: 'Bookmark removed' },
    });
  } catch (error) {
    next(error);
  }
});

export default router;