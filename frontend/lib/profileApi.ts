import { api } from '@/lib/api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'admin';
  created_at: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
}

/**
 * Récupérer le profil de l'utilisateur connecté — GET /auth/me
 */
export const getUserProfile = async (): Promise<UserProfile> => {
  return api.get<UserProfile>('/auth/me');
};

/**
 * Mettre à jour le profil (nom, email) — PATCH /auth/profile
 */
export const updateUserProfile = async (
  updates: UpdateProfileData
): Promise<UserProfile> => {
  return api.patch<UserProfile>('/auth/profile', updates);
};

/**
 * Changer le mot de passe — PATCH /auth/change-password
 */
export const changePassword = async (
  oldPassword: string,
  newPassword: string
): Promise<void> => {
  await api.patch('/auth/change-password', { oldPassword, newPassword });
};
