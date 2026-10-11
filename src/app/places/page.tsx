import type { Metadata } from 'next';
import Link from 'next/link';
import { ComingSoon, PageHeader } from '@/components/ComingSoon';
import { PlacesBrowser } from '@/components/PlacesBrowser';
import { provincesWithPlaces, thaiPlaces } from '@/lib/places';
import { listPublishedPlaces } from '@/lib/places-repo';

export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: '/places' },
  title: 'สถานที่เสริมดวงในไทย',
  description: 'วัด ศาลเจ้า เทวาลัย ทั่วไทย แยกตามเรื่องที่อยากขอพร พร้อมเวลาเปิด ของไหว้ วิธีขอพรและแก้บน',
};

export default async function PlacesPage() {
  const places = thaiPlaces(await listPublishedPlaces());
  const provinces = provincesWithPlaces(places);
  // ยังไม่มีข้อมูลที่ตรวจแล้ว: แสดงหน้ากำลังเตรียมแทนรายการว่าง
  if (places.length === 0) {
    return (
      <main>
        <PageHeader title="สถานที่เสริมดวงในไทย" />
        <ComingSoon>
          <p>วัด ศาลเจ้า เทวาลัย ทั่วไทย พร้อมเวลาเปิด ของไหว้ วิธีขอพรและแก้บน</p>
        </ComingSoon>
      </main>
    );
  }
  return (
    <main>
      <PageHeader title="สถานที่เสริมดวงในไทย" />
      <div className="prose intro">
        <p>วัด ศาลเจ้า เทวาลัย ทั่วไทย เลือกเรื่องที่อยากขอพร แล้วดูว่าควรไปไหว้ที่ไหน ต้องเตรียมอะไร</p>
      </div>
      <PlacesBrowser places={places} />
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
