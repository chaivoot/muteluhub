import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { PageHeader } from '@/components/ComingSoon';
import { LodgingBlock } from '@/components/LodgingBlock';
import { PlacesBrowser } from '@/components/PlacesBrowser';
import { COUNTRIES, getCountry } from '@/data/countries';
import { listPublishedArticles } from '@/lib/articles-repo';
import { lodgingLink } from '@/lib/booking';
import { Markdown } from '@/lib/markdown';
import { abroadPlaces, placesByGoal, placeShortName } from '@/lib/places';
import { listPublishedPlaces } from '@/lib/places-repo';

// ข้อมูลจากฐานข้อมูล ห้ามตั้ง dynamicParams = false (ดู CLAUDE.md)
export const revalidate = 3600;

export function generateStaticParams() {
  return COUNTRIES.map((c) => ({ country: c.slug }));
}

type Params = Promise<{ country: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { country } = await params;
  const c = getCountry(country);
  if (!c) return {};
  return {
    alternates: { canonical: `/abroad/${country}` },
    title: c.seoTitle ?? `มู${c.name} คู่มือทริปสายมู ขอพรที่ไหนดี`,
    description: (c.seoDescription ?? c.intro).slice(0, 160),
  };
}

export default async function CountryPage({ params }: { params: Params }) {
  const { country } = await params;
  const c = getCountry(country);
  if (!c) notFound();
  const places = abroadPlaces(await listPublishedPlaces(), c.code);
  if (places.length === 0) notFound();
  // ที่พักแยกตามเมืองที่มีสถานที่ (เมืองที่ Traveloka ไม่มีหน้าไม่แสดง)
  const cities = [...new Set(places.map((p) => p.city).filter((x): x is string => !!x))];
  const stays = cities
    .map((city) => ({ city, link: lodgingLink({ country: c.code, city }) }))
    .filter((x): x is { city: string; link: NonNullable<ReturnType<typeof lodgingLink>> } => x.link != null);
  const byGoal = placesByGoal(places);
  const reads = c.articles?.length
    ? (await listPublishedArticles()).filter((a) => c.articles!.includes(a.slug)).sort((a, b) => c.articles!.indexOf(a.slug) - c.articles!.indexOf(b.slug))
    : [];

  return (
    <main>
      <PageHeader title={`มู${c.name}`} backHref="/abroad" />
      <div className="prose intro">
        <p>{c.intro}</p>
      </div>
      {byGoal.length > 1 && (
        <section className="container goal-picks" aria-labelledby="goal-picks-title">
          <h2 id="goal-picks-title" className="goal-picks__title">
            อยากขอเรื่องไหน ไปที่ไหนดี
          </h2>
          <dl className="goal-picks__list">
            {byGoal.map((row) => (
              <div key={row.key}>
                <dt>{row.label}</dt>
                <dd>
                  {row.places.map((p, i) => (
                    <span key={p.slug}>
                      {i > 0 && ' · '}
                      <Link href={`/places/${p.slug}`}>{placeShortName(p)}</Link>
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}
      <Suspense>
        <PlacesBrowser places={places} groupBy="city" />
      </Suspense>
      {c.guide && (
        <section className="container place__body">
          <div className="reading">
            <Markdown source={c.guide} />
          </div>
        </section>
      )}
      {reads.length > 0 && (
        <div className="container home-reads">
          <h2 className="home-reads__title">อ่านก่อนไปมู{c.name}</h2>
          <ul className="home-reads__list">
            {reads.map((a) => (
              <li key={a.slug}>
                <Link href={`/articles/${a.slug}`} className="home-reads__item">
                  <span className="home-reads__name">{a.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {stays.map(({ city, link }) => (
        <div key={city} className="container">
          <LodgingBlock
            href={link.href}
            slug={`abroad-${country}`}
            title={`ที่พักใน${city}`}
            note={`วางแผนทริปมู${c.name} เทียบราคาโรงแรมใน${city}ได้บน Traveloka`}
          />
        </div>
      ))}
      <p className="container note abroad-note">
        เวลาเปิด ค่าเข้า และกฎการถ่ายรูปของแต่ละแห่งเปลี่ยนได้ ควรเช็กเว็บไซต์ทางการก่อนเดินทาง
      </p>
    </main>
  );
}
