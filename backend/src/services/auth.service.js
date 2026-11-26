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
    throw new AppError(`Erreur lors de la vérification de l'utilisateur`, 500);
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
    // C1 — Laisser remonter l'erreur brute pour que errorHandler détecte le code 23505
    throw insertError;
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
    throw new AppError(`Erreur lors de la recherche du compte`, 500);
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
    throw new AppError(`Erreur lors de la récupération du profil`, 500);
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
    throw new AppError(`Erreur lors de la récupération des utilisateurs`, 500);
  }

  return users || [];
};

/**
 * Service d'authentification : Mise à jour du rôle utilisateur (Admin)
 */
export const updateUserRole = async (userId, role) => {
  // La validation du rôle et de l'UUID est faite en amont par Zod (auth.controller.js)
  const { data, error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', userId)
    .select('id, name, email, role, created_at')
    .single();

  if (error) {
    throw new AppError(`Erreur lors du changement de rôle`, 500);
  }

  if (!data) {
    throw new AppError('Utilisateur introuvable', 404);
  }

  return data;
};

/**
 * Service d'authentification : Mettre à jour le profil (nom, email)
 */
export const updateProfile = async (userId, updates) => {
  const { name, email } = updates;
  const updateData = {};

  if (name) {
    updateData.name = name.trim();
  }

  if (email) {
    const normalizedEmail = email.trim().toLowerCase();

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', normalizedEmail)
      .neq('id', userId)
      .maybeSingle();

    if (checkError) {
      throw new AppError('Erreur lors de la vérification de l\'email', 500);
    }

    if (existingUser) {
      throw new AppError('Cette adresse email est déjà utilisée par un autre compte', 409);
    }

    updateData.email = normalizedEmail;
  }

  if (Object.keys(updateData).length === 0) {
    // Aucune mise à jour
    return await getUserById(userId);
  }

  const { data: updatedUser, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', userId)
    .select('id, name, email, role, created_at')
    .single();

  if (error) {
    throw new AppError('Erreur lors de la mise à jour du profil', 500);
  }

  if (!updatedUser) {
    throw new AppError('Utilisateur introuvable', 404);
  }

  return updatedUser;
};

/**
 * Service d'authentification : Changer le mot de passe
 */
export const changePassword = async (userId, oldPassword, newPassword) => {
  // 1. Récupérer l'utilisateur
  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('id, password_hash')
    .eq('id', userId)
    .maybeSingle();

  if (fetchError) {
    throw new AppError('Erreur lors de la récupération du profil', 500);
  }

  if (!user) {
    throw new AppError('Utilisateur introuvable', 404);
  }

  // 2. Vérifier que l'ancien mot de passe est correct
  const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
  if (!isMatch) {
    throw new AppError('L\'ancien mot de passe est incorrect', 401);
  }

  // 3. Hasher le nouveau mot de passe
  const salt = await bcrypt.genSalt(10);
  const newPasswordHash = await bcrypt.hash(newPassword, salt);

  // 4. Mettre à jour le mot de passe
  const { error: updateError } = await supabase
    .from('users')
    .update({ password_hash: newPasswordHash })
    .eq('id', userId);

  if (updateError) {
    throw new AppError('Erreur lors du changement de mot de passe', 500);
  }
};

