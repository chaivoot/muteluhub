'use client';

import type { Place } from '@/data/places';
import { getGoal, type GoalSlug } from '@/lib/goals';
import { filterPlaces } from '@/lib/places';
import { PlaceCard } from './PlaceCard';
import { SectionHeader } from './SectionHeader';
import { useGoal } from './goal-context';

/** 12 = หารลงตัวทั้งแถวละ 3, 4, 6 บนจอคอม ไม่มีแถวขาด (เจ้าของขอ 2026-10-13) */
const HOME_PLACES = 12;

/** carousel "มูทั่วไทย เสริม..." ตามเป้าหมายที่เลือก (หน้าแรก) หรือเป้าหมายที่กำหนด (landing) */
export function PlacesForGoal({ places: all, goal: fixedGoal }: { places: Place[]; goal?: GoalSlug }) {
  const { goal: remembered } = useGoal();
  const goal = fixedGoal ?? remembered;
  const places = goal ? filterPlaces({ goal }, all) : all;
  if (places.length === 0) return null;
  const title = goal ? `มูทั่วไทย เสริม${getGoal(goal).short}` : 'มูทั่วไทย';
  return (
    <section>
      <SectionHeader title={title} href="/places" />
      <div className="carousel carousel--grid12">
        {places.slice(0, HOME_PLACES).map((p) => (
          <PlaceCard key={p.slug} place={p} />
        ))}
      </div>
    </section>
  );
}
