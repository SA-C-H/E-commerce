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
  Package, Clock, CheckCircle2, XCircle, Truck,
  ArrowLeft, ShoppingBag, AlertTriangle, ChevronDown,
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
  'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&auto=format&fit=crop&q=80';

const STATUS_CONFIG = {
  pending:   { label: 'En attente', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)',  icon: Clock        },
  confirmed: { label: 'Confirmée',  color: '#3B82F6', bg: 'rgba(59,130,246,0.15)',  icon: CheckCircle2 },
  delivered: { label: 'Livrée',     color: '#10B981', bg: 'rgba(16,185,129,0.15)',  icon: Truck        },
  cancelled: { label: 'Annulée',    color: '#EF4444', bg: 'rgba(239,68,68,0.15)',   icon: XCircle      },
};

const StatusBadge = ({ status }: { status: Order['status'] }) => {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0"
      style={{ color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.color}40` }}
    >
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
};

export default function OrdersHistoryPage() {
  const { isAuthenticated, token: storeToken } = useAuthStore();
  const [orders, setOrders]         = useState<Order[]>([]);
  const [loading, setLoading]       = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [confirmId, setConfirmId]   = useState<string | null>(null);
  const [openIds, setOpenIds]       = useState<Set<string>>(new Set()); // accordion

  const toggleOpen = (id: string) => {
    setOpenIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const fetchOrders = async () => {
    if (storeToken && typeof window !== 'undefined') {
      // Synchroniser sessionStorage ET localStorage pour compatibilité
      if (!sessionStorage.getItem('token')) sessionStorage.setItem('token', storeToken);
      if (!localStorage.getItem('token')) localStorage.setItem('token', storeToken);
    }
    try {
      const data = await api.get<Order[]>('/orders');
      const list = Array.isArray(data) ? data : [];
      setOrders(list);
      // Ouvrir automatiquement la première commande pending
      const firstPending = list.find(o => o.status === 'pending');
      if (firstPending) setOpenIds(new Set([firstPending.id]));
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

  /* ── Non connecté ── */
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg-page)]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="p-8 text-center rounded-2xl max-w-sm w-full bg-[var(--bg-card)] border border-[var(--border)]">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 bg-[var(--bg-page)] border border-[var(--border)]">
              <ShoppingBag className="w-6 h-6 text-amber-500" />
            </div>
            <h2 className="text-xl font-black mb-2 text-[var(--text-dark)]">Connectez-vous</h2>
            <p className="text-sm mb-5 text-[var(--text-body)]">
              Consultez et gérez vos commandes.
            </p>
            <Link href="/login?redirect=/orders"
              className="inline-block px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-slate-950 transition">
              Se connecter
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)]">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-8 w-full">

        {/* En-tête compact */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-amber-500 uppercase block mb-0.5">
              SUIVI CLIENT
            </span>
            <h1 className="text-2xl font-black text-[var(--text-dark)]">
              Mes Commandes
              {!loading && orders.length > 0 && (
                <span className="ml-2 text-sm font-semibold text-[var(--text-muted)]">
                  ({orders.length})
                </span>
              )}
            </h1>
          </div>
          <Link href="/products"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold transition hover:text-amber-500 text-[var(--text-muted)]">
            <ArrowLeft className="w-3.5 h-3.5" />
            Boutique
          </Link>
        </div>

        {/* Chargement */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-[var(--text-muted)]">Chargement...</p>
          </div>

        ) : orders.length === 0 ? (
          /* Aucune commande */
          <div className="py-16 text-center rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 bg-[var(--bg-page)] border border-[var(--border)]">
              <Package className="w-6 h-6 text-[var(--text-muted)]" />
            </div>
            <h2 className="text-lg font-black mb-1 text-[var(--text-dark)]">Aucune commande</h2>
            <p className="text-sm mb-5 text-[var(--text-body)]">
              Vous n&apos;avez pas encore passé de commande.
            </p>
            <Link href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-slate-950 transition">
              Découvrir nos produits
            </Link>
          </div>

        ) : (
          /* ── Liste accordion ── */
          <div className="space-y-3">
            {orders.map((order) => {
              const isOpen = openIds.has(order.id);
              const cfg    = STATUS_CONFIG[order.status];

              return (
                <div
                  key={order.id}
                  className="rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] transition-shadow hover:shadow-md"
                >
                  {/* ── Ligne résumé cliquable ── */}
                  <button
                    className="w-full px-4 py-3.5 flex items-center gap-3 text-left"
                    onClick={() => toggleOpen(order.id)}
                  >
                    {/* Badge statut */}
                    <StatusBadge status={order.status} />

                    {/* Infos principales */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-xs font-black font-mono text-[var(--text-dark)]">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)]">
                          {new Date(order.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </span>
                        <span className="text-[11px] text-[var(--text-body)] hidden sm:inline truncate">
                          · {order.order_items?.length ?? 0} article{(order.order_items?.length ?? 0) > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    {/* Total */}
                    <span className="text-sm font-black text-amber-500 shrink-0">
                      {Number(order.total).toLocaleString('fr-FR')} MAD
                    </span>

                    {/* Chevron */}
                    <ChevronDown
                      className="w-4 h-4 shrink-0 text-[var(--text-muted)] transition-transform duration-200"
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </button>

                  {/* ── Contenu dépliable ── */}
                  {isOpen && (
                    <div className="border-t border-[var(--border)]">

                      {/* Bandeau info pending */}
                      {order.status === 'pending' && (
                        <div className="px-4 py-2 flex items-center justify-between gap-3 bg-amber-500/5 border-b border-[var(--border)]">
                          <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
                            <Clock className="w-3 h-3 text-amber-500 shrink-0" />
                            En attente de confirmation — vous pouvez encore annuler.
                          </div>

                          {/* Bouton Annuler */}
                          {confirmId === order.id ? (
                            <div className="flex items-center gap-1.5 shrink-0">
                              <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                              <span className="text-xs text-[var(--text-dark)]">Confirmer ?</span>
                              <button
                                onClick={() => handleCancel(order.id)}
                                disabled={cancelling === order.id}
                                className="px-2 py-0.5 rounded-lg text-xs font-black bg-red-500 hover:bg-red-600 text-white transition disabled:opacity-50"
                              >
                                {cancelling === order.id ? '...' : 'Oui'}
                              </button>
                              <button
                                onClick={() => setConfirmId(null)}
                                className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-[var(--bg-page)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-dark)] transition"
                              >
                                Non
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmId(order.id)}
                              className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30"
                            >
                              <XCircle className="w-3 h-3" />
                              Annuler
                            </button>
                          )}
                        </div>
                      )}

                      {/* Articles — grille compacte */}
                      <div className="divide-y divide-[var(--border)]">
                        {order.order_items?.map((item) => (
                          <div key={item.id} className="px-4 py-3 flex items-center gap-3">
                            {/* Image miniature */}
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-[var(--bg-page)] border border-[var(--border)]">
                              <Image
                                src={item.products?.image_url || DEFAULT_IMAGE}
                                alt={item.products?.name || 'Produit'}
                                fill sizes="40px"
                                className="object-cover"
                              />
                            </div>
                            {/* Nom */}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold truncate text-[var(--text-dark)]">
                                {item.products?.name || 'Article TechNova'}
                              </p>
                              <p className="text-[11px] text-[var(--text-body)]">
                                {item.quantity} × {Number(item.unit_price).toLocaleString('fr-FR')} MAD
                              </p>
                            </div>
                            {/* Sous-total ligne */}
                            <span className="text-xs font-black shrink-0 text-amber-500">
                              {(item.quantity * item.unit_price).toLocaleString('fr-FR')} MAD
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Pied : total récap */}
                      <div className="px-4 py-2.5 flex items-center justify-between bg-[var(--bg-page)] border-t border-[var(--border)]">
                        <span className="text-xs text-[var(--text-muted)]">
                          {order.order_items?.length ?? 0} article{(order.order_items?.length ?? 0) > 1 ? 's' : ''} · {order.customer_name}
                        </span>
                        <span className="text-sm font-black text-[var(--text-dark)]">
                          Total : <span className="text-amber-500">{Number(order.total).toLocaleString('fr-FR')} MAD</span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
