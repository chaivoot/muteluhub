import type { Goal } from '@/lib/goals';

/** tag เป้าหมายบนการ์ด: pill เล็ก ขอบสีเป้าหมาย ไม่มีไอคอน */
export function GoalTag({ goal }: { goal: Goal }) {
  return (
    <span className="tag" style={{ borderColor: goal.chipBorder, color: goal.chipText }}>
      {goal.short}
    </span>
  );
}
