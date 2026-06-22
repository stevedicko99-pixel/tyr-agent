import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.alibaba.com',
      },
      {
        protocol: 'https',
        hostname: '*.alicdn.com',
      },
      {
        protocol: 'https',
        hostname: '*.1688.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;