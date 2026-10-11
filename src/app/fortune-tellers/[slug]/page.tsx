import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { PageHeader } from '@/components/ComingSoon';
import { GoalTag } from '@/components/GoalTag';
import { TellerCard } from '@/components/TellerCard';
import { TellersBrowser } from '@/components/TellersBrowser';
import { CHANNEL_LABEL, type FortuneTeller } from '@/data/fortune-tellers';
import { PROVINCES } from '@/data/provinces';
import { tellerArtPath } from '@/lib/art/discipline-art';
import { getDiscipline } from '@/lib/disciplines';
import { getGoal } from '@/lib/goals';
import { SITE_URL } from '@/lib/site';
import { filterTellers, formatPrice, lineUrl, similarTellers, telUrl } from '@/lib/tellers';
import { listPublishedTellers } from '@/lib/tellers-repo';
import { parseIsoDay, TH_MONTHS, toBuddhistYear } from '@/lib/thai-date';

// /fortune-tellers/[slug] รับได้ทั้ง slug ศาสตร์ (หน้ารวมตามศาสตร์) และ slug หมอดู (หน้าโปรไฟล์)
// ข้อมูลจากฐานข้อมูล ห้ามตั้ง dynamicParams = false (ดู CLAUDE.md)
export const revalidate = 3600;

export async function generateStaticParams() {
  const tellers = await listPublishedTellers();
  const disciplines = new Set(tellers.flatMap((t) => t.disciplines));
  return [...tellers.map((t) => ({ slug: t.slug })), ...[...disciplines].map((slug) => ({ slug }))];
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const tellers = await listPublishedTellers();
  const teller = tellers.find((t) => t.slug === slug);
  if (teller) {
    const disciplines = teller.disciplines.map((d) => getDiscipline(d)?.name ?? d).join(' ');
    return {
      alternates: { canonical: `/fortune-tellers/${slug}` },
      title: `${teller.name} หมอดู${disciplines}`,
      description: teller.bio.slice(0, 160),
    };
  }
  const discipline = getDiscipline(slug);
  if (discipline && filterTellers({ discipline: slug }, tellers).length > 0) {
    return {
      alternates: { canonical: `/fortune-tellers/${slug}` },
      title: `หมอดู${discipline.name}`,
      description: `รวมหมอดูศาสตร์${discipline.name} กรองตามเรื่องที่อยากเสริม ช่องทาง จังหวัด และราคา`,
    };
  }
  return {};
}

export default async function TellerOrDisciplinePage({ params }: { params: Params }) {
  const { slug } = await params;
  const tellers = await listPublishedTellers();
  const teller = tellers.find((t) => t.slug === slug);
  if (teller) return <TellerProfile teller={teller} all={tellers} />;

  const discipline = getDiscipline(slug);
  const inDiscipline = filterTellers({ discipline: slug }, tellers);
  if (!discipline || inDiscipline.length === 0) notFound();
  return (
    <main>
      <PageHeader title={`หมอดู${discipline.name}`} backHref="/fortune-tellers" />
      <div className="prose intro">
        <p>
          ศาสตร์{discipline.name} ในหมวด{discipline.groupName}
        </p>
      </div>
      <Suspense>
        <TellersBrowser tellers={inDiscipline} fixedDiscipline={slug} />
      </Suspense>
    </main>
  );
}

function formatCheckedAt(iso: string) {
  const d = parseIsoDay(iso);
  return `${d.day} ${TH_MONTHS[d.month - 1]} ${toBuddhistYear(d.year)}`;
}

function TellerProfile({ teller, all }: { teller: FortuneTeller; all: FortuneTeller[] }) {
  const primary = getDiscipline(teller.disciplines[0]);
  const { contact } = teller;
  const similar = similarTellers(teller, all);
  const location = [teller.district, teller.provinceSlug ? PROVINCES[teller.provinceSlug] : null].filter(Boolean).join(' ');
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: teller.name,
    description: teller.bio,
    url: `${SITE_URL}/fortune-tellers/${teller.slug}`,
    telephone: contact.phone,
    address: teller.provinceSlug ? { '@type': 'PostalAddress', addressRegion: PROVINCES[teller.provinceSlug], addressCountry: 'TH' } : undefined,
    sameAs: [contact.facebook, contact.instagram, contact.tiktok, contact.youtube, contact.website].filter(Boolean),
  };

  const contacts: { href: string; label: string; external: boolean }[] = [
    contact.line ? { href: lineUrl(contact.line), label: `LINE: ${contact.line}`, external: true } : null,
    contact.phone ? { href: telUrl(contact.phone), label: `โทร ${contact.phone}`, external: false } : null,
    contact.facebook ? { href: contact.facebook, label: 'Facebook', external: true } : null,
    contact.instagram ? { href: contact.instagram, label: 'Instagram', external: true } : null,
    contact.tiktok ? { href: contact.tiktok, label: 'TikTok', external: true } : null,
    contact.youtube ? { href: contact.youtube, label: 'YouTube', external: true } : null,
    contact.website ? { href: contact.website, label: 'เว็บไซต์', external: true } : null,
  ].filter((c): c is { href: string; label: string; external: boolean } => c !== null);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader title="หมอดู" backHref="/fortune-tellers" asHeading={false} />
      <div className="teller-hero">
        <img
          src={tellerArtPath(teller)}
          alt={`ภาพประกอบศาสตร์${primary?.name ?? ''}`}
          className="teller-hero__img"
          width={180}
          height={180}
        />
        <h1 className="teller-hero__name">{teller.name}</h1>
        <div className="tag-row">
          {teller.disciplines.map((d) => (
            <Link key={d} href={`/fortune-tellers/${d}`} className="tag tag--discipline">
              {getDiscipline(d)?.name ?? d}
            </Link>
          ))}
        </div>
      </div>

      <div className="container place__body">
        <p className="place__summary">{teller.bio}</p>

        <dl className="info-list">
          <div>
            <dt>ช่องทาง</dt>
            <dd>{teller.channels.map((c) => CHANNEL_LABEL[c]).join(' · ')}</dd>
          </div>
          {location && (
            <div>
              <dt>ที่ตั้ง</dt>
              <dd>
                {location}
                {teller.mapsUrl && (
                  <>
                    {' · '}
                    <a href={teller.mapsUrl} target="_blank" rel="noopener noreferrer">
                      เปิดแผนที่
                    </a>
                  </>
                )}
              </dd>
            </div>
          )}
          {(teller.priceFrom != null || teller.priceNote) && (
            <div>
              <dt>ราคา</dt>
              <dd>
                {teller.priceFrom != null && `เริ่ม ${formatPrice(teller.priceFrom)}`}
                {teller.priceFrom != null && teller.priceNote && ' · '}
                {teller.priceNote}
              </dd>
            </div>
          )}
          {teller.hours && (
            <div>
              <dt>เวลา</dt>
              <dd>{teller.hours}</dd>
            </div>
          )}
        </dl>

        <section>
          <h2 className="place__h2">ถนัดเรื่อง</h2>
          <div className="tag-row">
            {teller.goals.map((g) => (
              <GoalTag key={g} goal={getGoal(g)} />
            ))}
          </div>
        </section>

        {contacts.length > 0 && (
          <section>
            <h2 className="place__h2">ติดต่อ</h2>
            <div className="contact-list">
              {contacts.map((c, i) => (
                <a
                  key={c.href}
                  href={c.href}
                  className={`btn contact-btn ${i === 0 ? 'btn--gold' : 'btn--outline'}`}
                  {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {c.label}
                </a>
              ))}
            </div>
          </section>
        )}

        <Link href={`/ai-prompts/${teller.goals[0]}`} className="shortcut-card shortcut-card--flush">
          <span className="shortcut-card__body">
            <span className="shortcut-card__title">เตรียมคำถามก่อนไปดูดวง</span>
            <span className="shortcut-card__sub">ใช้ prompt ช่วยเรียบเรียงเรื่องที่อยากถามกับ AI</span>
          </span>
        </Link>

        <section className="place__sources">
          <p>ตรวจข้อมูลล่าสุด {formatCheckedAt(teller.checkedAt)} · ราคาและช่องทางอาจเปลี่ยน ควรสอบถามก่อนนัด</p>
          <p className="claim-note">
            {teller.claimed ? 'ข้อมูลนี้ยืนยันโดยเจ้าของ' : 'ภาพเป็นภาพประกอบตามศาสตร์ ไม่ใช่ภาพของหมอดูท่านนี้'}
          </p>
          {teller.sources.length > 0 && (
            <details>
              <summary>แหล่งข้อมูล</summary>
              <ul>
                {teller.sources.map((s) => (
                  <li key={s}>
                    <a href={s} target="_blank" rel="noopener noreferrer">
                      {new URL(s).hostname.replace(/^www\./, '')}
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </section>
      </div>

      {similar.length > 0 && (
        <section>
          <div className="section-header">
            <h2 className="section-header__title">หมอดูที่คล้ายกัน</h2>
          </div>
          <div className="stack container">
            {similar.map((t) => (
              <TellerCard key={t.slug} teller={t} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
