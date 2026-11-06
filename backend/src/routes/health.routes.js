import { Router } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

/**
 * Route GET /api/health
 * Permet de vérifier que le serveur Express tourne et de tester la liaison Supabase
 */
router.get('/', async (req, res, next) => {
  try {
    let dbStatus = 'non configuré';

    // Test de connexion rapide si les identifiants Supabase sont renseignés
    if (process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('your-project-id')) {
      const { error } = await supabase.from('categories').select('count', { count: 'exact', head: true });
      dbStatus = error ? `erreur: ${error.message}` : 'connecté';
    }

    res.status(200).json({
      success: true,
      data: {
        status: 'OK',
        service: 'API E-commerce High-Tech',
        timestamp: new Date().toISOString(),
        database: dbStatus,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;

