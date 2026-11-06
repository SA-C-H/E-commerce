/**
 * Classe d'erreur opérationnelle personnalisée
 * Permet de définir un message, un code HTTP et des détails optionnels (validation)
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, details = []) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.details = Array.isArray(details) ? details : [details];

    Error.captureStackTrace(this, this.constructor);
  }
}

