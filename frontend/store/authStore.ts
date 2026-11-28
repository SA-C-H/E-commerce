import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'admin';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,

      login: (user: User, token: string) => {
        // sessionStorage → chaque onglet a sa propre session
        // deux onglets peuvent être connectés avec des comptes différents
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('token', token);
          // Compatibilité api.ts qui lit aussi localStorage
          localStorage.setItem('token', token);
        }
        set({
          user,
          token,
          isAuthenticated: true,
          isAdmin: user.role === 'admin',
        });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('token');
          localStorage.removeItem('token');
        }
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      },
    }),
    {
      name: 'technova-auth',
      // sessionStorage : la session est isolée par onglet
      // fermer l'onglet = déconnexion automatique
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? sessionStorage : localStorage
      ),
    }
  )
);
