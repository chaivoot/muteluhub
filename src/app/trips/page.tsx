import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/ComingSoon';
import { TEMPLE_TRIPS } from '@/data/temple-trips';

export const metadata: Metadata = {
  alternates: { canonical: '/trips' },
  title: 'ทริปไหว้พระ 9 วัด เส้นทางสายมูทั่วไทย กรุงเทพ อยุธยา และจังหวัดท่องเที่ยว',
  description:
    'รวมเส้นทางไหว้พระ 9 วัดกรุงเทพฯ อยุธยา และทริปไหว้พระจังหวัดท่องเที่ยว เรียงจุดตามเส้นทาง พร้อมความหมายว่าแต่ละวัดขอพรเรื่องอะไร',
};

export default function TripsPage() {
  return (
    <main>
      <PageHeader title="ทริปไหว้พระ" />
      <div className="prose intro">
        <p>
          เส้นทางไหว้พระที่เรียงจุดตามทางให้แล้ว ไหว้ 9 วัดในกรุงเทพฯ และอยุธยาได้ใน 1 วัน ส่วนจังหวัดท่องเที่ยวคัดมาไม่กี่จุดที่แวะได้ระหว่างเที่ยว
          ทุกจุดบอกว่าทำไมถึงอยู่ในทริปและขอพรเรื่องอะไร
        </p>
      </div>
      <ul className="container home-reads__list">
        {TEMPLE_TRIPS.map((t) => (
          <li key={t.slug}>
            <Link href={`/trips/${t.slug}`} className="home-reads__item">
              <span className="home-reads__name">{t.name}</span>
              <span className="home-reads__meta">
                {t.duration} · {t.stops.length} จุด · {t.stops.slice(0, 3).map((s) => s.name).join(' ')}
                {t.stops.length > 3 ? ' ...' : ''}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
