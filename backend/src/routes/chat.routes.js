import express from 'express';
import { handleChat } from '../controllers/chat.controller.js';

const router = express.Router();

// Route publique de chat assistant (accessible aux visiteurs et administrateurs)
router.post('/', handleChat);

export default router;
