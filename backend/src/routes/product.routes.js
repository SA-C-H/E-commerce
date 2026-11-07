import { Router } from 'express';
import * as productController from '../controllers/product.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = Router();

// Middleware cache HTTP pour les routes publiques (60s navigateur, 120s CDN)
const httpCache = (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=60, s-maxage=120, stale-while-revalidate=30');
  next();
};

// Routes publiques
router.get('/', httpCache, productController.getProducts);
router.get('/:id', httpCache, productController.getProductById);

// Routes d'administration protégées
router.post('/', protect, restrictTo('admin'), productController.createProduct);
router.put('/:id', protect, restrictTo('admin'), productController.updateProduct);
router.delete('/:id', protect, restrictTo('admin'), productController.deleteProduct);

export default router;

