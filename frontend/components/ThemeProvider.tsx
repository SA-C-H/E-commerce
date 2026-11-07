'use client';

import { useEffect } from 'react';

/**
 * Applique le thème persisté (localStorage) au <html>
 * dès le premier rendu client — évite le flash FOUC.
 */
export default function ThemeProvider() {
  useEffect(() => {
    try {
      const stored = localStorage.getItem('technova-theme');
      const theme = stored
        ? (JSON.parse(stored)?.state?.theme ?? 'light')
        : 'light';
      document.documentElement.setAttribute('data-theme', theme);
    } catch {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  return null;
}
