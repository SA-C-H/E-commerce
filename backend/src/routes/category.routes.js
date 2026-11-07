import { Router } from 'express';
import * as categoryController from '../controllers/category.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = Router();

// Cache HTTP 5 minutes pour les catégories (données peu changeantes)
const httpCache = (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300, s-maxage=600, stale-while-revalidate=60');
  next();
};

// Route publique
router.get('/', httpCache, categoryController.getCategories);

// Routes protégées réservées aux administrateurs
router.post('/', protect, restrictTo('admin'), categoryController.createCategory);
router.put('/:id', protect, restrictTo('admin'), categoryController.updateCategory);
router.delete('/:id', protect, restrictTo('admin'), categoryController.deleteCategory);

export default router;

