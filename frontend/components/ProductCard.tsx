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

  const specs = product.description
    ? product.description.split('.').filter(s => s.trim().length > 0)
    : [];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-[var(--bg-card)] rounded-2xl p-4 sm:p-5 border border-[var(--border)] shadow-sm hover:shadow-xl hover:shadow-[#0F172A]/8 hover:border-[#CBD5E1] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
    >
      <div>
        {/* Image */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[var(--bg-page)] mb-3 sm:mb-4">
          <Image
            src={product.image_url || defaultImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badge Catégorie */}
          {product.categories?.name && (
            <span className="hidden sm:inline-block absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[var(--bg-card)]/95 text-[var(--text-dark)] shadow-sm border border-[var(--border)]">
              {product.categories.name}
            </span>
          )}

          {/* Badge Stock — text-xs minimum pour lisibilité */}
          <span className={`absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm ${
            isOutOfStock
              ? 'bg-red-50 text-red-600 border border-red-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            {isOutOfStock ? 'Épuisé' : `Stock: ${product.stock}`}
          </span>

          {/* Overlay hover specs — desktop uniquement */}
          <div className={`hidden sm:flex absolute inset-0 z-20 bg-[#0F172A]/85 backdrop-blur-[4px] p-4 flex-col justify-between text-white transition-all duration-300 ${
            hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}>
            <div>
              <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-bold tracking-widest uppercase mb-2">
                <Zap className="w-3.5 h-3.5" />
                Points clés
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
              <span className="text-[10px] text-slate-300 flex items-center gap-1 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Garantie 1 an
              </span>
              <Link
                href={`/products/${product.id}`}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition"
              >
                <Eye className="w-3 h-3 text-amber-400" />
                Détails
              </Link>
            </div>
          </div>
        </div>

        {/* Étoiles */}
        <div className="flex items-center gap-0.5 mb-1.5 sm:mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
          ))}
          <span className="text-[11px] text-[var(--text-muted)] ml-1">(4.9)</span>
        </div>

        {/* Nom produit */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-serif-title font-bold text-sm sm:text-base lg:text-lg text-[var(--text-dark)] group-hover:text-amber-500 transition-colors line-clamp-2 mb-1">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs text-[var(--text-body)] leading-relaxed line-clamp-2 hidden sm:block">
          {product.description || "Appareil d'origine certifié neuf sous blister avec garantie constructeur."}
        </p>
      </div>

      {/* Prix + bouton — min 44px de hauteur sur mobile */}
      <div className="pt-3 mt-3 border-t border-[var(--border)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <div className="min-w-0">
          <span className="hidden sm:block text-[10px] text-[var(--text-muted)] font-medium uppercase tracking-wider">
            Prix garanti
          </span>
          <span className="text-sm sm:text-base lg:text-lg font-bold text-[var(--text-dark)] block leading-tight">
            {Number(product.price).toLocaleString('fr-FR')}
            <span className="text-xs font-normal text-amber-600 ml-1">MAD</span>
          </span>
        </div>

        {/* Bouton : min-h-[44px] pour tactile */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`min-h-[44px] w-full sm:w-auto px-4 sm:px-5 rounded-xl text-xs font-semibold tracking-wide flex items-center justify-center gap-1.5 transition-all shadow-sm ${
            isOutOfStock
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : added
              ? 'bg-emerald-600 text-white'
              : 'bg-[#0F172A] group-hover:bg-amber-500 group-hover:text-[#0F172A] text-white hover:shadow-md'
          }`}
        >
          {added ? (
            <><Check className="w-3.5 h-3.5 shrink-0" /><span>Ajouté</span></>
          ) : isOutOfStock ? (
            'Épuisé'
          ) : (
            <><ShoppingCart className="w-3.5 h-3.5 shrink-0" /><span>Ajouter</span></>
          )}
        </button>
      </div>
    </div>
  );
}
