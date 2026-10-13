import type { NextConfig } from 'next';

// PostHog: ส่งผ่าน /ingest ของเว็บเอง (US เป็นค่าเริ่มต้น ตั้ง NEXT_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com ถ้าใช้ EU)
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';
const posthogAssets = posthogHost.replace('.i.posthog.com', '-assets.i.posthog.com');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      { source: '/ingest/static/:path*', destination: `${posthogAssets}/static/:path*` },
      { source: '/ingest/array/:path*', destination: `${posthogAssets}/array/:path*` },
      { source: '/ingest/:path*', destination: `${posthogHost}/:path*` },
    ];
  },
  // ฟอนต์ TTF ที่ OG image อ่านด้วย fs ต้องติดไปกับฟังก์ชันบน Vercel
  outputFileTracingIncludes: {
    '/fortune-tellers/**': ['./src/assets/og/**'],
    '/color-today/**': ['./src/assets/og/**', './public/logo-mark.png', './public/logo-badge.png'],
    '/opengraph-image': ['./src/assets/og/**', './public/logo-mark.png', './public/logo-badge.png'],
  },
};

export default nextConfig;
