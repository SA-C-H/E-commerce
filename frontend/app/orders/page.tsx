'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ShoppingBag, Package, ArrowLeft, Clock, CheckCircle, XCircle, Loader2,
  Eye, ChevronLeft, ChevronRight, Download, Truck, AlertCircle,
} from 'lucide-react';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=100&auto=format&fit=crop';

type OrderStatus = 'pending' | 'confirmed' | 'delivered' | 'cancelled';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  products?: { name: string; image_url?: string };
}

interface Order {
  id: string;
  user_id: string;
  customer_name: string;
  customer_phone: string;
  total: number;
  status: OrderStatus;
  created_at: string;
  order_items?: OrderItem[];
}

const STATUS_CONFIG = {
  pending:   { label: 'En cours',    bgColor: 'bg-amber-500/15',   textColor: 'text-amber-600 dark:text-amber-400',   icon: Clock },
  confirmed: { label: 'Livrée',      bgColor: 'bg-emerald-500/15', textColor: 'text-emerald-600 dark:text-emerald-400', icon: CheckCircle },
  delivered: { label: 'Livrée',      bgColor: 'bg-emerald-500/15', textColor: 'text-emerald-600 dark:text-emerald-400', icon: CheckCircle },
  cancelled: { label: 'Annulée',     bgColor: 'bg-red-500/15',     textColor: 'text-red-600 dark:text-red-400',       icon: XCircle },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${cfg.bgColor} ${cfg.textColor}`}>
      <Icon className="w-3.5 h-3.5" />
      {cfg.label}
    </span>
  );
}

export default function OrdersHistoryPage() {
  const { isAuthenticated, token: storeToken } = useAuthStore();
  const [orders, setOrders]         = useState<Order[]>([]);
  const [loading, setLoading]       = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

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

  /* ── Stats ── */
  const totalOrders    = orders.length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;
  const pendingCount   = orders.filter(o => o.status === 'pending').length;
  const cancelledCount = orders.filter(o => o.status === 'cancelled').length;

  /* ── Pagination ── */
  const totalPages = Math.ceil(orders.length / pageSize);
  const pagedOrders = orders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">

        {/* En-tête */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-amber-500 uppercase block mb-1">
              MON COMPTE
            </span>
            <h1 className="text-3xl font-black text-[var(--text-dark)]">
              Mes Commandes
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Suivez vos commandes et accédez à leur statut en un coup d'œil
            </p>
          </div>
          <Link href="/products"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold transition text-[var(--text-body)] hover:text-amber-500 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
            <ArrowLeft className="w-3.5 h-3.5" />
            Retour à la boutique
          </Link>
        </div>

        {/* Chargement */}
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto mb-3" />
            <p className="text-sm text-[var(--text-muted)]">Chargement de vos commandes...</p>
          </div>

        ) : orders.length === 0 ? (
          /* Aucune commande */
          <div className="py-20 text-center rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-[var(--bg-page)] border border-[var(--border)]">
              <Package className="w-7 h-7 text-[var(--text-muted)]" />
            </div>
            <h2 className="text-xl font-black mb-2 text-[var(--text-dark)]">Aucune commande</h2>
            <p className="text-sm mb-6 text-[var(--text-body)] max-w-md mx-auto">
              Vous n'avez pas encore passé de commande sur TechNova.
            </p>
            <Link href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-slate-950 transition">
              Découvrir nos produits
            </Link>
          </div>

        ) : (
          <>
            {/* ── KPI Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Total */}
              <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-amber-500" />
                  </div>
                  <span className="text-3xl font-black text-[var(--text-dark)]">{totalOrders}</span>
                </div>
                <p className="text-xs font-semibold text-[var(--text-muted)]">Commande(s)</p>
              </div>

              {/* Livrées */}
              <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                  <span className="text-3xl font-black text-[var(--text-dark)]">{deliveredCount}</span>
                </div>
                <p className="text-xs font-semibold text-[var(--text-muted)]">Livrée(s)</p>
              </div>

              {/* En cours */}
              <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="text-3xl font-black text-[var(--text-dark)]">{pendingCount}</span>
                </div>
                <p className="text-xs font-semibold text-[var(--text-muted)]">En cours</p>
              </div>

              {/* Annulées */}
              <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-red-500/20 to-red-500/5 border border-red-500/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-red-500" />
                  </div>
                  <span className="text-3xl font-black text-[var(--text-dark)]">{cancelledCount}</span>
                </div>
                <p className="text-xs font-semibold text-[var(--text-muted)]">Annulée(s)</p>
              </div>
            </div>

            {/* ── Tableau ── */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
                <h3 className="text-sm font-black text-[var(--text-dark)] flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-500" />
                  Historique de mes commandes
                </h3>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-amber-500 bg-[var(--bg-page)] border border-[var(--border)] rounded-lg transition">
                  <Download className="w-3.5 h-3.5" />
                  Toutes les commandes
                </button>
              </div>

              {/* Table Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-[var(--text-muted)] uppercase tracking-wider">
                      <th className="text-left p-4 pl-5 font-bold">N° Commande</th>
                      <th className="text-left p-4 font-bold">Date</th>
                      <th className="text-left p-4 font-bold">Produits</th>
                      <th className="text-left p-4 font-bold">Total</th>
                      <th className="text-left p-4 font-bold">Statut</th>
                      <th className="text-center p-4 pr-5 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {pagedOrders.map(order => (
                      <tr key={order.id} className="hover:bg-[var(--bg-page)] transition">
                        <td className="p-4 pl-5">
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 rounded-lg bg-[var(--bg-page)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-dark)] transition">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                            <span className="font-mono font-bold text-[var(--text-dark)]">
                              #{order.id.slice(0, 8).toUpperCase()}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 text-[var(--text-body)]">
                            <svg className="w-3.5 h-3.5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(order.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {order.order_items?.slice(0, 3).map((item, i) => (
                              <div key={i} className="relative w-8 h-8 rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--bg-page)]">
                                <Image src={item.products?.image_url || DEFAULT_IMAGE} alt="" fill sizes="32px" className="object-cover" />
                              </div>
                            ))}
                            {(order.order_items?.length ?? 0) > 3 && (
                              <span className="text-[11px] text-[var(--text-muted)] font-semibold">
                                +{(order.order_items?.length ?? 0) - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-black text-amber-500 font-mono">
                          {Number(order.total).toLocaleString('fr-FR')} MAD
                        </td>
                        <td className="p-4">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="p-4 pr-5">
                          <div className="flex items-center justify-center gap-1.5">
                            <button className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 transition" title="Voir détails">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            {order.status === 'pending' && (
                              <button
                                onClick={() => handleCancel(order.id)}
                                disabled={cancelling === order.id}
                                className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition disabled:opacity-50"
                                title="Annuler">
                                {cancelling === order.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Cards Mobile */}
              <div className="md:hidden divide-y divide-[var(--border)]">
                {pagedOrders.map(order => (
                  <div key={order.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-[var(--text-dark)]">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="flex items-center gap-2">
                      {order.order_items?.slice(0, 4).map((item, i) => (
                        <div key={i} className="relative w-10 h-10 rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--bg-page)]">
                          <Image src={item.products?.image_url || DEFAULT_IMAGE} alt="" fill sizes="40px" className="object-cover" />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                      <span className="text-xs text-[var(--text-muted)]">
                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </span>
                      <span className="text-sm font-black text-amber-500">
                        {Number(order.total).toLocaleString('fr-FR')} MAD
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 rounded-lg bg-amber-500/10 text-amber-500 text-xs font-semibold transition hover:bg-amber-500/20">
                        Voir détails
                      </button>
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleCancel(order.id)}
                          disabled={cancelling === order.id}
                          className="flex-1 py-2 rounded-lg bg-red-500/10 text-red-500 text-xs font-semibold transition hover:bg-red-500/20 disabled:opacity-50">
                          {cancelling === order.id ? 'Annulation...' : 'Annuler'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-5 py-3.5 border-t border-[var(--border)] flex items-center justify-between">
                  <span className="text-[11px] text-[var(--text-muted)]">
                    Affichage de {(currentPage - 1) * pageSize + 1} à {Math.min(currentPage * pageSize, orders.length)} sur {orders.length} commande(s)
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-page)] text-[var(--text-muted)] hover:text-[var(--text-dark)] disabled:opacity-30 transition">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          p === currentPage
                            ? 'bg-amber-500 text-slate-950'
                            : 'border border-[var(--border)] bg-[var(--bg-page)] text-[var(--text-muted)] hover:text-[var(--text-dark)]'
                        }`}>
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-page)] text-[var(--text-muted)] hover:text-[var(--text-dark)] disabled:opacity-30 transition">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
