'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag, User as UserIcon, LogOut, Menu, X,
  Search, MessageCircle, Grid, ChevronDown, ChevronRight,
  MapPin, Smartphone, Laptop, Tablet, Gamepad2, Star,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import ThemeSwitch from '@/components/ThemeSwitch';

/* ── Catégories du mega menu ── */
const megaCategories = [
  {
    label: 'Smartphones',
    icon: Smartphone,
    href: '/products?search=Phone',
    subcats: ['iPhone', 'Samsung Galaxy', 'Google Pixel', 'Xiaomi', 'OnePlus'],
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: 'PC Portables',
    icon: Laptop,
    href: '/products?search=Laptop',
    subcats: ['MacBook', 'Dell XPS', 'Asus ROG', 'HP Elite', 'Lenovo ThinkPad'],
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: 'Tablettes & iPads',
    icon: Tablet,
    href: '/products?search=iPad',
    subcats: ['iPad Pro', 'iPad Air', 'Samsung Tab', 'Galaxy Tab S'],
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: 'Gaming',
    icon: Gamepad2,
    href: '/products?search=Gaming',
    subcats: ['PC Gaming', 'ROG Strix', 'Razer Blade', 'Alienware'],
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: 'Apple',
    icon: Star,
    href: '/products?search=Apple',
    subcats: ['iPhone 16 Pro', 'MacBook M3', 'iPad Pro M4', 'Apple Watch'],
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format&fit=crop&q=80',
  },
  {
    label: 'Samsung',
    icon: Star,
    href: '/products?search=Galaxy',
    subcats: ['Galaxy S24', 'Galaxy Z Fold', 'Galaxy Tab', 'Galaxy Watch'],
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&auto=format&fit=crop&q=80',
  },
];

const navLinks = [
  { label: '★ BONS PLANS', href: '/products?sortBy=price_asc', highlight: true },
  { label: 'PC Portables', href: '/products?search=Laptop' },
  { label: 'Smartphones', href: '/products?search=Phone' },
  { label: 'Apple', href: '/products?search=Apple' },
  { label: 'Samsung', href: '/products?search=Galaxy' },
  { label: 'Gaming', href: '/products?search=Gaming' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [hoveredCat, setHoveredCat] = useState(0);
  const [mounted, setMounted] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);

  const totalCount = useCartStore((state) => state.getTotalCount());
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => { setMounted(true); }, []);

  /* Fermer le mega menu si clic en dehors */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const activeCat = megaCategories[hoveredCat];

  return (
    <>
      {/* ── TOP BAR ── */}
      <div className="hidden lg:block bg-[#0A1128] text-white border-b border-white/5">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 h-9 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse shrink-0" />
            <span className="font-black text-[#DC2626] uppercase tracking-widest text-[11px]">BLACK FRIDAY</span>
            <span className="text-slate-400 text-[11px]">— Livraison 24h · Paiement à la livraison</span>
            <Link href="/products" className="text-amber-400 hover:text-amber-300 font-semibold text-[11px] underline transition">
              Voir les offres →
            </Link>
          </div>
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

            {/* Logo */}
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setMobileMenuOpen(true)}
                className="flex items-center justify-center w-10 h-10 text-[var(--text-dark)] hover:text-amber-500 transition rounded-xl hover:bg-[var(--bg-page)] lg:hidden shrink-0">
                <Menu className="w-5 h-5" />
              </button>
              <Link href="/" className="flex items-center gap-2 group shrink-0">
                <div className="flex flex-col leading-none">
                  <div className="flex items-baseline gap-0.5">
                    <span className="font-black text-xl sm:text-2xl tracking-tight text-amber-500 leading-none">TechNova</span>
                    <span className="px-1 py-0.5 bg-amber-500 text-white text-[8px] font-black rounded tracking-widest uppercase leading-none">.ma</span>
                  </div>
                  <span className="text-[8px] font-bold text-[var(--text-muted)] tracking-widest uppercase mt-0.5 hidden sm:block">L&apos;EXPERT TECH</span>
                </div>
              </Link>
            </div>

            {/* Barre recherche desktop */}
            <form action="/products" method="GET" className="hidden lg:flex items-center flex-1 max-w-2xl relative">
              <input type="text" name="search"
                placeholder="Rechercher : iPhone, MacBook, Samsung, ROG..."
                className="w-full min-w-0 pl-5 pr-14 py-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border)] text-sm text-[var(--text-dark)] placeholder-[var(--text-muted)] focus:outline-none focus:border-amber-500 transition"
              />
              <button type="submit"
                className="absolute right-0 top-0 bottom-0 px-4 bg-amber-500 hover:bg-amber-400 text-white rounded-r-xl flex items-center justify-center transition font-bold">
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Actions droite */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="lg:hidden"><ThemeSwitch compact /></div>

              {mounted && isAuthenticated ? (
                <div className="flex items-center gap-1">
                  <Link href="/orders" className="flex items-center justify-center w-10 h-10 text-[var(--text-dark)] hover:text-amber-500 transition rounded-xl hover:bg-[var(--bg-page)]">
                    <UserIcon className="w-5 h-5 stroke-[1.8]" />
                  </Link>
                  <button onClick={logout} className="flex items-center justify-center w-10 h-10 text-[var(--text-muted)] hover:text-red-500 transition rounded-xl hover:bg-[var(--bg-page)]">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link href="/login" className="flex items-center justify-center w-10 h-10 text-[var(--text-dark)] hover:text-amber-500 transition rounded-xl hover:bg-[var(--bg-page)]">
                  <UserIcon className="w-5 h-5 stroke-[1.8]" />
                </Link>
              )}

              <Link href="/cart" className="relative flex items-center justify-center w-10 h-10 text-[var(--text-dark)] hover:text-amber-500 transition rounded-xl hover:bg-[var(--bg-page)]">
                <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
                {mounted && totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#DC2626] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Recherche mobile */}
          <div className="lg:hidden mt-3 pt-3 border-t border-[var(--border)]">
            <form action="/products" method="GET" className="relative">
              <input type="text" name="search" placeholder="Rechercher un produit..."
                className="w-full pl-4 pr-12 py-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border)] text-sm text-[var(--text-dark)] placeholder-[var(--text-muted)] focus:outline-none focus:border-amber-500 transition"
              />
              <button type="submit" className="absolute right-0 top-0 bottom-0 px-3.5 bg-amber-500 text-white rounded-r-xl flex items-center justify-center">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* ── BARRE NAV DESKTOP + MEGA MENU ── */}
        <div className="hidden lg:block border-t border-[var(--border)]" ref={megaRef}>
          <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 flex items-center justify-between relative">

            {/* Bouton "Tous nos produits" → déclenche le mega menu */}
            <div className="flex items-center">
              <button
                onClick={() => setMegaOpen((v) => !v)}
                className={`flex items-center gap-2 px-4 py-2.5 font-black text-xs uppercase tracking-widest transition rounded-t-lg ${
                  megaOpen
                    ? 'bg-[var(--bg-page)] text-amber-500 border-x border-t border-[var(--border)]'
                    : 'bg-amber-500 hover:bg-amber-400 text-white'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                Tous nos produits
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${megaOpen ? 'rotate-180' : ''}`} />
              </button>

              <nav className="flex items-center ml-1 overflow-x-auto scrollbar-hidden">
                {navLinks.map((item) => (
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
              className="flex items-center gap-1.5 text-xs font-bold text-[#25D366] hover:text-emerald-600 transition py-2.5 shrink-0">
              <MessageCircle className="w-4 h-4 fill-[#25D366]" />
              Commande WhatsApp
            </a>
          </div>

          {/* ── MEGA MENU DROPDOWN ── */}
          {megaOpen && (
            <div className="absolute left-0 right-0 z-50 bg-[var(--bg-card)] border-t border-[var(--border)] shadow-2xl"
              style={{ top: '100%' }}>
              <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-4">
                <div className="flex gap-0">

                  {/* Colonne gauche — liste des catégories */}
                  <div className="w-56 shrink-0 border-r border-[var(--border)] pr-2">
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest px-3 mb-2">
                      Univers
                    </p>
                    {megaCategories.map((cat, idx) => {
                      const Icon = cat.icon;
                      return (
                        <Link
                          key={cat.label}
                          href={cat.href}
                          onClick={() => setMegaOpen(false)}
                          onMouseEnter={() => setHoveredCat(idx)}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition group ${
                            hoveredCat === idx
                              ? 'bg-amber-500 text-white'
                              : 'text-[var(--text-dark)] hover:bg-[var(--bg-page)]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 ${hoveredCat === idx ? 'text-white' : 'text-amber-500'}`} />
                            {cat.label}
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                        </Link>
                      );
                    })}

                    {/* Voir tout */}
                    <Link href="/products" onClick={() => setMegaOpen(false)}
                      className="flex items-center gap-2 px-3 py-2.5 mt-1 rounded-xl text-xs font-bold text-amber-500 hover:bg-amber-50 transition uppercase tracking-wider border-t border-[var(--border)] pt-3 mt-2">
                      Voir tout le catalogue →
                    </Link>
                  </div>

                  {/* Zone droite — sous-catégories + image */}
                  <div className="flex-1 pl-6 flex gap-6">

                    {/* Sous-catégories */}
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-3">
                        {activeCat.label}
                      </p>
                      <div className="grid grid-cols-2 gap-1">
                        {activeCat.subcats.map((sub) => (
                          <Link
                            key={sub}
                            href={`/products?search=${encodeURIComponent(sub)}`}
                            onClick={() => setMegaOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--text-body)] hover:text-amber-500 hover:bg-[var(--bg-page)] transition"
                          >
                            <span className="w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                            {sub}
                          </Link>
                        ))}
                      </div>

                      {/* CTA */}
                      <Link href={activeCat.href} onClick={() => setMegaOpen(false)}
                        className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-[#0F172A] hover:bg-amber-500 text-white text-xs font-bold uppercase tracking-wider transition">
                        Voir tous les {activeCat.label}
                      </Link>
                    </div>

                    {/* Image produit de la catégorie */}
                    <div className="w-48 shrink-0 hidden xl:block">
                      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[var(--bg-page)]">
                        <Image
                          src={activeCat.image}
                          alt={activeCat.label}
                          fill
                          sizes="192px"
                          className="object-cover transition-all duration-300"
                        />
                      </div>
                      <p className="text-xs text-[var(--text-muted)] text-center mt-2 font-medium">
                        {activeCat.label}
                      </p>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── MENU MOBILE ── */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative w-80 max-w-[88vw] bg-[var(--bg-card)] h-full shadow-2xl flex flex-col z-10">
              <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between bg-amber-500">
                <span className="font-black text-xl tracking-tight text-white">TechNova.ma</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-full bg-white/20 text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-1">
                <p className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest mb-3">Rayons</p>
                {megaCategories.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.label} href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[var(--text-dark)] hover:bg-[var(--bg-page)] transition">
                      <Icon className="w-4 h-4 text-amber-500 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
                <Link href="/products?sortBy=price_asc" onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-amber-500 text-white">
                  ★ Bons Plans
                </Link>
              </div>
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
