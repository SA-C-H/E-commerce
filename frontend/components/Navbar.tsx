'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag, User as UserIcon, Menu, X,
  Search, MessageCircle, Grid, ChevronDown, ChevronRight,
  MapPin, Smartphone, Laptop, Tablet, Gamepad2, Star, Monitor, Headphones, Watch,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import ThemeSwitch from '@/components/ThemeSwitch';
import ProfileModal from '@/components/ProfileModal';
import CartDrawer from '@/components/CartDrawer';
import { api } from '@/lib/api';

/* â”€â”€ IcÃ´ne par mot-clÃ© dans le nom de catÃ©gorie â”€â”€ */
const getCatIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('phone') || n.includes('smartphone') || n.includes('iphone') || n.includes('samsung')) return Smartphone;
  if (n.includes('laptop') || n.includes('macbook') || n.includes('pc') || n.includes('portab')) return Laptop;
  if (n.includes('tablet') || n.includes('ipad')) return Tablet;
  if (n.includes('gaming') || n.includes('rog') || n.includes('jeu')) return Gamepad2;
  if (n.includes('audio') || n.includes('son') || n.includes('Ã©couteur') || n.includes('casque')) return Headphones;
  if (n.includes('montre') || n.includes('watch') || n.includes('wearable')) return Watch;
  if (n.includes('Ã©cran') || n.includes('monitor') || n.includes('display')) return Monitor;
  if (n.includes('apple')) return Star;
  return Grid;
};

/* â”€â”€ Liens barre de nav â”€â”€ */
const navLinks = [
  { label: 'â˜… BONS PLANS', href: '/products?sortBy=price_asc', highlight: true },
  { label: 'PC Portables',  href: '/products?search=MacBook' },
  { label: 'Smartphones',   href: '/products?search=iPhone' },
  { label: 'Apple',         href: '/products?search=Apple' },
  { label: 'Samsung',       href: '/products?search=Samsung' },
  { label: 'Gaming',        href: '/products?search=ROG' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen]             = useState(false);
  const [hoveredIdx, setHoveredIdx]         = useState(0);
  const [mounted, setMounted]               = useState(false);
  const [navBottom, setNavBottom]           = useState(105);
  const [profileOpen, setProfileOpen]       = useState(false);
  const [cartOpen, setCartOpen]             = useState(false);
  const [categories, setCategories]         = useState<{ id: string; name: string }[]>([]);

  const megaRef   = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const totalCount = useCartStore((state) => state.getTotalCount());
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => { setMounted(true); }, []);

  /* Charger les catÃ©gories depuis l'API */
  useEffect(() => {
    api.get<{ id: string; name: string }[]>('/categories')
      .then((data) => { if (Array.isArray(data)) setCategories(data); })
      .catch(() => {});
  }, []);

  /* Fermer mega menu si clic en dehors */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMegaOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Fermer mega menu au scroll */
  useEffect(() => {
    const handler = () => { if (megaOpen) setMegaOpen(false); };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [megaOpen]);

  /* Mesurer position du header */
  useEffect(() => {
    const measure = () => {
      if (headerRef.current) setNavBottom(headerRef.current.getBoundingClientRect().bottom);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const activecat = categories[hoveredIdx];

  return (
    <>
      {/* â”€â”€ TOP BAR â”€â”€ */}
      <div className="hidden lg:block bg-[#0A1128] text-white border-b border-white/5">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 h-9 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse shrink-0" />
            <span className="font-black text-[#DC2626] uppercase tracking-widest text-[11px]">BLACK FRIDAY</span>
            <span className="text-slate-400 text-[11px]">â€” Livraison 24h Â· Paiement Ã  la livraison</span>
            <Link href="/products" className="text-amber-400 hover:text-amber-300 font-semibold text-[11px] underline transition">
              Voir les offres â†’
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
              Casablanca Â· Rabat Â· Marrakech
            </span>
            <span className="text-white/20">|</span>
            <ThemeSwitch />
          </div>
        </div>
      </div>

      {/* â”€â”€ HEADER PRINCIPAL â”€â”€ */}
      <header ref={headerRef}
        className="sticky top-0 z-50 bg-[var(--bg-card)]/95 backdrop-blur-md border-b border-[var(--border)] shadow-xs"
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
                    <span className="font-black text-xl sm:text-2xl tracking-tight text-amber-500 leading-none group-hover:text-amber-400 transition-colors">TechNova</span>
                    <span className="px-1.5 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[8px] font-black rounded-md tracking-widest uppercase leading-none shadow-xs">.ma</span>
                  </div>
                  <span className="text-[8px] font-black text-[var(--text-muted)] tracking-widest uppercase mt-0.5 hidden sm:block">L&apos;EXPERT TECH</span>
                </div>
              </Link>
            </div>

            {/* Barre recherche desktop */}
            <form action="/products" method="GET" className="hidden lg:flex items-center flex-1 max-w-2xl relative">
              <input type="text" name="search"
                placeholder="Rechercher un modÃ¨le : iPhone 16 Pro, MacBook M3, Galaxy S24, ROG..."
                className="w-full min-w-0 pl-5 pr-14 py-2.5 rounded-xl bg-[var(--bg-page)] border border-[var(--border)] text-sm text-[var(--text-dark)] placeholder-[var(--text-muted)] focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200"
              />
              <button type="submit"
                className="absolute right-1 top-1 bottom-1 px-4 bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-950 rounded-lg flex items-center justify-center transition-all duration-200 font-bold">
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Actions droite */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="lg:hidden"><ThemeSwitch compact /></div>

              {mounted && isAuthenticated ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setProfileOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[var(--text-dark)] hover:text-amber-500 transition rounded-xl hover:bg-[var(--bg-page)]"
                    title="Voir mon profil"
                  >
                    <UserIcon className="w-4 h-4 stroke-[2]" />
                    <span className="hidden sm:inline">{user?.name?.split(' ')[0]}</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Link href="/login"
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[var(--text-dark)] hover:text-amber-500 transition rounded-xl hover:bg-[var(--bg-page)] border border-[var(--border)]">
                    <UserIcon className="w-4 h-4 stroke-[2]" />
                    <span className="hidden sm:inline">Connexion</span>
                  </Link>
                  <Link href="/register"
                    className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition rounded-xl shadow-xs shadow-amber-500/20">
                    S&apos;inscrire
                  </Link>
                </div>
              )}

              {/* IcÃ´ne panier â†’ ouvre CartDrawer */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center justify-center w-10 h-10 text-[var(--text-dark)] hover:text-amber-500 transition rounded-xl hover:bg-[var(--bg-page)] border border-[var(--border)] sm:border-transparent"
              >
                <ShoppingBag className="w-5 h-5 stroke-[2]" />
                {mounted && totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                    {totalCount}
                  </span>
                )}
              </button>
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

        {/* â”€â”€ BARRE NAV DESKTOP + MEGA MENU â”€â”€ */}
        <div className="hidden lg:block border-t border-[var(--border)]" ref={megaRef}>
          <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 flex items-center justify-between relative">

            {/* Bouton "Tous nos produits" */}
            <div className="flex items-center">
              <button
                onClick={() => {
                  if (headerRef.current) setNavBottom(headerRef.current.getBoundingClientRect().bottom);
                  setMegaOpen((v) => !v);
                }}
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

          {/* â”€â”€ MEGA MENU DROPDOWN style iris.ma â”€â”€ */}
          {megaOpen && categories.length > 0 && (
            <div
              className="fixed left-0 right-0 z-40 shadow-2xl"
              style={{
                top: `${navBottom}px`,
                backgroundColor: 'var(--bg-card)',
                borderTop: '1px solid var(--border)',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 flex" style={{ minHeight: '320px' }}>

                {/* â”€â”€ Colonne gauche : liste catÃ©gories â”€â”€ */}
                <div className="w-60 shrink-0 py-3 border-r border-[var(--border)]">
                  {categories.map((cat, idx) => {
                    const Icon = getCatIcon(cat.name);
                    const isActive = idx === hoveredIdx;
                    return (
                      <Link
                        key={cat.id}
                        href={`/products?category=${cat.id}`}
                        onClick={() => setMegaOpen(false)}
                        onMouseEnter={() => setHoveredIdx(idx)}
                        className="flex items-center justify-between px-4 py-2.5 text-sm font-semibold transition group"
                        style={{
                          backgroundColor: isActive ? '#F59E0B' : 'transparent',
                          color: isActive ? '#0A1128' : 'var(--text-dark)',
                          borderRadius: '8px',
                        }}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 shrink-0" style={{ color: isActive ? '#0A1128' : '#F59E0B' }} />
                          {cat.name}
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                      </Link>
                    );
                  })}
                  <div style={{ borderTop: '1px solid var(--border)', margin: '8px 0' }} />
                  <Link href="/products" onClick={() => setMegaOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-black text-amber-500 hover:text-amber-400 transition uppercase tracking-wider">
                    Voir tout le catalogue â†’
                  </Link>
                </div>

                {/* â”€â”€ Zone droite : sous-catÃ©gories â”€â”€ */}
                <div className="flex-1 py-5 pl-8">
                  {activecat && (
                    <>
                      <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-4">
                        {activecat.name}
                      </p>

                      {/* Liens produits populaires pour cette catÃ©gorie */}
                      <div className="grid grid-cols-3 gap-x-6 gap-y-1">
                        {[
                          'iPhone 16 Pro', 'iPhone 15', 'iPhone 14',
                          'Samsung Galaxy S24', 'Samsung Galaxy S23', 'Samsung Galaxy A55',
                          'MacBook Pro M3', 'MacBook Air M2', 'MacBook Air M3',
                          'iPad Pro M4', 'iPad Air M2', 'iPad mini',
                          'Asus ROG Strix', 'Dell XPS 15', 'HP EliteBook',
                          'Lenovo ThinkPad', 'Google Pixel 9', 'OnePlus 12',
                        ]
                          .filter((s) => {
                            const n = activecat.name.toLowerCase();
                            const sl = s.toLowerCase();
                            if (n.includes('phone') || n.includes('smartphone')) return sl.includes('iphone') || sl.includes('galaxy') || sl.includes('pixel') || sl.includes('oneplus');
                            if (n.includes('laptop') || n.includes('pc') || n.includes('portab')) return sl.includes('macbook') || sl.includes('dell') || sl.includes('hp') || sl.includes('lenovo') || sl.includes('asus');
                            if (n.includes('tablet') || n.includes('ipad')) return sl.includes('ipad');
                            if (n.includes('gaming') || n.includes('rog')) return sl.includes('rog') || sl.includes('asus');
                            if (n.includes('apple')) return sl.includes('iphone') || sl.includes('macbook') || sl.includes('ipad');
                            if (n.includes('samsung')) return sl.includes('samsung');
                            return true;
                          })
                          .slice(0, 9)
                          .map((sub) => (
                            <Link
                              key={sub}
                              href={`/products?search=${encodeURIComponent(sub)}`}
                              onClick={() => setMegaOpen(false)}
                              className="flex items-center gap-2 py-1.5 text-sm transition hover:text-amber-500"
                              style={{ color: 'var(--text-body)' }}
                            >
                              <span className="w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                              {sub}
                            </Link>
                          ))
                        }
                      </div>

                      <Link
                        href={`/products?category=${activecat.id}`}
                        onClick={() => setMegaOpen(false)}
                        className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition"
                        style={{ backgroundColor: '#0F172A', color: '#F8FAFC' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F59E0B'; e.currentTarget.style.color = '#0A1128'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#0F172A'; e.currentTarget.style.color = '#F8FAFC'; }}
                      >
                        Voir tous les {activecat.name}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* â”€â”€ MENU MOBILE â”€â”€ */}
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
                <p className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest mb-3">CatÃ©gories</p>
                {categories.map((cat) => {
                  const Icon = getCatIcon(cat.name);
                  return (
                    <Link key={cat.id} href={`/products?category=${cat.id}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[var(--text-dark)] hover:bg-[var(--bg-page)] transition">
                      <Icon className="w-4 h-4 text-amber-500 shrink-0" />
                      {cat.name}
                    </Link>
                  );
                })}
                <div className="pt-3 border-t border-[var(--border)]">
                  {navLinks.map((item) => (
                    <Link key={item.label} href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-sm font-bold transition ${item.highlight ? 'text-amber-500' : 'text-[var(--text-dark)] hover:bg-[var(--bg-page)]'}`}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* â”€â”€ Modal Profil â”€â”€ */}
      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />

      {/* â”€â”€ Drawer Panier â”€â”€ */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
