import jwt from 'jsonwebtoken';

// B1 — Le serveur refuse de démarrer si JWT_SECRET est absent
if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL : La variable JWT_SECRET est absente. Arrêt du serveur.');
  process.exit(1);
}

const JWT_SECRET = process.env.JWT_SECRET;
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

