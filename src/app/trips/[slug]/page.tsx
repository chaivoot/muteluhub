import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/ComingSoon';
import { GoalTag } from '@/components/GoalTag';
import { LodgingBlock } from '@/components/LodgingBlock';
import { provinceShortName } from '@/data/provinces';
import { getTrip, TEMPLE_TRIPS } from '@/data/temple-trips';
import { lodgingLink } from '@/lib/booking';
import { getGoal } from '@/lib/goals';
import { listPublishedPlaces } from '@/lib/places-repo';
import { SITE_URL } from '@/lib/site';
import { parseIsoDay, TH_MONTHS, toBuddhistYear } from '@/lib/thai-date';

// ลิงก์ไปหน้าสถานที่อ่านจากฐานข้อมูล ห้ามตั้ง dynamicParams = false (ดู CLAUDE.md)
export const revalidate = 3600;

export function generateStaticParams() {
  return TEMPLE_TRIPS.map((t) => ({ slug: t.slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const trip = getTrip(slug);
  if (!trip) return {};
  return {
    alternates: { canonical: `/trips/${slug}` },
    title: trip.seoTitle,
    description: trip.description.slice(0, 160),
  };
}

const checked = (iso: string) => {
  const d = parseIsoDay(iso);
  return `${d.day} ${TH_MONTHS[d.month - 1]} ${toBuddhistYear(d.year)}`;
};

export default async function TripPage({ params }: { params: Params }) {
  const { slug } = await params;
  const trip = getTrip(slug);
  if (!trip) notFound();
  const published = new Set((await listPublishedPlaces()).map((p) => p.slug));
  const lodging = lodgingLink({ country: 'TH', provinceSlug: trip.provinceSlug });
  const others = TEMPLE_TRIPS.filter((t) => t.slug !== trip.slug);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: trip.name,
    description: trip.description,
    url: `${SITE_URL}/trips/${trip.slug}`,
    touristType: 'สายมู ไหว้พระขอพร',
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: trip.stops.length,
      itemListElement: trip.stops.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'TouristAttraction',
          name: s.name,
          description: s.why,
          ...(s.place && published.has(s.place) ? { url: `${SITE_URL}/places/${s.place}` } : {}),
        },
      })),
    },
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader title={trip.name} backHref="/trips" />
      <div className="container place__body">
        <p className="place__summary">{trip.intro}</p>
        <div className="tag-row">
          <span className="tag">{trip.duration}</span>
          <span className="tag">{trip.stops.length} จุด</span>
          {trip.goals.map((g) => (
            <GoalTag key={g} goal={getGoal(g)} />
          ))}
        </div>
        {trip.howToGo && (
          <section>
            <h2 className="place__h2">เส้นทาง</h2>
            <p>{trip.howToGo}</p>
          </section>
        )}
        <section>
          <h2 className="place__h2">ไปที่ไหนบ้าง ทำไมต้องไป</h2>
          <ol className="fest-steps">
            {trip.stops.map((s) => (
              <li key={s.name}>
                <div className="venue__name">
                  {s.place && published.has(s.place) ? <Link href={`/places/${s.place}`}>{s.name}</Link> : s.name}
                  {s.area && <span className="note"> · {s.area}</span>}
                </div>
                <p className="venue__desc">{s.why}</p>
                {s.note && <p className="note">{s.note}</p>}
              </li>
            ))}
          </ol>
        </section>
        {trip.tips.length > 0 && (
          <section>
            <h2 className="place__h2">ก่อนไป</h2>
            <ul className="bullet-list">
              {trip.tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </section>
        )}
        {lodging && (
          <LodgingBlock
            href={lodging.href}
            slug={`trip-${trip.slug}`}
            title={`ที่พักใน${provinceShortName(trip.provinceSlug)}`}
            note="ไหว้หลายวัดไม่ต้องรีบ ค้างคืนแล้วไปต่อวันรุ่งขึ้นได้"
          />
        )}
        <p className="note">
          <Link href={`/places/${trip.provinceSlug}`}>ดูสถานที่เสริมดวงทั้งหมดใน{provinceShortName(trip.provinceSlug)}</Link>
        </p>
        <section className="place__sources">
          <p>
            ตรวจข้อมูลล่าสุด {checked(trip.checkedAt)} · ความหมายของแต่ละวัดเป็นความเชื่อที่เล่าต่อกันมา เวลาเปิดอาจเปลี่ยน ควรเช็กก่อนไป
          </p>
          <details>
            <summary>แหล่งข้อมูล</summary>
            <ul>
              {[...new Set([...trip.sources, ...trip.stops.map((s) => s.source)])].map((s) => (
                <li key={s}>
                  <a href={s} target="_blank" rel="noopener noreferrer">
                    {new URL(s).hostname.replace(/^www\./, '')}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        </section>
      </div>
      {others.length > 0 && (
        <section className="container">
          <h2 className="place__h2">ทริปไหว้พระจังหวัดอื่น</h2>
          <ul className="home-reads__list">
            {others.map((t) => (
              <li key={t.slug}>
                <Link href={`/trips/${t.slug}`} className="home-reads__item">
                  <span className="home-reads__name">{t.name}</span>
                  <span className="home-reads__meta">
                    {t.duration} · {t.stops.length} จุด
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
