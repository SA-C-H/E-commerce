'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, User as UserIcon, Shield, LogOut, Menu, X, Laptop } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const totalCount = useCartStore((state) => state.getTotalCount());
  const { user, isAuthenticated, isAdmin, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'ACCUEIL', href: '/' },
    { label: 'SMARTPHONES & LAPTOPS', href: '/products' },
    { label: 'COMMENT COMMANDER', href: '/#how-it-works' },
    { label: 'CONTACT', href: '/#contact' },
  ];

  return (
    <>
      {/* ── 1. Top bar ticker high-tech ── */}
      <div className="bg-white border-b border-[#E2E8F0] text-[11px] text-[#475569] py-2 px-4 sm:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <span className="bg-[#0F172A] text-white text-[10px] font-bold tracking-widest px-2.5 py-0.5 rounded-full uppercase flex-shrink-0">
            DIRECT
          </span>
          <div className="overflow-hidden whitespace-nowrap flex-1">
            <div className="flex items-center gap-6 animate-ticker">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-6">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                    Smartphones & Laptops 100% Neufs sous blister avec garantie officielle 1 an
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                    Livraison sécurisée partout au Maroc sous 24h à 48h
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                    Vérification du colis avant paiement à la livraison
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                    iPhone, Samsung Galaxy, Pixel, MacBook, Dell XPS & ThinkPad en stock
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Navigation scroll-aware ── */}
      {/* En haut : fond transparent, fondu sur le hero */}
      {/* Après scroll : conteneur plein avec fond blanc + ombre (effet pilule flottante) */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-[#E2E8F0] py-2 px-4 sm:px-8'
            : 'bg-transparent py-4 px-4 sm:px-8'
        }`}
      >
        <div
          className={`max-w-7xl mx-auto flex items-center justify-between transition-all duration-300 ${
            scrolled
              ? ''
              : 'bg-white/70 backdrop-blur-md rounded-full px-5 py-2.5 shadow-sm border border-white/60'
          }`}
        >
          {/* Logo High-Tech */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-[#0F172A] flex items-center justify-center text-white font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
              <Laptop className="w-4 h-4 text-[#38BDF8]" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-title text-2xl font-bold tracking-tight text-[#0F172A]">
                Tech<span className="text-[#2563EB]">Nova</span>
              </span>
              <span className="text-[9px] text-[#64748B] font-medium tracking-[0.2em] uppercase -mt-1">
                Smartphones & Laptops
              </span>
            </div>
          </Link>

          {/* Pilule centrale — liens de navigation */}
          <nav className="hidden md:flex items-center gap-7 bg-white/80 backdrop-blur-md rounded-full px-7 py-2 shadow-sm border border-[#E2E8F0]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-[11px] font-semibold tracking-wider transition-colors uppercase ${
                    isActive
                      ? 'text-[#0F172A] font-bold'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions : Profil & Panier */}
          <div className="flex items-center gap-4">
            {mounted && isAuthenticated ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-[#0F172A] bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-full hover:bg-slate-50 transition"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#2563EB]" />
                    Admin
                  </Link>
                )}
                <Link
                  href="/orders"
                  className="hidden sm:inline-block text-xs font-medium text-[#475569] hover:text-[#0F172A]"
                >
                  Mes commandes
                </Link>
                <button
                  onClick={logout}
                  title="Déconnexion"
                  className="p-1.5 text-[#64748B] hover:text-red-600 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="p-1.5 text-[#0F172A] hover:text-[#2563EB] transition"
                title="Mon compte"
              >
                <UserIcon className="w-5 h-5 stroke-[1.6]" />
              </Link>
            )}

            {/* Panier */}
            <Link
              href="/cart"
              className="relative p-1.5 text-[#0F172A] hover:text-[#2563EB] transition"
              title="Panier"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.6]" />
              {mounted && totalCount > 0 && (
                <span className="absolute -top-0.5 -right-1 bg-[#2563EB] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-[#0F172A]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-[#E2E8F0] bg-white rounded-2xl p-4 shadow-lg space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-xs font-semibold tracking-wider text-[#0F172A] uppercase hover:text-[#2563EB]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}
