'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';
import { Lock, Mail, User, ArrowRight, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const loginStore = useAuthStore((state) => state.login);

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
      toast.success('Compte créé avec succès !');
      router.push('/');
    } catch (err: any) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Échec de l'inscription, vérifiez vos informations.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-[#0F172A] flex items-center justify-center mx-auto mb-4 shadow-md text-white">
              <Zap className="w-7 h-7 text-[#38BDF8]" />
            </div>
            <h1 className="font-serif-title text-2xl font-bold text-[#0F172A]">Créer un compte TechNova</h1>
            <p className="text-sm text-[#64748B] mt-2">
              Rejoignez TechNova pour suivre vos commandes et faciliter vos achats
            </p>
          </div>

          {/* Avantages */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 mb-6 shadow-sm">
            <div className="grid grid-cols-2 gap-2">
              {[
                'Suivi de commandes en direct',
                'Historique de vos achats',
                'Bon de commande prérempli',
                'Accès exclusif aux nouveautés',
              ].map((avantage) => (
                <div key={avantage} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] flex-shrink-0 mt-0.5" />
                  <span className="text-[11px] text-[#0F172A] font-semibold">{avantage}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card formulaire */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-2">Nom complet</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Youssef Bennani"
                    className="w-full pl-10 pr-4 py-3 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-2">Adresse email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nom@exemple.com"
                    className="w-full pl-10 pr-4 py-3 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-2">
                  Mot de passe <span className="text-[#94A3B8] font-normal">(8 caractères minimum)</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-[#0F172A] hover:bg-[#2563EB] text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50 mt-2"
              >
                {loading ? 'Création en cours...' : 'Créer mon compte'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-[#F1F5F9] text-center">
              <p className="text-sm text-[#64748B]">
                Vous possédez déjà un compte ?{' '}
                <Link href="/login" className="text-[#2563EB] font-bold hover:underline">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-5 text-xs text-[#94A3B8]">
            <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
            Inscription sécurisée — vos données sont protégées
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
