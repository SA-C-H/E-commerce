import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard, { Product } from '@/components/ProductCard';
import PromoCarouselBanner from '@/components/PromoCarouselBanner';
import {
  ArrowRight,
  Star,
  Smartphone,
  Laptop,
  Tablet,
  Monitor,
  Cpu,
  Gamepad2,
  Search,
  MessageCircle,
  Truck,
  CreditCard,
  ShieldCheck,
  Zap,
} from 'lucide-react';

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products?limit=8`,
      { next: { revalidate: 60 } }
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
      { next: { revalidate: 60 } }
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
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] overflow-x-hidden">
      <Navbar />

      {/* ══════════════════════════════════════════════
          PILULES DE RAYONS & BANDEAU RÉASSURANCE (STYLE IRIS.MA)
      ══════════════════════════════════════════════ */}
      <section className="bg-[var(--bg-card)] border-b border-[var(--border)] shadow-xs">
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-3.5 sm:py-4 space-y-3">
          
          {/* Pilules défilantes des univers & bons plans (comme iris.ma Image 1) */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hidden py-1">
            <Link
              href="/products"
              className="px-4 py-1.5 rounded-full bg-amber-500 text-white font-black text-xs whitespace-nowrap shadow-xs hover:bg-amber-400 transition shrink-0 flex items-center gap-1.5"
            >
              <span>★ BONS PLANS</span>
            </Link>

            {categories.map((c: any) => (
              <Link
                key={c.id}
                href={`/products?category=${c.id}`}
                className="px-3.5 py-1.5 rounded-full bg-[var(--bg-page)] border border-[var(--border)] hover:border-amber-500 hover:text-amber-600 text-[var(--text-dark)] text-xs font-bold whitespace-nowrap shadow-2xs hover:bg-[var(--bg-card)] transition shrink-0"
              >
                {c.name}
              </Link>
            ))}
          </div>

          {/* Bandeau de Réassurance Iris.ma */}
          <div className="pt-2 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-3 text-[11px] text-[var(--text-body)]">
            <div className="flex items-center gap-2 font-semibold text-[var(--text-dark)]">
              <span className="px-2 py-0.5 rounded bg-amber-500 text-white text-[10px] font-black uppercase">
                L&apos;EXPERT TECH
              </span>
              <span className="hidden sm:inline">— du matériel informatique & électronique au Maroc</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-6 text-xs">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-500" />
                <span>Expédition rapide 24h</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-amber-500" />
                <span>Paiement à la livraison</span>
              </span>
              <span className="hidden md:flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>Garantie & SAV 1 an</span>
              </span>
            </div>
          </div>

        </div>
      </section>

      <main className="flex-1 w-full space-y-12 sm:space-y-20">

        {/* ══════════════════════════════════════════════
            HERO BANNER : SMARTPHONES & LAPTOPS DE GRANDES MARQUES
        ══════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-[#0A1128] min-h-[360px] sm:min-h-[520px] lg:min-h-[600px] flex items-center">
          {/* Image laptop & smartphone haute définition */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600&auto=format&fit=crop&q=85"
              alt="Smartphones et Laptops Haut de Gamme"
              fill priority sizes="100vw" className="object-cover object-right-center opacity-80"
            />
            {/* Dégradé Bleu Nuit profond sur la gauche pour lisibilité optimale */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#070D1E] via-[#0A1128]/90 to-transparent sm:w-3/4" />
            {/* Fondu doux vers le bas qui rejoint le fond #F8FAFC */}
            <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#F8FAFC] to-transparent" />
          </div>

          {/* Contenu textuel et boutons */}
          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-20 sm:py-28">
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
                  className="px-7 py-3.5 rounded-full bg-[var(--bg-card)] text-[var(--text-dark)] font-semibold text-xs tracking-wider uppercase hover:bg-slate-100 transition shadow-lg"
                >
                  Voir les produits
                </Link>
                <Link
                  href="/#how-it-works"
                  className="px-7 py-3.5 rounded-full bg-[var(--bg-card)]/15 hover:bg-[var(--bg-card)]/25 backdrop-blur-md border border-white/30 text-white font-semibold text-xs tracking-wider uppercase transition"
                >
                  Commander sur WhatsApp
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* Contenu principal sur fond #F8FAFC */}
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 space-y-12 sm:space-y-20 w-full -mt-6 sm:-mt-10 relative z-20">

          {/* ══════════════════════════════════════════════
              1. LES 4 CARTES D'AVANTAGES (PHONES & LAPTOPS)
          ══════════════════════════════════════════════ */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            <div className="bg-[var(--bg-card)] rounded-3xl p-6 border border-[var(--border)] shadow-sm">
              <h3 className="font-serif-title text-base text-[var(--text-dark)] mb-2">
                Appareils 100% Neufs
              </h3>
              <p className="text-xs text-[var(--text-body)] leading-relaxed">
                Tous nos smartphones et laptops sont certifiés d&apos;origine, scellés sous blister avec garantie constructeur 1 an.
              </p>
            </div>

            <div className="bg-[var(--bg-card)] rounded-3xl p-6 border border-[var(--border)] shadow-sm">
              <h3 className="font-serif-title text-base text-[var(--text-dark)] mb-2">
                Grandes Marques Officielles
              </h3>
              <p className="text-xs text-[var(--text-body)] leading-relaxed">
                Apple Silicon M3, Snapdragon 8 Gen 3, processeurs Intel & AMD de dernière génération pour des performances ultimes.
              </p>
            </div>

            <div className="bg-[var(--bg-card)] rounded-3xl p-6 border border-[var(--border)] shadow-sm">
              <h3 className="font-serif-title text-base text-[var(--text-dark)] mb-2">
                Livraison Sécurisée 24h
              </h3>
              <p className="text-xs text-[var(--text-body)] leading-relaxed">
                Expédition avec emballage renforcé et transport sécurisé. Vérification du produit avant règlement partout au Maroc.
              </p>
            </div>

            <div className="bg-[var(--bg-card)] rounded-3xl p-6 border border-[var(--border)] shadow-sm">
              <h3 className="font-serif-title text-base text-[var(--text-dark)] mb-2">
                Commande WhatsApp Directe
              </h3>
              <p className="text-xs text-[var(--text-body)] leading-relaxed">
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
                <span className="text-[11px] font-semibold tracking-widest text-amber-500 uppercase block mb-1">
                  SÉLECTION VEDETTE
                </span>
                <h2 className="font-serif-title text-3xl sm:text-4xl text-[var(--text-dark)]">
                  Les modèles les plus demandés
                </h2>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-dark)] hover:text-amber-500 transition group"
              >
                Explorer tout le catalogue
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border)] p-12 text-center shadow-sm">
                <p className="text-sm text-[var(--text-body)]">
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
                <span className="text-[11px] font-semibold tracking-widest text-amber-400 uppercase block">
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
                <span className="text-[11px] font-semibold tracking-widest text-amber-400 uppercase flex items-center gap-1.5">
                  ✦ PASSE À L&apos;ACTION
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-light">
                  Consultez notre stock en temps réel ou contactez-nous directement pour réserver votre smartphone ou ordinateur portable.
                </p>
                <div className="space-y-3 pt-2">
                  <Link
                    href="/products"
                    className="block w-full py-3.5 px-6 rounded-full bg-[var(--bg-card)] text-[var(--text-dark)] font-semibold text-xs tracking-wider text-center uppercase hover:bg-slate-100 transition shadow-sm"
                  >
                    Voir le catalogue
                  </Link>
                  <Link
                    href="/#how-it-works"
                    className="block w-full py-3.5 px-6 rounded-full border border-white/20 text-white font-semibold text-xs tracking-wider text-center uppercase hover:bg-[var(--bg-card)]/10 transition"
                  >
                    Comment commander
                  </Link>
                </div>
              </div>

            </div>
          </section>

          {/* ══════════════════════════════════════════════
              4. CHOISISSEZ VOTRE UNIVERS (REPRODUCTION EXACTE IRIS.MA)
          ══════════════════════════════════════════════ */}
          {categories.length > 0 && (
            <section className="space-y-6">
              <div className="space-y-2">
                <span className="text-[11px] font-semibold tracking-widest text-amber-500 uppercase block mb-2">
                  UNIVERS & CATÉGORIES
                </span>
                <h2 className="font-serif-title text-2xl sm:text-3xl lg:text-4xl font-normal text-[var(--text-dark)]">
                  Choisissez votre univers
                </h2>
                <div className="w-16 h-1.5 bg-amber-500 rounded-full" />
                <p className="text-xs sm:text-sm text-[var(--text-body)] max-w-3xl leading-relaxed pt-1">
                  Explorez tout le matériel informatique et high-tech de TechNova au Maroc : PC portables et de bureau, smartphones, tablettes, gaming, écrans et bien plus — en stock, au meilleur prix et livrés partout au Maroc.
                </p>
              </div>

              {/* Grille : 3 colonnes sur Mobile (comme iris.ma), 4 sur tablette, 8 sur grand écran */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
                {categories.map((cat: any) => {
                  const lower = (cat.name || '').toLowerCase();
                  let img = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&auto=format&fit=crop&q=80';
                  let shortLabel = cat.name.toUpperCase();

                  if (lower.includes('iphone')) {
                    img = 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&auto=format&fit=crop&q=80';
                    shortLabel = 'IPHONE';
                  } else if (lower.includes('macbook')) {
                    img = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&auto=format&fit=crop&q=80';
                    shortLabel = 'MACBOOK';
                  } else if (lower.includes('gaming')) {
                    img = 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300&auto=format&fit=crop&q=80';
                    shortLabel = 'PC GAMING';
                  } else if (lower.includes('professionnels') || lower.includes('pro')) {
                    img = 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300&auto=format&fit=crop&q=80';
                    shortLabel = 'LAPTOPS PRO';
                  } else if (lower.includes('samsung')) {
                    img = 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&auto=format&fit=crop&q=80';
                    shortLabel = 'SAMSUNG';
                  } else if (lower.includes('pixel')) {
                    img = 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&auto=format&fit=crop&q=80';
                    shortLabel = 'PIXEL';
                  } else if (lower.includes('tablette') || lower.includes('ipad')) {
                    img = 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&auto=format&fit=crop&q=80';
                    shortLabel = 'TABLETTES';
                  } else if (lower.includes('xiaomi') || lower.includes('oneplus')) {
                    img = 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=300&auto=format&fit=crop&q=80';
                    shortLabel = 'ANDROID';
                  }

                  const count = cat.productCount || 35;

                  return (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.id}`}
                      className="group bg-[var(--bg-card)] rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 border border-[var(--border)] shadow-2xs hover:shadow-xl hover:border-amber-400 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-between text-center"
                    >
                      {/* Photo produit de la catégorie */}
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mb-2 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center">
                        <Image
                          src={img}
                          alt={cat.name}
                          fill
                          sizes="(max-width: 640px) 33vw, 15vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      {/* Nom de la catégorie en gras majuscule Iris.ma */}
                      <div className="w-full">
                        <h3 className="font-extrabold text-[10px] sm:text-xs text-[var(--text-dark)] uppercase tracking-tight line-clamp-1 group-hover:text-amber-600 transition-colors">
                          {shortLabel}
                        </h3>
                        <p className="text-[9px] sm:text-[11px] text-[var(--text-body)] font-medium mt-0.5">
                          {count} produits
                        </p>
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
          <section className="space-y-10 py-6">
            <div className="text-center space-y-2">
              <h2 className="font-serif-title text-3xl sm:text-4xl text-[var(--text-dark)]">
                Ce que disent nos clients
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-body)]">
                Des avis authentiques de clients livrés partout au Maroc.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <div key={i} className="bg-[var(--bg-card)] rounded-3xl p-8 border border-[var(--border)] shadow-sm space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(t.stars)].map((_, j) => (
                        <Star key={j} className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                      ))}
                    </div>

                    <p className="text-xs sm:text-sm text-[var(--text-body)] leading-relaxed italic">
                      &ldquo;{t.text}&rdquo;
                    </p>
                  </div>

                  <p className="font-serif-title text-sm text-[var(--text-dark)] pt-3 font-semibold">
                    {t.name}
                  </p>
                </div>
              ))}
            </div>
          </section>

        </div>

      </main>

      <Footer />

      {/* ── Bandeau flottant WhatsApp fixe au bas de l'écran (Mobile comme iris.ma) ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden">
        <a
          href="https://wa.me/212600000000?text=Bonjour%20TechNova%2C%20je%20souhaite%20des%20renseignements%20sur%20un%20produit."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-5 py-3.5 bg-[#25D366] text-white font-bold text-xs shadow-2xl transition active:bg-[#1EBE5D]"
        >
          <div className="flex items-center gap-2.5">
            <MessageCircle className="w-5 h-5 fill-white" />
            <span className="text-sm font-extrabold">WhatsApp</span>
            <span className="text-xs font-normal opacity-90">• Écrivez-nous</span>
          </div>
          <div className="w-6 h-6 rounded-full bg-[var(--bg-card)]/20 flex items-center justify-center">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </a>
      </div>
    </div>
  );
}
