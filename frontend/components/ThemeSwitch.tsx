'use client';

import { useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';

interface ThemeSwitchProps {
  /** Mode compact : affiche juste l'icône, sans le label ni le track */
  compact?: boolean;
}

export default function ThemeSwitch({ compact = false }: ThemeSwitchProps) {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  /* ── Version compacte (mobile navbar) : juste une icône dans un bouton carré ── */
  if (compact) {
    return (
      <button
        onClick={toggleTheme}
        title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
        className="flex items-center justify-center w-10 h-10 rounded-xl text-[var(--text-dark)] hover:text-amber-500 hover:bg-[var(--bg-page)] transition"
      >
        {theme === 'dark'
          ? <Moon className="w-5 h-5 text-amber-400" />
          : <Sun className="w-5 h-5" />
        }
      </button>
    );
  }

  /* ── Version complète (desktop top bar) ── */
  return (
    <button
      onClick={toggleTheme}
      title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border transition-all duration-300"
      style={{
        background: theme === 'dark' ? '#161B22' : '#FFFFFF',
        borderColor: theme === 'dark' ? '#30363D' : '#E2E8F0',
        color: theme === 'dark' ? '#F1F5F9' : '#0F172A',
      }}
    >
      {/* Track toggle */}
      <div
        className="relative w-9 h-5 rounded-full flex items-center transition-colors duration-300"
        style={{ background: theme === 'dark' ? '#F59E0B' : '#CBD5E1' }}
      >
        <div
          className="absolute w-4 h-4 rounded-full bg-white shadow-sm flex items-center justify-center transition-all duration-300"
          style={{ left: theme === 'dark' ? 'calc(100% - 18px)' : '2px' }}
        >
          {theme === 'dark'
            ? <Moon className="w-2.5 h-2.5 text-amber-500" />
            : <Sun className="w-2.5 h-2.5 text-slate-400" />
          }
        </div>
      </div>
      <span className="text-[10px] font-bold tracking-wider"
        style={{ color: theme === 'dark' ? '#F59E0B' : '#64748B' }}>
        {theme === 'dark' ? 'Dark' : 'Light'}
      </span>
    </button>
  );
}
