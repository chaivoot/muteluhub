'use client';

import { GOALS, type GoalSlug } from '@/lib/goals';
import { GoalIcon } from './icons';

/** chip เป้าหมาย (filter แถวบนสุด) ขึ้นบรรทัดใหม่ให้เห็นครบทุกเรื่องโดยไม่ต้องเลื่อน (เจ้าของขอ 2026-10-12) */
export function GoalChips({
  value,
  onChange,
  allowAll = true,
}: {
  value: GoalSlug | null;
  onChange: (goal: GoalSlug | null) => void;
  allowAll?: boolean;
}) {
  return (
    <div className="chip-row chip-row--wrap goal-chips container" role="group" aria-label="กรองตามเป้าหมาย">
      {allowAll && (
        <button type="button" className="chip" aria-pressed={value === null} onClick={() => onChange(null)}>
          ทั้งหมด
        </button>
      )}
      {GOALS.map((g) => (
        <button
          key={g.slug}
          type="button"
          className="chip"
          aria-pressed={value === g.slug}
          onClick={() => onChange(g.slug)}
          style={value === g.slug ? undefined : { borderColor: g.chipBorder, color: g.chipText }}
        >
          <span style={{ color: value === g.slug ? undefined : g.color, display: 'inline-flex' }}>
            <GoalIcon slug={g.slug} size={16} strokeWidth={1.9} />
          </span>
          {g.short}
        </button>
      ))}
    </div>
  );
}
