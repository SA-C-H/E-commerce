import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0A1128] border-t border-[#1E293B] pt-14 pb-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Grille de liens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#2563EB] flex items-center justify-center text-white">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <span className="font-serif-title text-xl font-bold text-white block">
                Tech<span className="text-[#38BDF8]">Nova</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Boutique en ligne premium d&apos;accessoires smartphone. Chargeurs GaN ultra-rapides, protections MagSafe certifiées et câbles blindés.
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-bold tracking-widest uppercase text-white mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-white transition">Accueil</Link></li>
              <li><Link href="/products" className="hover:text-white transition">Catalogue Produits</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-white transition">Comment commander</Link></li>
              <li><Link href="/cart" className="hover:text-white transition">Mon panier</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold tracking-widest uppercase text-white mb-4">
              Informations
            </h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white transition">Livraison Express 24h/48h</Link></li>
              <li><Link href="#" className="hover:text-white transition">Garantie & Sécurité CE</Link></li>
              <li><Link href="#" className="hover:text-white transition">Mentions légales</Link></li>
              <li><Link href="#" className="hover:text-white transition">Politique de confidentialité</Link></li>
            </ul>
          </div>

          <div id="contact" className="space-y-3">
            <h4 className="text-[11px] font-bold tracking-widest uppercase text-white mb-4">
              Contact & Support
            </h4>
            <p className="text-xs leading-relaxed text-slate-400">
              Casablanca, Maroc 🇲🇦<br />
              WhatsApp : +212 600-000-000<br />
              Email : contact@technova.ma<br />
              Service client 7j/7 par message direct
            </p>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} TechNova Store. Tous droits réservés.</p>
          <p className="text-[11px]">Projet Universitaire E-Commerce &bull; Architecture Node.js / Express &bull; Next.js</p>
        </div>

      </div>
    </footer>
  );
}
