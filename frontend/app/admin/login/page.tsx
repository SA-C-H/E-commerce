'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';
import { Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
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

      if (res.user.role !== 'admin') {
        toast.error('Accès refusé — ce portail est réservé aux administrateurs.');
        return;
      }

      loginStore(res.user, res.token);
      toast.success(`Bienvenue, ${res.user.name}`);
      router.push('/admin');
    } catch (err: any) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error('Identifiants incorrects.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1128] flex items-center justify-center px-4">

      {/* Fond décoratif subtil */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1E293B_0%,_#0A1128_70%)] pointer-events-none" />

      <div className="relative w-full max-w-md z-10">

        {/* Logo + titre */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-5">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="font-black text-3xl tracking-tight text-white">TechNova</span>
            <span className="px-1.5 py-0.5 bg-amber-500 text-[#0A1128] text-[10px] font-black rounded tracking-widest uppercase">.ma</span>
          </div>
          <p className="text-[11px] font-bold tracking-widest uppercase text-amber-500 mt-1">
            Console d'Administration
          </p>
          <p className="text-xs text-slate-400 mt-3">
            Accès réservé aux administrateurs autorisés
          </p>
        </div>

        {/* Card formulaire */}
        <div className="bg-[#0F1A2E] border border-[#1E293B] rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-xs font-bold tracking-wider uppercase text-slate-300 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@technova.ma"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0A1128] border border-[#1E293B] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/60 focus:bg-[#0D1630] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold tracking-wider uppercase text-slate-300 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0A1128] border border-[#1E293B] text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/60 focus:bg-[#0D1630] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#0A1128] font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Accéder au Back Office'}
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          <div className="mt-6 pt-5 border-t border-[#1E293B] flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500/60" />
            Connexion sécurisée — accès administrateur uniquement
          </div>
        </div>

        {/* Lien retour boutique */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs text-slate-500 hover:text-slate-300 transition"
          >
            ← Retourner à la boutique publique
          </a>
        </div>

      </div>
    </div>
  );
}
