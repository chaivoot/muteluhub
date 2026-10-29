import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs, PageHeader } from '@/components/ComingSoon';
import { placeholderFor } from '@/lib/place-placeholder';
import { SiteHeader } from '@/components/SiteHeader';
import { CreditBadge } from '@/components/CreditBadge';
import { GoalTag } from '@/components/GoalTag';
import { PlaceCard } from '@/components/PlaceCard';
import { PlacesBrowser } from '@/components/PlacesBrowser';
import { PLACE_TYPE_LABEL, type Place } from '@/data/places';
import { PROVINCES, provinceShortName } from '@/data/provinces';
import { agodaLink, agodaNearPlace } from '@/lib/agoda';
import { LodgingBlock } from '@/components/LodgingBlock';
import { getGoal } from '@/lib/goals';
import { countryByCode } from '@/data/countries';
import { filterPlaces, isCityPillarShrine, mapLink, placeLocation, provincesWithPlaces, relatedPlaces, thaiPlaces } from '@/lib/places';
import { listPublishedPlaces } from '@/lib/places-repo';
import { SITE_URL } from '@/lib/site';
import { parseIsoDay, TH_MONTHS, toBuddhistYear } from '@/lib/thai-date';

// /places/[slug] รับได้ทั้ง slug จังหวัด (หน้าจังหวัด) และ slug สถานที่ (หน้าสถานที่)
// ข้อมูลมาจากฐานข้อมูล สถานที่ที่นำเข้าใหม่จะสร้างหน้าเมื่อมีคนเปิดครั้งแรก
export const revalidate = 3600;

export async function generateStaticParams() {
  const places = await listPublishedPlaces();
  return [...places.map((p) => ({ slug: p.slug })), ...provincesWithPlaces(thaiPlaces(places)).map((p) => ({ slug: p.slug }))];
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const places = await listPublishedPlaces();
  const place = places.find((p) => p.slug === slug);
  if (place) {
    const goals = place.goals.map((g) => getGoal(g).short).join(' ');
    return {
      alternates: { canonical: `/places/${slug}` },
      title: `${place.name} ขอพรเรื่องอะไร ไหว้อย่างไร`,
      // ผลค้นหาส่วนใหญ่ถาม ขอพรเรื่องอะไร ขึ้นต้นด้วยคำตอบก่อน ตามด้วยของไหว้และคำอธิบาย
      description: [
        goals ? `ขอพรเด่นเรื่อง${goals}` : null,
        place.offerings.length > 0 ? `ของไหว้ ${place.offerings.slice(0, 3).join(' ')}` : null,
        place.summary,
      ]
        .filter(Boolean)
        .join(' · ')
        .slice(0, 160),
      openGraph: place.images[0] ? { images: [{ url: place.images[0].src, alt: place.images[0].alt }] } : undefined,
    };
  }
  if (PROVINCES[slug] && places.some((p) => p.provinceSlug === slug)) {
    return {
      alternates: { canonical: `/places/${slug}` },
      title: `สถานที่เสริมดวง${PROVINCES[slug]}`,
      description: `วัด ศาลเจ้า สถานที่ขอพรใน${PROVINCES[slug]} พร้อมของไหว้และวิธีขอพร`,
    };
  }
  return {};
}

export default async function PlaceOrProvincePage({ params }: { params: Params }) {
  const { slug } = await params;
  const places = await listPublishedPlaces();
  const place = places.find((p) => p.slug === slug);
  if (place) return <PlaceDetail place={place} places={places} />;
  const inProvince = filterPlaces({ province: slug }, thaiPlaces(places));
  if (PROVINCES[slug] && inProvince.length > 0) {
    const provinceAgoda = agodaLink({ country: 'TH', provinceSlug: slug });
    return (
      <main>
        <PageHeader title={`มู${provinceShortName(slug)}`} backHref="/places" />
        <div className="prose intro">
          <p>สถานที่เสริมดวงใน{PROVINCES[slug]}</p>
        </div>
        <PlacesBrowser places={inProvince} fixedProvince={slug} />
        {inProvince.some(isCityPillarShrine) && (
          <p className="container note">
            <Link href={`/places/city-pillar-shrines#${slug}`}>ดูศาลหลักเมืองจังหวัดอื่น ๆ ทั่วไทย</Link>
          </p>
        )}
        {provinceAgoda && (
          <div className="container">
            <LodgingBlock
              href={provinceAgoda}
              slug={slug}
              title={`ที่พักใน${provinceShortName(slug)}`}
              note="สายมูที่ต้องเดินทางไกล หาที่พักไว้ก่อน ไหว้ได้หลายที่ไม่ต้องรีบ"
            />
          </div>
        )}
      </main>
    );
  }
  notFound();
}

function formatCheckedAt(iso: string) {
  const d = parseIsoDay(iso);
  return `${d.day} ${TH_MONTHS[d.month - 1]} ${toBuddhistYear(d.year)}`;
}

function PlaceDetail({ place, places }: { place: Place; places: Place[] }) {
  const image = place.images[0];
  const map = mapLink(place);
  const agoda = agodaLink(place);
  const related = relatedPlaces(place, 4, places);
  const country = countryByCode(place.country);
  const crumbs =
    place.country === 'TH'
      ? [
          { href: '/places', label: 'สถานที่เสริมดวง' },
          ...(place.provinceSlug ? [{ href: `/places/${place.provinceSlug}`, label: provinceShortName(place.provinceSlug) }] : []),
        ]
      : [
          { href: '/abroad', label: 'มูต่างประเทศ' },
          ...(country ? [{ href: `/abroad/${country.slug}`, label: country.name }] : []),
        ];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': place.type === 'temple' ? 'BuddhistTemple' : 'PlaceOfWorship',
    name: place.name,
    alternateName: place.nameEn,
    description: place.summary,
    url: `${SITE_URL}/places/${place.slug}`,
    image: image?.src,
    address: {
      '@type': 'PostalAddress',
      addressRegion: place.provinceSlug ? PROVINCES[place.provinceSlug] : undefined,
      addressLocality: place.city,
      addressCountry: place.country,
    },
    geo: place.lat != null ? { '@type': 'GeoCoordinates', latitude: place.lat, longitude: place.lng } : undefined,
  };

  return (
    <main className="place">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader />
      <div className="place-hero">
        {image ? (
          <img src={image.src} alt={image.alt} className="place-hero__img" />
        ) : (
          <img
            src={placeholderFor(place).src}
            srcSet={`${placeholderFor(place).srcSmall} 600w, ${placeholderFor(place).src} 1200w`}
            sizes="100vw"
            alt={placeholderFor(place).alt}
            className="place-hero__img place-img-placeholder"
          />
        )}
        <span className="place-hero__scrim" aria-hidden="true" />
        <CreditBadge credit={image ? `${image.author} / ${image.license}` : placeholderFor(place).credit} position="top-right" />
        <div className="place-hero__text">
          <span className="place-hero__type">
            {PLACE_TYPE_LABEL[place.type]} · {placeLocation(place)}
          </span>
          <h1 className="place-hero__name">{place.name}</h1>
        </div>
      </div>

      <div className="container place__body">
        <Breadcrumbs items={crumbs} />
        <div className="tag-row">
          {place.deities.map((d) => (
            <span key={d} className="tag tag--discipline">
              {d}
            </span>
          ))}
          {place.goals.map((g) => (
            <GoalTag key={g} goal={getGoal(g)} />
          ))}
        </div>
        <p className="place__summary">{place.summary}</p>

        <dl className="info-list">
          {place.openingHours && (
            <div>
              <dt>เวลาเปิด</dt>
              <dd>{place.openingHours}</dd>
            </div>
          )}
          <div>
            <dt>ที่ตั้ง</dt>
            <dd>
              {place.country === 'TH'
                ? [place.district, place.provinceSlug && PROVINCES[place.provinceSlug]].filter(Boolean).join(' ')
                : [place.district, place.city, countryByCode(place.country)?.name].filter(Boolean).join(' ')}
              {map && (
                <>
                  {' · '}
                  <a href={map} target="_blank" rel="noopener noreferrer">
                    เปิดแผนที่
                  </a>
                </>
              )}
            </dd>
          </div>
        </dl>

        <section>
          <h2 className="place__h2">ขอพรเรื่องอะไรได้บ้าง</h2>
          <ul className="chip-row chip-row--wrap">
            {place.goals.map((g) => {
              const goal = getGoal(g);
              return (
                <li key={g}>
                  <Link href={`/${g}`} className="chip" style={{ borderColor: goal.chipBorder, color: goal.chipText }}>
                    {goal.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {place.offerings.length > 0 && (
          <section>
            <h2 className="place__h2">ของไหว้ที่ต้องเตรียม</h2>
            <ul className="bullet-list">
              {place.offerings.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </section>
        )}

        {place.howToPray.length > 0 && (
          <section>
            <h2 className="place__h2">วิธีขอพร</h2>
            <ol className="step-list">
              {place.howToPray.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </section>
        )}

        {place.howToRepayVow.length > 0 && (
          <section>
            <h2 className="place__h2">วิธีแก้บน</h2>
            <ul className="bullet-list">
              {place.howToRepayVow.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>
        )}

        {agoda && (
          <LodgingBlock
            href={agoda}
            slug={place.slug}
            title={`ที่พักใกล้${place.name}`}
            note={
              agodaNearPlace(place.slug)
                ? 'มาไหว้แล้วค้างต่อ เทียบราคาโรงแรมและที่พักรอบ ๆ ได้บน Agoda'
                : `เทียบราคาที่พักใน${placeLocation(place, false)}บน Agoda`
            }
          />
        )}

        <section className="place__sources">
          <p>ตรวจข้อมูลล่าสุด {formatCheckedAt(place.checkedAt)} · เวลาเปิดและธรรมเนียมอาจเปลี่ยน ควรเช็กกับสถานที่อีกครั้ง</p>
          {place.sources.length > 0 && (
            <details>
              <summary>แหล่งข้อมูล</summary>
              <ul>
                {place.sources.map((s) => (
                  <li key={s}>
                    <a href={s} target="_blank" rel="noopener noreferrer">
                      {new URL(s).hostname.replace(/^www\./, '')}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          )}
          {image && (
            <p>
              ภาพ:{' '}
              {image.sourceUrl ? (
                <a href={image.sourceUrl} target="_blank" rel="noopener noreferrer">
                  {image.author}
                </a>
              ) : (
                image.author
              )}{' '}
              / {image.license}
            </p>
          )}
        </section>
        {isCityPillarShrine(place) && (
          <p className="note">
            <Link href={`/places/city-pillar-shrines${place.provinceSlug ? `#${place.provinceSlug}` : ''}`}>
              ดูศาลหลักเมืองทุกจังหวัดทั่วไทย
            </Link>
          </p>
        )}
      </div>

      {related.length > 0 && (
        <section>
          <div className="section-header">
            <h2 className="section-header__title">ที่อื่นที่น่าไป</h2>
          </div>
          <div className="carousel">
            {related.map((p) => (
              <PlaceCard key={p.slug} place={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
