'use client';

import Link from 'next/link';
import { getShirtColor } from '@/lib/daily-colors';
import { getGoal } from '@/lib/goals';
import type { Weekday } from '@/lib/thai-date';
import { ShirtSolid, UiIcon } from './icons';
import { useGoal } from './goal-context';
import { ShareButton } from './ShareButton';

/** การ์ดสีเสื้อวันนี้ แบบย่อ (หน้าแรก) ตามเป้าหมายที่เลือก */
export function ShirtColorCard({ weekday }: { weekday: Weekday }) {
  const { goal } = useGoal();
  const goalInfo = goal ? getGoal(goal) : null;
  const result = goal ? getShirtColor(weekday, goal) : null;
  const lucky = result?.lucky;

  const avoidText = result?.avoid.length ? `เลี่ยง ${result.avoid.map((c) => c.colorName.replace(/^สี/, '')).join(' ')}` : null;
  const meta = [avoidText, result?.isSample && lucky ? 'ข้อมูลตัวอย่าง' : null].filter(Boolean).join(' · ');

  return (
    <section className="shirt-card" aria-label="สีเสื้อมงคลวันนี้">
      <div className="shirt-card__inner">
        <div
          className="shirt-card__swatch"
          style={{ background: lucky?.hex ?? 'var(--color-image-placeholder)' }}
        >
          <ShirtSolid color={lucky ? '#E9F5EC' : 'var(--color-text-muted)'} />
        </div>
        <div className="shirt-card__body">
          <div className="shirt-card__eyebrow">
            สีเสื้อมงคลวันนี้{goalInfo ? ` · ${goalInfo.short}` : ''}
          </div>
          {!goal && <div className="shirt-card__title shirt-card__title--sm">เลือกเรื่องที่อยากเสริมด้านบน</div>}
          {goal && lucky && <div className="shirt-card__title">{lucky.colorName}</div>}
          {goal && !lucky && (
            <div className="shirt-card__title shirt-card__title--sm">กำลังเตรียมข้อมูลสีของวันนี้</div>
          )}
          {meta && <div className="shirt-card__meta">{meta}</div>}
          {goal && !lucky && <div className="shirt-card__meta">รอยืนยันหลักทักษาที่ใช้</div>}
        </div>
        {lucky && goalInfo ? (
          <ShareButton
            className="icon-btn icon-btn--gold"
            label="แชร์การ์ดสีเสื้อ"
            title={`สีเสื้อมงคลวันนี้ ด้าน${goalInfo.short}: ${lucky.colorName}`}
            path={`/color-today?goal=${goalInfo.slug}`}
          />
        ) : (
          <Link href="/color-today" className="icon-btn icon-btn--outline" aria-label="ดูสีเสื้อมงคลทั้งหมด">
            <UiIcon name="chevron" size={20} />
          </Link>
        )}
      </div>
    </section>
  );
}
