'use client';

import { PLACES } from '@/data/places';
import { getGoal, type GoalSlug } from '@/lib/goals';
import { filterPlaces } from '@/lib/places';
import { PlaceCard } from './PlaceCard';
import { SectionHeader } from './SectionHeader';
import { useGoal } from './goal-context';

/** carousel "มูทั่วไทย เสริม..." ตามเป้าหมายที่เลือก (หน้าแรก) หรือเป้าหมายที่กำหนด (landing) */
export function PlacesForGoal({ goal: fixedGoal }: { goal?: GoalSlug }) {
  const { goal: remembered } = useGoal();
  const goal = fixedGoal ?? remembered;
  const places = goal ? filterPlaces({ goal }) : PLACES;
  if (places.length === 0) return null;
  const title = goal ? `มูทั่วไทย เสริม${getGoal(goal).short}` : 'มูทั่วไทย';
  return (
    <section>
      <SectionHeader title={title} href="/places" />
      <div className="carousel">
        {places.slice(0, 8).map((p) => (
          <PlaceCard key={p.slug} place={p} />
        ))}
      </div>
    </section>
  );
}
