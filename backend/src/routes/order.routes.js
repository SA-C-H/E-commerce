import { Router } from 'express';
import * as orderController from '../controllers/order.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

const router = Router();

// Toutes les routes de commandes nécessitent d'être connecté
router.use(protect);

// Création d'une commande (client connecté)
router.post('/', orderController.createOrder);

// Liste des commandes (client : les siennes, admin : toutes)
router.get('/', orderController.getOrders);

// Détail d'une commande
router.get('/:id', orderController.getOrderById);

// Modification du statut (admin uniquement)
router.patch('/:id/status', restrictTo('admin'), orderController.updateOrderStatus);

export default router;

