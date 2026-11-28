'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, MessageSquare, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&auto=format&fit=crop&q=80';

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice, getTotalCount } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  const [customerName,  setCustomerName]  = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (user?.name) setCustomerName(user.name); }, [user]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const totalPrice = getTotalPrice();
  const totalCount = getTotalCount();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onClose();
      toast.error('Vous devez être connecté pour commander', {
        action: { label: 'Se connecter', onClick: () => router.push('/login?redirect=/') },
      });
      return;
    }
    if (!customerName.trim()) { toast.error('Veuillez renseigner votre nom'); return; }

    setLoading(true);
    try {
      const result = await api.post<{ order: any; whatsappUrl: string }>('/orders', {
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        items: items.map((i) => ({ product_id: i.id, quantity: i.quantity })),
      });
      clearCart();
      onClose();
      toast.success('Commande validée !', {
        description: 'Redirection vers WhatsApp...',
        action: { label: 'Voir mes commandes', onClick: () => router.push('/orders') },
      });
      setTimeout(() => {
        if (result.whatsappUrl) window.location.href = result.whatsappUrl;
        else router.push('/orders');
      }, 1200);
    } catch (err: any) {
      toast.error(err instanceof ApiError ? err.message : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] transition-all duration-300"
        style={{
          backgroundColor: open ? 'rgba(0,0,0,0.55)' : 'transparent',
          backdropFilter: open ? 'blur(2px)' : 'none',
          pointerEvents: open ? 'auto' : 'none',
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full z-[101] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out bg-[var(--bg-card)] border-l border-[var(--border)]"
        style={{
          width: 'min(420px, 88vw)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        {/* En-tête */}
        <div className="flex items-center justify-between px-5 py-4 shrink-0 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            <span className="font-black text-base text-[var(--text-dark)]">Mon panier</span>
            {totalCount > 0 && (
              <span className="bg-amber-500 text-slate-950 text-xs font-black px-2 py-0.5 rounded-full">
                {totalCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full transition hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Corps */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[var(--bg-page)] border border-[var(--border)]">
                <ShoppingBag className="w-7 h-7 text-[var(--text-muted)]" />
              </div>
              <p className="font-bold text-base text-[var(--text-dark)]">Votre panier est vide</p>
              <p className="text-sm text-[var(--text-body)]">Ajoutez des produits pour commencer</p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 transition"
              >
                Continuer mes achats
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border)]"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-[var(--bg-card)] border border-[var(--border)]">
                    <Image
                      src={item.image_url || DEFAULT_IMAGE}
                      alt={item.name}
                      fill sizes="64px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold leading-tight truncate text-[var(--text-dark)]">
                      {item.name}
                    </p>
                    <p className="text-sm font-black mt-1 text-amber-500">
                      {(item.price * item.quantity).toLocaleString('fr-FR')} MAD
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-9 h-9 rounded-lg flex items-center justify-center transition bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-muted)] hover:border-amber-500"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-black w-6 text-center tabular-nums text-[var(--text-dark)]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-9 h-9 rounded-lg flex items-center justify-center transition bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-muted)] hover:border-amber-500 disabled:opacity-40"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto w-9 h-9 rounded-lg flex items-center justify-center transition hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pied */}
        {items.length > 0 && (
          <div className="shrink-0 p-4 space-y-3 border-t border-[var(--border)] bg-[var(--bg-page)]">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--text-muted)]">Sous-total ({totalCount} articles)</span>
              <span className="font-black text-[var(--text-dark)]">{totalPrice.toLocaleString('fr-FR')} MAD</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[var(--text-muted)]">Livraison</span>
              <span className="font-bold text-amber-500">Via WhatsApp</span>
            </div>

            <form onSubmit={handleCheckout} className="space-y-2 pt-2 border-t border-[var(--border)]">
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Nom & Prénom *"
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition focus:ring-2 focus:ring-amber-500/40 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-dark)] placeholder-[var(--text-muted)]"
              />
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Téléphone WhatsApp"
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition focus:ring-2 focus:ring-amber-500/40 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-dark)] placeholder-[var(--text-muted)]"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                  color: '#0A1128',
                  boxShadow: '0 4px 16px rgba(245,158,11,0.3)',
                }}
              >
                {loading
                  ? <span className="w-4 h-4 border-2 border-[#0A1128]/30 border-t-[#0A1128] rounded-full animate-spin" />
                  : <MessageSquare className="w-4 h-4" />}
                {loading ? 'Validation...' : 'Commander sur WhatsApp'}
              </button>
            </form>

            <Link
              href="/cart"
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 text-xs font-semibold transition hover:text-amber-500 text-[var(--text-muted)]"
            >
              Voir le panier complet
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
