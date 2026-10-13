'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { NAV_ITEMS } from '@/lib/site';
import { GOALS } from '@/lib/goals';
import { GoalIcon, UiIcon } from './icons';
import { TextSizeToggle } from './TextSizeToggle';

export function MenuButton() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="icon-btn icon-btn--glass"
        aria-label="เมนู"
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen(true)}
      >
        <UiIcon name="menu" size={20} />
      </button>
      {open && (
        <div className="menu-backdrop" onClick={() => setOpen(false)}>
          <nav
            id="site-menu"
            className="menu-sheet"
            aria-label="เมนูหลัก"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="menu-sheet__head">
              <span className="menu-sheet__title">เมนู</span>
              <button ref={closeRef} type="button" className="icon-btn" aria-label="ปิดเมนู" onClick={() => setOpen(false)}>
                <UiIcon name="close" size={20} />
              </button>
            </div>
            <ul className="menu-sheet__list">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="menu-sheet__link">
                    <UiIcon name={item.icon} size={20} />
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/tools/lucky-number" className="menu-sheet__link">
                  <span className="menu-sheet__num" aria-hidden="true">9</span>
                  เลขมงคลจากวันเกิด
                </Link>
              </li>
            </ul>
            <TextSizeToggle />
            <div className="menu-sheet__label">เสริมเรื่อง</div>
            <ul className="chip-row chip-row--wrap">
              {GOALS.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/${g.slug}`}
                    className="chip"
                    style={{ borderColor: g.chipBorder, color: g.chipText }}
                  >
                    <span style={{ color: g.color, display: 'inline-flex' }}>
                      <GoalIcon slug={g.slug} size={16} strokeWidth={1.9} />
                    </span>
                    {g.short}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
