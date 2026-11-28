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
  Truck, ArrowLeft, ShoppingBag, AlertTriangle,
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
  const { isAuthenticated, token: storeToken } = useAuthStore();
  const [orders, setOrders]         = useState<Order[]>([]);
  const [loading, setLoading]       = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null); // id de la commande en cours d'annulation
  const [confirmId, setConfirmId]   = useState<string | null>(null); // id de la commande à confirmer l'annulation

  const fetchOrders = async () => {
    if (storeToken && typeof window !== 'undefined') {
      if (!localStorage.getItem('token')) localStorage.setItem('token', storeToken);
    }
    try {
      const data = await api.get<Order[]>('/orders');
      setOrders(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast.error(err instanceof ApiError ? err.message : 'Impossible de charger vos commandes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    fetchOrders();
  }, [isAuthenticated, storeToken]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Annuler une commande (seulement pending) ── */
  const handleCancel = async (orderId: string) => {
    setCancelling(orderId);
    setConfirmId(null);
    try {
      await api.patch(`/orders/${orderId}/cancel`, {});
      toast.success('Commande annulée — le stock a été remis à jour.');
      await fetchOrders();
    } catch (err: any) {
      toast.error(err instanceof ApiError ? err.message : 'Impossible d\'annuler la commande');
    } finally {
      setCancelling(null);
    }
  };

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

  /* ── Non connecté ── */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0B0F1A' }}>
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="p-8 sm:p-12 text-center rounded-3xl max-w-md w-full"
            style={{ backgroundColor: '#0F1A2E', border: '1px solid #1E293B' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: '#1E293B' }}>
              <ShoppingBag className="w-7 h-7" style={{ color: '#F59E0B' }} />
            </div>
            <h2 className="text-2xl font-black mb-2" style={{ color: '#F8FAFC' }}>Connectez-vous</h2>
            <p className="text-sm mb-6" style={{ color: '#94A3B8' }}>
              Consultez et gérez vos commandes.
            </p>
            <Link href="/login?redirect=/orders"
              className="inline-block px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider transition"
              style={{ backgroundColor: '#F59E0B', color: '#0A1128' }}>
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

        {/* En-tête */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold tracking-widest text-amber-500 uppercase block mb-1">
              SUIVI CLIENT
            </span>
            <h1 className="text-3xl sm:text-4xl font-black" style={{ color: '#F8FAFC' }}>
              Mes Commandes
            </h1>
          </div>
          <Link href="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold transition hover:text-amber-500"
            style={{ color: '#94A3B8' }}>
            <ArrowLeft className="w-4 h-4" />
            Continuer mes achats
          </Link>
        </div>

        {/* Chargement */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm" style={{ color: '#94A3B8' }}>Chargement...</p>
          </div>

        ) : orders.length === 0 ? (
          /* Aucune commande */
          <div className="py-20 text-center rounded-3xl"
            style={{ backgroundColor: '#0F1A2E', border: '1px solid #1E293B' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: '#1E293B' }}>
              <Package className="w-7 h-7" style={{ color: '#64748B' }} />
            </div>
            <h2 className="text-2xl font-black mb-2" style={{ color: '#F8FAFC' }}>
              Aucune commande pour l&apos;instant
            </h2>
            <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: '#94A3B8' }}>
              Vous n&apos;avez pas encore passé de commande.
            </p>
            <Link href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider"
              style={{ backgroundColor: '#F59E0B', color: '#0A1128' }}>
              Découvrir nos produits
            </Link>
          </div>

        ) : (
          /* Liste commandes */
          <div className="space-y-5">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl overflow-hidden"
                style={{ backgroundColor: '#0F1A2E', border: '1px solid #1E293B' }}>

                {/* En-tête commande */}
                <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-3"
                  style={{ backgroundColor: '#0A1120', borderBottom: '1px solid #1E293B' }}>
                  <div>
                    <span className="text-xs font-black" style={{ color: '#F8FAFC' }}>
                      Commande #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="text-[11px] block mt-0.5" style={{ color: '#64748B' }}>
                      {new Date(order.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <StatusBadge status={order.status} />
                    <span className="text-base font-black" style={{ color: '#F59E0B' }}>
                      {Number(order.total).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD
                    </span>
                    {/* ── Bouton Annuler — seulement si pending ── */}
                    {order.status === 'pending' && (
                      confirmId === order.id ? (
                        /* Mini confirmation inline */
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                          style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" style={{ color: '#EF4444' }} />
                          <span className="text-xs" style={{ color: '#F1F5F9' }}>Confirmer l&apos;annulation ?</span>
                          <button
                            onClick={() => handleCancel(order.id)}
                            disabled={cancelling === order.id}
                            className="px-2.5 py-1 rounded-lg text-xs font-black transition disabled:opacity-50"
                            style={{ backgroundColor: '#EF4444', color: '#fff' }}
                          >
                            {cancelling === order.id ? '...' : 'Oui'}
                          </button>
                          <button
                            onClick={() => setConfirmId(null)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold transition"
                            style={{ backgroundColor: '#1E293B', color: '#94A3B8' }}
                          >
                            Non
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmId(order.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition"
                          style={{
                            backgroundColor: 'rgba(239,68,68,0.1)',
                            color: '#EF4444',
                            border: '1px solid rgba(239,68,68,0.3)',
                          }}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Annuler
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Info annulation pour pending */}
                {order.status === 'pending' && (
                  <div className="px-5 py-2 text-[11px] flex items-center gap-1.5"
                    style={{ backgroundColor: 'rgba(245,158,11,0.05)', borderBottom: '1px solid #1E293B', color: '#94A3B8' }}>
                    <Clock className="w-3 h-3 text-amber-500 shrink-0" />
                    En attente de confirmation admin — vous pouvez encore annuler cette commande.
                  </div>
                )}

                {/* Articles */}
                <div className="divide-y" style={{ borderColor: '#1E293B' }}>
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="px-5 py-4 flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0"
                        style={{ backgroundColor: '#1E293B' }}>
                        <Image
                          src={item.products?.image_url || DEFAULT_IMAGE}
                          alt={item.products?.name || 'Produit'}
                          fill sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: '#F1F5F9' }}>
                          {item.products?.name || 'Article TechNova'}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>
                          {item.quantity} × {Number(item.unit_price).toLocaleString('fr-FR')} MAD
                        </p>
                      </div>
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
