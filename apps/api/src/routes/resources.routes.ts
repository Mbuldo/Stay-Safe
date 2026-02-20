import { Router } from 'express';
import resourcesService from '../services/resources.service';

const router = Router();

// Get all resources (with filters)
router.get('/', async (req, res, next) => {
  try {
    const { type, category, city, studentFriendly, search, limit } = req.query;

    const resources = resourcesService.getAllResources({
      type: type as string,
      category: category as string,
      city: city as string,
      studentFriendly: studentFriendly === 'true',
      search: search as string,
      limit: limit ? parseInt(limit as string) : 100,
    });

    res.json({
      success: true,
      data: resources,
      meta: { count: resources.length },
    });
  } catch (error) {
    next(error);
  }
});

// Get resource by ID
router.get('/:id', async (req, res, next) => {
  try {
    const resource = resourcesService.getResourceById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        error: { message: 'Resource not found' },
      });
    }

    res.json({
      success: true,
      data: resource,
    });
  } catch (error) {
    next(error);
  }
});

// Get resources by type
router.get('/type/:type', async (req, res, next) => {
  try {
    const resources = resourcesService.getResourcesByType(req.params.type);

    res.json({
      success: true,
      data: resources,
    });
  } catch (error) {
    next(error);
  }
});

// Get resources by category
router.get('/category/:category', async (req, res, next) => {
  try {
    const resources = resourcesService.getResourcesByCategory(req.params.category);

    res.json({
      success: true,
      data: resources,
    });
  } catch (error) {
    next(error);
  }
});

export default router;