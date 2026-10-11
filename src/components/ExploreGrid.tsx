import Link from 'next/link';
import { NAV_ITEMS } from '@/lib/site';
import { UiIcon } from './icons';

const DESCRIPTIONS: Record<string, string> = {
  '/fortune-tellers': 'แยกตามศาสตร์และเรื่องที่ถนัด',
  '/places': 'วัด ศาลเจ้า เทวาลัย ทั่วไทย',
  '/abroad': 'คู่มือทริปสายมู',
  '/calendar': 'ฤกษ์ดีตามประเภทงาน',
  '/ai-prompts': 'prompt พร้อมใช้กับ ChatGPT Claude Gemini',
};

/** ทางเข้าหมอดู / สถานที่ไทย / ต่างประเทศ / ปฏิทินมงคล */
export function ExploreGrid() {
  const items = NAV_ITEMS.filter((item) => item.href in DESCRIPTIONS);
  return (
    <nav className="explore-grid" aria-label="หมวดหลัก">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className="explore-grid__item">
          <span className="explore-grid__icon">
            <UiIcon name={item.icon} size={22} />
          </span>
          <span className="explore-grid__label">{item.label}</span>
          <span className="explore-grid__desc">{DESCRIPTIONS[item.href]}</span>
        </Link>
      ))}
    </nav>
  );
}
