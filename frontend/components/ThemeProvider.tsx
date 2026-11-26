'use client';

import { useEffect } from 'react';

/**
 * Applique le thème persisté (localStorage) au <html>
 * dès le premier rendu client — évite le flash FOUC.
 * Défaut : dark (thème TechNova)
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
