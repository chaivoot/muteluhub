'use client';

import Link from 'next/link';
import type { Planet } from '@/data/daily-colors';
import type { ShirtOffer } from '@/data/products';
import { colorShort, getShirtColor } from '@/lib/daily-colors';
import { getGoal } from '@/lib/goals';
import type { Weekday } from '@/lib/thai-date';
import { ShirtSolid, UiIcon } from './icons';
import { useGoal } from './goal-context';
import { ShareButton } from './ShareButton';

/** การ์ดสีเสื้อวันนี้ แบบย่อ (หน้าแรก) ตามเป้าหมายที่เลือก กดทั้งการ์ดไปหน้าสีเสื้อ ยกเว้นปุ่มแชร์ */
export function ShirtColorCard({
  weekday,
  shirts = {},
}: {
  weekday: Weekday;
  shirts?: Partial<Record<Planet, ShirtOffer>>;
}) {
  const { goal } = useGoal();
  const goalInfo = goal ? getGoal(goal) : null;
  const result = goal ? getShirtColor(weekday, goal) : null;
  const offer = result ? shirts[result.lucky.planet] : undefined;

  return (
    <section className="shirt-card" aria-label="สีเสื้อมงคลวันนี้">
      <div className="shirt-card__inner">
        <Link
          href={goal ? `/color-today?goal=${goal}` : '/color-today'}
          className={offer ? 'shirt-card__swatch shirt-card__link shirt-swatch--photo' : 'shirt-card__swatch shirt-card__link'}
          style={{
            background: result?.lucky.color.hex ?? 'var(--color-image-placeholder)',
            borderColor: result?.lucky.color.hex,
          }}
          aria-label="ดูสีเสื้อมงคลทั้งหมดของวันนี้"
        >
          {offer ? (
            <img src={offer.image.src} alt={offer.image.alt} className="shirt-photo" />
          ) : (
            <ShirtSolid color={result ? result.lucky.color.ink : 'var(--color-text-muted)'} />
          )}
        </Link>
        <div className="shirt-card__body">
          <div className="shirt-card__eyebrow">สีเสื้อมงคลวันนี้{goalInfo ? ` · ${goalInfo.short}` : ''}</div>
          {result ? (
            <>
              <div className="shirt-card__title">{result.lucky.color.name}</div>
              <div className="shirt-card__meta">เลี่ยง {colorShort(result.avoid.color)}</div>
            </>
          ) : (
            <div className="shirt-card__title shirt-card__title--sm">เลือกเรื่องที่อยากเสริมด้านบน</div>
          )}
        </div>
        {result && goalInfo ? (
          <ShareButton
            className="icon-btn icon-btn--gold"
            label="แชร์การ์ดสีเสื้อ"
            title={`สีเสื้อมงคลวันนี้ ด้าน${goalInfo.short}: ${result.lucky.color.name}`}
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
