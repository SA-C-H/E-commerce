import bcrypt from 'bcryptjs';
import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/AppError.js';
import { generateToken } from '../utils/jwt.js';

/**
 * Service d'authentification : Inscription d'un nouveau client
 */
export const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  // 1. Vérifier si l'email existe déjà
  const { data: existingUser, error: checkError } = await supabase
    .from('users')
    .select('id')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (checkError) {
    throw new AppError(`Erreur lors de la vérification de l'utilisateur : ${checkError.message}`, 500);
  }

  if (existingUser) {
    throw new AppError('Cette adresse email est déjà associée à un compte', 409);
  }

  // 2. Hashage du mot de passe avec bcrypt
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // 3. Insertion dans la base de données Supabase
  const { data: newUser, error: insertError } = await supabase
    .from('users')
    .insert([
      {
        name: name.trim(),
        email: normalizedEmail,
        password_hash: passwordHash,
        role: 'client', // rôle client par défaut
      },
    ])
    .select('id, name, email, role, created_at')
    .single();

  if (insertError) {
    throw new AppError(`Échec de la création du compte : ${insertError.message}`, 500);
  }

  // 4. Génération du token JWT
  const token = generateToken({
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
  });

  return { user: newUser, token };
};

/**
 * Service d'authentification : Connexion d'un utilisateur
 */
export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  // 1. Recherche de l'utilisateur par email
  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('id, name, email, password_hash, role, created_at')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (fetchError) {
    throw new AppError(`Erreur lors de la recherche du compte : ${fetchError.message}`, 500);
  }

  if (!user) {
    throw new AppError('Adresse email ou mot de passe incorrect', 401);
  }

  // 2. Vérification du mot de passe
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new AppError('Adresse email ou mot de passe incorrect', 401);
  }

  // 3. Génération du token JWT
  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  // Ne pas exposer le hash du mot de passe dans la réponse
  const { password_hash, ...safeUser } = user;

  return { user: safeUser, token };
};

/**
 * Service d'authentification : Récupération du profil
 */
export const getUserById = async (userId) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('id, name, email, role, created_at')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw new AppError(`Erreur lors de la récupération du profil : ${error.message}`, 500);
  }

  if (!user) {
    throw new AppError('Utilisateur introuvable', 404);
  }

  return user;
};

/**
 * Service d'authentification : Liste de tous les utilisateurs (Admin)
 */
export const getAllUsers = async () => {
  const { data: users, error } = await supabase
    .from('users')
    .select('id, name, email, role, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw new AppError(`Erreur lors de la récupération des utilisateurs : ${error.message}`, 500);
  }

  return users || [];
};

/**
 * Service d'authentification : Mise à jour du rôle utilisateur (Admin)
 */
export const updateUserRole = async (userId, role) => {
  if (!['client', 'admin'].includes(role)) {
    throw new AppError('Rôle non valide (doit être client ou admin)', 400);
  }

  const { data, error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', userId)
    .select('id, name, email, role, created_at')
    .single();

  if (error) {
    throw new AppError(`Erreur lors du changement de rôle : ${error.message}`, 500);
  }

  return data;
};


