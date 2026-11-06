import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md p-10 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm">
          <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] flex items-center justify-center mx-auto mb-4">
            <Compass className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-widest">
            Erreur 404
          </span>
          <h1 className="font-serif-title text-2xl font-bold text-[#0F172A] mt-2">
            Page Introuvable
          </h1>
          <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
            La ressource ou le produit que vous recherchez semble introuvable ou a été déplacé.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full font-semibold text-xs text-white bg-[#0F172A] hover:bg-[#2563EB] shadow-sm transition uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            Retourner à l&apos;accueil
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
