import Link from 'next/link';
import { UiIcon } from './icons';

export function PhoneNumberShortcut() {
  return (
    <Link href="/tools/phone-number" className="shortcut-card">
      <span className="shortcut-card__num" aria-hidden="true">
        ☎
      </span>
      <span className="shortcut-card__body">
        <span className="shortcut-card__title">เช็กเบอร์มงคล</span>
        <span className="shortcut-card__sub">ดูความหมายคู่เลข และคู่เลขที่เหมาะกับวันเกิดคุณ</span>
      </span>
      <UiIcon name="chevron" size={20} className="shortcut-card__arrow" />
    </Link>
  );
}
