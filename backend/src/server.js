import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import categoryRoutes from './routes/category.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import chatRoutes from './routes/chat.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { AppError } from './utils/AppError.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// B5 — Faire confiance au proxy Railway/Vercel pour que le rate limiter
//        voie l'IP réelle du visiteur et non celle du reverse proxy.
app.set('trust proxy', 1);

// 1. Sécurité HTTP avec Helmet
app.use(helmet());

// 2. Configuration CORS — B2 : liste exacte, pas de sous-chaînes permissives
const buildAllowedOrigins = () => {
  const origins = new Set([
    'http://localhost:3000',
    'http://localhost:3001',
  ]);
  // Ajouter les origines déclarées dans les variables d'environnement
  if (process.env.FRONTEND_URL) origins.add(process.env.FRONTEND_URL);
  if (process.env.FRONTEND_URL_PROD) origins.add(process.env.FRONTEND_URL_PROD);
  return origins;
};

const allowedOrigins = buildAllowedOrigins();

app.use(
  cors({
    origin: (origin, callback) => {
      // Autoriser les requêtes sans origin (Postman, mobile natif, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(origin)) return callback(null, true);
      return callback(new AppError('Non autorisé par CORS', 403));
    },
    credentials: true,
  })
);

// 3. Limitation du débit (Rate Limiting)
// 3a. Limite globale : 300 req / 15 min par IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    success: false,
    message: 'Trop de requêtes effectuées depuis cette adresse IP, réessayez plus tard.',
    details: [],
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// 3b. B10 — Limite stricte sur les routes d'authentification (anti brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.',
    details: [],
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 4. Analyse des corps de requêtes (Body Parsers)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Journalisation des requêtes HTTP (Morgan)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// 6. Routes principales
app.use('/api/health', healthRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chat', chatRoutes);

// 7. Capture des routes non trouvées (404)
app.all('*', (req, res, next) => {
  next(new AppError(`Route introuvable : ${req.method} ${req.originalUrl}`, 404));
});

// 8. Middleware centralisé de gestion des erreurs
app.use(errorHandler);

// Démarrage du serveur si exécuté directement
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur backend démarré avec succès sur le port ${PORT}`);
    console.log(`📡 URL de santé : http://localhost:${PORT}/api/health`);
  });
}

export default app;

