'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Search,
  MessageCircle,
  Grid,
  ChevronDown,
  MapPin,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import ThemeSwitch from '@/components/ThemeSwitch';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const totalCount = useCartStore((state) => state.getTotalCount());
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => { setMounted(true); }, []);

  const navCategories = [
    { label: '★ BONS PLANS', href: '/products?sortBy=price_asc', highlight: true },
    { label: 'PC Portables', href: '/products?search=Laptop' },
    { label: 'Smartphones', href: '/products?search=Phone' },
    { label: 'Apple', href: '/products?search=Apple' },
    { label: 'Samsung', href: '/products?search=Galaxy' },
    { label: 'Tablettes', href: '/products?search=iPad' },
    { label: 'Gaming', href: '/products?search=Gaming' },
    { label: 'Tout voir', href: '/products' },
  ];

  return (
    <>
      {/* ── TOP BAR : ribbon promo + coordonnées fusionnés ── */}
      <div className="hidden lg:block bg-[#0A1128] text-white border-b border-white/5">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 h-9 flex items-center justify-between">
          {/* Gauche — promo */}
          <div className="flex items-center gap-3 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse shrink-0" />
            <span className="font-black text-[#DC2626] uppercase tracking-widest text-[11px]">BLACK FRIDAY</span>
            <span className="text-slate-400 text-[11px]">— Livraison 24h · Paiement à la livraison</span>
            <Link href="/products" className="text-amber-400 hover:text-amber-300 font-semibold text-[11px] underline transition">
              Voir les offres →
            </Link>
          </div>
          {/* Droite — contact + switch */}
          <div className="flex items-center gap-5 text-[11px] text-slate-300">
            <a href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#25D366] transition">
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
              +212 6 00 00 00 00
            </a>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400" />
              Casablanca · Rabat · Marrakech
            </span>
            <span className="text-white/20">|</span>
            <ThemeSwitch />
          </div>
        </div>
      </div>

      {/* ── HEADER PRINCIPAL ── */}
      <header className="sticky top-0 z-50 bg-[var(--bg-card)] border-b border-[var(--border)] shadow-sm"
        style={{ transition: 'background 0.3s ease, border-color 0.3s ease' }}>

        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-3">
          <div className="flex items-center justify-between gap-3">

            {/* Logo + bouton menu */}
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setMobileMenuOpen(true)}
                className="flex items-center justify-center w-10 h-10 text-[var(--text-dark)] hover:text-amber-500 transition rounded-xl hover:bg-[var(--bg-page)] lg:hidden shrink-0"
                title="Menu">
                <Menu className="w-5 h-5" />
              </button>

              <Link href="/" className="flex items-center gap-2 group shrink-0">
                <div className="flex flex-col leading-none">
                  <div className="flex items-baseline gap-0.5">
                    <span className="font-black text-xl sm:text-2xl tracking-tight text-amber-500 leading-none">
                      TechNova
                    </span>
                    <span className="px-1 py-0.5 bg-amber-500 text-white text-[8px] font-black rounded tracking-widest uppercase leading-none">
                      .ma
                    </span>
                  </div>
                  <span className="text-[8px] font-bold text-[var(--text-muted)] tracking-widest uppercase mt-0.5 hidden xs:block">
                    L&apos;EXPERT TECH
                  </span>
                </div>
              </Link>
            </div>

            {/* Barre de recherche centrale */}
            <form action="/products" method="GET"
              className="hidden lg:flex items-center flex-1 max-w-2xl relative">
              <input
                type="text"
                name="search"
                placeholder="Rechercher : iPhone, MacBook, Samsung, ROG..."
                className="w-full min-w-0 pl-5 pr-14 py-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border)] text-sm text-[var(--text-dark)] placeholder-[var(--text-muted)] focus:outline-none focus:border-amber-500 focus:bg-[var(--bg-card)] transition"
              />
              <button type="submit"
                className="absolute right-0 top-0 bottom-0 px-4 bg-amber-500 hover:bg-amber-400 text-white rounded-r-xl flex items-center justify-center transition font-bold">
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Actions droite — compactes sur mobile */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">

              {/* Theme switch — compact sur mobile */}
              <div className="lg:hidden">
                <ThemeSwitch compact />
              </div>

              {/* Compte */}
              {mounted && isAuthenticated ? (
                <div className="flex items-center gap-1">
                  <Link href="/orders"
                    className="flex items-center justify-center w-10 h-10 text-[var(--text-dark)] hover:text-amber-500 transition rounded-xl hover:bg-[var(--bg-page)]">
                    <UserIcon className="w-5 h-5 stroke-[1.8]" />
                  </Link>
                  <button onClick={logout} title="Déconnexion"
                    className="flex items-center justify-center w-10 h-10 text-[var(--text-muted)] hover:text-red-500 transition rounded-xl hover:bg-[var(--bg-page)]">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link href="/login"
                  className="flex items-center justify-center w-10 h-10 text-[var(--text-dark)] hover:text-amber-500 transition rounded-xl hover:bg-[var(--bg-page)]">
                  <UserIcon className="w-5 h-5 stroke-[1.8]" />
                </Link>
              )}

              {/* Panier */}
              <Link href="/cart"
                className="relative flex items-center justify-center w-10 h-10 text-[var(--text-dark)] hover:text-amber-500 transition rounded-xl hover:bg-[var(--bg-page)]">
                <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
                {mounted && totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#DC2626] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    {totalCount}
                  </span>
                )}
              </Link>

            </div>
          </div>

          {/* Recherche mobile */}
          <div className="lg:hidden mt-3 pt-3 border-t border-[var(--border)]">
            <form action="/products" method="GET" className="relative">
              <input
                type="text"
                name="search"
                placeholder="Rechercher un produit..."
                className="w-full pl-4 pr-12 py-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border)] text-sm text-[var(--text-dark)] placeholder-[var(--text-muted)] focus:outline-none focus:border-amber-500 transition"
              />
              <button type="submit"
                className="absolute right-0 top-0 bottom-0 px-3.5 bg-amber-500 hover:bg-amber-400 text-white rounded-r-xl flex items-center justify-center transition">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* ── BARRE NAV DESKTOP ── */}
        <div className="hidden lg:block border-t border-[var(--border)]">
          <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/products"
                className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-white font-black text-xs uppercase tracking-widest rounded-t-lg transition">
                <Grid className="w-3.5 h-3.5" />
                Tous nos produits
                <ChevronDown className="w-3.5 h-3.5" />
              </Link>
              <nav className="flex items-center ml-1 overflow-x-auto scrollbar-hidden">
                {navCategories.map((item) => (
                  <Link key={item.label} href={item.href}
                    className={`px-3.5 py-2.5 text-xs font-bold transition uppercase whitespace-nowrap ${
                      item.highlight
                        ? 'text-amber-500 hover:text-amber-600 mx-1'
                        : 'text-[var(--text-dark)] hover:text-amber-500'
                    }`}>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <a href="https://wa.me/212600000000?text=Bonjour%20TechNova%2C%20je%20souhaite%20commander."
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold text-[#25D366] hover:text-emerald-600 transition py-2.5">
              <MessageCircle className="w-4 h-4 fill-[#25D366]" />
              Commande WhatsApp
            </a>
          </div>
        </div>

        {/* ── MENU MOBILE ── */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)} />
            <div className="relative w-80 max-w-[88vw] bg-[var(--bg-card)] h-full shadow-2xl flex flex-col z-10">
              {/* Header menu */}
              <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between bg-amber-500">
                <span className="font-black text-xl tracking-tight text-white">TechNova.ma</span>
                <button onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-full bg-white/20 text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {/* Nav links */}
              <div className="flex-1 overflow-y-auto p-5 space-y-1">
                <p className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest mb-3">
                  Rayons
                </p>
                {navCategories.map((item) => (
                  <Link key={item.label} href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-bold uppercase transition ${
                      item.highlight
                        ? 'bg-amber-500 text-white'
                        : 'text-[var(--text-dark)] hover:bg-[var(--bg-page)]'
                    }`}>
                    {item.label}
                  </Link>
                ))}
              </div>
              {/* Pied menu mobile */}
              <div className="p-5 border-t border-[var(--border)] space-y-3">
                <a href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#25D366] text-white font-bold text-sm">
                  <MessageCircle className="w-4 h-4 fill-white" />
                  Commander sur WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
