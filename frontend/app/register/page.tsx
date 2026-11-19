'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';
import { Lock, Mail, User, ArrowRight, ShieldCheck, Eye, EyeOff, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);

  const loginStore = useAuthStore((s) => s.login);

  /* Force mot de passe */
  const pwdStrength = password.length === 0 ? 0 : password.length < 8 ? 1 : password.length < 12 ? 2 : 3;
  const strengthLabel = ['', 'Trop court', 'Correct', 'Fort'];
  const strengthColor = ['', 'bg-red-500', 'bg-amber-400', 'bg-emerald-500'];

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
      router.push('/orders');
    } catch (err: unknown) {
      toast.error(err instanceof ApiError ? err.message : "Échec de l'inscription.");
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
            <UserPlus className="w-6 h-6 text-amber-500" />
          </div>
          <h1 className="text-3xl font-black text-[var(--text-dark)] leading-tight">
            Créer un compte
          </h1>
          <p className="text-[var(--text-body)] mt-2 text-sm">
            Gratuit et sans engagement — votre compte en 30 secondes.
          </p>
        </div>

        {/* Card formulaire */}
        <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border)] shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Nom */}
            <div>
              <label className="block text-xs font-bold tracking-wider uppercase text-[var(--text-dark)] mb-2">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text" required
                  value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Ex : Youssef Bennani"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[var(--bg-page)] border border-[var(--border)] text-sm text-[var(--text-dark)] placeholder-[var(--text-muted)] focus:outline-none focus:border-amber-500 transition"
                />
              </div>
            </div>

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
                  type={showPwd ? 'text' : 'password'} required minLength={8}
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="8 caractères minimum"
                  className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-[var(--bg-page)] border border-[var(--border)] text-sm text-[var(--text-dark)] placeholder-[var(--text-muted)] focus:outline-none focus:border-amber-500 transition"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-dark)] transition">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Barre de force */}
              {password.length > 0 && (
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3].map((lvl) => (
                      <div key={lvl}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          pwdStrength >= lvl ? strengthColor[pwdStrength] : 'bg-[var(--border)]'
                        }`} />
                    ))}
                  </div>
                  <span className={`text-[11px] font-bold ${
                    pwdStrength === 1 ? 'text-red-500' :
                    pwdStrength === 2 ? 'text-amber-500' : 'text-emerald-500'
                  }`}>
                    {strengthLabel[pwdStrength]}
                  </span>
                </div>
              )}
            </div>

            {/* Bouton */}
            <button
              type="submit" disabled={loading}
              className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-[#0F172A] font-bold text-sm flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#0F172A]/30 border-t-[#0F172A] rounded-full animate-spin" />
                  Création du compte...
                </span>
              ) : (
                <>Créer mon compte <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[var(--border)]">
            <p className="text-sm text-center text-[var(--text-body)]">
              Vous avez déjà un compte ?{' '}
              <Link href="/login" className="text-amber-500 font-bold hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        {/* Sécurité */}
        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-[var(--text-muted)]">
          <ShieldCheck className="w-4 h-4 text-amber-500" />
          Inscription sécurisée — vos données sont protégées
        </div>

      </div>
    </div>
  );
}
