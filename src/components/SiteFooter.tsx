import Link from 'next/link';
import { SITE_NAME } from '@/lib/site';

const LINKS = [
  { href: '/about', label: 'เกี่ยวกับเรา' },
  { href: '/contact', label: 'ติดต่อเรา' },
  { href: '/terms', label: 'ข้อกำหนดการใช้งาน' },
  { href: '/privacy', label: 'นโยบายความเป็นส่วนตัว' },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <nav aria-label="ข้อมูลเว็บไซต์">
        <ul className="site-footer__links">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href}>{l.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <p className="site-footer__note">
        เนื้อหาเป็นความเชื่อและข้อมูลประกอบการตัดสินใจ บางลิงก์เป็นลิงก์ affiliate ที่เว็บได้ค่าคอมมิชชันโดยราคาของคุณเท่าเดิม
      </p>
      <p className="site-footer__copy">© {new Date().getFullYear() + 543} {SITE_NAME}</p>
    </footer>
  );
}
