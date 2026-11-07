import type { Metadata, Viewport } from 'next';
import { Toaster } from 'sonner';
import ThemeProvider from '@/components/ThemeProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'TechNova | Smartphones & Laptops Haut de Gamme',
  description: 'Boutique en ligne premium de smartphones et laptops. iPhone, Samsung Galaxy, MacBook, Dell XPS — livrés partout au Maroc.',
};

/* ← C'est ça qui manquait — sans ça les breakpoints Tailwind sont ignorés sur mobile */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col overflow-x-hidden">
        <ThemeProvider />
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
