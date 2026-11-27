'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Package, Clock, CheckCircle2, XCircle, Truck, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';

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

const STATUS_CFG = {
  pending:   { label: 'En attente', color: '#F59E0B', bg: 'rgba(245,158,11,0.15)',  Icon: Clock        },
  confirmed: { label: 'Confirmée',  color: '#3B82F6', bg: 'rgba(59,130,246,0.15)', Icon: CheckCircle2 },
  delivered: { label: 'Livrée',     color: '#10B981', bg: 'rgba(16,185,129,0.15)', Icon: Truck        },
  cancelled: { label: 'Annulée',    color: '#EF4444', bg: 'rgba(239,68,68,0.15)',  Icon: XCircle      },
};

interface OrdersDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function OrdersDrawer({ open, onClose }: OrdersDrawerProps) {
  const { isAuthenticated, token: storeToken } = useAuthStore();
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  /* Charger les commandes à l'ouverture */
  useEffect(() => {
    if (!open || !isAuthenticated) return;

    if (storeToken && typeof window !== 'undefined') {
      if (!localStorage.getItem('token')) localStorage.setItem('token', storeToken);
    }

    setLoading(true);
    api.get<Order[]>('/orders')
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((err) => toast.error(err instanceof ApiError ? err.message : 'Erreur de chargement'))
      .finally(() => setLoading(false));
  }, [open, isAuthenticated, storeToken]);

  /* Escape */
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[300] transition-all duration-300"
        style={{
          backgroundColor: open ? 'rgba(0,0,0,0.6)' : 'transparent',
          backdropFilter: open ? 'blur(2px)' : 'none',
          pointerEvents: open ? 'auto' : 'none',
        }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 h-full z-[301] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out"
        style={{
          width: 'min(440px, 96vw)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          backgroundColor: '#0F1A2E',
          borderLeft: '1px solid #1E293B',
        }}
      >
        {/* En-tête */}
        <div
          className="flex items-center gap-3 px-5 py-4 shrink-0"
          style={{ borderBottom: '1px solid #1E293B' }}
        >
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full transition hover:bg-white/10"
            style={{ color: '#94A3B8' }}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <p className="font-black text-base" style={{ color: '#F8FAFC' }}>
              Mes commandes
            </p>
            {!loading && (
              <p className="text-xs" style={{ color: '#64748B' }}>
                {orders.length} commande{orders.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full transition hover:bg-white/10"
            style={{ color: '#94A3B8' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Corps */}
        <div className="flex-1 overflow-y-auto">

          {/* Chargement */}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm" style={{ color: '#94A3B8' }}>Chargement...</p>
            </div>

          /* Aucune commande */
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#1E293B' }}
              >
                <Package className="w-7 h-7" style={{ color: '#475569' }} />
              </div>
              <p className="font-black text-base" style={{ color: '#F8FAFC' }}>
                Aucune commande
              </p>
              <p className="text-sm" style={{ color: '#64748B' }}>
                Vous n&apos;avez pas encore passé de commande.
              </p>
            </div>

          /* Liste */
          ) : (
            <div className="p-4 space-y-3">
              {orders.map((order) => {
                const cfg = STATUS_CFG[order.status];
                const Icon = cfg.Icon;
                return (
                  <div
                    key={order.id}
                    className="rounded-2xl overflow-hidden"
                    style={{ backgroundColor: '#0A1628', border: '1px solid #1E293B' }}
                  >
                    {/* En-tête commande */}
                    <div
                      className="px-4 py-3 flex items-center justify-between gap-2"
                      style={{ borderBottom: '1px solid #1E293B' }}
                    >
                      <div>
                        <p className="text-xs font-black" style={{ color: '#F8FAFC' }}>
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-[11px] mt-0.5" style={{ color: '#64748B' }}>
                          {new Date(order.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Badge statut */}
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold"
                          style={{ color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.color}40` }}
                        >
                          <Icon className="w-3 h-3" />
                          {cfg.label}
                        </span>
                        {/* Total */}
                        <span className="text-sm font-black" style={{ color: '#F59E0B' }}>
                          {Number(order.total).toLocaleString('fr-FR')} MAD
                        </span>
                      </div>
                    </div>

                    {/* Articles */}
                    <div className="divide-y" style={{ borderColor: '#1E293B' }}>
                      {order.order_items?.slice(0, 3).map((item) => (
                        <div key={item.id} className="px-4 py-3 flex items-center gap-3">
                          <div
                            className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0"
                            style={{ backgroundColor: '#1E293B' }}
                          >
                            <Image
                              src={item.products?.image_url || DEFAULT_IMAGE}
                              alt={item.products?.name || 'Produit'}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate" style={{ color: '#F1F5F9' }}>
                              {item.products?.name || 'Article TechNova'}
                            </p>
                            <p className="text-[11px] mt-0.5" style={{ color: '#64748B' }}>
                              {item.quantity} × {Number(item.unit_price).toLocaleString('fr-FR')} MAD
                            </p>
                          </div>
                          <span className="text-xs font-black shrink-0" style={{ color: '#F59E0B' }}>
                            {(item.quantity * item.unit_price).toLocaleString('fr-FR')} MAD
                          </span>
                        </div>
                      ))}
                      {/* Si plus de 3 articles */}
                      {order.order_items?.length > 3 && (
                        <div className="px-4 py-2 text-center text-[11px]" style={{ color: '#64748B' }}>
                          +{order.order_items.length - 3} autre{order.order_items.length - 3 > 1 ? 's' : ''} article{order.order_items.length - 3 > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
