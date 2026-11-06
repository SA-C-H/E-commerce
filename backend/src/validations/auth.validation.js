import { z } from 'zod';

/**
 * Schéma de validation pour l'inscription d'un utilisateur
 */
export const registerSchema = z.object({
  name: z
    .string({ required_error: 'Le nom est obligatoire' })
    .trim()
    .min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z
    .string({ required_error: 'L\'email est obligatoire' })
    .trim()
    .email('Adresse email invalide'),
  password: z
    .string({ required_error: 'Le mot de passe est obligatoire' })
    .min(8, 'Le mot de passe doit comporter au moins 8 caractères'),
});

/**
 * Schéma de validation pour la connexion
 */
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'L\'email est obligatoire' })
    .trim()
    .email('Adresse email invalide'),
  password: z
    .string({ required_error: 'Le mot de passe est obligatoire' })
    .min(1, 'Le mot de passe est obligatoire'),
});

