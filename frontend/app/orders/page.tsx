'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';
import { Package, Clock, CheckCircle2, XCircle, Truck, ArrowLeft, ShoppingBag } from 'lucide-react';

interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  products?: {
    name: string;
    image_url?: string | null;
  } | null;
}

interface Order {
  id: string;
  customer_name: string;
  total: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  created_at: string;
  order_items: OrderItem[];
}

export default function OrdersHistoryPage() {
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const data = await api.get<Order[]>('/orders');
        setOrders(data || []);
      } catch (err: any) {
        if (err instanceof ApiError) {
          toast.error(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  const defaultImage =
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80';

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            En attente
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
            Confirmée
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Truck className="w-3.5 h-3.5 text-emerald-600" />
            Livrée
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            Annulée
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-8 py-10 w-full space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold tracking-widest text-amber-500 uppercase block">
              SUIVI CLIENT
            </span>
            <h1 className="font-serif-title text-3xl sm:text-4xl text-[var(--text-dark)] font-normal mt-1">
              Mes Commandes
            </h1>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-dark)] hover:text-amber-500 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Retourner à la boutique
          </Link>
        </div>

        {!isAuthenticated ? (
          <div className="p-12 text-center rounded-3xl bg-[var(--bg-card)] border border-[var(--border)] shadow-sm max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-[var(--bg-page)] border border-[var(--border)] flex items-center justify-center mx-auto text-[var(--text-dark)] mb-4">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h2 className="font-serif-title text-2xl text-[var(--text-dark)]">
              Connectez-vous pour voir vos commandes
            </h2>
            <p className="text-xs text-[var(--text-body)] mt-2 leading-relaxed">
              Consultez l&apos;état de vos livraisons et retrouvez l&apos;historique complet de vos achats.
            </p>
            <Link
              href="/login?redirect=/orders"
              className="inline-block mt-6 px-6 py-3 rounded-full bg-[#0F172A] hover:bg-amber-500 hover:text-[var(--text-dark)] text-white text-xs font-semibold uppercase tracking-wider transition shadow-sm"
            >
              Se connecter
            </Link>
          </div>
        ) : loading ? (
          <div className="p-16 text-center">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[var(--text-body)] mt-4">Chargement de votre historique...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center rounded-3xl bg-[var(--bg-card)] border border-[var(--border)] shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-[var(--bg-page)] border border-[var(--border)] flex items-center justify-center mx-auto text-[var(--text-dark)]">
              <Package className="w-7 h-7" />
            </div>
            <h2 className="font-serif-title text-2xl text-[var(--text-dark)]">
              Aucune commande trouvée
            </h2>
            <p className="text-xs text-[var(--text-body)] max-w-sm mx-auto">
              Vous n&apos;avez pas encore passé de commande sur TechNova Store.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0F172A] hover:bg-amber-500 hover:text-[var(--text-dark)] text-white text-xs font-semibold tracking-wider uppercase transition shadow-sm"
              >
                Découvrir nos produits
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border)] shadow-sm overflow-hidden"
              >
                {/* En-tête de la commande */}
                <div className="p-6 bg-[var(--bg-page)] border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-medium text-[var(--text-body)] block">
                      Commande #{order.id.slice(0, 8)}
                    </span>
                    <span className="text-xs text-[var(--text-dark)] font-semibold mt-0.5 block">
                      Passée le {new Date(order.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    {getStatusBadge(order.status)}
                    <span className="text-base font-bold text-[var(--text-dark)]">
                      {Number(order.total).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD
                    </span>
                  </div>
                </div>

                {/* Articles de la commande */}
                <div className="p-6 divide-y divide-[var(--border)]">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-[var(--bg-page)] border border-[var(--border)] flex-shrink-0">
                        <Image
                          src={item.products?.image_url || defaultImage}
                          alt={item.products?.name || 'Produit'}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <h4 className="font-semibold text-sm text-[var(--text-dark)] truncate">
                          {item.products?.name || 'Article TechNova'}
                        </h4>
                        <p className="text-xs text-[var(--text-body)] mt-0.5">
                          Quantité : <span className="font-bold text-[var(--text-dark)]">{item.quantity}</span> ×{' '}
                          {Number(item.unit_price).toFixed(2)} MAD
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-[var(--text-dark)]">
                          {(item.quantity * item.unit_price).toFixed(2)} MAD
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

