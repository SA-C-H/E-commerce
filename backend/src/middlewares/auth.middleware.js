import { verifyToken } from '../utils/jwt.js';
import { AppError } from '../utils/AppError.js';
import { getUserById } from '../services/auth.service.js';

/**
 * Middleware de protection des routes par JWT
 * Vérifie la présence et la validité du token dans le header Authorization
 */
export const protect = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Accès refusé : veuillez vous connecter pour continuer', 401));
    }

    // Décodage du jeton
    const decoded = verifyToken(token);

    // Vérification que l'utilisateur existe toujours dans la base
    const currentUser = await getUserById(decoded.id);

    // Attachement des informations de l'utilisateur à la requête
    req.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware de contrôle d'accès basé sur les rôles (RBAC)
 * Exemple : restrictTo('admin')
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError('Accès interdit : vous n\'avez pas les droits nécessaires pour effectuer cette action', 403)
      );
    }
    next();
  };
};

