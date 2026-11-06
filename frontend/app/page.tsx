import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard, { Product } from '@/components/ProductCard';
import PromoCarouselBanner from '@/components/PromoCarouselBanner';
import { ArrowRight, Star, Smartphone, Laptop, Tablet, Monitor, Cpu, Gamepad2 } from 'lucide-react';

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products?limit=8`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data?.products || [];
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/categories`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

const testimonials = [
  {
    name: 'Mehdi B.',
    text: 'iPhone 15 Pro Max reçu sous blister en 24h à Casablanca. Boîte scellée, garantie Apple activée le jour même, service au top !',
    stars: 5,
  },
  {
    name: 'Sara E.',
    text: 'J\'ai commandé mon MacBook Air M3 sur WhatsApp. Réponse immédiate, livraison soignée et paiement après vérification de l\'appareil.',
    stars: 5,
  },
  {
    name: 'Hamza T.',
    text: 'Le Galaxy S24 Ultra est une pépite. Très bon prix par rapport aux magasins et vendeur très professionnel. Je recommande les yeux fermés !',
    stars: 5,
  },
];

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 w-full space-y-16">

        {/* ══════════════════════════════════════════════
            HERO BANNER : SMARTPHONES & LAPTOPS DE GRANDES MARQUES
        ══════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-[#0A1128] min-h-[580px] sm:min-h-[640px] flex items-center">
          {/* Image laptop & smartphone haute définition */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600&auto=format&fit=crop&q=85"
              alt="Smartphones et Laptops Haut de Gamme"
              fill
              priority
              className="object-cover object-right-center opacity-80"
            />
            {/* Dégradé Bleu Nuit profond sur la gauche pour lisibilité optimale */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#070D1E] via-[#0A1128]/90 to-transparent sm:w-3/4" />
            {/* Fondu doux vers le bas qui rejoint le fond #F8FAFC */}
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#F8FAFC] to-transparent" />
          </div>

          {/* Contenu textuel et boutons */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
            <div className="max-w-xl space-y-6">
              
              {/* Grand Titre Serif Blanc */}
              <h1 className="font-serif-title text-4xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.12] tracking-tight">
                Pour une technologie saine et sans compromis.
              </h1>

              {/* Sous-titre fin orienté Marques Phones & Laptops */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                Les plus grandes marques mondiales : iPhone, Samsung Galaxy, Google Pixel, MacBook et PC portables garantis neufs avec livraison express partout au Maroc.
              </p>

              {/* Deux boutons arrondis en pilule */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/products"
                  className="px-7 py-3.5 rounded-full bg-white text-[#0F172A] font-semibold text-xs tracking-wider uppercase hover:bg-slate-100 transition shadow-lg"
                >
                  Voir les produits
                </Link>
                <Link
                  href="/#how-it-works"
                  className="px-7 py-3.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-semibold text-xs tracking-wider uppercase transition"
                >
                  Commander sur WhatsApp
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* Contenu principal sur fond #F8FAFC */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 w-full -mt-8 relative z-20">

          {/* ══════════════════════════════════════════════
              1. LES 4 CARTES D'AVANTAGES (PHONES & LAPTOPS)
          ══════════════════════════════════════════════ */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm">
              <h3 className="font-serif-title text-base font-bold text-[#0F172A] mb-2">
                Appareils 100% Neufs
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Tous nos smartphones et laptops sont certifiés d&apos;origine, scellés sous blister avec garantie constructeur 1 an.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm">
              <h3 className="font-serif-title text-base font-bold text-[#0F172A] mb-2">
                Grandes Marques Officielles
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Apple Silicon M3, Snapdragon 8 Gen 3, processeurs Intel & AMD de dernière génération pour des performances ultimes.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm">
              <h3 className="font-serif-title text-base font-bold text-[#0F172A] mb-2">
                Livraison Sécurisée 24h
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Expédition avec emballage renforcé et transport sécurisé. Vérification du produit avant règlement partout au Maroc.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm">
              <h3 className="font-serif-title text-base font-bold text-[#0F172A] mb-2">
                Commande WhatsApp Directe
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Sélectionnez votre modèle, validez sur WhatsApp avec nos conseillers et payez en toute sérénité à la réception.
              </p>
            </div>
          </section>

          {/* ══════════════════════════════════════════════
              CARROUSEL PROMOTIONNEL TYPE IRIS.MA (BANDEROLE DÉROULANTE)
          ══════════════════════════════════════════════ */}
          <PromoCarouselBanner />

          {/* ══════════════════════════════════════════════
              2. SECTION VEDETTE : "Les produits qui convertissent"
          ══════════════════════════════════════════════ */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-[11px] font-semibold tracking-widest text-[#2563EB] uppercase block mb-1">
                  SÉLECTION VEDETTE
                </span>
                <h2 className="font-serif-title text-3xl sm:text-4xl text-[#0F172A] font-normal">
                  Les modèles les plus demandés
                </h2>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F172A] hover:text-[#2563EB] transition group"
              >
                Explorer tout le catalogue
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-[#E2E8F0] p-12 text-center shadow-sm">
                <p className="text-sm text-[#64748B]">
                  Exécutez le script seed.sql dans Supabase pour afficher les smartphones et laptops.
                </p>
              </div>
            )}
          </section>

          {/* ══════════════════════════════════════════════
              3. BANNIÈRE BLEU NUIT : "COLLECTION PREMIUM"
          ══════════════════════════════════════════════ */}
          <section className="bg-[#0F172A] rounded-3xl p-8 sm:p-12 text-white shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-4">
                <span className="text-[11px] font-semibold tracking-widest text-[#38BDF8] uppercase block">
                  COLLECTION PREMIUM
                </span>
                <h2 className="font-serif-title text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight">
                  Choisis ton prochain appareil et commence aujourd&apos;hui.
                </h2>
                <p className="text-sm text-slate-300 max-w-lg leading-relaxed font-light">
                  Que vous cherchiez la puissance d&apos;un iPhone 15 Pro Max, l&apos;innovation d&apos;un Galaxy S24 Ultra ou la vélocité d&apos;un MacBook M3, profitez des meilleurs prix garantis.
                </p>
              </div>

              <div className="lg:col-span-5 bg-[#1E293B] rounded-2xl p-6 sm:p-8 border border-[#334155] space-y-5">
                <span className="text-[11px] font-semibold tracking-widest text-[#38BDF8] uppercase flex items-center gap-1.5">
                  ✦ PASSE À L&apos;ACTION
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Consultez notre stock en temps réel ou contactez-nous directement pour réserver votre smartphone ou ordinateur portable.
                </p>
                <div className="space-y-3 pt-2">
                  <Link
                    href="/products"
                    className="block w-full py-3.5 px-6 rounded-full bg-white text-[#0F172A] font-semibold text-xs tracking-wider text-center uppercase hover:bg-slate-100 transition shadow-sm"
                  >
                    Voir le catalogue
                  </Link>
                  <Link
                    href="/#how-it-works"
                    className="block w-full py-3.5 px-6 rounded-full border border-white/20 text-white font-semibold text-xs tracking-wider text-center uppercase hover:bg-white/10 transition"
                  >
                    Comment commander
                  </Link>
                </div>
              </div>

            </div>
          </section>

          {/* ══════════════════════════════════════════════
              4. CATÉGORIES / UNIVERS DE MARQUES avec icônes
          ══════════════════════════════════════════════ */}
          {categories.length > 0 && (
            <section className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {categories.map((cat: any) => {
                  // Icône + couleur déduites du nom de la catégorie
                  const name = cat.name?.toLowerCase() || '';
                  let icon = null;
                  let iconBg = 'bg-slate-50';
                  let iconColor = 'text-[#0F172A]';
                  let emoji = '';

                  if (name.includes('iphone') || name.includes('pixel') || name.includes('samsung') || name.includes('xiaomi') || name.includes('oneplus')) {
                    icon = <Smartphone className="w-6 h-6" />;
                    iconBg = 'bg-blue-50'; iconColor = 'text-[#2563EB]';
                    emoji = name.includes('iphone') ? '🍎' : name.includes('pixel') ? '🌐' : name.includes('samsung') ? '🌌' : '📱';
                  } else if (name.includes('macbook') || name.includes('laptop') || name.includes('dell') || name.includes('lenovo') || name.includes('hp') || name.includes('professionnels')) {
                    icon = <Laptop className="w-6 h-6" />;
                    iconBg = 'bg-indigo-50'; iconColor = 'text-indigo-600';
                    emoji = name.includes('macbook') ? '🍎' : '💼';
                  } else if (name.includes('gaming') || name.includes('rog') || name.includes('msi') || name.includes('razer')) {
                    icon = <Gamepad2 className="w-6 h-6" />;
                    iconBg = 'bg-purple-50'; iconColor = 'text-purple-600';
                    emoji = '🎮';
                  } else if (name.includes('tablette') || name.includes('ipad')) {
                    icon = <Tablet className="w-6 h-6" />;
                    iconBg = 'bg-emerald-50'; iconColor = 'text-emerald-600';
                    emoji = '📱';
                  } else if (name.includes('moniteur') || name.includes('écran')) {
                    icon = <Monitor className="w-6 h-6" />;
                    iconBg = 'bg-sky-50'; iconColor = 'text-sky-600';
                    emoji = '🖥️';
                  } else {
                    icon = <Cpu className="w-6 h-6" />;
                    iconBg = 'bg-slate-50'; iconColor = 'text-[#0F172A]';
                    emoji = '⚡';
                  }

                  return (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.id}`}
                      className="group bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-lg hover:border-[#CBD5E1] hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="space-y-3">
                        {/* Icône représentative */}
                        <div className={`w-12 h-12 rounded-2xl ${iconBg} ${iconColor} flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform duration-300`}>
                          {icon}
                        </div>

                        {/* Nom de la catégorie */}
                        <h3 className="font-serif-title text-base font-bold text-[#0F172A] leading-snug group-hover:text-[#2563EB] transition-colors">
                          {cat.name}
                        </h3>

                        {/* Description courte */}
                        <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                          Découvrez la gamme officielle {cat.name} garantie neuve.
                        </p>
                      </div>

                      <div className="pt-5">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                          Découvrir la gamme
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* ══════════════════════════════════════════════
              5. "CE QUE DISENT NOS CLIENTS"
          ══════════════════════════════════════════════ */}
          <section className="space-y-8 pt-4 pb-8">
            <div className="text-center space-y-2">
              <h2 className="font-serif-title text-3xl sm:text-4xl text-[#0F172A] font-normal">
                Ce que disent nos clients
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B]">
                Des avis authentiques de clients livrés partout au Maroc.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-white rounded-3xl p-8 border border-[#E2E8F0] shadow-sm space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(t.stars)].map((_, j) => (
                        <Star key={j} className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                      ))}
                    </div>

                    <p className="text-xs sm:text-sm text-[#475569] leading-relaxed italic">
                      &ldquo;{t.text}&rdquo;
                    </p>
                  </div>

                  <p className="font-serif-title font-bold text-sm text-[#0F172A] pt-3">
                    {t.name}
                  </p>
                </div>
              ))}
            </div>
          </section>

        </div>

      </main>

      <Footer />
    </div>
  );
}
