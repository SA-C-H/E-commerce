'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';
import { Lock, Mail, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

/* Séparé dans un composant client car useSearchParams() requiert Suspense */
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const loginStore = useAuthStore((state) => state.login);

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
    } catch (err: any) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error('Échec de la connexion, veuillez vérifier vos identifiants.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[#0F172A] flex items-center justify-center mx-auto mb-4 shadow-md text-white">
          <Zap className="w-7 h-7 text-amber-400" />
        </div>
        <h1 className="font-serif-title text-2xl font-normal text-[var(--text-dark)]">Connexion à TechNova</h1>
        <p className="text-sm text-[var(--text-body)] mt-2">
          Accédez à votre espace client et à vos commandes
        </p>
      </div>

      <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border)] shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold tracking-wider uppercase text-[var(--text-dark)] mb-2">
              Adresse email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@exemple.com"
                className="w-full pl-10 pr-4 py-3 rounded-full bg-[var(--bg-page)] border border-[var(--border)] text-sm text-[var(--text-dark)] placeholder-[#94A3B8] focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold tracking-wider uppercase text-[var(--text-dark)] mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-full bg-[var(--bg-page)] border border-[var(--border)] text-sm text-[var(--text-dark)] placeholder-[#94A3B8] focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-[#0F172A] hover:bg-amber-500 hover:text-[var(--text-dark)] text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50"
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[var(--border)] text-center">
          <p className="text-sm text-[var(--text-body)]">
            Vous n&apos;avez pas encore de compte ?{' '}
            <Link href="/register" className="text-amber-600 font-bold hover:underline">
              Créer un compte gratuit
            </Link>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mt-5 text-xs text-[var(--text-muted)]">
        <ShieldCheck className="w-4 h-4 text-amber-500" />
        Connexion sécurisée — vos données sont protégées
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <Suspense fallback={
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        }>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
