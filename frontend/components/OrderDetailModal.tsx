'use client';

import { X, Package, Calendar, Phone, User, MapPin } from 'lucide-react';
import Image from 'next/image';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=100&auto=format&fit=crop';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  products?: { name: string; image_url?: string };
}

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  total: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  created_at: string;
  order_items?: OrderItem[];
}

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
}

const STATUS_CONFIG = {
  pending:   { label: 'En cours',    bgColor: 'bg-amber-500/15',   textColor: 'text-amber-600 dark:text-amber-400' },
  confirmed: { label: 'Confirmée',   bgColor: 'bg-blue-500/15',    textColor: 'text-blue-600 dark:text-blue-400' },
  delivered: { label: 'Livrée',      bgColor: 'bg-emerald-500/15', textColor: 'text-emerald-600 dark:text-emerald-400' },
  cancelled: { label: 'Annulée',     bgColor: 'bg-red-500/15',     textColor: 'text-red-600 dark:text-red-400' },
};

export default function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  if (!order) return null;

  const cfg = STATUS_CONFIG[order.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="relative bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 px-5 py-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-page)]">
          <div>
            <h2 className="text-lg font-black text-[var(--text-dark)]">
              Détails de la commande
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5 font-mono">
              #{order.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-dark)] hover:bg-[var(--bg-card)] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Client */}
          <div className="bg-[var(--bg-page)] border border-[var(--border)] rounded-xl p-4">
            <p className="text-[10px] font-bold tracking-widest text-amber-500 uppercase mb-3">
              Informations client
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                <span className="font-semibold text-[var(--text-dark)]">{order.customer_name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                <span className="text-[var(--text-body)] font-mono">{order.customer_phone || 'Non renseigné'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                <span className="text-[var(--text-body)]">
                  {new Date(order.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Statut */}
          <div className="flex items-center justify-between p-4 bg-[var(--bg-page)] border border-[var(--border)] rounded-xl">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Statut de la commande</span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${cfg.bgColor} ${cfg.textColor}`}>
              {cfg.label}
            </span>
          </div>

          {/* Articles */}
          <div>
            <p className="text-[10px] font-bold tracking-widest text-amber-500 uppercase mb-3">
              Articles commandés ({order.order_items?.length ?? 0})
            </p>
            <div className="space-y-2">
              {order.order_items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-[var(--bg-page)] border border-[var(--border)] rounded-xl hover:bg-[var(--bg-card-hover)] transition"
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-[var(--bg-card)] border border-[var(--border)]">
                    <Image
                      src={item.products?.image_url || DEFAULT_IMAGE}
                      alt={item.products?.name || 'Produit'}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[var(--text-dark)] truncate">
                      {item.products?.name || 'Article TechNova'}
                    </p>
                    <p className="text-[11px] text-[var(--text-body)] mt-0.5">
                      {item.quantity} × {Number(item.unit_price).toLocaleString('fr-FR')} MAD
                    </p>
                  </div>
                  <span className="text-sm font-black text-amber-500 shrink-0">
                    {(item.quantity * item.unit_price).toLocaleString('fr-FR')} MAD
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-500/15 to-amber-500/5 border border-amber-500/30">
            <span className="text-sm font-bold text-[var(--text-dark)] uppercase tracking-wider">
              Total
            </span>
            <span className="text-2xl font-black text-amber-500">
              {Number(order.total).toLocaleString('fr-FR')} MAD
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-5 py-4 border-t border-[var(--border)] bg-[var(--bg-page)] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-dark)] hover:bg-[var(--bg-card-hover)] transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
