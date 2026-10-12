import type { Metadata } from 'next';
import { PageHeader } from '@/components/ComingSoon';
import { FestivalCard } from '@/components/FestivalCard';
import { FESTIVALS } from '@/data/festivals';
import { currentFestivalDate, type FestivalOccurrence } from '@/lib/festivals';
import { bangkokDay } from '@/lib/thai-date';

export const revalidate = 600;

export const metadata: Metadata = {
  alternates: { canonical: '/festival' },
  title: 'เทศกาลและบทความสายมู',
  description: 'รวมเทศกาลสายมูตลอดปี กินเจ ฮาโลวีน และอื่น ๆ วันจัดงาน ข้อควรรู้ ไหว้ที่ไหน เตรียมอะไร',
};

/** หน้ารวมเทศกาล: งานที่กำลังจัด/กำลังมาก่อน แล้วตามด้วยงานที่ผ่านไปแล้วของปีนี้ */
export default function FestivalIndexPage() {
  const today = bangkokDay().iso;
  const items: FestivalOccurrence[] = FESTIVALS.flatMap((festival) => {
    const date = currentFestivalDate(festival, today);
    if (!date) return [];
    return [{ festival, date, status: date.start <= today && date.end >= today ? 'ongoing' : 'upcoming' } as const];
  });
  const isPast = (o: FestivalOccurrence) => o.date.end < today;
  const sorted = [...items.filter((o) => !isPast(o)), ...items.filter(isPast)].sort(
    (a, b) => Number(isPast(a)) - Number(isPast(b)) || a.date.start.localeCompare(b.date.start),
  );
  return (
    <main>
      <PageHeader title="เทศกาลและบทความ" />
      <div className="prose intro">
        <p>เทศกาลสายมูตลอดปี วันจัดงาน ข้อควรรู้ ไหว้ที่ไหน เตรียมอะไร</p>
      </div>
      <div className="stack">
        {sorted.map((o) => (
          <FestivalCard key={o.festival.slug} occurrence={o} />
        ))}
      </div>
    </main>
  );
}
