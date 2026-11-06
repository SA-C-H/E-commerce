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
    if (user?.name) {
      setCustomerName(user.name);
    }
  }, [user]);

  const defaultImage =
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80';

  const totalPrice = getTotalPrice();
  const totalCount = getTotalCount();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour valider votre commande', {
        action: {
          label: 'Se connecter',
          onClick: () => router.push('/login?redirect=/cart'),
        },
      });
      return;
    }

    if (items.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }

    if (!customerName.trim()) {
      toast.error('Veuillez renseigner votre nom pour la livraison');
      return;
    }

    setLoadingOrder(true);

    try {
      const payload = {
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        items: items.map((i) => ({
          product_id: i.id,
          quantity: i.quantity,
        })),
      };

      const result = await api.post<{ order: any; whatsappUrl: string }>('/orders', payload);

      clearCart();
      toast.success('Commande validée ! Redirection vers WhatsApp...');

      setTimeout(() => {
        if (result.whatsappUrl) {
          window.location.href = result.whatsappUrl;
        } else {
          router.push('/orders');
        }
      }, 1000);
    } catch (err: any) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error('Une erreur est survenue lors de la commande.');
      }
    } finally {
      setLoadingOrder(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        <div className="space-y-1">
          <span className="text-[11px] font-semibold tracking-widest text-[#2563EB] uppercase block">
            FINALISATION
          </span>
          <h1 className="font-serif-title text-3xl sm:text-4xl text-[#0F172A] font-normal">
            Votre Panier ({totalCount})
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-[#E2E8F0] shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center mx-auto text-[#0F172A]">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h2 className="font-serif-title text-2xl text-[#0F172A]">Votre panier est vide</h2>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto">
              Découvrez nos chargeurs rapides GaN, coques protectrices et connectique haute performance.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0F172A] hover:bg-[#2563EB] text-white text-xs font-semibold tracking-wider uppercase transition shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Explorer la boutique
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Liste des articles */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-[#E2E8F0] shadow-sm divide-y divide-[#F1F5F9]">
                {items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-[#F1F5F9] flex-shrink-0">
                      <Image
                        src={item.image_url || defaultImage}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif-title font-bold text-sm text-[#0F172A] truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#2563EB] font-bold mt-1">
                        {Number(item.price).toFixed(2)} MAD
                      </p>

                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] hover:bg-white transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-[#0F172A] w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="w-7 h-7 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-[#0F172A] hover:bg-white transition disabled:opacity-40"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-[#0F172A] block">
                        {(item.price * item.quantity).toFixed(2)} MAD
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="mt-2 text-slate-400 hover:text-red-500 transition p-1"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Récapitulatif et validation WhatsApp */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-6">
              <h2 className="font-serif-title text-xl text-[#0F172A] font-bold">
                Validation de la commande
              </h2>

              <form onSubmit={handleCheckout} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold tracking-wider uppercase text-[#0F172A] mb-1.5">
                    Nom & Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Votre nom complet"
                    className="w-full px-4 py-2.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold tracking-wider uppercase text-[#0F172A] mb-1.5">
                    Numéro de Téléphone (WhatsApp)
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="06 XX XX XX XX"
                    className="w-full px-4 py-2.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div className="pt-4 border-t border-[#F1F5F9] space-y-2 text-xs">
                  <div className="flex justify-between text-[#64748B]">
                    <span>Sous-total ({totalCount} articles)</span>
                    <span>{totalPrice.toFixed(2)} MAD</span>
                  </div>
                  <div className="flex justify-between text-[#64748B]">
                    <span>Livraison</span>
                    <span className="text-[#2563EB] font-semibold">Calculée sur WhatsApp</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-[#0F172A] pt-2 border-t border-[#F1F5F9]">
                    <span>Total estimé</span>
                    <span>{totalPrice.toFixed(2)} MAD</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loadingOrder}
                  className="w-full py-3.5 px-6 rounded-full bg-[#0F172A] hover:bg-[#2563EB] text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50"
                >
                  <MessageSquare className="w-4 h-4" />
                  {loadingOrder ? 'Validation...' : 'Commander sur WhatsApp'}
                </button>

                <p className="text-[11px] text-[#94A3B8] text-center leading-relaxed">
                  Paiement à la livraison. Vous serez redirigé vers WhatsApp avec votre bon de commande prérempli.
                </p>
              </form>
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
