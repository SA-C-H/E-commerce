'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';
import {
  LayoutDashboard, Package, Layers, ShoppingBag, Users, Settings,
  Plus, Trash2, Edit2, TrendingUp, ShieldAlert, Search, MessageCircle,
  AlertTriangle, X, RefreshCw, LogOut, Store, DollarSign, Minus,
  ArrowUpRight, Menu, ChevronRight, CheckCircle2, Clock, Truck, XCircle,
  Eye, Phone, Calendar, Filter, ShieldCheck,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type AdminTab = 'dashboard' | 'products' | 'orders' | 'categories' | 'users' | 'settings';

/* ─── Helpers visuels ─── */
const STATUS_CFG = {
  pending:   { label: 'En attente', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30',   icon: Clock },
  confirmed: { label: 'Confirmée',  color: 'bg-blue-500/15 text-blue-400 border-blue-500/30',      icon: CheckCircle2 },
  delivered: { label: 'Livrée',     color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', icon: Truck },
  cancelled: { label: 'Annulée',    color: 'bg-red-500/15 text-red-400 border-red-500/30',         icon: XCircle },
} as const;

function StatusBadge({ status }: { status: keyof typeof STATUS_CFG }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0)  return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/15 text-red-400 border border-red-500/30">Rupture</span>;
  if (stock <= 5)   return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">{stock} restants</span>;
  return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">{stock} en stock</span>;
}

/* ─── Transitions de statut autorisées (miroir exact du backend) ─── */
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  pending:   ['confirmed', 'cancelled'],
  confirmed: ['delivered', 'cancelled'],
  delivered: [],   // statut terminal
  cancelled: [],   // statut terminal
};

/* ─── Ouverture d'une conversation WhatsApp avec un client ─── */
function openWhatsApp(phone: string, orderId: string, name: string) {
  if (!phone) { toast.error('Aucun numéro de téléphone pour ce client'); return; }
  const digits = phone.replace(/[^0-9]/g, '');
  const intl   = digits.startsWith('0') ? `212${digits.slice(1)}` : digits;
  const msg    = encodeURIComponent(`Bonjour ${name}, votre commande #${orderId.slice(0,8)} TechNova. Confirmez votre adresse svp. Merci !`);
  window.open(`https://wa.me/${intl}?text=${msg}`, '_blank');
}

/* ─── Squelette de chargement pour les tableaux ─── */
function SkeletonRows({ cols, rows = 6 }: { cols: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="animate-pulse">
          {Array.from({ length: cols }).map((_, c) => (
            <td key={c} className="p-4 pl-5">
              <div className="h-3.5 rounded-md bg-white/[0.06]" style={{ width: c === 0 ? '72%' : '42%' }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/* ─── Boîte de dialogue de confirmation (remplace window.confirm) ─── */
function ConfirmDialog({
  open, title, message, confirmLabel = 'Confirmer', tone = 'danger', onConfirm, onCancel,
}: {
  open: boolean; title: string; message?: string; confirmLabel?: string;
  tone?: 'danger' | 'default'; onConfirm: () => void; onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onCancel} role="dialog" aria-modal="true">
      <div className="w-full max-w-sm bg-[#0D0D20] border border-white/10 rounded-3xl shadow-2xl p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${tone === 'danger' ? 'bg-red-500/10 border-red-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
            <AlertTriangle className={`w-5 h-5 ${tone === 'danger' ? 'text-red-400' : 'text-amber-400'}`} />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-white">{title}</h3>
            {message && <p className="text-xs text-slate-400 mt-1 leading-relaxed">{message}</p>}
          </div>
        </div>
        <div className="flex gap-3 pt-1">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition">
            Annuler
          </button>
          <button onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition ${tone === 'danger' ? 'bg-red-500 hover:bg-red-400 text-white' : 'bg-amber-500 hover:bg-amber-400 text-[#060614]'}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Panneau latéral : détail complet d'une commande ─── */
function OrderDetailPanel({
  order, onClose, onStatusChange,
}: {
  order: any; onClose: () => void; onStatusChange: (id: string, status: string) => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const items   = order.order_items || [];
  const allowed = ALLOWED_TRANSITIONS[order.status] || [];
  const steps   = ['pending', 'confirmed', 'delivered'] as const;
  const currentStep = steps.indexOf(order.status as any);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true">
      <div className="w-full max-w-md h-full bg-[#0D0D20] border-l border-white/10 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}>

        {/* En-tête */}
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between shrink-0">
          <div>
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Commande</p>
            <h3 className="font-bold text-white font-mono">#{order.id.slice(0, 8)}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hidden p-5 space-y-5">

          {/* Client */}
          <div className="bg-[#060614] border border-white/5 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-500 text-[#060614] font-black text-sm flex items-center justify-center shrink-0">
                {order.customer_name?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{order.customer_name}</p>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(order.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                {order.customer_phone || 'Aucun numéro'}
              </span>
              <button onClick={() => openWhatsApp(order.customer_phone, order.id, order.customer_name)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-[11px] font-semibold border border-emerald-500/30 transition">
                <MessageCircle className="w-3.5 h-3.5" />Contacter
              </button>
            </div>
          </div>

          {/* Chronologie du statut */}
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Progression</p>
            <div className="flex items-center">
              {steps.map((s, i) => {
                const cfg = STATUS_CFG[s];
                const done = order.status !== 'cancelled' && i <= currentStep;
                return (
                  <div key={s} className="flex items-center flex-1 last:flex-none">
                    <div className={`flex items-center justify-center w-7 h-7 rounded-full border shrink-0 ${
                      done ? 'bg-amber-500 border-amber-500 text-[#060614]' : 'border-white/15 text-slate-600'
                    }`}>
                      <cfg.icon className="w-3.5 h-3.5" />
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`h-0.5 flex-1 mx-1 ${done && i < currentStep ? 'bg-amber-500' : 'bg-white/10'}`} />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-2">
              <StatusBadge status={order.status} />
            </div>
          </div>

          {/* Articles */}
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
              Articles ({items.length})
            </p>
            <div className="space-y-2">
              {items.map((it: any) => (
                <div key={it.id} className="flex items-center gap-3 bg-[#060614] border border-white/5 rounded-2xl p-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white/5 shrink-0 border border-white/5">
                    {it.products?.image_url
                      ? <Image src={it.products.image_url} alt={it.products?.name || ''} fill className="object-cover" sizes="48px" />
                      : <div className="w-full h-full flex items-center justify-center"><Package className="w-4 h-4 text-slate-600" /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{it.products?.name || 'Article supprimé'}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {it.quantity} × {Number(it.unit_price).toLocaleString('fr-FR')} MAD
                    </p>
                  </div>
                  <span className="text-xs font-bold text-white font-mono shrink-0">
                    {(it.quantity * Number(it.unit_price)).toLocaleString('fr-FR')} MAD
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 rounded-2xl px-4 py-3.5">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Total</span>
            <span className="text-lg font-black text-white font-mono">
              {Number(order.total).toLocaleString('fr-FR')} MAD
            </span>
          </div>
        </div>

        {/* Pied : changement de statut */}
        <div className="p-5 border-t border-white/5 shrink-0 space-y-2">
          {allowed.length === 0 ? (
            <p className="text-center text-[11px] text-slate-500 py-1">
              {order.status === 'delivered' ? 'Commande livrée — statut final.' : 'Commande annulée — statut final.'}
            </p>
          ) : (
            <>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Faire évoluer</p>
              <div className="flex gap-2">
                {allowed.map((s) => {
                  const cfg = STATUS_CFG[s as keyof typeof STATUS_CFG];
                  return (
                    <button key={s} onClick={() => onStatusChange(order.id, s)}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border transition ${cfg.color} hover:brightness-125`}>
                      <cfg.icon className="w-3.5 h-3.5" />{cfg.label}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  const [products,   setProducts]   = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders,     setOrders]     = useState<any[]>([]);
  const [usersList,  setUsersList]  = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);

  /* Filtres catalogue */
  const [searchQuery,  setSearchQuery]  = useState('');
  const [catFilter,    setCatFilter]    = useState('ALL');
  const [stockFilter,  setStockFilter]  = useState<'ALL'|'LOW'|'OUT'>('ALL');
  const [currentPage,  setCurrentPage]  = useState(1);
  const [pageSize,     setPageSize]     = useState(10);
  const [orderPage,    setOrderPage]    = useState(1);
  const ORDER_PAGE_SIZE = 10;

  /* Filtres commandes */
  const [orderSearch,       setOrderSearch]       = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'ALL'|'pending'|'confirmed'|'delivered'|'cancelled'>('ALL');

  /* Panneau détail + boîte de confirmation */
  const [detailOrder,  setDetailOrder]  = useState<any|null>(null);
  const [confirmState, setConfirmState] = useState<{
    title: string; message?: string; confirmLabel?: string;
    tone?: 'danger'|'default'; onConfirm: () => void;
  } | null>(null);

  /* Modales produit */
  const [productModal, setProductModal]   = useState(false);
  const [editProduct,  setEditProduct]    = useState<any|null>(null);
  const [productForm,  setProductForm]    = useState({ name:'', description:'', price:'', stock:'15', image_url:'', category_id:'' });

  /* Modales catégorie */
  const [catModal,     setCatModal]       = useState(false);
  const [editCat,      setEditCat]        = useState<any|null>(null);
  const [catName,      setCatName]        = useState('');

  /* ── Chargement ── */
  const loadData = async () => {
    try {
      setLoading(true);
      const noStore: RequestInit = { cache: 'no-store' };
      const [prodRes, catRes, ordRes] = await Promise.all([
        api.get<any>('/products?limit=500', noStore),
        api.get<any[]>('/categories', noStore),
        api.get<any[]>('/orders', noStore),
      ]);
      setProducts(prodRes?.products || []);
      setCategories(catRes || []);
      setOrders(ordRes || []);
      try { setUsersList(await api.get<any[]>('/auth/users', noStore) || []); }
      catch { setUsersList([]); }
    } catch (err: unknown) {
      toast.error(err instanceof ApiError ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { setMounted(true); if (isAdmin) loadData(); }, [isAdmin]);
  useEffect(() => { setCurrentPage(1); }, [searchQuery, catFilter, stockFilter]);
  useEffect(() => { setOrderPage(1); }, [orderSearch, orderStatusFilter]);

  /* ── Métriques ── */
  const totalRevenue   = orders.filter(o => o.status === 'confirmed' || o.status === 'delivered').reduce((s,o) => s + Number(o.total||0), 0);
  const pendingOrders  = orders.filter(o => o.status === 'pending').length;
  const deliveredOrders= orders.filter(o => o.status === 'delivered').length;
  const lowStock       = products.filter(p => Number(p.stock) <= 5);

  /* ── Filtres produits ── */
  const filteredProducts = useMemo(() => products.filter(p => {
    const q = searchQuery.toLowerCase();
    const matchName = p.name.toLowerCase().includes(q) || (p.description||'').toLowerCase().includes(q);
    const matchCat  = catFilter === 'ALL' || p.category_id === catFilter;
    const stock = Number(p.stock);
    const matchStock = stockFilter === 'ALL' || (stockFilter === 'LOW' && stock > 0 && stock <= 5) || (stockFilter === 'OUT' && stock === 0);
    return matchName && matchCat && matchStock;
  }), [products, searchQuery, catFilter, stockFilter]);

  const totalPages    = Math.ceil(filteredProducts.length / pageSize) || 1;
  const pagedProducts = useMemo(() => filteredProducts.slice((currentPage-1)*pageSize, currentPage*pageSize), [filteredProducts, currentPage, pageSize]);

  /* ── Filtres commandes (recherche + statut) ── */
  const filteredOrders = useMemo(() => orders.filter(o => {
    const q = orderSearch.toLowerCase();
    const matchQ = !q
      || (o.customer_name || '').toLowerCase().includes(q)
      || (o.id || '').toLowerCase().includes(q)
      || (o.customer_phone || '').includes(q);
    const matchStatus = orderStatusFilter === 'ALL' || o.status === orderStatusFilter;
    return matchQ && matchStatus;
  }), [orders, orderSearch, orderStatusFilter]);
  const totalOrdPages = Math.ceil(filteredOrders.length / ORDER_PAGE_SIZE) || 1;
  const pagedOrders   = useMemo(() => filteredOrders.slice((orderPage-1)*ORDER_PAGE_SIZE, orderPage*ORDER_PAGE_SIZE), [filteredOrders, orderPage]);

  /* ── CRUD Produits ── */
  const openCreate = () => { setEditProduct(null); setProductForm({ name:'', description:'', price:'', stock:'15', image_url:'', category_id: categories[0]?.id||'' }); setProductModal(true); };
  const openEdit   = (p: any) => { setEditProduct(p); setProductForm({ name:p.name, description:p.description||'', price:String(p.price), stock:String(p.stock), image_url:p.image_url||'', category_id:p.category_id||'' }); setProductModal(true); };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { name: productForm.name.trim(), description: productForm.description.trim(), price: Number(productForm.price), stock: Number(productForm.stock), image_url: productForm.image_url.trim()||null, category_id: productForm.category_id||null };
    try {
      if (editProduct) { await api.put(`/products/${editProduct.id}`, payload); toast.success(`"${payload.name}" mis à jour`); }
      else             { await api.post('/products', payload); toast.success(`"${payload.name}" ajouté`); }
      setProductModal(false); loadData();
    } catch (err: any) { toast.error(err.message || 'Erreur'); }
  };

  const handleDelete = (id: string, name: string) => {
    setConfirmState({
      title: `Supprimer « ${name} » ?`,
      message: 'Ce produit sera définitivement retiré du catalogue.',
      confirmLabel: 'Supprimer',
      onConfirm: async () => {
        setConfirmState(null);
        try { await api.delete(`/products/${id}`); toast.success('Produit supprimé'); loadData(); }
        catch (err: any) { toast.error(err.message || 'Erreur'); }
      },
    });
  };

  const handleQuickStock = async (prod: any, delta: number) => {
    try {
      const updated = await api.patch<{ stock: number }>(`/products/${prod.id}/stock`, { delta });
      toast.success(`Stock : ${updated.stock} unités`);
      setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, stock: updated.stock } : p));
    } catch { toast.error('Erreur stock'); }
  };

  /* ── CRUD Catégories ── */
  const handleSaveCat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    try {
      if (editCat) { await api.put(`/categories/${editCat.id}`, { name: catName.trim() }); toast.success('Renommée'); }
      else         { await api.post('/categories', { name: catName.trim() }); toast.success('Créée'); }
      setCatModal(false); setCatName(''); loadData();
    } catch (err: any) { toast.error(err.message || 'Erreur'); }
  };

  const handleDeleteCat = async (id: string, name: string) => {
    if (!confirm(`Supprimer "${name}" ?`)) return;
    try { await api.delete(`/categories/${id}`); toast.success('Supprimée'); loadData(); }
    catch (err: any) { toast.error(err.message || 'Erreur'); }
  };

  /* ── Commandes ── */
  const handleOrderStatus = async (id: string, status: string) => {
    try { await api.patch(`/orders/${id}/status`, { status }); toast.success('Statut mis à jour'); loadData(); }
    catch (err: any) { toast.error(err.message || 'Erreur'); }
  };

  const openWhatsApp = (phone: string, orderId: string, name: string) => {
    if (!phone) { toast.error('Pas de numéro'); return; }
    const digits = phone.replace(/[^0-9]/g, '');
    const intl   = digits.startsWith('0') ? `212${digits.slice(1)}` : digits;
    const msg    = encodeURIComponent(`Bonjour ${name}, votre commande #${orderId.slice(0,8)} TechNova. Confirmez votre adresse svp. Merci !`);
    window.open(`https://wa.me/${intl}?text=${msg}`, '_blank');
  };

  /* ── Utilisateurs ── */
  const handleToggleRole = async (u: any) => {
    const next = u.role === 'admin' ? 'client' : 'admin';
    if (!confirm(`Changer "${u.name}" → ${next.toUpperCase()} ?`)) return;
    try { await api.patch(`/auth/users/${u.id}/role`, { role: next }); toast.success('Rôle mis à jour'); loadData(); }
    catch (err: any) { toast.error(err.message || 'Erreur'); }
  };

  if (!mounted) return null;

  /* ── Accès refusé ── */
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#060614] flex items-center justify-center p-4">
        <div className="text-center max-w-sm space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8 text-amber-400" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-amber-500 uppercase tracking-widest mb-2">Accès réservé</p>
            <h1 className="text-2xl font-black text-white">Console Admin</h1>
            <p className="text-sm text-slate-400 mt-2">Connectez-vous avec un compte administrateur.</p>
          </div>
          <button onClick={() => router.push('/login?redirect=/admin')}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#060614] text-sm font-bold transition">
            Se connecter
          </button>
          <Link href="/" className="block text-xs text-slate-500 hover:text-slate-300 transition">← Retour boutique</Link>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════════
     LAYOUT PRINCIPAL
  ══════════════════════════════════════════════════════════════ */

  /* ── sections sidebar ── */
  const NAV_SECTIONS = [
    {
      title: 'GÉNÉRAL',
      items: [
        { tab: 'dashboard'  as AdminTab, label: "Vue d'ensemble", icon: LayoutDashboard },
        { tab: 'products'   as AdminTab, label: 'Catalogue',       icon: Package,    badge: products.length },
        { tab: 'orders'     as AdminTab, label: 'Commandes',       icon: ShoppingBag, badge: pendingOrders || undefined },
        { tab: 'categories' as AdminTab, label: 'Catégories',      icon: Layers,     badge: categories.length },
        { tab: 'users'      as AdminTab, label: 'Utilisateurs',    icon: Users,      badge: usersList.length },
      ],
    },
    {
      title: 'SYSTÈME',
      items: [
        { tab: 'settings' as AdminTab, label: 'Paramètres', icon: Settings },
      ],
    },
  ];

  /* helpers breadcrumb */
  const BC_LABELS: Record<AdminTab, string> = {
    dashboard: "Vue d'ensemble", products: 'Catalogue', orders: 'Commandes',
    categories: 'Catégories', users: 'Utilisateurs', settings: 'Paramètres',
  };

  function SidebarNav({ onSelect }: { onSelect?: () => void }) {
    return (
      <nav className="flex-1 overflow-y-auto scrollbar-hidden p-3 space-y-5">
        {NAV_SECTIONS.map(section => (
          <div key={section.title}>
            <p className="px-3 mb-1 text-[10px] font-black text-slate-600 uppercase tracking-widest">{section.title}</p>
            <div className="space-y-0.5">
              {section.items.map(({ tab, label, icon: Icon, badge }) => (
                <button key={tab} onClick={() => { setActiveTab(tab); onSelect?.(); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    activeTab === tab
                      ? 'bg-amber-500 text-[#060614]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}>
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{label}</span>
                  </div>
                  {badge !== undefined && badge > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                      activeTab === tab ? 'bg-[#060614]/20 text-[#060614]'
                      : tab === 'orders' && pendingOrders > 0 ? 'bg-red-500/20 text-red-400'
                      : 'bg-white/10 text-slate-400'
                    }`}>{badge}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
    );
  }

  return (
    <div className="flex h-screen bg-[#060614] text-white overflow-hidden">

      {/* ══════════ SIDEBAR DESKTOP ══════════ */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col bg-[#0A0A1A] border-r border-white/5 overflow-hidden">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center font-black text-[#060614] text-sm shadow">TN</div>
            <div>
              <p className="font-black text-sm text-white leading-none">TechNova<span className="text-amber-500">.ma</span></p>
              <p className="text-[10px] text-slate-500 mt-0.5">L&apos;Expert Tech</p>
            </div>
          </div>
        </div>

        <SidebarNav />

        {/* Pied sidebar */}
        <div className="p-3 border-t border-white/5 space-y-1">
          <Link href="/" target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition">
            <div className="flex items-center gap-2.5"><Store className="w-4 h-4 text-amber-500" /><span>Voir la boutique</span></div>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/5 mt-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-[#060614] font-black text-xs flex items-center justify-center shrink-0">
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Admin'}</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />Super Admin
                </p>
              </div>
            </div>
            <button onClick={logout} title="Déconnexion"
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ══════════ DRAWER MOBILE ══════════ */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 bg-[#0A0A1A] h-full border-r border-white/5 flex flex-col z-10">
            <div className="px-5 py-5 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center font-black text-[#060614] text-xs">TN</div>
                <p className="font-black text-sm text-white">TechNova<span className="text-amber-500">.ma</span></p>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-1 text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <SidebarNav onSelect={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* ══════════ ZONE PRINCIPALE ══════════ */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header avec barre de recherche centrée (style modèle) */}
        <header className="h-14 shrink-0 bg-[#0A0A1A] border-b border-white/5 px-4 flex items-center gap-3">
          {/* Burger mobile */}
          <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 shrink-0">
            <Menu className="w-4 h-4" />
          </button>

          {/* Barre de recherche centrée */}
          <div className="flex-1 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Rechercher un produit, une commande…"
                value={activeTab === 'products' ? searchQuery : activeTab === 'orders' ? orderSearch : ''}
                onChange={e => {
                  if (activeTab === 'products') setSearchQuery(e.target.value);
                  else if (activeTab === 'orders') setOrderSearch(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50 transition"
              />
            </div>
          </div>

          {/* Icônes droite */}
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={loadData} disabled={loading} title="Rafraîchir"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-500' : ''}`} />
            </button>
            <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 relative">
              <ShoppingBag className="w-4 h-4" />
              {pendingOrders > 0 && <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />}
            </button>
            <div className="w-8 h-8 rounded-full bg-amber-500 text-[#060614] font-black text-xs flex items-center justify-center ml-1">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        {/* Contenu scrollable */}
        <main className="flex-1 overflow-y-auto scrollbar-hidden p-4 sm:p-6 space-y-6">

          {/* ═══════ DASHBOARD ═══════ */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span className="text-amber-500 font-semibold">Console</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-white font-semibold">Vue d&apos;ensemble</span>
              </div>

              {/* 6 KPI cards — style modèle */}
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
                {[
                  { label: 'Chiffre d\'affaires', value: `${totalRevenue.toLocaleString('fr-FR')} MAD`, sub: `↑ Confirmées + livrées`, icon: DollarSign, iconBg: 'bg-amber-500/15 border-amber-500/30', iconColor: 'text-amber-400' },
                  { label: 'Commandes totales',   value: orders.length,     sub: `↑ ${orders.length} au total`, icon: ShoppingBag, iconBg: 'bg-blue-500/15 border-blue-500/30', iconColor: 'text-blue-400' },
                  { label: 'En attente',           value: pendingOrders,     sub: `À traiter maintenant`,  icon: Clock,       iconBg: 'bg-orange-500/15 border-orange-500/30', iconColor: 'text-orange-400' },
                  { label: 'Livrées',              value: deliveredOrders,   sub: `Commandes finalisées`,  icon: Truck,       iconBg: 'bg-emerald-500/15 border-emerald-500/30', iconColor: 'text-emerald-400' },
                  { label: 'Produits référencés',  value: products.length,   sub: `${categories.length} catégories`, icon: Package, iconBg: 'bg-purple-500/15 border-purple-500/30', iconColor: 'text-purple-400' },
                  { label: 'Alertes stock',        value: lowStock.length,   sub: `Produits ≤ 5 unités`,  icon: AlertTriangle, iconBg: lowStock.length > 0 ? 'bg-red-500/15 border-red-500/30' : 'bg-slate-500/15 border-slate-500/30', iconColor: lowStock.length > 0 ? 'text-red-400' : 'text-slate-500' },
                ].map(({ label, value, sub, icon: Icon, iconBg, iconColor }) => (
                  <div key={label} className="bg-[#0D0D20] border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider leading-tight">{label}</p>
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center border shrink-0 ${iconBg}`}>
                        <Icon className={`w-4 h-4 ${iconColor}`} />
                      </div>
                    </div>
                    <p className="text-xl font-black text-white">{value}</p>
                    <p className="text-[10px] text-slate-600 leading-tight">{sub}</p>
                  </div>
                ))}
              </div>

              {/* Dernières commandes + stock faible */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#0D0D20] border border-white/5 rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-amber-500" />Dernières commandes</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-[11px] text-amber-500 hover:underline font-semibold">Voir tout →</button>
                  </div>
                  {orders.length === 0
                    ? <p className="p-8 text-center text-sm text-slate-500">Aucune commande</p>
                    : <div className="divide-y divide-white/5">
                        {orders.slice(0, 5).map(o => (
                          <div key={o.id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate">{o.customer_name}</p>
                              <p className="text-[11px] text-slate-500 font-mono">#{o.id.slice(0,8)}</p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-xs font-bold text-white font-mono">{Number(o.total).toLocaleString('fr-FR')} MAD</span>
                              <StatusBadge status={o.status} />
                            </div>
                          </div>
                        ))}
                      </div>
                  }
                </div>

                <div className="bg-[#0D0D20] border border-white/5 rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-400" />Alertes réapprovisionnement</h3>
                    <button onClick={() => { setStockFilter('LOW'); setActiveTab('products'); }} className="text-[11px] text-amber-500 hover:underline font-semibold">Filtrer →</button>
                  </div>
                  {lowStock.length === 0
                    ? <p className="p-8 text-center text-sm text-emerald-400">✅ Tous les stocks sont optimaux</p>
                    : <div className="divide-y divide-white/5">
                        {lowStock.slice(0, 5).map(p => (
                          <div key={p.id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                            <p className="text-xs font-bold text-white truncate flex-1">{p.name}</p>
                            <div className="flex items-center gap-2 shrink-0">
                              <StockBadge stock={Number(p.stock)} />
                              <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition"><Edit2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                  }
                </div>
              </div>
            </div>
          )}

          {/* ═══════ PRODUITS ═══════ */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              {/* En-tête section style modèle : titre + breadcrumb + bouton */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1">
                    <span className="text-amber-500 font-semibold">Console</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-white font-semibold">Catalogue</span>
                    <ChevronRight className="w-3 h-3" />
                    <span>Liste des produits</span>
                  </div>
                  <h2 className="text-lg font-black text-white">Liste des produits</h2>
                </div>
                <button onClick={openCreate}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#060614] text-xs font-black transition shadow-lg shadow-amber-500/20">
                  <Plus className="w-4 h-4" /> Ajouter un produit +
                </button>
              </div>

              {/* Barre filtres compacte */}
              <div className="bg-[#0D0D20] border border-white/5 rounded-2xl px-4 py-3 flex flex-wrap gap-3 items-center">
                <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#060614] border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500">
                  <option value="ALL">Toutes catégories</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select value={stockFilter} onChange={e => setStockFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-[#060614] border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500">
                  <option value="ALL">Tous les stocks</option>
                  <option value="LOW">Stock faible (≤5)</option>
                  <option value="OUT">Rupture (0)</option>
                </select>
                <span className="text-[11px] text-slate-500 ml-auto">{filteredProducts.length} produit(s)</span>
              </div>

              {/* Tableau style modèle — avec checkbox + image + catégorie + prix + stock badge + actions */}
              <div className="bg-[#0D0D20] border border-white/5 rounded-2xl overflow-hidden">
                {/* Sous-titre table + compteur */}
                <div className="px-5 py-3.5 border-b border-white/5 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Tous les produits</h3>
                  <span className="text-[11px] text-slate-500">{filteredProducts.length} résultats</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-white/5 text-slate-500 uppercase tracking-wider">
                        <th className="p-4 pl-5 w-8"><input type="checkbox" className="rounded accent-amber-500" /></th>
                        <th className="text-left p-4 font-bold">Produit</th>
                        <th className="text-left p-4 font-bold">Catégorie</th>
                        <th className="text-left p-4 font-bold">Prix</th>
                        <th className="text-left p-4 font-bold">Stock</th>
                        <th className="text-left p-4 font-bold">Disponibilité</th>
                        <th className="text-right p-4 pr-5 font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {pagedProducts.length === 0
                        ? <tr><td colSpan={7} className="p-12 text-center text-slate-500">Aucun produit</td></tr>
                        : pagedProducts.map(p => (
                          <tr key={p.id} className="hover:bg-white/[0.02] transition group">
                            <td className="p-4 pl-5"><input type="checkbox" className="rounded accent-amber-500" /></td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-xl overflow-hidden bg-white/5 shrink-0 relative border border-white/5">
                                  {p.image_url
                                    ? <Image src={p.image_url} alt={p.name} fill className="object-cover" sizes="44px"
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=100&auto=format&fit=crop'; }} />
                                    : <div className="w-full h-full flex items-center justify-center"><Package className="w-4 h-4 text-slate-600" /></div>
                                  }
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-white truncate max-w-[180px]">{p.name}</p>
                                  <p className="text-slate-600 truncate max-w-[180px] mt-0.5 text-[11px]">{p.description || '—'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-400 font-medium">
                                {p.categories?.name || '—'}
                              </span>
                            </td>
                            <td className="p-4 font-black text-white font-mono">{Number(p.price).toLocaleString('fr-FR')} <span className="text-slate-500 font-normal text-[11px]">MAD</span></td>
                            <td className="p-4">
                              <div className="flex items-center gap-1.5">
                                <button onClick={() => handleQuickStock(p, -1)} disabled={Number(p.stock) <= 0}
                                  className="w-5 h-5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center disabled:opacity-30 transition text-slate-400">
                                  <Minus className="w-2.5 h-2.5" />
                                </button>
                                <span className="text-white font-mono font-bold text-xs w-8 text-center">{p.stock}</span>
                                <button onClick={() => handleQuickStock(p, +1)}
                                  className="w-5 h-5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition text-slate-400">
                                  <Plus className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            </td>
                            <td className="p-4">
                              {Number(p.stock) === 0
                                ? <span className="px-3 py-1 rounded-full text-[11px] font-bold border border-red-500/40 text-red-400">Rupture</span>
                                : Number(p.stock) <= 5
                                ? <span className="px-3 py-1 rounded-full text-[11px] font-bold border border-amber-500/40 text-amber-400">Stock faible</span>
                                : <span className="px-3 py-1 rounded-full text-[11px] font-bold border border-emerald-500/40 text-emerald-400">Disponible</span>
                              }
                            </td>
                            <td className="p-4 pr-5 text-right">
                              <div className="inline-flex items-center gap-1">
                                <button onClick={() => openEdit(p)} className="p-2 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition" title="Modifier"><Edit2 className="w-3.5 h-3.5" /></button>
                                <button onClick={() => handleDelete(p.id, p.name)} className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition" title="Supprimer"><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                {filteredProducts.length > pageSize && (
                  <div className="px-5 py-3.5 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">{(currentPage-1)*pageSize+1}–{Math.min(currentPage*pageSize, filteredProducts.length)} / {filteredProducts.length}</span>
                    <div className="flex items-center gap-2">
                      <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                        className="px-3 py-1.5 rounded-lg bg-[#060614] border border-white/10 text-xs text-white focus:outline-none">
                        {[10,25,50].map(n => <option key={n} value={n}>{n} / page</option>)}
                      </select>
                      <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage <= 1}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white disabled:opacity-30 hover:bg-white/10 transition">Préc.</button>
                      <span className="text-xs text-slate-400 px-2">{currentPage} / {totalPages}</span>
                      <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage >= totalPages}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white disabled:opacity-30 hover:bg-white/10 transition">Suiv.</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══════ COMMANDES ═══════ */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* En-tête */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1">
                    <span className="text-amber-500 font-semibold">Console</span>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-white font-semibold">Commandes</span>
                  </div>
                  <h2 className="text-lg font-black text-white">Commandes WhatsApp</h2>
                </div>
                {/* Filtre statut commandes */}
                <select value={orderStatusFilter} onChange={e => setOrderStatusFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-[#0D0D20] border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500">
                  <option value="ALL">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmées</option>
                  <option value="delivered">Livrées</option>
                  <option value="cancelled">Annulées</option>
                </select>
              </div>

            <div className="bg-[#0D0D20] border border-white/5 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/5 text-slate-500 uppercase tracking-wider">
                      <th className="text-left p-4 pl-5 font-bold">N° commande</th>
                      <th className="text-left p-4 font-bold">Date</th>
                      <th className="text-left p-4 font-bold">Client</th>
                      <th className="text-left p-4 font-bold">Téléphone</th>
                      <th className="text-left p-4 font-bold">Total</th>
                      <th className="text-left p-4 font-bold">Statut</th>
                      <th className="text-right p-4 pr-5 font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {pagedOrders.length === 0
                      ? <tr><td colSpan={7} className="p-12 text-center text-slate-500">Aucune commande</td></tr>
                      : pagedOrders.map(o => (
                        <tr key={o.id} className="hover:bg-white/[0.02] transition">
                          <td className="p-4 pl-5 font-mono font-bold text-amber-500">#{o.id.slice(0,8)}</td>
                          <td className="p-4 text-slate-400">{new Date(o.created_at).toLocaleDateString('fr-FR')}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-[10px] shrink-0">
                                {o.customer_name?.[0]?.toUpperCase() || '?'}
                              </div>
                              <span className="font-semibold text-white">{o.customer_name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-slate-400 font-mono">{o.customer_phone || '—'}</td>
                          <td className="p-4 font-black text-white font-mono">{Number(o.total).toLocaleString('fr-FR')} <span className="text-slate-500 font-normal">MAD</span></td>
                          <td className="p-4"><StatusBadge status={o.status} /></td>
                          <td className="p-4 pr-5 text-right">
                            <button onClick={() => openWhatsApp(o.customer_phone, o.id, o.customer_name)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-[11px] font-semibold border border-emerald-500/30 transition">
                              <MessageCircle className="w-3.5 h-3.5" />WhatsApp
                            </button>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
              {orders.length > ORDER_PAGE_SIZE && (
                <div className="px-5 py-3.5 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">{(orderPage-1)*ORDER_PAGE_SIZE+1}–{Math.min(orderPage*ORDER_PAGE_SIZE, orders.length)} / {orders.length}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setOrderPage(p => Math.max(1,p-1))} disabled={orderPage<=1} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white disabled:opacity-30 hover:bg-white/10 transition">Préc.</button>
                    <span className="text-xs text-slate-400 px-2">{orderPage} / {totalOrdPages}</span>
                    <button onClick={() => setOrderPage(p => Math.min(totalOrdPages,p+1))} disabled={orderPage>=totalOrdPages} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white disabled:opacity-30 hover:bg-white/10 transition">Suiv.</button>
                  </div>
                </div>
              )}
            </div>
            </div>
          )}

          {/* ═══════ CATÉGORIES ═══════ */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
              <div className="md:col-span-2 bg-[#0D0D20] border border-white/5 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-sm text-white">{editCat ? 'Renommer' : 'Nouvelle catégorie'}</h3>
                <form onSubmit={handleSaveCat} className="space-y-3">
                  <input type="text" required value={catName} onChange={e => setCatName(e.target.value)}
                    placeholder="Ex: Apple iPhone"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#060614] border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition" />
                  <div className="flex gap-2">
                    {editCat && <button type="button" onClick={() => { setEditCat(null); setCatName(''); }} className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs text-slate-400 hover:text-white hover:bg-white/5 transition">Annuler</button>}
                    <button type="submit" className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#060614] text-xs font-bold transition">
                      {editCat ? 'Sauvegarder' : 'Créer'}
                    </button>
                  </div>
                </form>
              </div>
              <div className="md:col-span-3 bg-[#0D0D20] border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead><tr className="border-b border-white/5 text-slate-500 uppercase tracking-wider"><th className="text-left p-4 pl-5 font-bold">Catégorie</th><th className="text-right p-4 pr-5 font-bold">Actions</th></tr></thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {categories.map(c => (
                      <tr key={c.id} className="hover:bg-white/[0.02] transition">
                        <td className="p-4 pl-5 font-semibold text-white">{c.name}</td>
                        <td className="p-4 pr-5 text-right">
                          <div className="inline-flex gap-1">
                            <button onClick={() => { setEditCat(c); setCatName(c.name); }} className="p-2 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDeleteCat(c.id, c.name)} className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ═══════ UTILISATEURS ═══════ */}
          {activeTab === 'users' && (
            <div className="bg-[#0D0D20] border border-white/5 rounded-2xl overflow-hidden">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-white/5 text-slate-500 uppercase tracking-wider">
                  <th className="text-left p-4 pl-5 font-bold">Utilisateur</th>
                  <th className="text-left p-4 font-bold">Email</th>
                  <th className="text-left p-4 font-bold">Rôle</th>
                  <th className="text-left p-4 font-bold">Inscrit le</th>
                  <th className="text-right p-4 pr-5 font-bold">Action</th>
                </tr></thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {usersList.length === 0
                    ? <tr><td colSpan={5} className="p-8 text-center text-slate-500">Aucun utilisateur chargé</td></tr>
                    : usersList.map(u => (
                      <tr key={u.id} className="hover:bg-white/[0.02] transition">
                        <td className="p-4 pl-5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-xs shrink-0">
                              {u.name?.[0]?.toUpperCase() || '?'}
                            </div>
                            <span className="font-semibold text-white">{u.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-slate-400 font-mono">{u.email}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${u.role === 'admin' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : 'bg-slate-500/15 text-slate-400 border-slate-500/30'}`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500">{new Date(u.created_at).toLocaleDateString('fr-FR')}</td>
                        <td className="p-4 pr-5 text-right">
                          <button onClick={() => handleToggleRole(u)}
                            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-slate-300 hover:text-white transition">
                            {u.role === 'admin' ? '↓ Client' : '↑ Admin'}
                          </button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          )}

          {/* ═══════ PARAMÈTRES ═══════ */}
          {activeTab === 'settings' && (
            <div className="max-w-xl space-y-4">
              {[
                { label: 'Numéro WhatsApp', value: process.env.NEXT_PUBLIC_WHATSAPP || '+212 600-000000', note: 'Configuré dans backend/.env (WHATSAPP_NUMBER)' },
                { label: 'Devise', value: 'Dirham Marocain (MAD)' },
                { label: 'Mode de paiement', value: 'Cash on Delivery — validation WhatsApp', badge: 'Opérationnel' },
              ].map(({ label, value, note, badge }) => (
                <div key={label} className="bg-[#0D0D20] border border-white/5 rounded-2xl p-5 space-y-2">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-white">{value}</p>
                    {badge && <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">{badge}</span>}
                  </div>
                  {note && <p className="text-[11px] text-slate-600">{note}</p>}
                </div>
              ))}
            </div>
          )}

        </main>
      </div>

      {/* ══════════ MODALE PRODUIT ══════════ */}
      {productModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0D0D20] border border-white/10 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-bold text-white">{editProduct ? 'Modifier le produit' : 'Nouveau produit'}</h3>
              <button onClick={() => setProductModal(false)} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Nom *</label>
                <input type="text" required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})}
                  placeholder="Apple iPhone 16 Pro Max (256 Go)"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#060614] border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Prix (MAD) *</label>
                  <input type="number" step="0.01" required value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})}
                    placeholder="16490"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#060614] border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition font-mono" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Stock *</label>
                  <input type="number" required value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})}
                    placeholder="15"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#060614] border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition font-mono" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Catégorie</label>
                <select value={productForm.category_id} onChange={e => setProductForm({...productForm, category_id: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#060614] border border-white/10 text-sm text-white focus:outline-none focus:border-amber-500">
                  <option value="">— Sélectionner —</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">URL Image</label>
                <input type="url" value={productForm.image_url} onChange={e => setProductForm({...productForm, image_url: e.target.value})}
                  placeholder="https://…"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#060614] border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                <textarea rows={3} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})}
                  placeholder="Écran 6.9'' OLED 120Hz, puce A18 Pro…"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#060614] border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setProductModal(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition">Annuler</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#060614] text-sm font-bold transition">
                  {editProduct ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════ MODALE CATÉGORIE ══════════ */}
      {catModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#0D0D20] border border-white/10 rounded-3xl shadow-2xl">
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-bold text-white">{editCat ? 'Renommer' : 'Nouvelle catégorie'}</h3>
              <button onClick={() => setCatModal(false)} className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveCat} className="p-6 space-y-4">
              <input type="text" required value={catName} onChange={e => setCatName(e.target.value)}
                placeholder="Ex: Apple iPhone"
                className="w-full px-4 py-2.5 rounded-xl bg-[#060614] border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 transition" />
              <div className="flex gap-3">
                <button type="button" onClick={() => setCatModal(false)} className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition">Annuler</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#060614] text-sm font-bold transition">
                  {editCat ? 'Sauvegarder' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
