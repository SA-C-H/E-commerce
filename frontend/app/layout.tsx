import type { Metadata, Viewport } from 'next';
import { Toaster } from 'sonner';
import ThemeProvider from '@/components/ThemeProvider';
import Chatbot from '@/components/Chatbot';
import './globals.css';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="fr" data-scroll-behavior="smooth" data-theme="dark" className={cn("font-sans", geist.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider />
        {children}
        <Chatbot />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
