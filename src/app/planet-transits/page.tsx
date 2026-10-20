import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/ComingSoon';
import { SectionHeader } from '@/components/SectionHeader';
import { PLANET_TRANSITS, PLANETS, type PlanetTransit } from '@/data/planet-transits';
import { listPublishedArticles } from '@/lib/articles-repo';
import { planetPositions, thaiDigits, transitTitle } from '@/lib/planet-transits';
import { bangkokDay, formatThaiRange, parseIsoDay, TH_MONTHS, toBuddhistYear } from '@/lib/thai-date';

export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: '/planet-transits' },
  title: 'ดาวย้ายราศี 2569-2570 ตอนนี้ดาวอยู่ราศีไหน ย้ายวันไหน',
  description:
    'ปฏิทินดาวย้ายราศีตามโหราศาสตร์ไทย พฤหัสบดี เสาร์ ราหู เกตุ มฤตยู และช่วงพุธพักร์ ตอนนี้ดาวอยู่ราศีไหน ย้ายครั้งถัดไปวันไหน พร้อมแหล่งอ้างอิง',
};

const date = (iso: string) => thaiDigits(formatThaiRange(iso, iso, true));
const span = (t: PlanetTransit) => thaiDigits(formatThaiRange(t.date, t.end ?? t.date, true));
const monthKey = (iso: string) => {
  const d = parseIsoDay(iso);
  return `${TH_MONTHS[d.month - 1]} ${thaiDigits(toBuddhistYear(d.year))}`;
};

export default async function PlanetTransitsPage() {
  const today = bangkokDay().iso;
  const articles = await listPublishedArticles();
  const published = new Set(articles.map((a) => a.slug));
  const positions = planetPositions(today);
  const sorted = [...PLANET_TRANSITS].sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = sorted.filter((t) => (t.end ?? t.date) >= today);
  const past = sorted.filter((t) => (t.end ?? t.date) < today).reverse();
  const months = [...new Set(upcoming.map((t) => monthKey(t.date)))];

  return (
    <main>
      <PageHeader title="ดาวย้ายราศี" />
      <div className="prose intro">
        <p>
          ตอนนี้ดาวอยู่ราศีไหน และจะย้ายเมื่อไร ตามโหราศาสตร์ไทย วันที่อ้างอิงจากโหรและปฏิทินโหราศาสตร์ที่เผยแพร่แล้ว
          แต่ละสำนักอาจต่างกันได้ 1-2 วัน
        </p>
      </div>

      <SectionHeader title="ตอนนี้ดาวอยู่ราศีไหน" />
      <ul className="planet-grid container">
        {positions.map((p) => (
          <li key={p.planet.slug} className="planet-card">
            <span className="planet-card__num" aria-hidden="true">
              {thaiDigits(p.planet.number)}
            </span>
            <span className="planet-card__name">{p.planet.name}</span>
            <span className="planet-card__sign">ราศี{p.sign}</span>
            {p.retrograde && <span className="tag planet-card__tag">กำลังพักร์</span>}
            <span className="planet-card__meta">
              {p.since && `ตั้งแต่ ${date(p.since)}`}
              {p.next && (
                <>
                  {p.since && <br />}
                  ย้ายเข้า{p.next.to} {date(p.next.date)}
                </>
              )}
            </span>
          </li>
        ))}
      </ul>

      <SectionHeader title="ดาวย้ายที่กำลังจะมา" />
      {upcoming.length === 0 ? (
        <p className="container note">ยังไม่มีข้อมูลดาวย้ายครั้งถัดไป</p>
      ) : (
        <div className="container transit-list">
          {months.map((m) => (
            <section key={m}>
              <h3 className="transit-list__month">{m}</h3>
              <ul className="transit-list__items">
                {upcoming
                  .filter((t) => monthKey(t.date) === m)
                  .map((t) => (
                    <TransitItem key={`${t.planet}-${t.kind}-${t.date}`} t={t} today={today} article={t.article && published.has(t.article) ? t.article : null} />
                  ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <SectionHeader title="ดาวแต่ละดวงหมายถึงอะไร" />
      <dl className="container planet-meanings">
        {PLANETS.map((p) => (
          <div key={p.slug}>
            <dt>
              {p.name} ({thaiDigits(p.number)})
            </dt>
            <dd>
              {p.meaning} <span className="note">{thaiDigits(p.pace)}</span>
            </dd>
          </div>
        ))}
      </dl>

      {past.length > 0 && (
        <details className="container transit-past">
          <summary>ดาวย้ายที่ผ่านมา ({thaiDigits(past.length)})</summary>
          <ul className="transit-list__items">
            {past.map((t) => (
              <TransitItem key={`${t.planet}-${t.kind}-${t.date}`} t={t} today={today} article={t.article && published.has(t.article) ? t.article : null} />
            ))}
          </ul>
        </details>
      )}

      <section className="container method-box" aria-label="ที่มาของข้อมูล">
        <p>
          <strong>ที่มาของวันที่</strong>
        </p>
        <p>
          ใช้วันที่ที่โหรและสื่อไทยเผยแพร่ตามปฏิทินโหราศาสตร์ไทย (นิรายนะ) ไม่ได้คำนวณเอง ปฏิทินโหราศาสตร์ไทยกับปฏิทินดาราศาสตร์สมัยใหม่อาจให้วันต่างกันได้
          แต่ละเหตุการณ์มีลิงก์แหล่งข้อมูลกำกับ ผลต่อดวงขึ้นกับดวงเดิมของแต่ละคน
        </p>
        <p>
          อยากรู้ว่าดาวย้ายมีผลกับดวงคุณอย่างไร ลองให้<Link href="/fortune-tellers/thai-astrology">หมอดูโหราศาสตร์ไทย</Link>ผูกดวงให้
        </p>
      </section>
    </main>
  );
}

function TransitItem({ t, today, article }: { t: PlanetTransit; today: string; article: string | null }) {
  const now = t.date <= today && (t.end ?? t.date) >= today;
  return (
    <li className={`transit-item${now ? ' transit-item--now' : ''}`}>
      <span className="transit-item__date">
        {span(t)}
        {t.time && ` เวลา ${thaiDigits(t.time)} น.`}
        {now && <span className="tag transit-item__tag">{t.end ? 'ช่วงนี้' : 'วันนี้'}</span>}
      </span>
      <span className="transit-item__title">{transitTitle(t)}</span>
      {t.note && <span className="transit-item__note">{thaiDigits(t.note)}</span>}
      <span className="transit-item__links">
        {article && <Link href={`/articles/${article}`}>อ่านว่าส่งผลอย่างไร</Link>}
        {t.sources.map((s, i) => (
          <a key={s} href={s} target="_blank" rel="noopener noreferrer">
            แหล่ง {thaiDigits(i + 1)}
          </a>
        ))}
      </span>
    </li>
  );
}
