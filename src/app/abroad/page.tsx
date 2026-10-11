import type { Metadata } from 'next';
import Link from 'next/link';
import { ComingSoon, PageHeader } from '@/components/ComingSoon';
import { PlaceImageBox } from '@/components/PlaceCard';
import { COUNTRIES } from '@/data/countries';
import { abroadPlaces } from '@/lib/places';
import { listPublishedPlaces } from '@/lib/places-repo';

export const metadata: Metadata = {
  alternates: { canonical: '/abroad' },
  title: 'มูต่างประเทศ',
  description: 'คู่มือทริปสายมูต่างประเทศ ศาลเจ้าและวัดที่คนไทยนิยมไปขอพร ญี่ปุ่น ฮ่องกง ไต้หวัน',
};

export const revalidate = 3600;

export default async function AbroadPage() {
  const places = abroadPlaces(await listPublishedPlaces());
  const countries = COUNTRIES.map((c) => ({ country: c, places: places.filter((p) => p.country === c.code) })).filter(
    (x) => x.places.length > 0,
  );

  if (countries.length === 0) {
    return (
      <main>
        <PageHeader title="มูต่างประเทศ" />
        <ComingSoon>
          <p>คู่มือทริปสายมูแยกตามประเทศ พร้อมสถานที่และที่พักใกล้ ๆ</p>
        </ComingSoon>
      </main>
    );
  }

  return (
    <main>
      <PageHeader title="มูต่างประเทศ" />
      <div className="prose intro">
        <p>คู่มือทริปสายมู เลือกประเทศ แล้วดูว่าที่ไหนขอพรเรื่องอะไร ต้องเตรียมอะไร</p>
      </div>
      <div className="stack container">
        {countries.map(({ country, places: ps }) => (
          <Link key={country.slug} href={`/abroad/${country.slug}`} className="abroad-card">
            <PlaceImageBox place={ps[0]} className="abroad-card__img" />
            <span className="abroad-card__body">
              <span className="abroad-card__eyebrow">มูต่างประเทศ</span>
              <span className="abroad-card__title">คู่มือทริปสายมู {country.name}</span>
              <span className="abroad-card__sub">
                {ps.length} แห่ง · {[...new Set(ps.map((p) => p.city).filter(Boolean))].join(' ')}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
