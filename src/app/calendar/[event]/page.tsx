import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EVENT_TYPES, getEventType } from '@/data/auspicious';
import { bangkokDay, toBuddhistYear } from '@/lib/thai-date';
import { CalendarPage } from '../CalendarPage';

// ไม่ใช้ dynamicParams = false ร่วมกับ revalidate (ดู CLAUDE.md)
export const revalidate = 3600;

export function generateStaticParams() {
  return EVENT_TYPES.map((e) => ({ event: e.slug }));
}

type Params = Promise<{ event: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { event } = await params;
  const e = getEventType(event);
  if (!e) return {};
  const year = toBuddhistYear(bangkokDay().year);
  return {
    title: `ฤกษ์${e.name} ${year} วันดี วันธงชัย`,
    description: `ปฏิทินวันดีสำหรับ${e.name} ตามวันธงชัย อธิบดี และวันที่ควรเลี่ยง พร้อมวันจันทรคติ`,
  };
}

export default async function Page({ params }: { params: Params }) {
  const { event } = await params;
  const e = getEventType(event);
  if (!e) notFound();
  return <CalendarPage event={e.slug} title={`ฤกษ์${e.name}`} />;
}
