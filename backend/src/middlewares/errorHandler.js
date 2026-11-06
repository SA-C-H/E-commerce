import { ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';

/**
 * Middleware centralisé de gestion des erreurs
 * Capture toutes les erreurs synchrones et asynchrones de l'application
 */
export const errorHandler = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  let error = err;

  // 1. Gestion des erreurs de validation Zod
  if (err instanceof ZodError) {
    const formattedDetails = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    error = new AppError('Données de requête invalides', 400, formattedDetails);
  }

  // 2. Gestion des erreurs JWT
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Jeton d\'authentification invalide', 401);
  }
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Jeton d\'authentification expiré, veuillez vous reconnecter', 401);
  }

  // 3. Gestion des erreurs Supabase / PostgreSQL courantes
  // Code 23505 = duplicate key value (email déjà existant, etc.)
  if (err.code === '23505') {
    error = new AppError('Cette ressource existe déjà (conflit de données uniques)', 409);
  }
  // Code 23503 = foreign key violation
  if (err.code === '23503') {
    error = new AppError('Référence invalide (clé étrangère introuvable)', 400);
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Une erreur interne est survenue sur le serveur';
  const details = error.details || [];

  // Journalisation dans la console avec horodatage
  if (statusCode >= 500) {
    console.error(`[${timestamp}] ❌ ERREUR 500 [${req.method} ${req.originalUrl}]:`, err.stack || err);
  } else {
    console.warn(`[${timestamp}] ⚠️ ALERTE ${statusCode} [${req.method} ${req.originalUrl}]: ${message}`);
  }

  // Réponse JSON uniforme requise par le cahier des charges
  return res.status(statusCode).json({
    success: false,
    message,
    details,
  });
};

