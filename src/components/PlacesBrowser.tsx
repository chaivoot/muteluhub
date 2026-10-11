'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Place } from '@/data/places';
import type { GoalSlug } from '@/lib/goals';
import { formatDistance, sortByDistance, type LatLng } from '@/lib/geo';
import { deitiesOf, filterPlaces, provincesWithPlaces } from '@/lib/places';
import { GoalChips } from './GoalChips';
import { UiIcon } from './icons';
import { PlaceCard } from './PlaceCard';
import { useGoal } from './goal-context';

type GeoState = 'idle' | 'locating' | 'denied' | 'unavailable';

/** รายการสถานที่ + filter: เป้าหมาย (บนสุด) องค์เทพ จังหวัด + ใกล้ฉัน (ตำแหน่งใช้ในเบราว์เซอร์เท่านั้น ไม่ส่งขึ้น server ไม่เก็บ) */
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
  const [here, setHere] = useState<LatLng | null>(null);
  const [geo, setGeo] = useState<GeoState>('idle');
  const nearMe = groupBy === 'province';

  const toggleNearMe = () => {
    if (here) {
      setHere(null);
      return;
    }
    if (!('geolocation' in navigator)) {
      setGeo('unavailable');
      return;
    }
    setGeo('locating');
    // บางเบราว์เซอร์ไม่เรียก callback เลยถ้าผู้ใช้ปิดหน้าต่างขอสิทธิ์ ไม่ให้ปุ่มค้าง
    const giveUp = window.setTimeout(() => setGeo((g) => (g === 'locating' ? 'unavailable' : g)), 20000);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        window.clearTimeout(giveUp);
        setHere({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeo('idle');
        setProvince('');
      },
      (err) => {
        window.clearTimeout(giveUp);
        setGeo(err.code === err.PERMISSION_DENIED ? 'denied' : 'unavailable');
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 5 * 60 * 1000 },
    );
  };

  useEffect(() => {
    if (!touched && remembered) setGoal(remembered);
  }, [remembered, touched]);

  const deities = useMemo(() => deitiesOf(places), [places]);
  const provinces = useMemo(() => provincesWithPlaces(places), [places]);
  const cities = useMemo(() => [...new Set(places.map((p) => p.city).filter((c): c is string => !!c))], [places]);
  const results = filterPlaces(
    {
      goal,
      deity: deity || null,
      province: groupBy === 'province' ? (fixedProvince ?? (province || null)) : null,
    },
    places,
  ).filter((p) => groupBy !== 'city' || !province || p.city === province);
  const rows = here ? sortByDistance(results, here) : results.map((item) => ({ item, km: null }));

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
        <div className="filter-bar__top">
          <span className="filter-bar__count">{results.length} แห่ง</span>
          {nearMe && (
            <button
              type="button"
              className="chip chip--near"
              aria-pressed={here != null}
              onClick={toggleNearMe}
              disabled={geo === 'locating'}
            >
              <UiIcon name="locate" size={16} strokeWidth={2} />
              {geo === 'locating' ? 'กำลังหาตำแหน่ง' : 'ใกล้ฉัน'}
            </button>
          )}
        </div>
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
      {(geo === 'denied' || geo === 'unavailable') && (
        <p className="container note" role="status">
          {geo === 'denied'
            ? 'เบราว์เซอร์ไม่ได้อนุญาตให้ใช้ตำแหน่ง เปิดสิทธิ์ตำแหน่งในการตั้งค่า หรือเลือกจังหวัดแทนได้'
            : 'หาตำแหน่งไม่ได้ตอนนี้ ลองใหม่อีกครั้ง หรือเลือกจังหวัดแทน'}
        </p>
      )}
      {here && <p className="container note">เรียงจากใกล้ไปไกล ระยะเป็นเส้นตรง ไม่ใช่ระยะทางขับรถ</p>}
      <div className="place-grid container">
        {rows.map(({ item, km }) => (
          <PlaceCard key={item.slug} place={item} distance={km == null ? undefined : formatDistance(km)} />
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
