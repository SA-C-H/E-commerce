'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';
import {
  Package, Clock, CheckCircle2, XCircle,
  Truck, ArrowLeft, ShoppingBag,
} from 'lucide-react';

interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  products?: { name: string; image_url?: string | null } | null;
}

interface Order {
  id: string;
  customer_name: string;
  total: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  created_at: string;
  order_items: OrderItem[];
}

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80';

const STATUS_CONFIG = {
  pending:   { label: 'En attente',  color: '#F59E0B', bg: 'rgba(245,158,11,0.15)',  icon: Clock        },
  confirmed: { label: 'Confirmée',   color: '#3B82F6', bg: 'rgba(59,130,246,0.15)',  icon: CheckCircle2 },
  delivered: { label: 'Livrée',      color: '#10B981', bg: 'rgba(16,185,129,0.15)', icon: Truck        },
  cancelled: { label: 'Annulée',     color: '#EF4444', bg: 'rgba(239,68,68,0.15)',   icon: XCircle      },
};

export default function OrdersHistoryPage() {
  /* ── le store expose token pour le fallback localStorage ── */
  const { isAuthenticated, token: storeToken } = useAuthStore();
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    /* Synchroniser le token dans localStorage si nécessaire
       (cas où Zustand a restauré le store avant que localStorage soit peuplé) */
    if (storeToken && typeof window !== 'undefined') {
      if (!localStorage.getItem('token')) {
        localStorage.setItem('token', storeToken);
      }
    }

    const fetchOrders = async () => {
      try {
        const data = await api.get<Order[]>('/orders');
        setOrders(Array.isArray(data) ? data : []);
      } catch (err: any) {
        toast.error(err instanceof ApiError ? err.message : 'Impossible de charger vos commandes');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, storeToken]);

  /* ── Badge statut ── */
  const StatusBadge = ({ status }: { status: Order['status'] }) => {
    const cfg = STATUS_CONFIG[status];
    const Icon = cfg.icon;
    return (
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
        style={{ color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.color}40` }}
      >
        <Icon className="w-3.5 h-3.5" />
        {cfg.label}
      </span>
    );
  };

  /* ── États d'affichage ── */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0B0F1A' }}>
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div
            className="p-8 sm:p-12 text-center rounded-3xl max-w-md w-full"
            style={{ backgroundColor: '#0F1A2E', border: '1px solid #1E293B' }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: '#1E293B' }}
            >
              <ShoppingBag className="w-7 h-7" style={{ color: '#F59E0B' }} />
            </div>
            <h2 className="text-2xl font-black mb-2" style={{ color: '#F8FAFC' }}>
              Connectez-vous
            </h2>
            <p className="text-sm mb-6" style={{ color: '#94A3B8' }}>
              Consultez l&apos;état de vos livraisons et retrouvez l&apos;historique complet de vos commandes.
            </p>
            <Link
              href="/login?redirect=/orders"
              className="inline-block px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider transition"
              style={{ backgroundColor: '#F59E0B', color: '#0A1128' }}
            >
              Se connecter
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0B0F1A' }}>
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-8 py-10 w-full space-y-8">

        {/* ── En-tête ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold tracking-widest text-amber-500 uppercase block mb-1">
              SUIVI CLIENT
            </span>
            <h1 className="text-3xl sm:text-4xl font-black" style={{ color: '#F8FAFC' }}>
              Mes Commandes
            </h1>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold transition hover:text-amber-500"
            style={{ color: '#94A3B8' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Continuer mes achats
          </Link>
        </div>

        {/* ── Chargement ── */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm" style={{ color: '#94A3B8' }}>Chargement de votre historique...</p>
          </div>

        /* ── Aucune commande ── */
        ) : orders.length === 0 ? (
          <div
            className="py-20 text-center rounded-3xl"
            style={{ backgroundColor: '#0F1A2E', border: '1px solid #1E293B' }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: '#1E293B' }}
            >
              <Package className="w-7 h-7" style={{ color: '#64748B' }} />
            </div>
            <h2 className="text-2xl font-black mb-2" style={{ color: '#F8FAFC' }}>
              Aucune commande pour l&apos;instant
            </h2>
            <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: '#94A3B8' }}>
              Vous n&apos;avez pas encore passé de commande. Découvrez notre catalogue de smartphones et laptops.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider transition"
              style={{ backgroundColor: '#F59E0B', color: '#0A1128' }}
            >
              Découvrir nos produits
            </Link>
          </div>

        /* ── Liste des commandes ── */
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl overflow-hidden"
                style={{ backgroundColor: '#0F1A2E', border: '1px solid #1E293B' }}
              >
                {/* En-tête commande */}
                <div
                  className="px-5 py-4 flex flex-wrap items-center justify-between gap-3"
                  style={{ backgroundColor: '#0A1120', borderBottom: '1px solid #1E293B' }}
                >
                  <div>
                    <span className="text-xs font-black" style={{ color: '#F8FAFC' }}>
                      Commande #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="text-[11px] block mt-0.5" style={{ color: '#64748B' }}>
                      {new Date(order.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })}
                      {' — '}
                      {order.customer_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={order.status} />
                    <span className="text-base font-black" style={{ color: '#F59E0B' }}>
                      {Number(order.total).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD
                    </span>
                  </div>
                </div>

                {/* Articles */}
                <div className="divide-y" style={{ borderColor: '#1E293B' }}>
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="px-5 py-4 flex items-center gap-4">
                      {/* Image */}
                      <div
                        className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0"
                        style={{ backgroundColor: '#1E293B' }}
                      >
                        <Image
                          src={item.products?.image_url || DEFAULT_IMAGE}
                          alt={item.products?.name || 'Produit'}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>

                      {/* Nom + quantité */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: '#F1F5F9' }}>
                          {item.products?.name || 'Article TechNova'}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>
                          {item.quantity} × {Number(item.unit_price).toLocaleString('fr-FR')} MAD
                        </p>
                      </div>

                      {/* Total ligne */}
                      <span className="text-sm font-black shrink-0" style={{ color: '#F59E0B' }}>
                        {(item.quantity * item.unit_price).toLocaleString('fr-FR')} MAD
                      </span>
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
