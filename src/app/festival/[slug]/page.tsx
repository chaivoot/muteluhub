import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ComingSoon } from '@/components/ComingSoon';
import { CreditBadge } from '@/components/CreditBadge';
import { GoalTag } from '@/components/GoalTag';
import { UiIcon } from '@/components/icons';
import { FESTIVALS, type Festival, type FestivalDate } from '@/data/festivals';
import { currentFestivalDate, festivalPhase, getFestival } from '@/lib/festivals';
import { getGoal } from '@/lib/goals';
import { SITE_URL } from '@/lib/site';
import { bangkokDay, formatThaiRange, parseIsoDay, TH_MONTHS, TH_WEEKDAYS, toBuddhistYear } from '@/lib/thai-date';

// ไม่ตั้ง dynamicParams = false ร่วมกับ revalidate (Next 15 ตอบ 404 ตอนสร้างหน้าใหม่) slug ที่ไม่รู้จัก notFound() ด้านล่าง
// สถานะ "วันที่ X ของเทศกาล" เปลี่ยนทุกวัน
export const revalidate = 600;

export function generateStaticParams() {
  return FESTIVALS.map((f) => ({ slug: f.slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const festival = getFestival(slug);
  if (!festival) return {};
  const date = currentFestivalDate(festival, bangkokDay().iso);
  // URL ไม่มีปี แต่ใส่ปีใน title ได้ (spec ข้อ 3.7)
  const year = date ? ` ${toBuddhistYear(date.year)}` : '';
  const when = date ? ` ${formatThaiRange(date.start, date.end, true)}` : '';
  return {
    title: `${festival.name}${year} วันไหน ข้อควรรู้ และงานทั่วไทย`,
    description: `${festival.name}${year}${when} ${festival.content?.intro ?? festival.tagline}`.slice(0, 160),
  };
}

const fullDate = (iso: string) => {
  const d = parseIsoDay(iso);
  return `วัน${TH_WEEKDAYS[d.weekday]} ${d.day} ${TH_MONTHS[d.month - 1]} ${toBuddhistYear(d.year)}`;
};

function PhaseBadge({ date, todayIso }: { date: FestivalDate; todayIso: string }) {
  const p = festivalPhase(date, todayIso);
  if (p.phase === 'ongoing') return <span className="pill pill--vermilion">วันนี้วันที่ {p.day} จาก {p.totalDays} วัน</span>;
  if (p.phase === 'prep') return <span className="pill pill--vermilion">วันนี้วันล้างท้อง</span>;
  if (p.phase === 'upcoming') return <span className="pill pill--gold">อีก {p.daysUntil} วัน</span>;
  return <span className="pill pill--gold">จบแล้วสำหรับปีนี้</span>;
}

export default async function FestivalPage({ params }: { params: Params }) {
  const { slug } = await params;
  const festival = getFestival(slug);
  if (!festival) notFound();
  const today = bangkokDay();
  const date = currentFestivalDate(festival, today.iso);
  const c = festival.content;

  return (
    <main>
      <FestivalJsonLd festival={festival} date={date} />
      <div className="fest-hero">
        {festival.image ? (
          <img src={festival.image.src} alt={festival.image.alt} className="festival-card__img" />
        ) : (
          <span className="festival-card__art" aria-hidden="true" />
        )}
        <span className="fest-hero__scrim" aria-hidden="true" />
        {festival.image && <CreditBadge credit={festival.image.credit} position="top-right" />}
        <div className="place-hero__top">
          <Link href="/" className="icon-btn icon-btn--glass" aria-label="ย้อนกลับ">
            <UiIcon name="back" size={22} strokeWidth={2} />
          </Link>
        </div>
        <div className="fest-hero__text">
          {date && (
            <div className="fest-hero__badges">
              <span className="pill pill--gold">{formatThaiRange(date.start, date.end, true)}</span>
              <PhaseBadge date={date} todayIso={today.iso} />
            </div>
          )}
          <h1 className="place-hero__name">
            {festival.name}
            {date ? ` ${toBuddhistYear(date.year)}` : ''}
          </h1>
        </div>
      </div>

      {!c ? (
        <ComingSoon>
          <p>{festival.tagline}</p>
        </ComingSoon>
      ) : (
        <div className="container place__body">
          <p className="place__summary">{c.intro}</p>
          <div className="tag-row">
            {festival.goals.map((g) => (
              <GoalTag key={g} goal={getGoal(g)} />
            ))}
          </div>

          {date && (
            <section>
              <h2 className="place__h2">วันสำคัญ</h2>
              <dl className="info-list">
                {date.prep && (
                  <div>
                    <dt>ล้างท้อง</dt>
                    <dd>{fullDate(date.prep)}</dd>
                  </div>
                )}
                <div>
                  <dt>วันแรก</dt>
                  <dd>{fullDate(date.start)}</dd>
                </div>
                <div>
                  <dt>วันสุดท้าย</dt>
                  <dd>{fullDate(date.end)}</dd>
                </div>
              </dl>
              {c.lunarNote && <p className="note fest-note">{c.lunarNote}</p>}
            </section>
          )}

          <section>
            <h2 className="place__h2">ข้อควรปฏิบัติ</h2>
            <ul className="bullet-list">
              {c.rules.map((r) => (
                <li key={r.text}>{r.text}</li>
              ))}
            </ul>
          </section>

          {c.specialList && (
            <section>
              <h2 className="place__h2">{c.specialList.title}</h2>
              <ul className="chip-row chip-row--wrap">
                {c.specialList.items.map((i) => (
                  <li key={i} className="chip chip--static">
                    {i}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {c.venues.length > 0 && (
            <section>
              <h2 className="place__h2">งานกินเจทั่วไทย</h2>
              <ul className="venue-list">
                {c.venues.map((v) => (
                  <li key={v.name} className="venue">
                    <div className="venue__name">{v.name}</div>
                    <div className="note">
                      {[v.placeName, v.province].filter(Boolean).join(' · ')}
                      {v.dates ? ` · ${v.dates}` : ''}
                    </div>
                    <p className="venue__desc">{v.description}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {c.healthNote && (
            <section className="shortcut-card shortcut-card--flush fest-health">
              <span className="shortcut-card__body">
                <span className="shortcut-card__title">ดูแลสุขภาพช่วงกินเจ</span>
                <span className="shortcut-card__sub">{c.healthNote}</span>
              </span>
            </section>
          )}

          {c.faq.length > 0 && (
            <section>
              <h2 className="place__h2">คำถามที่พบบ่อย</h2>
              <div className="faq">
                {c.faq.map((f) => (
                  <details key={f.q} className="faq__item">
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          <section className="place__sources">
            <p>ตรวจข้อมูลล่าสุด {fullDate(c.checkedAt)} · กำหนดการของแต่ละงานอาจเปลี่ยน ควรเช็กกับผู้จัดอีกครั้ง</p>
            <details>
              <summary>แหล่งข้อมูล</summary>
              <ul>
                {c.sources.map((s) => (
                  <li key={s}>
                    <a href={s} target="_blank" rel="noopener noreferrer">
                      {new URL(s).hostname.replace(/^www\./, '')}
                    </a>
                  </li>
                ))}
                {festival.image?.sourceUrl && (
                  <li>
                    <a href={festival.image.sourceUrl} target="_blank" rel="noopener noreferrer">
                      ภาพประกอบ: {festival.image.credit}
                    </a>
                  </li>
                )}
              </ul>
            </details>
          </section>
        </div>
      )}
    </main>
  );
}

function FestivalJsonLd({ festival, date }: { festival: Festival; date?: FestivalDate }) {
  const graph: object[] = [];
  if (date) {
    graph.push({
      '@type': 'Event',
      name: `${festival.name} ${toBuddhistYear(date.year)}`,
      startDate: date.start,
      endDate: date.end,
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: { '@type': 'Place', name: 'ประเทศไทย', address: { '@type': 'PostalAddress', addressCountry: 'TH' } },
      description: festival.content?.intro ?? festival.tagline,
      url: `${SITE_URL}/festival/${festival.slug}`,
    });
  }
  if (festival.content?.faq.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: festival.content.faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }
  if (graph.length === 0) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }) }}
    />
  );
}
