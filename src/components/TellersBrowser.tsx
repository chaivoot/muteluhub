'use client';

import { useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { CHANNEL_LABEL, CHANNELS, PRICE_BUCKETS, type Channel, type FortuneTeller } from '@/data/fortune-tellers';
import { PROVINCES } from '@/data/provinces';
import { DISCIPLINES, getDiscipline } from '@/lib/disciplines';
import { getGoal, isGoalSlug, type GoalSlug } from '@/lib/goals';
import { activeFilterCount, filterTellers, PIN_ALL, sortPinned } from '@/lib/tellers';
import { BottomSheet } from './BottomSheet';
import { GoalChips } from './GoalChips';
import { TellerCard } from './TellerCard';
import { UiIcon } from './icons';

/**
 * รายการหมอดู + filter: เป้าหมายอยู่แถวบนสุดเสมอ ที่เหลือ (ศาสตร์ ช่องทาง จังหวัด ราคา) อยู่ใน bottom sheet
 * รับค่าเริ่มต้นจาก query string ?goal=&discipline= (ลิงก์จากหน้า prompt / เลขมงคล)
 */
export function TellersBrowser({
  tellers,
  fixedDiscipline,
  belowGoals,
}: {
  tellers: FortuneTeller[];
  fixedDiscipline?: string;
  /** เนื้อหาที่แทรกใต้ปุ่มเรื่องที่อยากเสริม (หน้ารวมใช้วางแถว ดูตามศาสตร์) */
  belowGoals?: ReactNode;
}) {
  const params = useSearchParams();
  const queryGoal = params.get('goal');
  const [goal, setGoal] = useState<GoalSlug | null>(isGoalSlug(queryGoal) ? queryGoal : null);
  // ลิงก์จากหน้าอื่นใส่ศาสตร์มาด้วย (เช่น prompt สีเสื้อ = เลข 7 ตัว) ถ้าคู่กับเรื่องนั้นแล้วไม่เจอใคร ให้แสดงทุกศาสตร์แทนพร้อมบอก
  const [initial] = useState(() => {
    const q = fixedDiscipline ? '' : (params.get('discipline') ?? '');
    const g = isGoalSlug(queryGoal) ? queryGoal : null;
    const none = { channel: null, province: null, price: null };
    const relaxed =
      !!q &&
      filterTellers({ goal: g, discipline: q, ...none }, tellers).length === 0 &&
      filterTellers({ goal: g, discipline: null, ...none }, tellers).length > 0;
    return { discipline: relaxed ? '' : q, relaxedFrom: relaxed ? q : null };
  });
  const [discipline, setDiscipline] = useState(fixedDiscipline ?? initial.discipline);
  const [channel, setChannel] = useState<Channel | ''>('');
  const [province, setProvince] = useState('');
  const [price, setPrice] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const closeSheet = useCallback(() => setSheetOpen(false), []);

  const filter = {
    goal,
    discipline: fixedDiscipline ?? (discipline || null),
    channel: channel || null,
    province: province || null,
    price: price || null,
  };
  // ปักหมุด: เลือกศาสตร์อยู่ = หมุดของศาสตร์นั้น ไม่ได้เลือก = หมุดหน้ารวม
  const pin = filter.discipline ?? PIN_ALL;
  const results = sortPinned(filterTellers(filter, tellers), pin);
  const count = activeFilterCount({ ...filter, discipline: fixedDiscipline ? null : filter.discipline });

  // ตัวเลือกเฉพาะที่มีข้อมูลจริง
  const disciplineOptions = useMemo(() => {
    const used = new Set(tellers.flatMap((t) => t.disciplines));
    return DISCIPLINES.filter((d) => used.has(d.slug));
  }, [tellers]);
  const provinceOptions = useMemo(
    () =>
      [...new Set(tellers.map((t) => t.provinceSlug).filter((p): p is string => !!p))].sort((a, b) =>
        (PROVINCES[a] ?? a).localeCompare(PROVINCES[b] ?? b, 'th'),
      ),
    [tellers],
  );

  // ตัวกรองใน sheet ที่ใช้อยู่ แสดงเป็นชิปให้เห็นและกดเอาออกได้ (กันงงว่าทำไมผลน้อยหรือเป็น 0)
  const active: { key: string; label: string; clear: () => void }[] = [];
  if (!fixedDiscipline && discipline)
    active.push({ key: 'd', label: getDiscipline(discipline)?.name ?? discipline, clear: () => setDiscipline('') });
  if (channel) active.push({ key: 'c', label: CHANNEL_LABEL[channel], clear: () => setChannel('') });
  if (province) active.push({ key: 'p', label: PROVINCES[province] ?? province, clear: () => setProvince('') });
  if (price)
    active.push({ key: 'r', label: PRICE_BUCKETS.find((b) => b.slug === price)?.label ?? price, clear: () => setPrice('') });
  // ถ้าผลเป็น 0 บอกว่าเอาตัวกรองอื่นออกแล้วจะเจอกี่คน
  const goalOnly = results.length === 0 && active.length > 0
    ? filterTellers({ goal, discipline: fixedDiscipline ?? null, channel: null, province: null, price: null }, tellers).length
    : 0;

  function clearFilters() {
    if (!fixedDiscipline) setDiscipline('');
    setChannel('');
    setProvince('');
    setPrice('');
  }

  return (
    <>
      <GoalChips
        value={goal}
        onChange={(g) => {
          setGoal(g);
        }}
      />
      {belowGoals}
      <div className="filter-bar container">
        <span className="filter-bar__count">
          {results.length} หมอดู{goal ? `ที่ถนัดเรื่อง${getGoal(goal).short}` : ''}
        </span>
        <button type="button" className="btn btn--outline btn--sm filter-btn" onClick={() => setSheetOpen(true)}>
          <UiIcon name="filter" size={16} strokeWidth={1.9} />
          ตัวกรอง{count > 0 ? ` ${count}` : ''}
        </button>
      </div>

      {initial.relaxedFrom && !discipline && (
        <p className="container note">
          ยังไม่มีหมอดูสาย{getDiscipline(initial.relaxedFrom)?.name ?? initial.relaxedFrom}
          {goal ? `ที่ถนัดเรื่อง${getGoal(goal).short}` : ''} จึงแสดงทุกศาสตร์
        </p>
      )}
      {active.length > 0 && (
        <div className="container chip-row chip-row--wrap active-filters" aria-label="ตัวกรองที่ใช้อยู่">
          {active.map((a) => (
            <button key={a.key} type="button" className="chip active-filters__chip" aria-label={`เอา ${a.label} ออก`} onClick={a.clear}>
              {a.label} <span aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      )}

      <div className="stack container">
        {results.map((t) => (
          <TellerCard key={t.slug} teller={t} pinned={t.pinnedIn?.includes(pin)} />
        ))}
        {results.length === 0 && (
          <div className="note stack">
            <span>
              ยังไม่มีหมอดู{goal ? `เรื่อง${getGoal(goal).short}` : ''}ที่ตรงกับ {active.map((a) => a.label).join(' + ') || 'ตัวกรองนี้'}
            </span>
            {goalOnly > 0 ? (
              <button type="button" className="btn btn--gold btn--sm" onClick={clearFilters}>
                ดู{goal ? `หมอดูเรื่อง${getGoal(goal).short}` : 'หมอดู'}ทั้งหมด {goalOnly} คน
              </button>
            ) : (
              count > 0 && (
                <button type="button" className="link-btn" onClick={clearFilters}>
                  ล้างตัวกรอง
                </button>
              )
            )}
          </div>
        )}
      </div>

      <BottomSheet
        open={sheetOpen}
        title="ตัวกรอง"
        onClose={closeSheet}
        footer={
          <>
            <button type="button" className="btn btn--outline" onClick={clearFilters}>
              ล้างทั้งหมด
            </button>
            <button type="button" className="btn btn--gold" onClick={closeSheet}>
              ดู {results.length} หมอดู
            </button>
          </>
        }
      >
        {!fixedDiscipline && (
          <div className="field">
            <label htmlFor="f-discipline" className="field__label">
              ศาสตร์
            </label>
            <select
              id="f-discipline"
              className="select"
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
            >
              <option value="">ทุกศาสตร์</option>
              {disciplineOptions.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <fieldset className="field">
          <legend className="field__label">ช่องทาง</legend>
          <div className="chip-row chip-row--wrap">
            {CHANNELS.map((c) => (
              <button
                key={c}
                type="button"
                className="chip"
                aria-pressed={channel === c}
                onClick={() => setChannel(channel === c ? '' : c)}
              >
                {CHANNEL_LABEL[c]}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="field">
          <label htmlFor="f-province" className="field__label">
            จังหวัด
          </label>
          <select id="f-province" className="select" value={province} onChange={(e) => setProvince(e.target.value)}>
            <option value="">ทุกจังหวัด</option>
            {provinceOptions.map((p) => (
              <option key={p} value={p}>
                {PROVINCES[p]}
              </option>
            ))}
          </select>
        </div>
        <fieldset className="field">
          <legend className="field__label">ราคาเริ่มต้น</legend>
          <div className="chip-row chip-row--wrap">
            {PRICE_BUCKETS.map((b) => (
              <button
                key={b.slug}
                type="button"
                className="chip"
                aria-pressed={price === b.slug}
                onClick={() => setPrice(price === b.slug ? '' : b.slug)}
              >
                {b.label}
              </button>
            ))}
          </div>
        </fieldset>
      </BottomSheet>
    </>
  );
}
