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

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

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

  const defaultImage =
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80';

  // Découpage intelligent de la description pour extraire les caractéristiques
  const specs = product.description ? product.description.split('.').filter(s => s.trim().length > 0) : [];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-sm hover:shadow-xl hover:shadow-[#0F172A]/8 hover:border-[#CBD5E1] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
    >
      <div>
        {/* ── Image du produit avec Overlay au survol qui révèle ce qui est caché ── */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#F1F5F9] block mb-4">
          <Image
            src={product.image_url || defaultImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover object-center group-hover:scale-108 transition-transform duration-500"
          />

          {/* Badge Catégorie permanent */}
          {product.categories?.name && (
            <span className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-white/95 text-[#0F172A] shadow-sm border border-[#E2E8F0]">
              {product.categories.name}
            </span>
          )}

          {/* Badge Stock permanent */}
          <span className={`absolute top-3 right-3 z-10 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${
            isOutOfStock ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            {isOutOfStock ? 'Épuisé' : `En stock (${product.stock})`}
          </span>

          {/* ══════════════════════════════════════════════════════════
              OVERLAY AU HOVER : AFFICHE TOUTES LES CARACTÉRISTIQUES CACHÉES
          ══════════════════════════════════════════════════════════ */}
          <div
            className={`absolute inset-0 z-20 bg-[#0F172A]/85 backdrop-blur-[4px] p-4 flex flex-col justify-between text-white transition-all duration-300 ${
              hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
            <div>
              <div className="flex items-center gap-1.5 text-[#38BDF8] text-[10px] font-bold tracking-widest uppercase mb-2">
                <Zap className="w-3.5 h-3.5" />
                Fiche Technique & Points Forts
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-200 leading-snug">
                {specs.slice(0, 3).map((spec, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#38BDF8] font-bold text-xs leading-none">•</span>
                    <span className="line-clamp-2">{spec.trim()}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-white/15 flex items-center justify-between">
              <span className="text-[10px] text-slate-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Garantie 1 an
              </span>
              <Link
                href={`/products/${product.id}`}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full backdrop-blur-sm transition"
              >
                <Eye className="w-3 h-3 text-[#38BDF8]" />
                Détails
              </Link>
            </div>
          </div>
        </div>

        {/* Étoiles dorées discrètes */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
          ))}
          <span className="text-[11px] text-[#94A3B8] ml-1">(4.9/5)</span>
        </div>

        {/* Nom du produit en Serif */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-serif-title font-bold text-lg text-[#0F172A] group-hover:text-[#2563EB] transition-colors line-clamp-1 mb-1">
            {product.name}
          </h3>
        </Link>

        {/* Description : aperçu normal, s'agrandit au survol */}
        <p className={`text-xs text-[#64748B] leading-relaxed transition-all duration-300 ${
          hovered ? 'line-clamp-3 text-[#334155]' : 'line-clamp-2'
        }`}>
          {product.description || 'Appareil d\'origine certifié neuf sous blister avec garantie constructeur.'}
        </p>
      </div>

      {/* Prix et action */}
      <div className="pt-4 mt-3 border-t border-[#F1F5F9] flex items-center justify-between">
        <div>
          <span className="text-[10px] text-[#94A3B8] block font-medium uppercase tracking-wider">Prix garanti</span>
          <span className="text-lg font-bold text-[#0F172A]">
            {Number(product.price).toLocaleString('fr-FR')}{' '}
            <span className="text-xs font-normal text-[#2563EB]">MAD</span>
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide flex items-center gap-1.5 transition-all shadow-sm ${
            isOutOfStock
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : added
              ? 'bg-emerald-600 text-white'
              : 'bg-[#0F172A] group-hover:bg-[#2563EB] text-white hover:shadow-md'
          }`}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Ajouté
            </>
          ) : isOutOfStock ? (
            'Épuisé'
          ) : (
            <>
              <ShoppingCart className="w-3.5 h-3.5" />
              Commander
            </>
          )}
        </button>
      </div>
    </div>
  );
}
