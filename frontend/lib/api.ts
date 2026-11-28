import { useAuthStore } from '@/store/authStore';

/**
 * Client API centralisé pour communiquer avec le backend Express
 * Gère automatiquement le JWT, les en-têtes et le format d'erreurs uniforme
 */

export function getApiBaseUrl(): string {
  // 1. Priorité absolue à la variable d'environnement explicite
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // 2. Contexte client (navigateur)
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    // Si accédé en local réseau via smartphone (ex: 192.168.x.x ou IP unique sans point de domaine)
    if (host && host !== 'localhost' && host !== '127.0.0.1' && !host.includes('.')) {
      return `http://${host}:5000/api`;
    }
    // Si accédé sur le web en production (ex: *.vercel.app ou domaine en ligne)
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      return 'https://backend-production-5ffe3.up.railway.app/api';
    }
  }

  // 3. Fallback développement local
  return 'http://localhost:5000/api';
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  details?: Array<{ field?: string; message: string }>;
}

export class ApiError extends Error {
  statusCode: number;
  details?: Array<{ field?: string; message: string }>;

  constructor(message: string, statusCode: number, details?: any[]) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Fonction générique de requête HTTP
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  // Priorité : sessionStorage (isolé par onglet) puis localStorage (fallback)
  const token = typeof window !== 'undefined'
    ? (sessionStorage.getItem('token') || localStorage.getItem('token'))
    : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let data: ApiResponse<T>;
  try {
    data = await response.json();
  } catch (err) {
    throw new ApiError('Réponse serveur non reconnue', response.status);
  }

  if (!response.ok || !data.success) {
    // D5 — Token expiré ou invalide : déconnecter l'utilisateur automatiquement
    if (response.status === 401 && typeof window !== 'undefined') {
      useAuthStore.getState().logout();
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
    }
    throw new ApiError(
      data.message || 'Une erreur est survenue lors de la requête',
      response.status,
      data.details
    );
  }

  return data.data as T;
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};

