import { Router } from 'express';
import * as productController from '../controllers/product.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = Router();

// Routes publiques
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Routes d'administration protégées
router.post('/', protect, restrictTo('admin'), productController.createProduct);
router.put('/:id', protect, restrictTo('admin'), productController.updateProduct);
router.delete('/:id', protect, restrictTo('admin'), productController.deleteProduct);

export default router;

