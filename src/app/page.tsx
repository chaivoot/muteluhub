import type { Metadata } from 'next';
import { ExploreGrid } from '@/components/ExploreGrid';
import { FestivalCard } from '@/components/FestivalCard';
import { GoalPicker } from '@/components/GoalPicker';
import { LuckyNumberShortcut } from '@/components/LuckyNumberShortcut';
import { PlacesForGoal } from '@/components/PlacesForGoal';
import { SectionHeader } from '@/components/SectionHeader';
import { ShirtColorCard } from '@/components/ShirtColorCard';
import { SiteHeader } from '@/components/SiteHeader';
import { upcomingFestivals } from '@/lib/festivals';
import { abroadPlaces, thaiPlaces } from '@/lib/places';
import { COUNTRIES } from '@/data/countries';
import Link from 'next/link';
import { PlaceImageBox } from '@/components/PlaceCard';
import { listPublishedPlaces } from '@/lib/places-repo';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';
import { bangkokDay, formatThaiFullDate } from '@/lib/thai-date';

// วันที่ สีเสื้อ และเทศกาลขึ้นกับวัน จึงสร้างหน้าใหม่ทุก 10 นาที
export const revalidate = 600;

export const metadata: Metadata = { alternates: { canonical: '/' } };

// บอก Google ชื่อเว็บ (แสดงใต้ผลค้นหา) และเจ้าของเว็บ
const siteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: SITE_URL, name: SITE_NAME, alternateName: 'มูเตลูฮับ', inLanguage: 'th-TH', description: SITE_DESCRIPTION },
    { '@type': 'Organization', '@id': `${SITE_URL}/#org`, url: SITE_URL, name: SITE_NAME },
  ],
};

export default async function HomePage() {
  const today = bangkokDay();
  const festivals = upcomingFestivals(today.iso);
  const allPlaces = await listPublishedPlaces();
  const places = thaiPlaces(allPlaces);
  const abroad = abroadPlaces(allPlaces);
  const abroadCountry = COUNTRIES.find((c) => abroad.some((p) => p.country === c.code));

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
      <section className="hero">
        {/* TODO: ภาพบรรยากาศจริงพร้อมเครดิต (ห้ามใช้ภาพตัวอย่างใน design/mockups/images) */}
        <div className="hero__art" aria-hidden="true" />
        <div className="hero__scrim" aria-hidden="true" />
        <SiteHeader overlay />
        <div className="hero__content">
          <p className="hero__date">{formatThaiFullDate(today)}</p>
          <h1 className="hero__title">
            วันนี้อยากเสริม
            <br />
            เรื่องอะไร
          </h1>
        </div>
      </section>

      <GoalPicker />

      <div className="home-split">
        <div>
          <ShirtColorCard weekday={today.weekday} />
          <LuckyNumberShortcut />
        </div>
        {festivals.length > 0 && (
          <div>
            <SectionHeader title="เทศกาลที่กำลังจะมา" />
            <div className="stack">
              {festivals.map((o) => (
                <FestivalCard key={`${o.festival.slug}-${o.date.year}`} occurrence={o} />
              ))}
            </div>
          </div>
        )}
      </div>

      <PlacesForGoal places={places} />

      {abroadCountry && (
        <div className="container home-abroad">
          <Link href={`/abroad/${abroadCountry.slug}`} className="abroad-card">
            <PlaceImageBox place={abroad.find((p) => p.country === abroadCountry.code)!} className="abroad-card__img" />
            <span className="abroad-card__body">
              <span className="abroad-card__eyebrow">มูต่างประเทศ</span>
              <span className="abroad-card__title">คู่มือทริปสายมู {abroadCountry.name}</span>
              <span className="abroad-card__sub">ศาลเจ้า เป้าหมาย ที่พักใกล้ ๆ</span>
            </span>
          </Link>
        </div>
      )}

      <SectionHeader title="มูเรื่องไหนดี" />
      <ExploreGrid />
    </main>
  );
}
