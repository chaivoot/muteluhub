import Link from 'next/link';
import { UiIcon } from './icons';

export function LuckyNumberShortcut() {
  return (
    <Link href="/tools/lucky-number" className="shortcut-card">
      <span className="shortcut-card__num" aria-hidden="true">๙</span>
      <span className="shortcut-card__body">
        <span className="shortcut-card__title">เลขมงคลจากวันเกิด</span>
        <span className="shortcut-card__sub">กรอกวันเกิด เลือกเรื่องที่อยากเสริม รู้เลขของคุณ</span>
      </span>
      <UiIcon name="chevron" size={20} className="shortcut-card__arrow" />
    </Link>
  );
}
