import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] border-t border-[#1E293B] pt-12 pb-6 text-slate-400 text-sm">
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 space-y-10">

        {/* Grille principale */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

          {/* Colonne 1 — Marque */}
          <div className="space-y-4">
            <div className="flex items-baseline gap-1">
              <span className="font-black text-2xl tracking-tight text-white leading-none">TechNova</span>
              <span className="text-amber-400 font-black text-2xl leading-none">.ma</span>
            </div>
            <p className="text-[13px] text-slate-400 leading-relaxed font-normal">
              L&apos;expert tech au Maroc. Smartphones et laptops haut de gamme — iPhone, Samsung, MacBook, Dell XPS — livrés partout au Maroc, paiement à la livraison.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">Livraison 24h</span>
              <span className="text-slate-600">·</span>
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">Garantie 1 an</span>
            </div>
          </div>

          {/* Colonne 2 — Catalogue */}
          <div>
            <h4 className="text-[11px] font-black tracking-widest uppercase text-white mb-5">
              Catalogue
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Smartphones', href: '/products?search=Phone' },
                { label: 'PC Portables', href: '/products?search=Laptop' },
                { label: 'Apple iPhone & Mac', href: '/products?search=Apple' },
                { label: 'Samsung Galaxy', href: '/products?search=Galaxy' },
                { label: 'Gaming & ROG', href: '/products?search=Gaming' },
                { label: 'Voir tout', href: '/products' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href}
                    className="text-[13px] text-slate-400 hover:text-white transition font-normal">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 — Informations */}
          <div>
            <h4 className="text-[11px] font-black tracking-widest uppercase text-white mb-5">
              Informations
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Livraison Express 24h/48h', href: '#' },
                { label: 'Paiement à la livraison', href: '#' },
                { label: 'Garantie constructeur', href: '#' },
                { label: 'Mentions légales', href: '#' },
                { label: 'Politique de confidentialité', href: '#' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href}
                    className="text-[13px] text-slate-400 hover:text-white transition font-normal">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 4 — Contact */}
          <div id="contact">
            <h4 className="text-[11px] font-black tracking-widest uppercase text-white mb-5">
              Contact & Support
            </h4>
            <ul className="space-y-2.5 text-[13px] text-slate-400">
              <li>
                <a href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer"
                  className="hover:text-white transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] shrink-0" />
                  WhatsApp : +212 600-000-000
                </a>
              </li>
              <li>
                <a href="mailto:contact@technova.ma"
                  className="hover:text-white transition">
                  contact@technova.ma
                </a>
              </li>
              <li className="text-slate-500">
                Casablanca · Rabat · Marrakech · Tanger
              </li>
              <li className="text-slate-500">
                Service client 7j/7
              </li>
            </ul>
          </div>

        </div>

        {/* Barre de réassurance */}
        <div className="py-5 border-y border-[#1E293B]">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[12px] font-semibold text-slate-400">
            <span className="flex items-center gap-2">
              <span className="text-amber-400 font-black">✓</span>
              Appareils 100% neufs sous blister
            </span>
            <span className="flex items-center gap-2">
              <span className="text-amber-400 font-black">✓</span>
              Paiement à la livraison
            </span>
            <span className="flex items-center gap-2">
              <span className="text-amber-400 font-black">✓</span>
              Livraison partout au Maroc
            </span>
            <span className="flex items-center gap-2">
              <span className="text-amber-400 font-black">✓</span>
              Garantie constructeur 1 an
            </span>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-slate-600">
          <p>© {new Date().getFullYear()} TechNova Store — Tous droits réservés.</p>
          <p className="text-center sm:text-right">
            Projet Universitaire · Stack : Node.js · Express · Next.js · Supabase
          </p>
        </div>

      </div>
    </footer>
  );
}
