'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { getUserProfile, updateUserProfile, changePassword, UserProfile } from '@/lib/profileApi';
import { toast } from 'sonner';
import { ArrowLeft, Mail, User, Lock, Calendar, Shield } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Form states
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Rediriger si non authentifié
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/profile');
      return;
    }

    const loadProfile = async () => {
      try {
        setLoading(true);
        const profileData = await getUserProfile();
        setProfile(profileData);
        setFormData({
          name: profileData.name,
          email: profileData.email,
        });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Erreur lors du chargement du profil');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const updated = await updateUserProfile({
        name: formData.name,
        email: formData.email,
      });

      setProfile(updated);
      setEditing(false);
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Le nouveau mot de passe doit contenir au moins 8 caractères');
      return;
    }

    try {
      await changePassword(passwordData.oldPassword, passwordData.newPassword);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setChangingPassword(false);
      toast.success('Mot de passe changé avec succès');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erreur lors du changement de mot de passe');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-amber-500 hover:text-amber-400 mb-6"
          >
            <ArrowLeft size={20} />
            Retour
          </button>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
            <p className="text-red-400">Impossible de charger le profil</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-amber-500 hover:text-amber-400 mb-6 transition"
          >
            <ArrowLeft size={20} />
            Retour
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">Mon Profil</h1>
          <p className="text-slate-400">Gérez vos informations personnelles et vos paramètres</p>
        </div>

        {/* Profile Card */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-full p-3">
                <User size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{profile.name}</h2>
                <p className="text-slate-400">{profile.email}</p>
              </div>
            </div>
            {profile.role === 'admin' && (
              <div className="flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-3 py-1">
                <Shield size={16} className="text-purple-400" />
                <span className="text-sm font-semibold text-purple-400">Administrateur</span>
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <User size={16} className="text-amber-500" />
                <span className="text-sm text-slate-400">Nom</span>
              </div>
              <p className="text-white font-semibold">{profile.name}</p>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail size={16} className="text-amber-500" />
                <span className="text-sm text-slate-400">Email</span>
              </div>
              <p className="text-white font-semibold">{profile.email}</p>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={16} className="text-amber-500" />
                <span className="text-sm text-slate-400">Rôle</span>
              </div>
              <p className="text-white font-semibold capitalize">{profile.role === 'admin' ? 'Administrateur' : 'Client'}</p>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-amber-500" />
                <span className="text-sm text-slate-400">Membre depuis</span>
              </div>
              <p className="text-white font-semibold">
                {new Date(profile.created_at).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Edit Profile Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <User size={20} />
              Modifier mes informations
            </h3>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition"
              >
                Modifier
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 transition"
                  minLength={2}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 transition"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition"
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            <div className="text-slate-400">
              Pas d'informations à modifier pour l'instant.
            </div>
          )}
        </div>

        {/* Change Password Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock size={20} />
              Sécurité
            </h3>
            {!changingPassword && (
              <button
                onClick={() => setChangingPassword(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition"
              >
                Changer le mot de passe
              </button>
            )}
          </div>

          {changingPassword ? (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, oldPassword: e.target.value })
                  }
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 transition"
                  minLength={8}
                  required
                />
                <p className="text-xs text-slate-400 mt-1">Minimum 8 caractères</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 transition"
                  required
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition"
                >
                  Changer
                </button>
                <button
                  type="button"
                  onClick={() => setChangingPassword(false)}
                  className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            <div className="text-slate-400">
              Protégez votre compte avec un mot de passe fort.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
