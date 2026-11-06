'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

interface CarouselItem {
  name: string;
  price: string;
  image: string;
  link: string;
}

interface Slide {
  badge: string;
  brand: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  ribbonColor: string;
  items: CarouselItem[];
}

const slides: Slide[] = [
  {
    badge: 'BLACK WEEK • OFFRE SPÉCIALE APPLE',
    brand: 'APPLE STORE',
    title: 'Les nouveaux iPhone 16 Pro & MacBook M3 passent au Black Friday.',
    description:
      'Jusqu’à -20 % sur la gamme Apple Pro. Écran OLED ProMotion 120Hz, puce A18 Pro 3nm et boîtier titane. Garantie constructeur 1 an avec livraison sécurisée.',
    ctaText: 'Découvrir la sélection Apple',
    ctaLink: '/products?category=cat_0',
    ribbonColor: 'bg-[#DC2626]', // Rouge Black Friday iconique iris.ma
    items: [
      {
        name: 'iPhone 16 Pro Max (256 Go)',
        price: '16 490 DH',
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
        link: '/products',
      },
      {
        name: 'MacBook Pro 14" M3 Pro',
        price: '19 490 DH',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
        link: '/products',
      },
      {
        name: 'iPad Pro 13" M4 OLED',
        price: '16 990 DH',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
        link: '/products',
      },
    ],
  },
  {
    badge: 'EXCLUSIVITÉ MAROC • GALAXY AI',
    brand: 'SAMSUNG GALAXY',
    title: 'La révolution Galaxy AI : S24 Ultra & Pliables Z Fold 6.',
    description:
      'Capteur 200 Mpx, Space Zoom 100x et traduction IA instantanée. Commandez sur WhatsApp et payez en toute sérénité à la livraison.',
    ctaText: 'Voir les offres Galaxy AI',
    ctaLink: '/products?category=cat_1',
    ribbonColor: 'bg-[#2563EB]', // Bleu cobalt Galaxy
    items: [
      {
        name: 'Galaxy S24 Ultra 5G (512 Go)',
        price: '12 990 DH',
        image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&auto=format&fit=crop&q=80',
        link: '/products',
      },
      {
        name: 'Galaxy Z Fold 6 5G (256 Go)',
        price: '18 990 DH',
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
        link: '/products',
      },
      {
        name: 'Galaxy Tab S9 Ultra 14.6"',
        price: '14 490 DH',
        image: 'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=600&auto=format&fit=crop&q=80',
        link: '/products',
      },
    ],
  },
  {
    badge: 'PUISSANCE BRUTE • RTX 4090 & CORE ULTRA',
    brand: 'ROG & DELL XPS',
    title: 'Laptops Gaming & Ultrabooks Pro : Le sommet de la performance.',
    description:
      'Processeurs Intel Core Ultra 9, AMD Ryzen 9 et cartes graphiques Nvidia RTX 40 Series avec écrans 240Hz pour gamers et créateurs.',
    ctaText: 'Explorer les Laptops Pro',
    ctaLink: '/products',
    ribbonColor: 'bg-[#9333EA]', // Violet gaming
    items: [
      {
        name: 'Asus ROG Strix SCAR 18 RTX 4090',
        price: '49 990 DH',
        image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80',
        link: '/products',
      },
      {
        name: 'Dell XPS 16 9640 4K OLED',
        price: '29 990 DH',
        image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80',
        link: '/products',
      },
      {
        name: 'Razer Blade 16 Mini-LED 240Hz',
        price: '42 990 DH',
        image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&auto=format&fit=crop&q=80',
        link: '/products',
      },
    ],
  },
];

export default function PromoCarouselBanner() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Défilement automatique toutes les 5.5 secondes
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const slide = slides[current];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative rounded-3xl overflow-hidden bg-[#0A0F1D] border border-slate-800 shadow-2xl transition-all duration-500"
    >
      {/* ── 1. Ruban supérieur déroulant animé (inspiré de iris.ma) ── */}
      <div className={`py-2 px-4 ${slide.ribbonColor} text-white overflow-hidden whitespace-nowrap transition-colors duration-500`}>
        <div className="inline-flex items-center gap-8 text-[11px] font-black tracking-widest uppercase animate-ticker">
          <span>★ BLACK FRIDAY TECHNOVA</span>
          <span>•</span>
          <span>BLACK WEEK 1 • OFFRES EXCLUSIVES</span>
          <span>•</span>
          <span>LIVRAISON EXPRESS 24H PARTOUT AU MAROC</span>
          <span>•</span>
          <span>PAIEMENT À LA LIVRAISON (CASH ON DELIVERY)</span>
          <span>•</span>
          <span>GARANTIE CONSTRUCTEUR 1 AN</span>
          <span>•</span>
          <span>★ BLACK FRIDAY TECHNOVA</span>
          <span>•</span>
          <span>BLACK WEEK 1 • OFFRES EXCLUSIVES</span>
          <span>•</span>
          <span>LIVRAISON EXPRESS 24H PARTOUT AU MAROC</span>
        </div>
      </div>

      {/* ── 2. Corps de la Banderole ── */}
      <div className="p-8 sm:p-12 relative">
        {/* Badge Marque en haut à droite */}
        <div className="absolute top-6 right-8 sm:right-12">
          <div className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-widest uppercase">
            {slide.brand}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Côté gauche : Textes d'appel & Bouton CTA */}
          <div className="lg:col-span-5 space-y-4">
            <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-amber-400">
              {slide.badge}
            </span>

            <h2 className="font-serif-title text-2xl sm:text-3xl lg:text-4xl text-white font-normal leading-tight">
              {slide.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              {slide.description}
            </p>

            <div className="pt-2">
              <Link
                href={slide.ctaLink}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-[#0F172A] font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-amber-500/20 group"
              >
                <span>{slide.ctaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>
            </div>
          </div>

          {/* Côté droit : 3 Cartes Produits Blanches avec Prix en DH (Exactement comme iris.ma) */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {slide.items.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.link}
                  className="bg-white rounded-2xl p-4 flex flex-col justify-between items-center text-center shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group"
                >
                  {/* Image Produit */}
                  <div className="relative w-full aspect-square mb-3 rounded-xl overflow-hidden bg-slate-50">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  {/* Titre Produit */}
                  <h4 className="text-[12px] font-bold text-[#0F172A] line-clamp-1 mb-3 group-hover:text-[#2563EB] transition">
                    {item.name}
                  </h4>

                  {/* Étiquette Prix Rouge Iris.ma */}
                  <div className="w-full py-2 px-3 rounded-full bg-[#DC2626] text-white text-xs font-black tracking-tight text-center shadow-sm">
                    {item.price}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── 3. Contrôles de navigation (Dots et Flèches) ── */}
        <div className="flex items-center justify-between pt-8 border-t border-slate-800/80 mt-8">
          {/* Flèches précédent / suivant */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-md"
              title="Slide précédent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-md"
              title="Slide suivant"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Indicateur de pagination (Dots ronds iris.ma) */}
          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`transition-all duration-300 rounded-full ${
                  current === idx
                    ? 'w-8 h-2.5 bg-amber-400'
                    : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60'
                }`}
                title={`Aller au slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Mention Livraison */}
          <span className="text-[11px] text-slate-400 hidden sm:inline-block font-medium">
            Livraison 24h & Paiement Cash à la réception
          </span>
        </div>
      </div>
    </div>
  );
}

