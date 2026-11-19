import { registerSchema, loginSchema, updateRoleSchema } from '../validations/auth.validation.js';
import * as authService from '../services/auth.service.js';

/**
 * Contrôleur : Inscription d'un utilisateur
 * POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    // 1. Validation Zod
    const validatedData = registerSchema.parse(req.body);

    // 2. Appel du service
    const result = await authService.registerUser(validatedData);

    // 3. Réponse uniforme conforme au cahier des charges
    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Contrôleur : Connexion d'un utilisateur
 * POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    // 1. Validation Zod
    const validatedData = loginSchema.parse(req.body);

    // 2. Appel du service
    const result = await authService.loginUser(validatedData);

    // 3. Réponse uniforme
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Contrôleur : Profil de l'utilisateur connecté
 * GET /api/auth/me
 */
export const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Contrôleur : Liste de tous les utilisateurs (Admin)
 * GET /api/auth/users
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await authService.getAllUsers();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Contrôleur : Modification du rôle (Admin)
 * PATCH /api/auth/users/:id/role
 */
export const updateUserRole = async (req, res, next) => {
  try {
    // C2 — Validation Zod sur le body ET l'UUID dans les params
    const { params, body } = updateRoleSchema.parse({
      params: req.params,
      body: req.body,
    });
    const user = await authService.updateUserRole(params.id, body.role);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};



