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

// 2. Configuration CORS
const buildAllowedOrigins = () => {
  const origins = new Set([
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
  ]);
  // Ajouter les origines déclarées dans les variables d'environnement (support virgule)
  const addEnvOrigins = (val) => {
    if (!val) return;
    val.split(',').map((s) => s.trim()).filter(Boolean).forEach((url) => origins.add(url));
  };
  addEnvOrigins(process.env.FRONTEND_URL);
  addEnvOrigins(process.env.FRONTEND_URL_PROD);
  return origins;
};

const allowedOrigins = buildAllowedOrigins();

app.use(
  cors({
    origin: (origin, callback) => {
      // Autoriser les requêtes sans origin (Postman, mobile natif, curl, SSR)
      if (!origin) return callback(null, true);
      
      // 1. Origines exactes déclarées (localhost, domaine personnalisé)
      if (allowedOrigins.has(origin)) return callback(null, true);

      // 2. Autoriser automatiquement les domaines Vercel (*.vercel.app) et Railway (*.up.railway.app)
      try {
        const { hostname } = new URL(origin);
        if (hostname.endsWith('.vercel.app') || hostname.endsWith('.up.railway.app') || hostname === 'localhost') {
          return callback(null, true);
        }
      } catch {
        // En cas d'URL mal formée
      }

      return callback(new AppError(`Non autorisé par CORS: ${origin}`, 403));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
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

