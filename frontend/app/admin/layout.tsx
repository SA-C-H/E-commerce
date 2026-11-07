import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TechNova — Console d\'Administration',
  description: 'Espace réservé aux administrateurs TechNova Store.',
  robots: 'noindex, nofollow',
};

/**
 * Layout isolé du Back Office — sans Navbar ni Footer du site public.
 * Toutes les pages sous /admin utilisent ce layout indépendant.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] antialiased">
      {children}
    </div>
  );
}
