'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, type CSSProperties } from 'react';
import { DAILY_COLORS_SOURCE, GOAL_ROLE, PLANET_NAME, ROLE_MEANING } from '@/data/daily-colors';
import { colorLabel, colorShort, getShirtColor, taksaOfDay } from '@/lib/daily-colors';
import { GOALS, getGoal, isGoalSlug, type GoalSlug } from '@/lib/goals';
import { setPromptHandoff } from '@/lib/prompt-handoff';
import { TH_WEEKDAYS, type Weekday } from '@/lib/thai-date';
import { GoalChips } from './GoalChips';
import { ShirtSolid } from './icons';
import { useGoal } from './goal-context';

/** หน้าสีเสื้อมงคลวันนี้แบบเต็ม: การ์ดตามเป้าหมาย สีที่ควรเลี่ยง ทุกเป้าหมายของวันนี้ ทั้งสัปดาห์ แชร์ */
export function ColorToday({ weekday, dateLabel }: { weekday: Weekday; dateLabel: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const { goal: remembered, setGoal: remember } = useGoal();
  const queryGoal = params.get('goal');
  const [goal, setGoal] = useState<GoalSlug>(isGoalSlug(queryGoal) ? queryGoal : 'money');
  const [touched, setTouched] = useState(isGoalSlug(queryGoal));

  useEffect(() => {
    if (!touched && remembered) setGoal(remembered);
  }, [remembered, touched]);

  const g = getGoal(goal);
  const { lucky, avoid } = getShirtColor(weekday, goal);
  const today = taksaOfDay(weekday);
  const pageUrl = typeof window === 'undefined' ? '' : `${window.location.origin}/color-today?goal=${goal}`;
  const lineShare = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(pageUrl)}`;

  function askAi() {
    const slug = `color-today-${goal}`;
    setPromptHandoff(slug, {
      weekday: TH_WEEKDAYS[weekday],
      color: colorLabel(lucky.color),
      avoid_color: colorLabel(avoid.color),
    });
    router.push(`/ai-prompts/p/${slug}`);
  }

  return (
    <>
      <GoalChips
        value={goal}
        allowAll={false}
        onChange={(next) => {
          if (!next) return;
          setTouched(true);
          setGoal(next);
          remember(next);
        }}
      />

      <section className="container color-full" aria-live="polite">
        <div className="shirt-card shirt-card--full">
          <div className="shirt-card__inner shirt-card__inner--full">
            <div className="color-full__swatch" style={{ background: lucky.color.hex }}>
              <ShirtSolid size={64} color={lucky.color.ink} />
            </div>
            <div className="shirt-card__eyebrow">
              {dateLabel} · {g.short}
            </div>
            <div className="color-full__name">{lucky.color.name}</div>
            {lucky.color.alt.length > 0 && <div className="note">หรือ {lucky.color.alt.join(' ')}</div>}
            <div className="color-full__role">
              ตำแหน่ง{lucky.role} ({ROLE_MEANING[lucky.role]}) · ดาว{PLANET_NAME[lucky.planet]}
            </div>
            <div className="color-full__avoid">
              <span className="color-dot" style={{ background: avoid.color.hex }} />
              สีที่ควรเลี่ยง: {colorShort(avoid.color)}
            </div>
            <div className="color-full__actions">
              <a href={lineShare} target="_blank" rel="noopener noreferrer" className="btn btn--gold">
                แชร์ลง LINE
              </a>
              <a href={`/color-today/card?goal=${goal}&size=portrait`} download className="btn btn--outline">
                บันทึกเป็นรูป
              </a>
            </div>
            <a href={`/color-today/card?goal=${goal}&size=story`} download className="link-btn color-full__story">
              รูปแบบสตอรี่ (แนวตั้ง)
            </a>
          </div>
        </div>
        <button type="button" className="btn btn--outline color-full__ai" onClick={askAi}>
          ถาม AI ต่อ: วันนี้ควรแต่งตัวยังไง
        </button>
      </section>

      <section className="container">
        <div className="section-header section-header--flush">
          <h2 className="section-header__title">ทุกเรื่องของวันนี้</h2>
        </div>
        <ul className="color-list">
          {GOALS.map((x) => {
            const c = getShirtColor(weekday, x.slug).lucky;
            return (
              <li key={x.slug}>
                <button
                  type="button"
                  className="color-row"
                  aria-pressed={x.slug === goal}
                  onClick={() => {
                    setTouched(true);
                    setGoal(x.slug);
                    remember(x.slug);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{ '--goal': x.color } as CSSProperties}
                >
                  <span className="color-dot color-dot--lg" style={{ background: c.color.hex }} />
                  <span className="color-row__goal">{x.short}</span>
                  <span className="color-row__color">{c.color.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="container">
        <div className="section-header section-header--flush">
          <h2 className="section-header__title">สีด้าน{g.short}ทั้งสัปดาห์</h2>
        </div>
        <ul className="week-strip">
          {([0, 1, 2, 3, 4, 5, 6] as Weekday[]).map((d) => {
            const c = getShirtColor(d, goal).lucky.color;
            return (
              <li key={d} className={d === weekday ? 'week-strip__day week-strip__day--today' : 'week-strip__day'}>
                <span className="color-dot color-dot--lg" style={{ background: c.hex }} />
                <span className="week-strip__name">{TH_WEEKDAYS[d]}</span>
                <span className="week-strip__color">{c.name.replace(/^สี/, '')}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="container">
        <details className="taksa-table">
          <summary>ตำแหน่งทักษาของวัน{TH_WEEKDAYS[weekday]}ทั้งหมด</summary>
          <ul className="bullet-list">
            {today.map((slot) => (
              <li key={slot.role}>
                {slot.role} ({ROLE_MEANING[slot.role]}): {colorLabel(slot.color)} · ดาว{PLANET_NAME[slot.planet]}
              </li>
            ))}
          </ul>
        </details>
      </section>

      <section className="container method-box" aria-label="หลักที่ใช้">
        <p>
          <strong>หลัก: {DAILY_COLORS_SOURCE.name}</strong>
        </p>
        <p>{DAILY_COLORS_SOURCE.description}</p>
        <p>
          จับคู่เรื่องที่อยากเสริมกับตำแหน่ง:{' '}
          {GOALS.map((x) => `${x.short} = ${GOAL_ROLE[x.slug]}`).join(', ')}
        </p>
      </section>
    </>
  );
}
