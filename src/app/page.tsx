import type { Metadata } from 'next';
import { ExploreGrid } from '@/components/ExploreGrid';
import { FestivalCard } from '@/components/FestivalCard';
import { GoalPicker } from '@/components/GoalPicker';
import { LuckyNumberShortcut } from '@/components/LuckyNumberShortcut';
import { PhoneNumberShortcut } from '@/components/PhoneNumberShortcut';
import { PlacesForGoal } from '@/components/PlacesForGoal';
import { SectionHeader } from '@/components/SectionHeader';
import { ShirtColorCard } from '@/components/ShirtColorCard';
import { SiteHeader } from '@/components/SiteHeader';
import { festivalArticles, upcomingFestivals, withCover } from '@/lib/festivals';
import { FESTIVALS } from '@/data/festivals';
import { getFestivalCovers, listPublishedArticles } from '@/lib/articles-repo';
import { abroadPlaces, thaiPlaces } from '@/lib/places';
import { COUNTRIES } from '@/data/countries';
import Link from 'next/link';
import { PlaceImageBox } from '@/components/PlaceCard';
import { listPublishedPlaces } from '@/lib/places-repo';
import { listShirtOffers } from '@/lib/products-repo';
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
  const [allPlaces, shirts, covers, articles] = await Promise.all([
    listPublishedPlaces(),
    listShirtOffers(),
    getFestivalCovers(),
    listPublishedArticles(),
  ]);
  const upcoming = upcomingFestivals(today.iso, 45, FESTIVALS.map((f) => withCover(f, covers)));
  // หน้าแรกแสดงไม่เกิน 3 ใบ (ใกล้สุดก่อน) ที่เหลือดูได้ที่ /festival
  const festivals = upcoming.slice(0, 3);
  const readings = festivalArticles(articles, upcoming);
  const festivalName = new Map(upcoming.map((o) => [o.festival.slug, o.festival.name]));
  const places = thaiPlaces(allPlaces);
  const abroad = abroadPlaces(allPlaces);
  const abroadCountry = COUNTRIES.find((c) => abroad.some((p) => p.country === c.code));

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
      <section className="hero">
        {/* ภาพบรรยากาศ AI จากเจ้าของเว็บ (2026-10-12) ใช้เป็นภาพ hero เท่านั้น ห้ามใช้แทนภาพสถานที่จริง */}
        <img
          src="/images/hero/hero-prayer-1600.webp"
          srcSet="/images/hero/hero-prayer-900.webp 900w, /images/hero/hero-prayer-1600.webp 1600w"
          sizes="100vw"
          alt="หญิงสาวพนมมือไหว้ขอพรหน้าองค์เทพในศาลเจ้าจีน"
          className="hero__img"
          fetchPriority="high"
        />
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
          <ShirtColorCard weekday={today.weekday} shirts={shirts} />
          <LuckyNumberShortcut />
          <PhoneNumberShortcut />
        </div>
        {festivals.length > 0 && (
          <div>
            <SectionHeader title="เทศกาลที่กำลังจะมา" href="/festival" />
            <div className="stack">
              {festivals.map((o) => (
                <FestivalCard key={`${o.festival.slug}-${o.date.year}`} occurrence={o} />
              ))}
            </div>
            {readings.length > 0 && (
              <div className="home-reads">
                <h3 className="home-reads__title">อ่านรับเทศกาล</h3>
                <ul className="home-reads__list">
                  {readings.map((a) => (
                    <li key={a.slug}>
                      <Link href={`/articles/${a.slug}`} className="home-reads__item">
                        <span className="home-reads__name">{a.title}</span>
                        <span className="home-reads__meta">{festivalName.get(a.festival!)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
