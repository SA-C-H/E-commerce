'use client';
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);

  const loginStore = useAuthStore((s) => s.login);

  /* Force mot de passe */
  const pwdStrength =
    password.length === 0 ? 0 :
    password.length < 8   ? 1 :
    password.length < 12  ? 2 : 3;
  const strengthColor = ['', '#EF4444', '#F59E0B', '#10B981'];
  const strengthLabel = ['', 'Trop court', 'Correct', 'Fort'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('Le mot de passe doit comporter au moins 8 caractères');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post<{ user: any; token: string }>('/auth/register', {
        name: name.trim(),
        email: email.trim(),
        password,
      });
      loginStore(res.user, res.token);
      toast.success('Compte créé avec succès ! Bienvenue 🎉');
      router.push('/');
    } catch (err: unknown) {
      toast.error(err instanceof ApiError ? err.message : "Échec de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-5 py-3.5 rounded-xl text-sm outline-none transition focus:ring-2 focus:ring-amber-500/40';
  const inputStyle = {
    backgroundColor: '#1E2435',
    border: '1px solid #2A3045',
    color: '#F8FAFC',
    colorScheme: 'dark' as const,
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#0B0F1A' }}
    >
      <div
        className="flex w-full overflow-hidden rounded-2xl shadow-2xl"
        style={{ maxWidth: '780px', minHeight: '520px', border: '1px solid #1E2435' }}
      >

        {/* ── PANNEAU GAUCHE — Formulaire ── */}
        <div
          className="flex flex-1 flex-col justify-center px-10 py-10"
          style={{ backgroundColor: '#141926' }}
        >
          {/* Logo */}
          <Link href="/" className="inline-flex items-baseline gap-1 mb-8 w-fit">
            <span className="font-black text-xl text-amber-500 tracking-tight">TechNova</span>
            <span className="px-1.5 py-0.5 bg-amber-500 text-[#0B0F1A] text-[8px] font-black rounded tracking-widest uppercase">.ma</span>
          </Link>

          {/* Titre */}
          <div className="mb-6">
            <h1 className="text-2xl font-black text-white leading-tight mb-1">
              Create Account
            </h1>
            <p className="text-sm" style={{ color: '#94A3B8' }}>
              Fill in your details to Sign Up
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-3 w-full">

            {/* Nom */}
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className={inputClass}
              style={inputStyle}
            />

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
            <div className="space-y-1.5">
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (min. 8 caractères)"
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

              {/* Barre de force */}
              {password.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex flex-1 gap-1">
                    {[1, 2, 3].map((lvl) => (
                      <div
                        key={lvl}
                        className="h-1 flex-1 rounded-full transition-all"
                        style={{
                          backgroundColor: pwdStrength >= lvl
                            ? strengthColor[pwdStrength]
                            : '#2A3045',
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold" style={{ color: strengthColor[pwdStrength] }}>
                    {strengthLabel[pwdStrength]}
                  </span>
                </div>
              )}
            </div>

            {/* Bouton */}
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
                  Création...
                </>
              ) : (
                <>
                  Sign Up
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Lien connexion */}
          <p className="mt-5 text-sm" style={{ color: '#64748B' }}>
            Déjà un compte ?{' '}
            <Link href="/login" className="font-bold hover:underline" style={{ color: '#F59E0B' }}>
              Se connecter
            </Link>
          </p>
        </div>

        {/* ── PANNEAU DROIT — Visuel ── */}
        <div
          className="hidden lg:flex w-64 relative items-center justify-center overflow-hidden shrink-0"
          style={{ backgroundColor: '#0D1117' }}
        >
          {/* Orbe ambre */}
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
