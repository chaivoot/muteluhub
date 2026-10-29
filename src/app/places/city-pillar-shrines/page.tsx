import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/ComingSoon';
import { getGoal } from '@/lib/goals';
import { cityPillarsByProvince, thaiPlaces } from '@/lib/places';
import { listPublishedPlaces } from '@/lib/places-repo';
import { SITE_URL } from '@/lib/site';

export const revalidate = 3600;

const CANONICAL = '/places/city-pillar-shrines';

export async function generateMetadata(): Promise<Metadata> {
  const groups = cityPillarsByProvince(thaiPlaces(await listPublishedPlaces()));
  const count = groups.reduce((n, g) => n + g.places.length, 0);
  return {
    alternates: { canonical: CANONICAL },
    title: `ศาลหลักเมืองทั่วไทย ${count} แห่ง ${groups.length} จังหวัด ขอพรเรื่องอะไร ไหว้อย่างไร`,
    description: `รวมศาลหลักเมืองประจำจังหวัดและศาลหลักเมืองเก่าแก่ทั่วไทย ${count} แห่ง ดูได้ว่าแต่ละที่ขอพรเรื่องอะไร ของไหว้ วิธีไหว้ และพิกัด`,
  };
}

/** หน้ารวมศาลหลักเมือง (hub สำหรับคำค้น ศาลหลักเมือง + ชื่อจังหวัด) */
export default async function CityPillarShrinesPage() {
  const groups = cityPillarsByProvince(thaiPlaces(await listPublishedPlaces()));
  const count = groups.reduce((n, g) => n + g.places.length, 0);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'ศาลหลักเมืองทั่วไทย',
    numberOfItems: count,
    itemListElement: groups
      .flatMap((g) => g.places)
      .map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: `${SITE_URL}/places/${p.slug}` })),
  };
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader title="ศาลหลักเมืองทั่วไทย" backHref="/places" />
      <div className="prose intro">
        <p>
          ศาลหลักเมืองประจำจังหวัดและศาลหลักเมืองเก่าแก่ของอำเภอ {count} แห่งใน {groups.length} จังหวัด
          กดเข้าไปดูว่าแต่ละที่ขอพรเรื่องอะไร เตรียมของไหว้อะไร และไหว้อย่างไร
        </p>
      </div>
      <nav className="container pillar-jump" aria-label="ไปที่จังหวัด">
        <ul className="chip-row chip-row--wrap">
          {groups.map((g) => (
            <li key={g.slug}>
              <a href={`#${g.slug}`} className="chip">
                {g.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="container pillar-list">
        {groups.map((g) => (
          <section key={g.slug} id={g.slug} className="pillar-list__group">
            <h2 className="pillar-list__province">
              <Link href={`/places/${g.slug}`}>{g.name}</Link>
            </h2>
            <ul className="pillar-list__items">
              {g.places.map((p) => (
                <li key={p.slug}>
                  <Link href={`/places/${p.slug}`} className="pillar-list__item">
                    <span className="pillar-list__name">{p.name}</span>
                    <span className="pillar-list__meta">
                      {[p.district, p.goals.length > 0 ? `ขอพรเรื่อง${p.goals.map((x) => getGoal(x).short).join(' ')}` : null]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
