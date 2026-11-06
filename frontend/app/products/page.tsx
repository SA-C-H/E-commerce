import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard, { Product } from '@/components/ProductCard';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface SearchProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    sortBy?: string;
    page?: string;
  }>;
}

async function getProducts(params: Record<string, string | undefined>) {
  const query = new URLSearchParams();
  if (params.category) query.set('category', params.category);
  if (params.search) query.set('search', params.search);
  if (params.minPrice) query.set('minPrice', params.minPrice);
  if (params.maxPrice) query.set('maxPrice', params.maxPrice);
  if (params.sortBy) query.set('sortBy', params.sortBy);
  query.set('page', params.page || '1');
  query.set('limit', '12');

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products?${query.toString()}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return { products: [], pagination: { total: 0, page: 1, totalPages: 1 } };
    const json = await res.json();
    return json.data || { products: [], pagination: { total: 0, page: 1, totalPages: 1 } };
  } catch {
    return { products: [], pagination: { total: 0, page: 1, totalPages: 1 } };
  }
}

async function getCategories() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/categories`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch {
    return [];
  }
}

export default async function ProductsPage({ searchParams }: SearchProps) {
  const resolvedParams = await searchParams;
  const [data, categories] = await Promise.all([
    getProducts(resolvedParams),
    getCategories(),
  ]);

  const { products, pagination } = data;
  const currentPage = Number(resolvedParams.page || 1);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Titre Serif épuré High-Tech */}
        <div className="space-y-1">
          <span className="text-[11px] font-semibold tracking-widest text-[#2563EB] uppercase block">
            NOTRE COLLECTION OFFICIELLE
          </span>
          <h1 className="font-serif-title text-3xl sm:text-4xl text-[#0F172A] font-normal">
            Smartphones & Laptops
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Trouvez votre iPhone, Samsung Galaxy, Google Pixel, MacBook ou Laptop Windows avec garantie constructeur 1 an.
          </p>
        </div>

        {/* Barre de recherche et catégories dans une carte blanche élégante */}
        <div className="bg-white rounded-3xl p-5 border border-[#E2E8F0] shadow-sm space-y-4">
          <form method="GET" action="/products" className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="relative sm:col-span-6">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="text"
                name="search"
                defaultValue={resolvedParams.search || ''}
                placeholder="Rechercher iPhone 15 Pro, Galaxy S24, MacBook Pro, Dell XPS..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                name="category"
                defaultValue={resolvedParams.category || ''}
                className="w-full px-4 py-2.5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              >
                <option value="">Toutes les marques</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-[#0F172A] hover:bg-[#2563EB] text-white text-xs font-semibold tracking-wider uppercase transition shadow-sm"
              >
                Filtrer
              </button>
            </div>
          </form>

          {/* Pilules de catégories rapides */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F1F5F9]">
            <Link
              href="/products"
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                !resolvedParams.category
                  ? 'bg-[#0F172A] text-white'
                  : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Toutes les marques
            </Link>
            {categories.map((c: any) => {
              const active = resolvedParams.category === c.id;
              return (
                <Link
                  key={c.id}
                  href={`/products?category=${c.id}`}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                    active
                      ? 'bg-[#0F172A] text-white'
                      : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {c.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Grille de produits */}
        {products && products.length > 0 ? (
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p: Product) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-6">
                {currentPage > 1 ? (
                  <Link
                    href={`/products?${new URLSearchParams({ ...resolvedParams, page: String(currentPage - 1) }).toString()}`}
                    className="p-2 rounded-full bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] transition shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                ) : (
                  <span className="p-2 rounded-full bg-slate-100 text-slate-300 cursor-not-allowed">
                    <ChevronLeft className="w-4 h-4" />
                  </span>
                )}

                <span className="text-xs text-[#64748B] font-medium px-2">
                  Page {currentPage} sur {pagination.totalPages}
                </span>

                {currentPage < pagination.totalPages ? (
                  <Link
                    href={`/products?${new URLSearchParams({ ...resolvedParams, page: String(currentPage + 1) }).toString()}`}
                    className="p-2 rounded-full bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] transition shadow-sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <span className="p-2 rounded-full bg-slate-100 text-slate-300 cursor-not-allowed">
                    <ChevronRight className="w-4 h-4" />
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center border border-[#E2E8F0] shadow-sm space-y-3">
            <h3 className="font-serif-title text-2xl text-[#0F172A]">
              Aucun modèle disponible pour le moment
            </h3>
            <p className="text-xs text-[#64748B] max-w-md mx-auto">
              Exécutez le script SQL seed.sql dans votre espace Supabase pour afficher les smartphones et laptops.
            </p>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
