import { CalendarView } from '@/components/CalendarView';
import { PageHeader } from '@/components/ComingSoon';
import { KALAYOK, SPECIAL_LABEL, type EventSlug } from '@/data/auspicious';
import { LUNAR_SOURCES } from '@/data/lunar-calendar';
import { bangkokDay, parseIsoDay, TH_MONTHS, TH_WEEKDAYS, toBuddhistYear } from '@/lib/thai-date';

const fullDate = (iso: string) => {
  const d = parseIsoDay(iso);
  return `${d.day} ${TH_MONTHS[d.month - 1]} ${toBuddhistYear(d.year)}`;
};

/** ใช้ร่วมกันระหว่าง /calendar และ /calendar/[event-type] */
export function CalendarPage({ event, title }: { event: EventSlug; title: string }) {
  const today = bangkokDay();
  const current = KALAYOK.find((k) => today.iso >= k.from && today.iso <= k.to) ?? KALAYOK[KALAYOK.length - 1];
  const days = (ws: number[]) => ws.map((w) => TH_WEEKDAYS[w]).join(' ');
  const sources = [...new Set([...current.sources, ...LUNAR_SOURCES])];
  return (
    <main>
      <PageHeader title={title} />
      <div className="prose intro">
        <p>เลือกประเภทงาน แล้วดูวันดีในแต่ละเดือน ตามวันธงชัย อธิบดี อุบาทว์ โลกาวินาศ ของปีนี้ และความนิยมของงานนั้น</p>
      </div>
      <CalendarView initialEvent={event} todayIso={today.iso} />
      <section className="container method-box" aria-label="หลักที่ใช้">
        <p>
          <strong>กาลโยคปีนี้ (ใช้ {fullDate(current.from)} ถึง {fullDate(current.to)})</strong>
        </p>
        <p>
          {SPECIAL_LABEL.thongchai}: {days(current.thongchai)} · {SPECIAL_LABEL.athibodi}: {days(current.athibodi)} ·{' '}
          {SPECIAL_LABEL.ubat}: {days(current.ubat)} · {SPECIAL_LABEL.lokawinat}: {days(current.lokawinat)}
        </p>
        <p>
          วันธงชัย อธิบดี อุบาทว์ โลกาวินาศ เปลี่ยนทุกปีตามประกาศสงกรานต์ ถ้าวันหนึ่งเป็นทั้งวันดีและวันที่ควรเลี่ยง ระบบจะถือว่าควรเลี่ยง
          ความเชื่อเรื่องฤกษ์แต่ละท้องถิ่นต่างกัน ใช้เป็นแนวทางประกอบการตัดสินใจ
        </p>
        <details>
          <summary>แหล่งข้อมูล</summary>
          <ul>
            {sources.map((s) => (
              <li key={s}>
                <a href={s} target="_blank" rel="noopener noreferrer">
                  {new URL(s).hostname.replace(/^www\./, '')}
                </a>
              </li>
            ))}
          </ul>
        </details>
      </section>
    </main>
  );
}
