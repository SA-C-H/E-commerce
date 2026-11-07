'use client';

import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Erreur capturée par ErrorBoundary:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md p-10 rounded-3xl bg-[var(--bg-card)] border border-[var(--border)] shadow-sm">
          <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-bold text-red-600 uppercase tracking-widest">
            Alerte d&apos;affichage
          </span>
          <h1 className="font-serif-title text-2xl font-bold text-[var(--text-dark)] mt-2">
            Un problème inattendu est survenu
          </h1>
          <p className="text-xs text-[var(--text-body)] mt-2 leading-relaxed">
            {error.message || 'Une anomalie temporaire a empêché le chargement normal de cette page.'}
          </p>

          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full font-semibold text-xs text-white bg-[#0F172A] hover:bg-amber-500 hover:text-[var(--text-dark)] shadow-sm transition uppercase tracking-wider"
          >
            <RotateCcw className="w-4 h-4" />
            Réessayer
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
