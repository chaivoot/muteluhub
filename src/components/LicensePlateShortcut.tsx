import Link from 'next/link';
import { UiIcon } from './icons';

export function LicensePlateShortcut() {
  return (
    <Link href="/tools/license-plate" className="shortcut-card">
      <span className="shortcut-card__num" aria-hidden="true">
        ก
      </span>
      <span className="shortcut-card__body">
        <span className="shortcut-card__title">เช็กทะเบียนรถมงคล</span>
        <span className="shortcut-card__sub">ผลรวมทะเบียน และอักษรที่ควรเลี่ยงตามวันเกิด</span>
      </span>
      <UiIcon name="chevron" size={20} className="shortcut-card__arrow" />
    </Link>
  );
}
