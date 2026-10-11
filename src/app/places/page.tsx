import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/ComingSoon';
import { PlacesBrowser } from '@/components/PlacesBrowser';
import { PLACES } from '@/data/places';
import { provincesWithPlaces } from '@/lib/places';

export const metadata: Metadata = {
  title: 'สถานที่เสริมดวงในไทย',
  description: 'วัด ศาลเจ้า เทวาลัย ทั่วไทย แยกตามเรื่องที่อยากขอพร พร้อมเวลาเปิด ของไหว้ วิธีขอพรและแก้บน',
};

export default function PlacesPage() {
  const provinces = provincesWithPlaces();
  return (
    <main>
      <PageHeader title="สถานที่เสริมดวงในไทย" />
      <div className="prose intro">
        <p>วัด ศาลเจ้า เทวาลัย ทั่วไทย เลือกเรื่องที่อยากขอพร แล้วดูว่าควรไปไหว้ที่ไหน ต้องเตรียมอะไร</p>
      </div>
      <PlacesBrowser places={PLACES} />
      {provinces.length > 0 && (
        <section className="container">
          <div className="section-header section-header--flush">
            <h2 className="section-header__title">ดูตามจังหวัด</h2>
          </div>
          <ul className="chip-row chip-row--wrap">
            {provinces.map((p) => (
              <li key={p.slug}>
                <Link href={`/places/${p.slug}`} className="chip">
                  {p.name} ({p.count})
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
