'use client';

import { useEffect } from 'react';

/**
 * Synchronise le store Zustand avec l'attribut data-theme du <html>.
 * Le script inline dans layout.tsx gère déjà le premier paint (anti-FOUC).
 * Ce composant ne fait que réécouter les changements de thème après hydration.
 */
export default function ThemeProvider() {
  useEffect(() => {
    try {
      const stored = localStorage.getItem('technova-theme');
      const theme = stored
        ? (JSON.parse(stored)?.state?.theme ?? 'dark')
        : 'dark';
      document.documentElement.setAttribute('data-theme', theme);
    } catch {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  return null;
}
