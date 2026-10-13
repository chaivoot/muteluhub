import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // ฟอนต์ TTF ที่ OG image อ่านด้วย fs ต้องติดไปกับฟังก์ชันบน Vercel
  outputFileTracingIncludes: {
    '/fortune-tellers/**': ['./src/assets/og/**'],
    '/color-today/**': ['./src/assets/og/**', './public/logo-mark.png', './public/logo-badge.png'],
    '/opengraph-image': ['./src/assets/og/**', './public/logo-mark.png', './public/logo-badge.png'],
  },
};

export default nextConfig;
