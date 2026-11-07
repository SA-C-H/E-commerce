'use client';

import { useState } from 'react';
import { ShoppingCart, Check, Plus, Minus } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';

interface ProductDetailActionsProps {
  product: {
    id: string;
    name: string;
    price: number;
    stock: number;
    image_url?: string | null;
  };
}

export default function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        stock: product.stock,
      });
    }

    setAdded(true);
    toast.success(`${quantity} x "${product.name}" ajouté au panier !`);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {/* Quantité */}
        <div className="flex items-center bg-[var(--bg-page)] border border-[var(--border)] rounded-full p-1">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1 || isOutOfStock}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-dark)] hover:bg-[var(--bg-card)] transition disabled:opacity-30"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center text-xs font-bold text-[var(--text-dark)]">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            disabled={quantity >= product.stock || isOutOfStock}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-dark)] hover:bg-[var(--bg-card)] transition disabled:opacity-30"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bouton ajouter au panier */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`flex-1 py-3 px-6 rounded-full text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition shadow-sm ${
            isOutOfStock
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : added
              ? 'bg-amber-500 text-[var(--text-dark)]'
              : 'bg-[#0F172A] hover:bg-amber-500 hover:text-[var(--text-dark)] text-white'
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" />
              Ajouté au panier !
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              {isOutOfStock ? 'Rupture de stock' : 'Ajouter au panier'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
