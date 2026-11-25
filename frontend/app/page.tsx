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
  Sparkles,
  BadgeCheck,
  CheckCircle2,
  Award,
  ShoppingBag,
  PackageCheck,
  PhoneCall,
  HelpCircle,
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
    name: 'Mehdi Benjelloun',
    city: 'Casablanca (Maârif)',
    product: 'iPhone 15 Pro Max 256GB',
    text: 'iPhone 15 Pro Max reçu sous blister en 24h à Casablanca. Boîte scellée, garantie Apple activée le jour même, service au top !',
    stars: 5,
    initials: 'MB',
  },
  {
    name: 'Sara El Amrani',
    city: 'Rabat (Agdal)',
    product: 'MacBook Air 15" M3',
    text: 'J\'ai commandé mon MacBook Air M3 sur WhatsApp. Réponse immédiate, livraison soignée et paiement après vérification de l\'appareil.',
    stars: 5,
    initials: 'SE',
  },
  {
    name: 'Hamza Tazi',
    city: 'Marrakech (Guéliz)',
    product: 'Galaxy S24 Ultra Titanium',
    text: 'Le Galaxy S24 Ultra est une pépite. Très bon prix par rapport aux magasins et vendeur très professionnel. Je recommande les yeux fermés !',
    stars: 5,
    initials: 'HT',
  },
];

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)]">
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
        <section className="relative overflow-hidden bg-[#0A1128] min-h-[420px] sm:min-h-[540px] lg:min-h-[620px] flex items-center">
          {/* Image laptop & smartphone haute définition */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=1600&auto=format&fit=crop&q=85"
              alt="Smartphones et Laptops Haut de Gamme"
              fill priority sizes="100vw" className="object-cover object-right-center opacity-75 scale-102 transition-transform duration-1000"
            />
            {/* Dégradé Bleu Nuit profond sur la gauche pour lisibilité optimale */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#060B18] via-[#0A1128]/95 to-transparent sm:w-4/5" />
            {/* Fondu doux vers le bas qui rejoint le fond */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-page)] to-transparent" />
          </div>

          {/* Contenu textuel et boutons */}
          <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-16 sm:py-24">
            <div className="max-w-2xl space-y-6">
              
              {/* Badge Premium Lumineux */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 backdrop-blur-md text-amber-300 text-[11px] font-black tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>NOUVELLE COLLECTION 2026 · HAUTE TECHNOLOGIE</span>
              </div>

              {/* Grand Titre Ultra-Lisible et Impactant */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl text-white font-black leading-[1.08] tracking-tight">
                L&apos;excellence technologique <span className="text-amber-400">sans compromis.</span>
              </h1>

              {/* Sous-titre orienté Marques Phones & Laptops */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal max-w-xl">
                Les fleurons mondiaux à portée de main : <strong className="text-white font-semibold">iPhone 16 Pro, MacBook M3, Galaxy S24 Ultra</strong> et PC Portables d&apos;exception. 100% neufs sous blister avec livraison 24h partout au Maroc.
              </p>

              {/* Deux boutons arrondis en pilule */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/products"
                  className="px-8 py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs tracking-wider uppercase transition-all duration-200 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
                >
                  <span>Découvrir le catalogue</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="https://wa.me/212600000000?text=Bonjour%20TechNova%2C%20je%20souhaite%20des%20renseignements%20sur%20vos%20produits."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-bold text-xs tracking-wider uppercase transition-all hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Conseil WhatsApp Direct</span>
                </a>
              </div>

              {/* 3 piliers de réassurance sous le hero */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-5 sm:gap-8 text-xs text-slate-300">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>100% Neuf & Scellé</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Livraison 24h Express</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <CreditCard className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Paiement à la livraison</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Contenu principal */}
        <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16 space-y-12 sm:space-y-20 w-full -mt-6 sm:-mt-10 relative z-20">

          {/* ══════════════════════════════════════════════
              1. LES 4 CARTES D'AVANTAGES (STYLE PREMIUM)
          ══════════════════════════════════════════════ */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            <div className="bg-[var(--bg-card)] rounded-2xl p-5 sm:p-6 border border-[var(--border)] shadow-xs hover:shadow-lg hover:border-amber-400/50 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-[var(--text-dark)] mb-1.5">
                Appareils 100% Neufs
              </h3>
              <p className="text-xs text-[var(--text-body)] leading-relaxed">
                Tous nos smartphones et laptops sont scellés sous blister d&apos;origine avec garantie constructeur officielle de 12 à 24 mois.
              </p>
            </div>

            <div className="bg-[var(--bg-card)] rounded-2xl p-5 sm:p-6 border border-[var(--border)] shadow-xs hover:shadow-lg hover:border-blue-400/50 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Cpu className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-[var(--text-dark)] mb-1.5">
                Grandes Marques Officielles
              </h3>
              <p className="text-xs text-[var(--text-body)] leading-relaxed">
                Apple M3, Snapdragon 8 Gen 3, Intel Core Ultra et AMD Ryzen AI pour des performances de pointe sans compromis.
              </p>
            </div>

            <div className="bg-[var(--bg-card)] rounded-2xl p-5 sm:p-6 border border-[var(--border)] shadow-xs hover:shadow-lg hover:border-emerald-400/50 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Truck className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-[var(--text-dark)] mb-1.5">
                Livraison Sécurisée 24h
              </h3>
              <p className="text-xs text-[var(--text-body)] leading-relaxed">
                Colis blindé avec suivi direct. Vous inspectez l&apos;appareil sous blister avant tout règlement au transporteur.
              </p>
            </div>

            <div className="bg-[var(--bg-card)] rounded-2xl p-5 sm:p-6 border border-[var(--border)] shadow-xs hover:shadow-lg hover:border-violet-400/50 hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h3 className="font-bold text-sm sm:text-base text-[var(--text-dark)] mb-1.5">
                Support & WhatsApp 7j/7
              </h3>
              <p className="text-xs text-[var(--text-body)] leading-relaxed">
                Nos conseillers répondent en moins de 15 minutes pour vous guider dans le choix de votre configuration idéale.
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
                  Aucun produit disponible pour le moment.{' '}
                  <Link href="/products" className="text-amber-500 font-bold hover:underline">Voir le catalogue</Link>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
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
                      className="group bg-[var(--bg-card)] rounded-2xl p-3 sm:p-4 border border-[var(--border)] shadow-sm hover:shadow-lg hover:border-amber-400 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center gap-3 text-center"
                    >
                      {/* Image grande — style iris.ma */}
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[var(--bg-page)]">
                        <Image
                          src={img}
                          alt={cat.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Label catégorie */}
                      <div className="w-full">
                        <h3 className="font-black text-xs sm:text-sm text-[var(--text-dark)] uppercase tracking-tight line-clamp-1 group-hover:text-amber-500 transition-colors">
                          {shortLabel}
                        </h3>
                        <p className="text-[11px] text-[var(--text-muted)] font-medium mt-0.5">
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
              SECTION "COMMENT COMMANDER ?" (#how-it-works)
          ══════════════════════════════════════════════ */}
          <section id="how-it-works" className="scroll-mt-28 space-y-10 py-8">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-black tracking-widest uppercase border border-amber-500/25">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>GUIDE D&apos;ACHAT SÉCURISÉ</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--text-dark)] tracking-tight">
                Comment commander sur TechNova ?
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-body)] leading-relaxed">
                Une démarche transparente en 4 étapes simples, avec paiement sécurisé uniquement à la réception de votre appareil.
              </p>
            </div>

            {/* 4 Étapes Visuelles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Étape 1 */}
              <div className="bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border)] shadow-xs hover:shadow-xl hover:border-amber-400/50 hover:-translate-y-1 transition-all duration-300 relative group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-black text-2xl text-amber-500/30 group-hover:text-amber-500 transition-colors">
                      01
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 stroke-[2]" />
                    </div>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-[var(--text-dark)] mb-2">
                    Sélectionnez votre modèle
                  </h3>
                  <p className="text-xs text-[var(--text-body)] leading-relaxed">
                    Parcourez nos smartphones et laptops neufs scellés d&apos;origine. Comparez les caractéristiques et cliquez sur <strong>Commander</strong>.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[var(--border)] text-[11px] font-bold text-amber-600">
                  ✦ Matériel 100% Neuf garanti
                </div>
              </div>

              {/* Étape 2 */}
              <div className="bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border)] shadow-xs hover:shadow-xl hover:border-blue-400/50 hover:-translate-y-1 transition-all duration-300 relative group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-black text-2xl text-blue-500/30 group-hover:text-blue-500 transition-colors">
                      02
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 stroke-[2]" />
                    </div>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-[var(--text-dark)] mb-2">
                    Validez vos coordonnées
                  </h3>
                  <p className="text-xs text-[var(--text-body)] leading-relaxed">
                    Indiquez votre ville et téléphone. <strong>Aucun paiement par carte bancaire</strong> n&apos;est exigé à la validation du panier.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[var(--border)] text-[11px] font-bold text-blue-600">
                  ✦ Zéro risque financier
                </div>
              </div>

              {/* Étape 3 */}
              <div className="bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border)] shadow-xs hover:shadow-xl hover:border-emerald-400/50 hover:-translate-y-1 transition-all duration-300 relative group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-black text-2xl text-emerald-500/30 group-hover:text-emerald-500 transition-colors">
                      03
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <Truck className="w-5 h-5 stroke-[2]" />
                    </div>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-[var(--text-dark)] mb-2">
                    Livraison Express 24h/48h
                  </h3>
                  <p className="text-xs text-[var(--text-body)] leading-relaxed">
                    Votre colis renforcé est acheminé directement à votre porte partout au Maroc (Casablanca, Rabat, Marrakech, Tanger, etc.).
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[var(--border)] text-[11px] font-bold text-emerald-600">
                  ✦ Suivi par SMS & appel
                </div>
              </div>

              {/* Étape 4 */}
              <div className="bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border)] shadow-xs hover:shadow-xl hover:border-amber-400/50 hover:-translate-y-1 transition-all duration-300 relative group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-black text-2xl text-amber-500/30 group-hover:text-amber-500 transition-colors">
                      04
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 stroke-[2]" />
                    </div>
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-[var(--text-dark)] mb-2">
                    Vérification & Paiement
                  </h3>
                  <p className="text-xs text-[var(--text-body)] leading-relaxed">
                    Inspectez le colis et la boîte scellée avec le livreur. Vous ne réglez qu&apos;après vérification en espèces ou par carte bancaire.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[var(--border)] text-[11px] font-bold text-amber-600">
                  ✦ Paiement à la livraison
                </div>
              </div>
            </div>

            {/* Bannière d'assistance VIP par WhatsApp */}
            <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-2xl p-6 sm:p-8 text-white border border-[#334155] shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#25D366]/20 text-[#25D366] text-[10px] font-black uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
                  <span>CONSEILLER DISPONIBLE EN DIRECT</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold">
                  Vous préférez être conseillé avant de commander ?
                </h3>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                  Envoyez simplement le modèle recherché sur WhatsApp. Nos spécialistes vérifient le stock instantanément et réservent votre appareil.
                </p>
              </div>

              <a
                href="https://wa.me/212600000000?text=Bonjour%20TechNova%2C%20je%20souhaite%20commander%20un%20appareil%20et%20avoir%20des%20conseils."
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs tracking-wider uppercase shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2.5"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Commander sur WhatsApp</span>
              </a>
            </div>
          </section>

          {/* ══════════════════════════════════════════════
              5. "CE QUE DISENT NOS CLIENTS"
          ══════════════════════════════════════════════ */}
          <section className="space-y-10 py-6">
            <div className="text-center space-y-2.5 max-w-xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-black tracking-widest uppercase border border-amber-500/20">
                <Award className="w-3.5 h-3.5" />
                <span>EXPÉRIENCE CLIENT D&apos;EXCELLENCE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--text-dark)] tracking-tight">
                La confiance de nos clients au Maroc
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-body)]">
                Plus de <strong className="text-[var(--text-dark)] font-bold">1 200 livraisons réussies</strong> à Casablanca, Rabat, Marrakech, Tanger et partout au Royaume.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="bg-[var(--bg-card)] rounded-2xl p-6 sm:p-7 border border-[var(--border)] shadow-xs hover:shadow-xl hover:border-amber-400/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3.5">
                    {/* En-tête de l'avis : étoiles + badge vérifié */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-0.5">
                        {[...Array(t.stars)].map((_, j) => (
                          <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Vérifié
                      </span>
                    </div>

                    {/* Texte de l'avis */}
                    <p className="text-xs sm:text-sm text-[var(--text-body)] leading-relaxed italic">
                      &ldquo;{t.text}&rdquo;
                    </p>

                    {/* Badge produit acheté */}
                    <div className="pt-1">
                      <span className="inline-block text-[10px] font-semibold text-[var(--text-dark)] bg-[var(--bg-page)] border border-[var(--border)] px-2.5 py-1 rounded-md">
                        Appareil : {t.product}
                      </span>
                    </div>
                  </div>

                  {/* Profil client avec avatar dégradé */}
                  <div className="pt-3 border-t border-[var(--border)] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-xs shrink-0">
                      {t.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[var(--text-dark)] leading-tight truncate">
                        {t.name}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)] font-medium">
                        {t.city}
                      </p>
                    </div>
                  </div>
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
