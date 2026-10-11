import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { PageHeader } from '@/components/ComingSoon';
import { PlacesBrowser } from '@/components/PlacesBrowser';
import { COUNTRIES, getCountry } from '@/data/countries';
import { abroadPlaces } from '@/lib/places';
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
    title: `มู${c.name} คู่มือทริปสายมู ขอพรที่ไหนดี`,
    description: `${c.intro}`.slice(0, 160),
  };
}

export default async function CountryPage({ params }: { params: Params }) {
  const { country } = await params;
  const c = getCountry(country);
  if (!c) notFound();
  const places = abroadPlaces(await listPublishedPlaces(), c.code);
  if (places.length === 0) notFound();

  return (
    <main>
      <PageHeader title={`มู${c.name}`} backHref="/abroad" />
      <div className="prose intro">
        <p>{c.intro}</p>
      </div>
      <Suspense>
        <PlacesBrowser places={places} groupBy="city" />
      </Suspense>
      <p className="container note abroad-note">
        เวลาเปิด ค่าเข้า และกฎการถ่ายรูปของแต่ละแห่งเปลี่ยนได้ ควรเช็กเว็บไซต์ทางการก่อนเดินทาง
      </p>
    </main>
  );
}
