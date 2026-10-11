import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { GoalProvider } from '@/components/goal-context';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';
import '../../design/tokens.css'; // design tokens: แหล่งค่าเดียว
import './fonts.css';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} - รวมทุกเรื่องสายมู`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  openGraph: { siteName: SITE_NAME, locale: 'th_TH', type: 'website' },
};

export const viewport: Viewport = {
  themeColor: '#172038',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th">
      <body>
        <GoalProvider>
          <div className="app">{children}</div>
        </GoalProvider>
      </body>
    </html>
  );
}
