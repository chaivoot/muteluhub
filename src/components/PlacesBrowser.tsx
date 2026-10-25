'use client';

import { useEffect, useMemo, useState } from 'react';
import { DEITY_FAMILIES, deityGroup, FAMILY_PREFIX } from '@/data/deity-groups';
import { isGoalSlug } from '@/lib/goals';
import type { Place } from '@/data/places';
import type { GoalSlug } from '@/lib/goals';
import { formatDistance, NEAR_ME_RADIUS_KM, sortByDistance, type LatLng } from '@/lib/geo';
import { filterPlaces, provincesWithPlaces } from '@/lib/places';
import { DeityCombobox, type DeityValue } from './DeityCombobox';
import { GoalChips } from './GoalChips';
import { UiIcon } from './icons';
import { PlaceCard } from './PlaceCard';

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
  const [goal, setGoal] = useState<GoalSlug | null>(null);
  // ช่องค้นหาเดียว: เลือกจากรายการ = กลุ่มองค์เทพ, พิมพ์เอง = ค้นชื่อสถานที่ องค์เทพ อำเภอ จังหวัด
  const [deity, setDeity] = useState<DeityValue>(null);
  // ลิงก์ที่ส่งตัวกรองมาด้วย เช่น /places?deity=family:chinese จากหน้าตรุษจีน
  // อ่านหลัง mount (ไม่ใช้ useSearchParams) เพื่อให้ HTML ของหน้ายังมีรายการสถานที่ครบสำหรับ SEO
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const g = params.get('goal');
    if (isGoalSlug(g)) setGoal(g);
    const d = deityFromQuery(params.get('deity'));
    if (d) setDeity(d);
    const text = params.get('q');
    if (text && !d) setDeity({ kind: 'text', text });
  }, []);
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

  const provinces = useMemo(() => provincesWithPlaces(places), [places]);
  const cities = useMemo(() => [...new Set(places.map((p) => p.city).filter((c): c is string => !!c))], [places]);
  const scope = {
    goal,
    province: groupBy === 'province' ? (fixedProvince ?? (province || null)) : null,
  };
  const inCity = (p: Place) => groupBy !== 'city' || !province || p.city === province;
  // ตัวเลขในรายการองค์เทพต้องนับจากเป้าหมาย/จังหวัดที่เลือกอยู่ ให้ตรงกับผลที่ได้จริง
  const deityScope = filterPlaces(scope, places).filter(inCity);
  const results = filterPlaces(
    {
      ...scope,
      deity: deity?.kind === 'group' ? deity.slug : null,
      q: deity?.kind === 'text' ? deity.text : null,
    },
    places,
  ).filter(inCity);
  const sorted = here ? sortByDistance(results, here) : null;
  const nearby = sorted?.filter((r) => r.km != null && r.km <= NEAR_ME_RADIUS_KM) ?? [];
  // ไม่มีที่ไหนในรัศมี: แสดง 3 แห่งที่ใกล้ที่สุดแทนหน้าว่าง
  const outOfRange = sorted != null && nearby.length === 0 && sorted.length > 0;
  const rows = !sorted
    ? results.map((item) => ({ item, km: null as number | null }))
    : outOfRange
      ? sorted.slice(0, 3)
      : nearby;

  return (
    <>
      <GoalChips
        value={goal}
        onChange={(g) => {
          setGoal(g);
        }}
      />
      <div className="filter-bar filter-bar--wrap container">
        <div className="filter-bar__top">
          <span className="filter-bar__count">
            {!sorted
              ? `${results.length} แห่ง`
              : outOfRange
                ? `ใกล้ที่สุด ${rows.length} แห่ง`
                : `${rows.length} แห่งใน ${NEAR_ME_RADIUS_KM} กม.`}
          </span>
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
          <DeityCombobox places={deityScope} value={deity} onChange={setDeity} />
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
      {here && (
        <p className="container note" role="status">
          {outOfRange
            ? `ยังไม่มีสถานที่ในระยะ ${NEAR_ME_RADIUS_KM} กม. จากคุณ นี่คือที่ใกล้ที่สุดตอนนี้`
            : `ในระยะ ${NEAR_ME_RADIUS_KM} กม. เรียงจากใกล้ไปไกล ระยะเป็นเส้นตรง ไม่ใช่ระยะทางขับรถ`}
        </p>
      )}
      <div className="place-grid container">
        {rows.map(({ item, km }) => (
          <PlaceCard key={item.slug} place={item} distance={km == null ? undefined : formatDistance(km)} />
        ))}
      </div>
      {results.length === 0 && (
        <p className="container note">
          {places.length === 0 ? 'กำลังรวบรวมข้อมูลสถานที่' : deity?.kind === 'text' ? `ไม่เจอสถานที่ที่ตรงกับ ${deity.text.trim()} ลองพิมพ์คำอื่น หรือล้างตัวกรอง` : 'ยังไม่มีสถานที่ตามตัวกรองนี้ ลองเลือกเป้าหมายอื่น'}
        </p>
      )}
    </>
  );
}

function deityFromQuery(slug: string | null): DeityValue {
  if (!slug) return null;
  if (slug.startsWith(FAMILY_PREFIX)) {
    const f = DEITY_FAMILIES.find((x) => `${FAMILY_PREFIX}${x.slug}` === slug);
    return f ? { kind: 'group', slug, label: f.label } : null;
  }
  const g = deityGroup(slug);
  return g ? { kind: 'group', slug, label: g.label } : null;
}
