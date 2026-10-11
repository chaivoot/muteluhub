'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Place } from '@/data/places';
import type { GoalSlug } from '@/lib/goals';
import { deitiesOf, filterPlaces, provincesWithPlaces } from '@/lib/places';
import { GoalChips } from './GoalChips';
import { PlaceCard } from './PlaceCard';
import { useGoal } from './goal-context';

/** รายการสถานที่ + filter: เป้าหมาย (บนสุด) องค์เทพ จังหวัด */
export function PlacesBrowser({
  places,
  fixedProvince,
  groupBy = 'province',
}: {
  places: Place[];
  fixedProvince?: string;
  /** ตัวกรองพื้นที่: จังหวัด (ในไทย) หรือ เมือง (ต่างประเทศ) */
  groupBy?: 'province' | 'city';
}) {
  const { goal: remembered } = useGoal();
  const [goal, setGoal] = useState<GoalSlug | null>(null);
  const [touched, setTouched] = useState(false);
  const [deity, setDeity] = useState('');
  const [province, setProvince] = useState('');

  useEffect(() => {
    if (!touched && remembered) setGoal(remembered);
  }, [remembered, touched]);

  const deities = useMemo(() => deitiesOf(places), [places]);
  const provinces = useMemo(() => provincesWithPlaces(places), [places]);
  const cities = useMemo(() => [...new Set(places.map((p) => p.city).filter((c): c is string => !!c))], [places]);
  const results = filterPlaces(
    { goal, deity: deity || null, province: groupBy === 'province' ? (fixedProvince ?? (province || null)) : null },
    places,
  ).filter((p) => groupBy !== 'city' || !province || p.city === province);

  return (
    <>
      <GoalChips
        value={goal}
        onChange={(g) => {
          setTouched(true);
          setGoal(g);
        }}
      />
      <div className="filter-bar filter-bar--wrap container">
        <span className="filter-bar__count">{results.length} แห่ง</span>
        <div className="filter-bar__selects">
          <label className="select-wrap">
            <span className="visually-hidden">องค์เทพ / สิ่งศักดิ์สิทธิ์</span>
            <select className="select" value={deity} onChange={(e) => setDeity(e.target.value)}>
              <option value="">ทุกองค์เทพ</option>
              {deities.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          {!fixedProvince && groupBy === 'province' && (
            <label className="select-wrap">
              <span className="visually-hidden">จังหวัด</span>
              <select className="select" value={province} onChange={(e) => setProvince(e.target.value)}>
                <option value="">ทุกจังหวัด</option>
                {provinces.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          {groupBy === 'city' && cities.length > 1 && (
            <label className="select-wrap">
              <span className="visually-hidden">เมือง</span>
              <select className="select" value={province} onChange={(e) => setProvince(e.target.value)}>
                <option value="">ทุกเมือง</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>
      <div className="place-grid container">
        {results.map((p) => (
          <PlaceCard key={p.slug} place={p} />
        ))}
      </div>
      {results.length === 0 && (
        <p className="container note">
          {places.length === 0 ? 'กำลังรวบรวมข้อมูลสถานที่' : 'ยังไม่มีสถานที่ตามตัวกรองนี้ ลองเลือกเป้าหมายอื่น'}
        </p>
      )}
    </>
  );
}
