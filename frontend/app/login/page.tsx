'use client';

import Link from 'next/link';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';
import { Lock, Mail, ArrowRight, ShieldCheck, Zap, Eye, EyeOff } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get('redirect') || '/';
  const redirectUrl = rawRedirect.startsWith('/') && !rawRedirect.startsWith('//') ? rawRedirect : '/';

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const loginStore = useAuthStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post<{ user: any; token: string }>('/auth/login', {
        email: email.trim(),
        password,
      });
      loginStore(res.user, res.token);
      toast.success(`Bienvenue, ${res.user.name} !`);
      router.push(redirectUrl);
    } catch (err: unknown) {
      toast.error(err instanceof ApiError ? err.message : 'Identifiants incorrects.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-page)] px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-baseline gap-1 mb-6">
            <span className="font-black text-2xl text-amber-500 tracking-tight">TechNova</span>
            <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[9px] font-black rounded tracking-widest uppercase">.ma</span>
          </Link>

          <div className="w-12 h-12 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center mx-auto mb-5 shadow-sm">
            <Zap className="w-6 h-6 text-amber-500" />
          </div>
          <h1 className="text-3xl font-black text-[var(--text-dark)] leading-tight">
            Bon retour !
          </h1>
          <p className="text-[var(--text-body)] mt-2 text-sm">
            Connectez-vous pour accéder à vos commandes et votre panier sauvegardé.
          </p>
        </div>

        {/* Card formulaire */}
        <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border)] shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-xs font-bold tracking-wider uppercase text-[var(--text-dark)] mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[var(--bg-page)] border border-[var(--border)] text-sm text-[var(--text-dark)] placeholder-[var(--text-muted)] focus:outline-none focus:border-amber-500 transition"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-xs font-bold tracking-wider uppercase text-[var(--text-dark)] mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type={showPwd ? 'text' : 'password'} required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-[var(--bg-page)] border border-[var(--border)] text-sm text-[var(--text-dark)] placeholder-[var(--text-muted)] focus:outline-none focus:border-amber-500 transition"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-dark)] transition">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Bouton */}
            <button
              type="submit" disabled={loading}
              className="w-full py-4 rounded-2xl bg-[#0F172A] hover:bg-amber-500 hover:text-[#0F172A] text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion...
                </span>
              ) : (
                <>Se connecter <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[var(--border)]">
            <p className="text-sm text-center text-[var(--text-body)]">
              Pas encore de compte ?{' '}
              <Link href="/register" className="text-amber-500 font-bold hover:underline">
                Créer un compte gratuit
              </Link>
            </p>
          </div>
        </div>

        {/* Sécurité */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-[var(--text-muted)]">
          <ShieldCheck className="w-4 h-4 text-amber-500" />
          Connexion sécurisée — données protégées
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-page)]">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
