import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_temporaire_dev_ecommerce_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Génère un jeton JWT contenant l'identifiant, l'email et le rôle de l'utilisateur
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Vérifie et décode un jeton JWT
 */
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

