import Link from 'next/link';
import { SITE_NAME } from '@/lib/site';
import { LogoMark } from './icons';
import { MenuButton } from './MenuButton';

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  return (
    <header className={overlay ? 'site-header site-header--overlay' : 'site-header'}>
      <Link href="/" className="site-header__brand">
        <LogoMark />
        <span>{SITE_NAME}</span>
      </Link>
      <MenuButton />
    </header>
  );
}
