'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { api, ApiError } from '@/lib/api';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Settings,
  Plus,
  Trash2,
  Edit2,
  TrendingUp,
  ShieldAlert,
  Search,
  MessageCircle,
  ExternalLink,
  AlertTriangle,
  X,
  RefreshCw,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Store,
  DollarSign,
  Minus,
  Check,
  UserCheck,
  ArrowUpRight,
  Filter,
  Sparkles,
  SlidersHorizontal,
  Menu,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type AdminTab = 'dashboard' | 'products' | 'orders' | 'categories' | 'users' | 'settings';

export default function LuxuryAdminPortal() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtres catalogue
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');
  const [stockFilter, setStockFilter] = useState<'ALL' | 'LOW' | 'OUT'>('ALL');

  // Pagination Catalogue
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // 10 par page par défaut pour éviter les listes infinies

  // Pagination Commandes
  const [orderPage, setOrderPage] = useState(1);
  const orderPageSize = 10;

  // Modales
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [categoryName, setCategoryName] = useState('');

  // Formulaire produit
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '15',
    image_url: '',
    category_id: '',
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, ordRes] = await Promise.all([
        api.get<any>('/products?limit=500'),
        api.get<any[]>('/categories'),
        api.get<any[]>('/orders'),
      ]);
      setProducts(prodRes?.products || []);
      setCategories(catRes || []);
      setOrders(ordRes || []);

      try {
        const usersRes = await api.get<any[]>('/auth/users');
        setUsersList(usersRes || []);
      } catch (err) {
        setUsersList([]);
      }
    } catch (err: any) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error('Erreur lors du chargement des données');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory =
        selectedCategoryFilter === 'ALL' || p.category_id === selectedCategoryFilter;
      let matchesStock = true;
      if (stockFilter === 'LOW') matchesStock = Number(p.stock) > 0 && Number(p.stock) <= 5;
      if (stockFilter === 'OUT') matchesStock = Number(p.stock) === 0;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchQuery, selectedCategoryFilter, stockFilter]);

  // Réinitialiser la page lors d'une recherche ou d'un filtre
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategoryFilter, stockFilter]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const totalOrderPages = Math.ceil(orders.length / orderPageSize) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (orderPage - 1) * orderPageSize;
    return orders.slice(start, start + orderPageSize);
  }, [orders, orderPage]);

  if (!mounted) return null;

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="p-10 rounded-3xl bg-white border border-[#E2E8F0] shadow-xl text-center max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-5 border border-red-100">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-bold text-red-600 uppercase tracking-widest">
            Accès Réservé
          </span>
          <h1 className="font-serif-title text-2xl font-bold text-[#0F172A] mt-2">
            Console d&apos;Administration
          </h1>
          <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
            Cet espace de gestion est réservé aux administrateurs TechNova Store.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={() => router.push('/login')}
              className="w-full py-3 rounded-full bg-[#0F172A] hover:bg-[#2563EB] text-white text-xs font-semibold uppercase tracking-wider transition shadow-sm"
            >
              Se connecter au portail
            </button>
            <Link
              href="/"
              className="text-xs text-[#64748B] hover:text-[#0F172A] transition py-2"
            >
              ← Retourner à la boutique publique
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Métriques
  const totalRevenue = orders.reduce((sum, ord) => sum + Number(ord.total || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
  const lowStockProducts = products.filter((p) => Number(p.stock) <= 5);

  // CRUD PRODUITS
  const openCreateProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      stock: '15',
      image_url: '',
      category_id: categories[0]?.id || '',
    });
    setProductModalOpen(true);
  };

  const openEditProduct = (prod: any) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      description: prod.description || '',
      price: String(prod.price),
      stock: String(prod.stock),
      image_url: prod.image_url || '',
      category_id: prod.category_id || '',
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        image_url: productForm.image_url.trim() || null,
        category_id: productForm.category_id || null,
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
        toast.success(`"${payload.name}" mis à jour avec succès !`);
      } else {
        await api.post('/products', payload);
        toast.success(`Nouveau modèle "${payload.name}" ajouté !`);
      }

      setProductModalOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l’enregistrement');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Supprimer définitivement le produit :\n"${name}" ?`)) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Produit retiré du catalogue avec succès');
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la suppression');
    }
  };

  const handleQuickStock = async (prod: any, delta: number) => {
    const newStock = Math.max(0, Number(prod.stock) + delta);
    try {
      await api.put(`/products/${prod.id}`, { stock: newStock });
      toast.success(`Stock mis à jour : ${newStock} unités`);
      setProducts((prev) =>
        prev.map((p) => (p.id === prod.id ? { ...p, stock: newStock } : p))
      );
    } catch (err: any) {
      toast.error('Erreur lors de la mise à jour du stock');
    }
  };

  // CRUD CATÉGORIES
  const openCreateCategory = () => {
    setEditingCategory(null);
    setCategoryName('');
    setCategoryModalOpen(true);
  };

  const openEditCategory = (cat: any) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, { name: categoryName.trim() });
        toast.success(`Catégorie renommée en "${categoryName.trim()}" !`);
      } else {
        await api.post('/categories', { name: categoryName.trim() });
        toast.success(`Nouvelle catégorie "${categoryName.trim()}" créée !`);
      }
      setCategoryModalOpen(false);
      setCategoryName('');
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l’enregistrement');
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Supprimer définitivement la catégorie "${name}" ?`)) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Catégorie supprimée avec succès');
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la suppression');
    }
  };

  // COMMANDES
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      toast.success(`Statut mis à jour : ${status.toUpperCase()}`);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la mise à jour');
    }
  };

  const openWhatsAppClient = (phone: string, orderId: string, customerName: string) => {
    if (!phone) {
      toast.error('Aucun numéro de téléphone fourni pour cette commande');
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Bonjour ${customerName}, je vous contacte depuis TechNova Store au sujet de votre commande #${orderId.slice(
        0,
        8
      )}. Pourriez-vous nous confirmer votre adresse de livraison ? Merci !`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  // UTILISATEURS
  const handleToggleUserRole = async (targetUser: any) => {
    const nextRole = targetUser.role === 'admin' ? 'client' : 'admin';
    if (!confirm(`Changer le rôle de ${targetUser.name} vers "${nextRole.toUpperCase()}" ?`)) return;

    try {
      await api.patch(`/auth/users/${targetUser.id}/role`, { role: nextRole });
      toast.success(`Rôle de ${targetUser.name} mis à jour : ${nextRole.toUpperCase()}`);
      loadData();
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de la modification');
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8FAFC] text-[#0F172A] antialiased">
      {/* =========================================================================
          SIDEBAR — fixe, ne bouge jamais, indépendante du scroll
         ========================================================================= */}
      <aside className="w-64 h-screen shrink-0 bg-white border-r border-[#E2E8F0] hidden md:flex flex-col z-30 shadow-sm overflow-hidden">
        {/* Logo Brandé TechNova */}
        <div className="p-6 border-b border-[#F1F5F9] shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#0F172A] flex items-center justify-center text-white font-serif-title font-bold text-lg shadow-sm">
              TN
            </div>
            <div>
              <span className="font-serif-title font-bold text-base text-[#0F172A] tracking-tight block">
                TechNova
              </span>
              <span className="text-[10px] font-semibold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-wider">
                Back Office
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Latérale — défile si trop d'éléments, scrollbar invisible */}
        <nav className="flex-1 min-h-0 overflow-y-auto scrollbar-hidden p-4 space-y-5">
            <div>
              <p className="px-3.5 text-[11px] font-bold uppercase tracking-widest text-[#94A3B8] mb-2.5">
                Tableau de Bord
              </p>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-sm font-semibold transition ${
                  activeTab === 'dashboard'
                    ? 'bg-[#0F172A] text-white shadow-sm'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Vue d&apos;ensemble
              </button>
            </div>

            <div>
              <p className="px-3.5 text-[11px] font-bold uppercase tracking-widest text-[#94A3B8] mb-2.5">
                Gestion Commerciale
              </p>
              <div className="space-y-1.5">
                <button
                  onClick={() => setActiveTab('products')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-sm font-semibold transition ${
                    activeTab === 'products'
                      ? 'bg-[#0F172A] text-white shadow-sm'
                      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4" />
                    Catalogue Produits
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      activeTab === 'products'
                        ? 'bg-white/20 text-white'
                        : 'bg-[#F1F5F9] text-[#64748B]'
                    }`}
                  >
                    {products.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-sm font-semibold transition ${
                    activeTab === 'orders'
                      ? 'bg-[#0F172A] text-white shadow-sm'
                      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-4 h-4" />
                    Commandes
                  </div>
                  {pendingOrders > 0 ? (
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">
                      {pendingOrders} en attente
                    </span>
                  ) : (
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        activeTab === 'orders'
                          ? 'bg-white/20 text-white'
                          : 'bg-[#F1F5F9] text-[#64748B]'
                      }`}
                    >
                      {orders.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('categories')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-sm font-semibold transition ${
                    activeTab === 'categories'
                      ? 'bg-[#0F172A] text-white shadow-sm'
                      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Layers className="w-4 h-4" />
                    Catégories
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      activeTab === 'categories'
                        ? 'bg-white/20 text-white'
                        : 'bg-[#F1F5F9] text-[#64748B]'
                    }`}
                  >
                    {categories.length}
                  </span>
                </button>
              </div>
            </div>

            <div>
              <p className="px-3.5 text-[11px] font-bold uppercase tracking-widest text-[#94A3B8] mb-2.5">
                Administration
              </p>
              <div className="space-y-1.5">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-sm font-semibold transition ${
                    activeTab === 'users'
                      ? 'bg-[#0F172A] text-white shadow-sm'
                      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Utilisateurs & Rôles
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-sm font-semibold transition ${
                    activeTab === 'settings'
                      ? 'bg-[#0F172A] text-white shadow-sm'
                      : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Paramètres Boutique
                </button>
              </div>
            </div>
          </nav>

        {/* Pied de Sidebar */}
        <div className="p-4 border-t border-[#F1F5F9] space-y-3 bg-[#FAFCFF] shrink-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 text-xs font-semibold text-[#0F172A] transition border border-[#E2E8F0] shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <Store className="w-4 h-4 text-[#2563EB]" />
              <span>Voir la boutique</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#94A3B8]" />
          </Link>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#0F172A] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-[#0F172A] truncate">{user?.name || 'Amine'}</p>
                <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  Super Admin
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Se déconnecter"
              className="p-2 text-[#64748B] hover:text-red-600 transition rounded-xl hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          DRAWER MOBILE BACK OFFICE (Menu coulissant sur smartphone / tablette)
         ========================================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-fade-in">
            {/* Haut drawer : Logo + fermer */}
            <div className="p-5 border-b border-[#F1F5F9] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0F172A] flex items-center justify-center text-white font-serif-title font-bold text-lg shadow-sm">
                  TN
                </div>
                <div>
                  <span className="font-serif-title font-bold text-base text-[#0F172A] tracking-tight block">
                    TechNova
                  </span>
                  <span className="text-[10px] font-semibold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-wider">
                    Back Office
                  </span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full text-[#94A3B8] hover:text-[#0F172A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation drawer */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              <button
                onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-xs font-semibold transition ${
                  activeTab === 'dashboard' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-[#64748B] hover:bg-[#F8FAFC]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Vue d&apos;ensemble
              </button>
              <button
                onClick={() => { setActiveTab('products'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-xs font-semibold transition ${
                  activeTab === 'products' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-[#64748B] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4" />
                  Catalogue Produits
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                  {products.length}
                </span>
              </button>
              <button
                onClick={() => { setActiveTab('orders'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-xs font-semibold transition ${
                  activeTab === 'orders' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-[#64748B] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-4 h-4" />
                  Commandes
                </div>
                {pendingOrders > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                    {pendingOrders}
                  </span>
                )}
              </button>
              <button
                onClick={() => { setActiveTab('categories'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-full text-xs font-semibold transition ${
                  activeTab === 'categories' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-[#64748B] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Layers className="w-4 h-4" />
                  Rayons
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                  {categories.length}
                </span>
              </button>
              <button
                onClick={() => { setActiveTab('users'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-full text-xs font-semibold transition ${
                  activeTab === 'users' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-[#64748B] hover:bg-[#F8FAFC]'
                }`}
              >
                <Users className="w-4 h-4" />
                Utilisateurs & Rôles
              </button>
            </nav>

            {/* Pied drawer */}
            <div className="p-4 border-t border-[#F1F5F9] space-y-3 bg-[#FAFCFF]">
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-xs font-semibold text-[#0F172A]"
              >
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-[#2563EB]" />
                  <span>Voir la boutique</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#94A3B8]" />
              </Link>
              <div className="flex items-center justify-between pt-1">
                <div>
                  <p className="text-xs font-bold text-[#0F172A]">{user?.name || 'Amine'}</p>
                  <p className="text-[10px] text-emerald-600 font-semibold">Super Admin</p>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-[#64748B] hover:text-red-600 rounded-xl hover:bg-red-50"
                  title="Déconnexion"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ZONE PRINCIPALE (Thème Luxe Blanc & Bleu Nuit - Conteneur Fixe & Scroll Isolé)
         ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header responsive — ne bouge jamais au scroll */}
        <header className="h-16 shrink-0 bg-white border-b border-[#E2E8F0] px-4 sm:px-8 flex items-center justify-between z-20 shadow-sm gap-2">
          <div className="flex items-center gap-3 min-w-0">
            {/* Bouton Menu Burger sur Smartphone */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] hover:bg-slate-100 transition shrink-0"
              title="Ouvrir le menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="min-w-0">
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-widest text-[#2563EB] uppercase block truncate">
                CONSOLE DE GESTION
              </span>
              <h1 className="font-serif-title text-base sm:text-2xl font-bold text-[#0F172A] truncate">
                {activeTab === 'dashboard' && 'Vue d’ensemble'}
                {activeTab === 'products' && 'Catalogue & Stocks'}
                {activeTab === 'orders' && 'Commandes WhatsApp'}
                {activeTab === 'categories' && 'Rayons'}
                {activeTab === 'users' && 'Utilisateurs & Permissions'}
                {activeTab === 'settings' && 'Paramètres'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 sm:p-2.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] hover:bg-white transition shadow-2xs"
              title="Rafraîchir les données"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${loading ? 'animate-spin text-[#2563EB]' : ''}`} />
            </button>

            {activeTab === 'categories' ? (
              <button
                onClick={openCreateCategory}
                className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#0F172A] hover:bg-[#2563EB] text-white text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Nouvelle Catégorie</span>
                <span className="sm:hidden">Ajouter</span>
              </button>
            ) : (
              <button
                onClick={openCreateProduct}
                className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#0F172A] hover:bg-[#2563EB] text-white text-[11px] sm:text-xs font-semibold tracking-wider uppercase transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Nouveau Produit</span>
                <span className="sm:hidden">Ajouter</span>
              </button>
            )}
          </div>
        </header>

        {/* Barre de navigation rapide en pilules défilantes sur Smartphone (Flexbox scroll horizontal) */}
        <div className="md:hidden flex items-center gap-1.5 overflow-x-auto px-4 py-2 bg-white border-b border-[#E2E8F0] scrollbar-hidden shrink-0">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition ${
              activeTab === 'dashboard'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]'
            }`}
          >
            Vue d’ensemble
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition flex items-center gap-1 ${
              activeTab === 'products'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]'
            }`}
          >
            <span>Catalogue</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800 font-bold">
              {products.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition flex items-center gap-1 ${
              activeTab === 'orders'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]'
            }`}
          >
            <span>Commandes</span>
            {pendingOrders > 0 && (
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-400 text-black font-bold">
                {pendingOrders}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition ${
              activeTab === 'categories'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]'
            }`}
          >
            Rayons ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition ${
              activeTab === 'users'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]'
            }`}
          >
            Rôles ({usersList.length})
          </button>
        </div>

        {/* Corps des Onglets — scrollbar invisible au pavé tactile */}
        <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain scrollbar-hidden p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl w-full mx-auto">
          {/* ===================== TAB 1 : DASHBOARD ===================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Bannière Prestige */}
              <div className="p-8 sm:p-10 rounded-3xl bg-[#0F172A] text-white relative overflow-hidden shadow-xl">
                <div className="relative z-10 max-w-2xl space-y-3">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-300 border border-white/15 text-[11px] font-semibold tracking-widest uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                    TECHNOVA COMMERCE ENGINE
                  </span>
                  <h2 className="font-serif-title text-3xl sm:text-4xl font-normal leading-tight">
                    Pilotage de votre boutique en temps réel
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                    Gérez vos {products.length} références d&apos;exception, ajustez vos stocks instantanément et confirmez vos livraisons avec vos clients par WhatsApp.
                  </p>
                </div>
              </div>

              {/* 4 Métriques en Cartes Blanches */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                      Chiffre d&apos;Affaires
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-[#0F172A] font-mono">
                    {totalRevenue.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Total des commandes
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                      Commandes Totales
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-[#0F172A]">{orders.length}</p>
                  <div className="flex items-center gap-2 mt-2 text-[11px]">
                    <span className="text-amber-700 font-bold">{pendingOrders} en attente</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-emerald-700 font-bold">{deliveredOrders} livrées</span>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                      Produits Référencés
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Package className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-[#0F172A]">{products.length}</p>
                  <p className="text-[11px] text-[#64748B] mt-2">
                    Sur {categories.length} catégories premium
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                      Alerte Stock Faible
                    </span>
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                        lowStockProducts.length > 0
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-slate-50 text-slate-400'
                      }`}
                    >
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-[#0F172A]">{lowStockProducts.length}</p>
                  <p className="text-[11px] text-amber-700 font-semibold mt-2">
                    Articles avec {'\u2264'} 5 unités
                  </p>
                </div>
              </div>

              {/* Tableaux Récapitulatifs Récents */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Dernières Commandes */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif-title font-bold text-lg text-[#0F172A] flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-[#2563EB]" />
                      Dernières Commandes
                    </h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-semibold text-[#2563EB] hover:underline"
                    >
                      Voir toutes ({orders.length}) →
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <div className="py-12 text-center text-[#64748B] text-xs">
                      Aucune commande enregistrée pour l&apos;instant.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 4).map((ord) => (
                        <div
                          key={ord.id}
                          className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-xs"
                        >
                          <div>
                            <p className="font-bold text-[#0F172A]">{ord.customer_name}</p>
                            <p className="text-[11px] text-[#64748B] font-mono mt-0.5">
                              #{ord.id.slice(0, 8)} • {ord.customer_phone || 'Sans tel'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[#0F172A] font-mono">
                              {Number(ord.total).toFixed(2)} MAD
                            </p>
                            <span
                              className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                ord.status === 'delivered'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : ord.status === 'confirmed'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : ord.status === 'cancelled'
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Produits en Stock Faible */}
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif-title font-bold text-lg text-[#0F172A] flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      Alertes Réapprovisionnement
                    </h3>
                    <button
                      onClick={() => {
                        setStockFilter('LOW');
                        setActiveTab('products');
                      }}
                      className="text-xs font-semibold text-amber-700 hover:underline"
                    >
                      Filtrer stocks faibles →
                    </button>
                  </div>

                  {lowStockProducts.length === 0 ? (
                    <div className="py-12 text-center text-[#64748B] text-xs">
                      ✅ Tous vos stocks sont optimaux.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {lowStockProducts.slice(0, 4).map((p) => (
                        <div
                          key={p.id}
                          className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-xs"
                        >
                          <div className="max-w-xs">
                            <p className="font-bold text-[#0F172A] truncate">{p.name}</p>
                            <p className="text-[11px] text-[#64748B] font-mono">
                              {Number(p.price).toFixed(2)} MAD
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              {p.stock} restant(s)
                            </span>
                            <button
                              onClick={() => openEditProduct(p)}
                              className="p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-white transition"
                              title="Modifier produit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===================== TAB 2 : PRODUITS (CRUD ÉLÉGANT) ===================== */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Barre de Recherche Blanche */}
              <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Recherche par nom, puce (ex: M3 Max, OLED, 16 Pro...)"
                    className="w-full pl-11 pr-4 py-2.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="ALL">Toutes les catégories ({categories.length})</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value as any)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="ALL">Tous les stocks ({products.length})</option>
                    <option value="LOW">Stock Faible ({'\u2264'} 5)</option>
                    <option value="OUT">Rupture de Stock (0)</option>
                  </select>

                  <button
                    onClick={openCreateProduct}
                    className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0F172A] hover:bg-[#2563EB] text-white text-xs font-semibold uppercase tracking-wider transition shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter un Produit
                  </button>
                </div>
              </div>

              {/* Tableau Blanc Haut de Gamme */}
              <div className="rounded-3xl bg-white border border-[#E2E8F0] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8FAFC] text-[#64748B] uppercase tracking-wider font-bold border-b border-[#E2E8F0]">
                      <tr>
                        <th className="p-4 pl-6">Produit & Spécifications</th>
                        <th className="p-4">Rayon</th>
                        <th className="p-4">Prix de Vente</th>
                        <th className="p-4">Stock & Ajustement Rapide</th>
                        <th className="p-4 pr-6 text-right">Actions CRUD</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-16 text-center text-[#64748B]">
                            Aucun produit ne correspond à ces critères.
                          </td>
                        </tr>
                      ) : (
                        paginatedProducts.map((prod) => (
                          <tr key={prod.id} className="hover:bg-[#F8FAFC]/80 transition">
                            <td className="p-4 pl-6">
                              <div className="flex items-center gap-3.5">
                                <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] relative overflow-hidden flex-shrink-0">
                                  {prod.image_url ? (
                                    <Image
                                      src={prod.image_url}
                                      alt={prod.name}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#94A3B8]">
                                      <Package className="w-5 h-5" />
                                    </div>
                                  )}
                                </div>
                                <div className="max-w-md">
                                  <p className="font-bold text-[#0F172A] line-clamp-1">{prod.name}</p>
                                  <p className="text-[11px] text-[#64748B] line-clamp-1 mt-0.5">
                                    {prod.description || 'Sans caractéristiques'}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-[#475569] font-medium">
                              {prod.categories?.name || 'Général'}
                            </td>
                            <td className="p-4 font-bold text-[#0F172A] font-mono">
                              {Number(prod.price).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}{' '}
                              <span className="text-[10px] text-[#64748B]">MAD</span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleQuickStock(prod, -1)}
                                  disabled={Number(prod.stock) <= 0}
                                  className="w-7 h-7 rounded-full bg-[#F8FAFC] hover:bg-white border border-[#E2E8F0] text-[#0F172A] flex items-center justify-center disabled:opacity-30 transition shadow-2xs"
                                  title="Diminuer le stock (-1)"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span
                                  className={`px-3 py-1 rounded-full text-[11px] font-bold border min-w-[75px] text-center ${
                                    Number(prod.stock) === 0
                                      ? 'bg-red-50 text-red-700 border-red-200'
                                      : Number(prod.stock) <= 5
                                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  }`}
                                >
                                  {prod.stock} unités
                                </span>
                                <button
                                  onClick={() => handleQuickStock(prod, +1)}
                                  className="w-7 h-7 rounded-full bg-[#F8FAFC] hover:bg-white border border-[#E2E8F0] text-[#0F172A] flex items-center justify-center transition shadow-2xs"
                                  title="Augmenter le stock (+1)"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                            <td className="p-4 pr-6 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() => openEditProduct(prod)}
                                  className="p-2 rounded-xl text-[#64748B] hover:text-[#2563EB] hover:bg-blue-50 transition"
                                  title="Modifier le produit"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                  className="p-2 rounded-xl text-[#64748B] hover:text-red-600 hover:bg-red-50 transition"
                                  title="Supprimer définitivement"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Barre de Pagination Produits */}
                {filteredProducts.length > 0 && (
                  <div className="p-4 px-6 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-[#64748B]">
                      Affichage de <span className="font-bold text-[#0F172A]">{(currentPage - 1) * pageSize + 1}</span> à{' '}
                      <span className="font-bold text-[#0F172A]">
                        {Math.min(currentPage * pageSize, filteredProducts.length)}
                      </span>{' '}
                      sur <span className="font-bold text-[#0F172A]">{filteredProducts.length}</span> modèles
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      {/* Sélecteur de taille de page */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#64748B]">Afficher :</span>
                        <select
                          value={pageSize}
                          onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          className="px-3 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                        >
                          <option value={10}>10 par page</option>
                          <option value={15}>15 par page</option>
                          <option value={25}>25 par page</option>
                          <option value={50}>50 par page</option>
                        </select>
                      </div>

                      {/* Contrôles Précédent / Numéros / Suivant */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage <= 1}
                          className="px-3 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] hover:bg-slate-50 disabled:opacity-30 transition shadow-2xs"
                        >
                          Précédent
                        </button>

                        <span className="px-3 text-xs font-bold text-[#0F172A]">
                          Page {currentPage} / {totalPages}
                        </span>

                        <button
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage >= totalPages}
                          className="px-3 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] hover:bg-slate-50 disabled:opacity-30 transition shadow-2xs"
                        >
                          Suivant
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================== TAB 3 : COMMANDES ===================== */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="rounded-3xl bg-white border border-[#E2E8F0] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F8FAFC] text-[#64748B] uppercase tracking-wider font-bold border-b border-[#E2E8F0]">
                      <tr>
                        <th className="p-4 pl-6">ID Commande</th>
                        <th className="p-4">Client & Contact</th>
                        <th className="p-4">Articles</th>
                        <th className="p-4">Montant Total</th>
                        <th className="p-4">Statut Commande</th>
                        <th className="p-4 pr-6 text-right">Action WhatsApp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-16 text-center text-[#64748B]">
                            Aucune commande enregistrée pour le moment.
                          </td>
                        </tr>
                      ) : (
                        paginatedOrders.map((ord) => (
                          <tr key={ord.id} className="hover:bg-[#F8FAFC]/80 transition">
                            <td className="p-4 pl-6 font-mono font-bold text-[#0F172A]">
                              #{ord.id.slice(0, 8)}
                            </td>
                            <td className="p-4">
                              <p className="font-bold text-[#0F172A]">{ord.customer_name}</p>
                              <p className="text-[11px] text-[#64748B] font-mono mt-0.5">
                                {ord.customer_phone || 'Sans téléphone'}
                              </p>
                            </td>
                            <td className="p-4 text-[#475569]">
                              {ord.order_items?.length || 0} article(s)
                            </td>
                            <td className="p-4 font-bold text-[#0F172A] font-mono">
                              {Number(ord.total).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD
                            </td>
                            <td className="p-4">
                              <select
                                value={ord.status}
                                onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                                className={`px-3 py-1.5 rounded-full text-[11px] font-bold border focus:outline-none ${
                                  ord.status === 'delivered'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : ord.status === 'confirmed'
                                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                                    : ord.status === 'cancelled'
                                    ? 'bg-red-50 text-red-800 border-red-200'
                                    : 'bg-amber-50 text-amber-900 border-amber-200'
                                }`}
                              >
                                <option value="pending">🟡 En attente</option>
                                <option value="confirmed">🔵 Confirmée</option>
                                <option value="delivered">🟢 Livrée</option>
                                <option value="cancelled">🔴 Annulée</option>
                              </select>
                            </td>
                            <td className="p-4 pr-6 text-right">
                              <button
                                onClick={() =>
                                  openWhatsAppClient(ord.customer_phone, ord.id, ord.customer_name)
                                }
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition shadow-xs"
                                title="Ouvrir WhatsApp pour confirmer la commande"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                Contacter Client
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Barre de Pagination Commandes */}
                {orders.length > orderPageSize && (
                  <div className="p-4 px-6 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between">
                    <div className="text-xs text-[#64748B]">
                      Affichage de <span className="font-bold text-[#0F172A]">{(orderPage - 1) * orderPageSize + 1}</span> à{' '}
                      <span className="font-bold text-[#0F172A]">
                        {Math.min(orderPage * orderPageSize, orders.length)}
                      </span>{' '}
                      sur <span className="font-bold text-[#0F172A]">{orders.length}</span> commandes
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setOrderPage((p) => Math.max(1, p - 1))}
                        disabled={orderPage <= 1}
                        className="px-3 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] hover:bg-slate-50 disabled:opacity-30 transition"
                      >
                        Précédent
                      </button>
                      <span className="px-3 text-xs font-bold text-[#0F172A]">
                        {orderPage} / {totalOrderPages}
                      </span>
                      <button
                        onClick={() => setOrderPage((p) => Math.min(totalOrderPages, p + 1))}
                        disabled={orderPage >= totalOrderPages}
                        className="px-3 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] hover:bg-slate-50 disabled:opacity-30 transition"
                      >
                        Suivant
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===================== TAB 4 : CATÉGORIES (CRUD RAYONS) ===================== */}
          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-5 p-6 sm:p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm">
                <h3 className="font-serif-title font-bold text-lg text-[#0F172A] mb-1">
                  Créer une Catégorie
                </h3>
                <p className="text-xs text-[#64748B] mb-5">
                  Organisez vos rayons pour faciliter les filtres.
                </p>

                <form onSubmit={handleSaveCategory} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
                      Nom du rayon *
                    </label>
                    <input
                      type="text"
                      required
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      placeholder="Ex: Audio & Casques Bluetooth"
                      className="w-full px-4 py-2.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-full font-semibold text-xs text-white bg-[#0F172A] hover:bg-[#2563EB] transition flex items-center justify-center gap-2 shadow-sm uppercase tracking-wider"
                  >
                    <Plus className="w-4 h-4" />
                    Enregistrer la catégorie
                  </button>
                </form>
              </div>

              <div className="md:col-span-7 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] text-[#64748B] uppercase tracking-wider font-bold border-b border-[#E2E8F0]">
                    <tr>
                      <th className="p-4 pl-6">Nom de la Catégorie</th>
                      <th className="p-4">Produits associés</th>
                      <th className="p-4 pr-6 text-right">Actions CRUD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-[#F8FAFC]/80 transition">
                        <td className="p-4 pl-6 font-bold text-[#0F172A]">{cat.name}</td>
                        <td className="p-4 text-[#64748B] font-medium">
                          {cat.productCount || 0} produit(s)
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => openEditCategory(cat)}
                              className="p-2 rounded-xl text-[#64748B] hover:text-[#2563EB] hover:bg-blue-50 transition"
                              title="Renommer la catégorie"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat.id, cat.name)}
                              className="p-2 rounded-xl text-[#64748B] hover:text-red-600 hover:bg-red-50 transition"
                              title="Supprimer la catégorie"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================== TAB 5 : UTILISATEURS ===================== */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="rounded-3xl bg-white border border-[#E2E8F0] shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] text-[#64748B] uppercase tracking-wider font-bold border-b border-[#E2E8F0]">
                    <tr>
                      <th className="p-4 pl-6">Nom de l&apos;Utilisateur</th>
                      <th className="p-4">Adresse Email</th>
                      <th className="p-4">Rôle Attribué</th>
                      <th className="p-4">Date d&apos;inscription</th>
                      <th className="p-4 pr-6 text-right">Action Permission</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {usersList.length === 0 ? (
                      <tr>
                        <td className="p-4 pl-6 font-bold text-[#0F172A]">{user?.name || 'Amine'}</td>
                        <td className="p-4 text-[#64748B] font-mono">{user?.email}</td>
                        <td className="p-4">
                          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-[#2563EB] border border-blue-200">
                            ADMINISTRATEUR
                          </span>
                        </td>
                        <td className="p-4 text-[#64748B]">Actif</td>
                        <td className="p-4 pr-6 text-right text-[#94A3B8]">—</td>
                      </tr>
                    ) : (
                      usersList.map((u) => (
                        <tr key={u.id} className="hover:bg-[#F8FAFC]/80 transition">
                          <td className="p-4 pl-6 font-bold text-[#0F172A]">{u.name}</td>
                          <td className="p-4 text-[#64748B] font-mono">{u.email}</td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                                u.role === 'admin'
                                  ? 'bg-blue-50 text-[#2563EB] border-blue-200'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              {u.role.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-4 text-[#64748B]">
                            {new Date(u.created_at).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="p-4 pr-6 text-right">
                            <button
                              onClick={() => handleToggleUserRole(u)}
                              className="px-3 py-1.5 rounded-full bg-[#F8FAFC] hover:bg-[#0F172A] hover:text-white border border-[#E2E8F0] text-[11px] font-semibold text-[#0F172A] transition"
                            >
                              {u.role === 'admin' ? 'Rétrograder Client' : 'Promouvoir Admin'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================== TAB 6 : PARAMÈTRES ===================== */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-6">
              <div className="p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-5">
                <h3 className="font-serif-title font-bold text-lg text-[#0F172A]">
                  Configuration Système
                </h3>
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[#64748B] font-bold mb-1.5 uppercase tracking-wider">
                      Numéro WhatsApp Destinataire des Commandes
                    </label>
                    <input
                      type="text"
                      disabled
                      value="+212 600-000000"
                      className="w-full px-4 py-2.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] font-mono"
                    />
                    <p className="text-[11px] text-[#94A3B8] mt-1">
                      Numéro configuré dans le fichier backend `.env` (WHATSAPP_NUMBER).
                    </p>
                  </div>

                  <div>
                    <label className="block text-[#64748B] font-bold mb-1.5 uppercase tracking-wider">
                      Devise Principale
                    </label>
                    <input
                      type="text"
                      disabled
                      value="Dirham Marocain (MAD)"
                      className="w-full px-4 py-2.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[#64748B] font-bold mb-1.5 uppercase tracking-wider">
                      Passerelle de Paiement
                    </label>
                    <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] flex items-center justify-between font-medium">
                      <span>Paiement à la livraison (Cash on Delivery) avec validation WhatsApp</span>
                      <span className="text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-[11px] font-bold border border-emerald-200">
                        Opérationnel
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =========================================================================
          MODALE PRODUIT (Thème Blanc & Bleu Nuit)
         ========================================================================= */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9] mb-6">
              <div>
                <h3 className="font-serif-title font-bold text-[#0F172A] text-xl">
                  {editingProduct ? 'Modifier la Fiche Produit' : 'Ajouter un Produit'}
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Renseignez les détails techniques et le prix en MAD
                </p>
              </div>
              <button
                onClick={() => setProductModalOpen(false)}
                className="p-2 text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                  Nom & Désignation *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Ex: Apple iPhone 16 Pro Max (512 Go) - Titane"
                  className="w-full px-4 py-2.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Prix de Vente (MAD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="16490.00"
                    className="w-full px-4 py-2.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                    Quantité Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    placeholder="15"
                    className="w-full px-4 py-2.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:bg-white transition font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                  Rayon / Catégorie
                </label>
                <select
                  value={productForm.category_id}
                  onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                  URL Image HD
                </label>
                <input
                  type="url"
                  value={productForm.image_url}
                  onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
                  Fiche Technique & Caractéristiques
                </label>
                <textarea
                  rows={4}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Écran 6.9'' OLED 120Hz, puce A18 Pro, 512 Go NVMe, capteur Fusion 48 Mpx..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-[#F1F5F9]">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-[#0F172A] hover:bg-[#2563EB] uppercase tracking-wider transition shadow-sm"
                >
                  {editingProduct ? 'Mettre à jour' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODALE CATÉGORIE (Thème Blanc & Bleu Nuit)
         ========================================================================= */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-8 rounded-3xl bg-white border border-[#E2E8F0] shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9] mb-6">
              <div>
                <h3 className="font-serif-title font-bold text-[#0F172A] text-xl">
                  {editingCategory ? 'Renommer la Catégorie' : 'Nouvelle Catégorie'}
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Gestion des rayons du catalogue
                </p>
              </div>
              <button
                onClick={() => setCategoryModalOpen(false)}
                className="p-2 text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
                  Nom du rayon *
                </label>
                <input
                  type="text"
                  required
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Ex: Audio & Casques Bluetooth"
                  className="w-full px-4 py-2.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:bg-white transition"
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-[#F1F5F9]">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-[#0F172A] hover:bg-[#2563EB] uppercase tracking-wider transition shadow-sm"
                >
                  {editingCategory ? 'Sauvegarder' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
