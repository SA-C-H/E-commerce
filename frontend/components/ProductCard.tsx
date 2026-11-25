'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, Eye, ShoppingCart, Check, ShieldCheck, Zap } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  image_url?: string | null;
  category_id?: string | null;
  categories?: { id: string; name: string } | null;
}

// Images fallback fiables par catégorie (Unsplash IDs stables)
const FALLBACK_IMAGES: Record<string, string> = {
  iphone:    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80',
  samsung:   'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80',
  pixel:     'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80',
  macbook:   'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
  laptop:    'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&auto=format&fit=crop&q=80',
  gaming:    'https://images.unsplash.com/photo-1603481546579-65d935ba9cdd?w=800&auto=format&fit=crop&q=80',
  ipad:      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
  default:   'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=800&auto=format&fit=crop&q=80',
};

function getFallbackImage(name: string, categoryName?: string | null): string {
  const n = (name + ' ' + (categoryName || '')).toLowerCase();
  if (n.includes('iphone'))             return FALLBACK_IMAGES.iphone;
  if (n.includes('samsung') || n.includes('galaxy')) return FALLBACK_IMAGES.samsung;
  if (n.includes('pixel'))              return FALLBACK_IMAGES.pixel;
  if (n.includes('macbook'))            return FALLBACK_IMAGES.macbook;
  if (n.includes('rog') || n.includes('gaming') || n.includes('razer') || n.includes('msi') || n.includes('predator')) return FALLBACK_IMAGES.gaming;
  if (n.includes('laptop') || n.includes('xps') || n.includes('thinkpad') || n.includes('elitebook') || n.includes('surface')) return FALLBACK_IMAGES.laptop;
  if (n.includes('ipad'))               return FALLBACK_IMAGES.ipad;
  return FALLBACK_IMAGES.default;
}

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(
    product.image_url || getFallbackImage(product.name, product.categories?.name)
  );

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      stock: product.stock,
    });
    setAdded(true);
    toast.success(`"${product.name}" ajouté au panier !`, {
      description: `${Number(product.price).toLocaleString('fr-FR')} MAD`,
    });
    setTimeout(() => setAdded(false), 1600);
  };

  const specs = product.description
    ? product.description.split('.').filter(s => s.trim().length > 0)
    : [];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-[var(--bg-card)] rounded-2xl p-4 sm:p-5 border border-[var(--border)] shadow-xs hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-400/50 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
    >
      <div>
        {/* Image */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[var(--bg-page)] mb-3 sm:mb-4 border border-[var(--border)]/50">
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
            onError={() => setImgSrc(getFallbackImage(product.name, product.categories?.name))}
          />

          {/* Badge Catégorie / Authenticité */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-col gap-1 items-start">
            {product.categories?.name ? (
              <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-wider uppercase bg-[var(--bg-card)]/90 text-[var(--text-dark)] shadow-sm border border-[var(--border)] backdrop-blur-md">
                {product.categories.name}
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase bg-amber-500 text-slate-950 shadow-xs">
                ✦ OFFICIEL
              </span>
            )}
          </div>

          {/* Badge Stock avec point statut */}
          <span className={`absolute top-2.5 right-2.5 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm backdrop-blur-md flex items-center gap-1.5 ${
            isOutOfStock
              ? 'bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30'
              : 'bg-[var(--bg-card)]/90 text-emerald-600 dark:text-emerald-400 border border-[var(--border)]'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOutOfStock ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}`} />
            {isOutOfStock ? 'Épuisé' : `En stock`}
          </span>

          {/* Overlay hover specs — desktop uniquement */}
          <div className={`hidden sm:flex absolute inset-0 z-20 bg-slate-950/85 backdrop-blur-md p-4 flex-col justify-between text-white transition-all duration-300 ${
            hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
          }`}>
            <div>
              <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-black tracking-widest uppercase mb-2.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Caractéristiques Clés
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-200 leading-snug">
                {specs.slice(0, 3).map((spec, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold text-xs leading-none shrink-0">•</span>
                    <span className="line-clamp-2 min-w-0">{spec.trim()}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pt-2 border-t border-white/15 flex items-center justify-between gap-2">
              <span className="text-[10px] text-emerald-300 font-semibold flex items-center gap-1 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Garantie 12 Mois
              </span>
              <Link
                href={`/products/${product.id}`}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-full transition shadow-xs"
              >
                <Eye className="w-3 h-3" />
                Détails
              </Link>
            </div>
          </div>
        </div>

        {/* Étoiles & avis */}
        <div className="flex items-center gap-1 mb-1.5 sm:mb-2">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-[11px] font-bold text-[var(--text-dark)] ml-1">4.9</span>
          <span className="text-[10px] text-[var(--text-muted)] font-medium">· Certifié</span>
        </div>

        {/* Nom produit */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-bold text-sm sm:text-base text-[var(--text-dark)] group-hover:text-amber-500 transition-colors line-clamp-2 mb-1 tracking-tight">
            {product.name}
          </h3>
        </Link>

        {/* Description courte */}
        <p className="text-xs text-[var(--text-body)] leading-relaxed line-clamp-2 hidden sm:block">
          {product.description || "Produit scellé sous blister d'origine avec facture et garantie constructeur officielle."}
        </p>
      </div>

      {/* Prix + bouton d'achat */}
      <div className="pt-3.5 mt-3 border-t border-[var(--border)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="min-w-0">
          <span className="hidden sm:block text-[9px] text-[var(--text-muted)] font-black uppercase tracking-wider">
            Prix TTC Maroc
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-black text-[var(--text-dark)] tracking-tight">
              {Number(product.price).toLocaleString('fr-FR')}
            </span>
            <span className="text-xs font-bold text-amber-500">DH</span>
          </div>
        </div>

        {/* Bouton d'action */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`min-h-[42px] w-full sm:w-auto px-4 sm:px-5 rounded-xl text-xs font-bold tracking-wide flex items-center justify-center gap-1.5 transition-all duration-200 shadow-xs ${
            isOutOfStock
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              : added
              ? 'bg-emerald-600 text-white shadow-emerald-600/30 shadow-md'
              : 'bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-950 active:scale-95 hover:shadow-amber-500/20 hover:shadow-lg'
          }`}
        >
          {added ? (
            <><Check className="w-3.5 h-3.5 shrink-0 stroke-[3]" /><span>Ajouté</span></>
          ) : isOutOfStock ? (
            'Épuisé'
          ) : (
            <><ShoppingCart className="w-3.5 h-3.5 shrink-0" /><span>Commander</span></>
          )}
        </button>
      </div>
    </div>
  );
}
