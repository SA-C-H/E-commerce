'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect  = searchParams.get('redirect') || '/';
  const redirectUrl  = rawRedirect.startsWith('/') && !rawRedirect.startsWith('//') ? rawRedirect : '/';

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
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

  const inputClass =
    'w-full px-5 py-3.5 rounded-xl text-sm outline-none transition focus:ring-2 focus:ring-amber-500/40 bg-[var(--bg-page)] border border-[var(--border)] text-[var(--text-dark)] placeholder-[var(--text-muted)]';
  const inputStyle = { colorScheme: 'dark' as const, fontSize: '16px' };

  return (
    <div
      className="min-h-screen flex items-start justify-center p-3 sm:p-4 overflow-y-auto bg-[var(--bg-page)]"
    >
      <div
        className="flex w-full overflow-hidden rounded-2xl shadow-2xl my-auto border border-[var(--border)]"
        style={{ maxWidth: '780px' }}
      >
        {/* ── PANNEAU GAUCHE — Formulaire ── */}
        <div
          className="flex flex-1 flex-col justify-center px-5 sm:px-8 lg:px-10 py-8 sm:py-10 bg-[var(--bg-card)]"
        >
          {/* Logo */}
          <Link href="/" className="inline-flex items-baseline gap-1 mb-10 w-fit">
            <span className="font-black text-xl text-amber-500 tracking-tight">TechNova</span>
            <span className="px-1.5 py-0.5 bg-amber-500 text-[#0B0F1A] text-[8px] font-black rounded tracking-widest uppercase">.ma</span>
          </Link>

          {/* Titre */}
          <div className="mb-7">
            <h1 className="text-2xl font-black leading-tight mb-1 text-[var(--text-dark)]">
              Welcome Back!
            </h1>
            <p className="text-sm text-[var(--text-muted)]">
              Enter your info to Sign In
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-3 w-full">

            {/* Email */}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={inputClass}
              style={inputStyle}
            />

            {/* Mot de passe */}
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={`${inputClass} pr-12`}
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition"
                style={{ color: '#64748B' }}
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Bouton Sign In */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{
                background: loading
                  ? '#374151'
                  : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                color: '#0B0F1A',
                boxShadow: '0 4px 20px rgba(245,158,11,0.25)',
              }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#0B0F1A]/30 border-t-[#0B0F1A] rounded-full animate-spin" />
                  Connexion...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Lien inscription */}
          <p className="mt-6 text-sm text-[var(--text-muted)]">
            Pas encore de compte ?{' '}
            <Link href="/register" className="font-bold hover:underline text-amber-500">
              Créer un compte
            </Link>
          </p>
        </div>

        {/* ── PANNEAU DROIT — Visuel ── */}
        <div className="hidden lg:flex w-64 relative items-center justify-center overflow-hidden shrink-0 bg-[var(--bg-page)]">
          {/* Orbes lumineux */}
          <div
            className="absolute w-72 h-72 rounded-full blur-3xl opacity-20"
            style={{ background: 'radial-gradient(circle, #F59E0B, #92400E)', top: '-5%', right: '-20%' }}
          />
          <div
            className="absolute w-48 h-48 rounded-full blur-3xl opacity-15"
            style={{ background: 'radial-gradient(circle, #D97706, #0B0F1A)', bottom: '5%', left: '-10%' }}
          />

          {/* Disque central — Logo */}
          <div className="relative z-10 flex items-center justify-center">
            <div className="absolute w-56 h-56 rounded-full border opacity-10" style={{ borderColor: '#F59E0B' }} />
            <div className="absolute w-40 h-40 rounded-full border opacity-15" style={{ borderColor: '#F59E0B' }} />
            <div
              className="relative w-36 h-36 rounded-full flex items-center justify-center overflow-hidden"
              style={{
                background: 'radial-gradient(circle at 40% 35%, #1E2435, #0D1117)',
                boxShadow: '0 0 60px rgba(245,158,11,0.3)',
              }}
            >
              <Image
                src="/logo.png"
                alt="TechNova Logo"
                width={110}
                height={110}
                className="object-contain drop-shadow-xl"
              />
            </div>
          </div>

          <div className="absolute bottom-6 left-0 right-0 text-center">
            <p className="text-[9px] font-semibold tracking-widest uppercase" style={{ color: '#374151' }}>
              L'Expert Tech
            </p>
          </div>
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
