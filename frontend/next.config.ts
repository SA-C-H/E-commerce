import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Unsplash
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Supabase Storage
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      // Apple Store CDN
      {
        protocol: "https",
        hostname: "store.storeimages.cdn-apple.com",
      },
      {
        protocol: "https",
        hostname: "as-images.apple.com",
      },
      // Samsung
      {
        protocol: "https",
        hostname: "images.samsung.com",
      },
      {
        protocol: "https",
        hostname: "**.samsung.com",
      },
      // Google / Pixel
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "store.google.com",
      },
      // GSMArena (images produits)
      {
        protocol: "https",
        hostname: "**.gsmarena.com",
      },
      // Asus ROG
      {
        protocol: "https",
        hostname: "**.asus.com",
      },
      // Dell
      {
        protocol: "https",
        hostname: "i.dell.com",
      },
      {
        protocol: "https",
        hostname: "**.dell.com",
      },
      // Lenovo
      {
        protocol: "https",
        hostname: "**.lenovo.com",
      },
      // HP
      {
        protocol: "https",
        hostname: "**.hp.com",
      },
      // Microsoft
      {
        protocol: "https",
        hostname: "**.microsoft.com",
      },
      // Razer
      {
        protocol: "https",
        hostname: "**.razer.com",
      },
      // CDN générique
      {
        protocol: "https",
        hostname: "**.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "**.imgix.net",
      },
    ],
  },
};

export default nextConfig;
