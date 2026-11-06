import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = Router();

// Routes publiques
router.post('/register', authController.register);
router.post('/login', authController.login);

// Routes protégées par authentification
router.get('/me', protect, authController.getMe);
router.get('/users', protect, restrictTo('admin'), authController.getAllUsers);
router.patch('/users/:id/role', protect, restrictTo('admin'), authController.updateUserRole);

export default router;


