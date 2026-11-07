'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowLeft, MessageSquare, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useState, useEffect } from 'react';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);

  const { items, removeItem, updateQuantity, clearCart, getTotalPrice, getTotalCount } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  useEffect(() => {
    setMounted(true);
    if (user?.name) setCustomerName(user.name);
  }, [user]);

  const defaultImage =
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80';

  const totalPrice = getTotalPrice();
  const totalCount = getTotalCount();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour valider votre commande', {
        action: { label: 'Se connecter', onClick: () => router.push('/login?redirect=/cart') },
      });
      return;
    }
    if (items.length === 0) { toast.error('Votre panier est vide'); return; }
    if (!customerName.trim()) { toast.error('Veuillez renseigner votre nom'); return; }

    setLoadingOrder(true);
    try {
      const result = await api.post<{ order: any; whatsappUrl: string }>('/orders', {
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        items: items.map((i) => ({ product_id: i.id, quantity: i.quantity })),
      });
      clearCart();
      toast.success('Commande validée ! Redirection vers WhatsApp...');
      setTimeout(() => {
        if (result.whatsappUrl) window.location.href = result.whatsappUrl;
        else router.push('/orders');
      }, 1000);
    } catch (err: any) {
      toast.error(err instanceof ApiError ? err.message : 'Une erreur est survenue.');
    } finally {
      setLoadingOrder(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg-page)]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)]">
      <Navbar />

      <main className="flex-1 w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-10 sm:py-14 space-y-8">

        <div className="space-y-1">
          <span className="text-xs font-semibold tracking-widest text-amber-500 uppercase">
            FINALISATION
          </span>
          <h1 className="font-serif-title text-3xl sm:text-4xl text-[var(--text-dark)] font-normal">
            Votre Panier ({totalCount})
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-[var(--bg-card)] rounded-2xl p-12 sm:p-16 text-center border border-[var(--border)] shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-[var(--bg-page)] border border-[var(--border)] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-7 h-7 text-[var(--text-dark)]" />
            </div>
            <h2 className="font-serif-title text-2xl text-[var(--text-dark)]">Panier vide</h2>
            <p className="text-sm text-[var(--text-body)] max-w-sm mx-auto">
              Parcourez notre catalogue de smartphones et laptops.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0F172A] hover:bg-amber-500 hover:text-[#0F172A] text-white text-sm font-semibold transition shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Explorer la boutique
            </Link>
          </div>
        ) : (
          /* Layout : récap EN PREMIER sur mobile (order-first), articles dessous */
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 lg:items-start">

            {/* ── RÉCAPITULATIF — order-first sur mobile ── */}
            <div className="order-first lg:order-last lg:col-span-4 bg-[var(--bg-card)] rounded-2xl p-5 sm:p-7 border border-[var(--border)] shadow-sm space-y-5 lg:sticky lg:top-24">
              <h2 className="font-serif-title text-xl text-[var(--text-dark)]">
                Récapitulatif
              </h2>

              <form onSubmit={handleCheckout} className="space-y-4">

                <div>
                  <label className="block text-xs font-bold tracking-wider uppercase text-[var(--text-dark)] mb-2">
                    Nom & Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Votre nom complet"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border)] text-sm text-[var(--text-dark)] placeholder-[var(--text-muted)] focus:outline-none focus:border-amber-500 transition min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-wider uppercase text-[var(--text-dark)] mb-2">
                    Téléphone WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="06 XX XX XX XX"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border)] text-sm text-[var(--text-dark)] placeholder-[var(--text-muted)] focus:outline-none focus:border-amber-500 transition min-h-[44px]"
                  />
                </div>

                <div className="pt-4 border-t border-[var(--border)] space-y-2.5 text-sm">
                  <div className="flex justify-between text-[var(--text-body)]">
                    <span>Sous-total ({totalCount} articles)</span>
                    <span className="font-semibold">{totalPrice.toFixed(2)} MAD</span>
                  </div>
                  <div className="flex justify-between text-[var(--text-body)]">
                    <span>Livraison</span>
                    <span className="text-amber-600 font-semibold">Via WhatsApp</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[var(--text-dark)] pt-2 border-t border-[var(--border)]">
                    <span>Total estimé</span>
                    <span>{totalPrice.toFixed(2)} MAD</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loadingOrder}
                  className="w-full min-h-[48px] px-6 rounded-xl bg-[#0F172A] hover:bg-amber-500 hover:text-[#0F172A] text-white font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50"
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  {loadingOrder ? 'Validation...' : 'Commander sur WhatsApp'}
                </button>

                <p className="text-xs text-[var(--text-muted)] text-center leading-relaxed">
                  Paiement à la livraison — bon de commande WhatsApp prérempli.
                </p>
              </form>
            </div>

            {/* ── LISTE DES ARTICLES ── */}
            <div className="order-last lg:order-first lg:col-span-8 space-y-3">
              <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] shadow-sm divide-y divide-[var(--border)]">
                {items.map((item) => (
                  <div key={item.id} className="p-4 sm:p-5 flex items-center gap-4">

                    {/* Image */}
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[var(--bg-page)] shrink-0">
                      <Image
                        src={item.image_url || defaultImage}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    {/* Infos produit */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base text-[var(--text-dark)] truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-amber-600 font-bold mt-0.5">
                        {Number(item.price).toFixed(2)} MAD
                      </p>

                      {/* Contrôles quantité — 44px */}
                      <div className="flex items-center gap-2 mt-2.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-11 h-11 rounded-xl bg-[var(--bg-page)] border border-[var(--border)] flex items-center justify-center text-[var(--text-dark)] hover:border-amber-500 transition active:scale-95"
                          aria-label="Diminuer"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-bold text-[var(--text-dark)] w-8 text-center tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="w-11 h-11 rounded-xl bg-[var(--bg-page)] border border-[var(--border)] flex items-center justify-center text-[var(--text-dark)] hover:border-amber-500 transition disabled:opacity-40 active:scale-95"
                          aria-label="Augmenter"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Total ligne + supprimer */}
                    <div className="text-right shrink-0">
                      <span className="text-sm sm:text-base font-bold text-[var(--text-dark)] block tabular-nums">
                        {(item.price * item.quantity).toFixed(2)} MAD
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="mt-2 p-2 text-[var(--text-muted)] hover:text-red-500 transition rounded-lg hover:bg-red-50"
                        title="Supprimer"
                        aria-label="Supprimer l'article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* Lien retour boutique */}
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-sm text-[var(--text-body)] hover:text-amber-500 transition py-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Continuer mes achats
              </Link>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
