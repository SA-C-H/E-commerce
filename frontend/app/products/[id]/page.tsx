import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { notFound } from 'next/navigation';
import ProductDetailActions from './ProductDetailActions';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products/${id}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const defaultImage =
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80';

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Retour */}
        <div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au catalogue
          </Link>
        </div>

        {/* Fiche produit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-start">
          
          {/* Image */}
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-[#E2E8F0] shadow-sm">
            <Image
              src={product.image_url || defaultImage}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
            />
            {product.categories?.name && (
              <span className="absolute top-4 left-4 px-3.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white text-[#0F172A] shadow-sm border border-[#E2E8F0]">
                {product.categories.name}
              </span>
            )}
          </div>

          {/* Détails */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E2E8F0] shadow-sm space-y-6">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase mb-3 ${
                isOutOfStock ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-[#2563EB]'
              }`}>
                {isOutOfStock ? 'Rupture de stock' : `En stock (${product.stock} unités)`}
              </span>

              <h1 className="font-serif-title text-3xl sm:text-4xl font-normal text-[#0F172A] mb-3">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#0F172A]">
                  {Number(product.price).toFixed(2)}
                </span>
                <span className="text-sm font-semibold text-[#2563EB]">MAD</span>
              </div>
            </div>

            <div className="border-t border-[#F1F5F9] pt-4">
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                {product.description || 'Accessoire haute performance certifié et garanti.'}
              </p>
            </div>

            {/* Actions ajout panier */}
            <div className="border-t border-[#F1F5F9] pt-6">
              <ProductDetailActions product={product} />
            </div>

            {/* Réassurance */}
            <div className="border-t border-[#F1F5F9] pt-6 grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <Truck className="w-5 h-5 mx-auto text-[#0F172A]" />
                <p className="text-[10px] font-bold text-[#0F172A]">Livraison 24h</p>
                <p className="text-[9px] text-[#94A3B8]">Partout au Maroc</p>
              </div>
              <div className="space-y-1">
                <ShieldCheck className="w-5 h-5 mx-auto text-[#0F172A]" />
                <p className="text-[10px] font-bold text-[#0F172A]">Certifié CE</p>
                <p className="text-[9px] text-[#94A3B8]">Sécurité thermique</p>
              </div>
              <div className="space-y-1">
                <RefreshCw className="w-5 h-5 mx-auto text-[#0F172A]" />
                <p className="text-[10px] font-bold text-[#0F172A]">Retour Facile</p>
                <p className="text-[9px] text-[#94A3B8]">Sous 7 jours</p>
              </div>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
