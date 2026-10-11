'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { track } from '@/lib/analytics';
import { getGoal, type GoalSlug } from '@/lib/goals';
import {
  LUCKY_NUMBER_METHOD,
  NUMBER_MEANINGS,
  calculateLuckyNumbers,
  isValidBirthDate,
  type BirthDate,
} from '@/lib/lucky-number';
import { setPromptHandoff } from '@/lib/prompt-handoff';
import { getPromptTemplate } from '@/lib/prompts';
import { TH_MONTHS, bangkokDay, toBuddhistYear } from '@/lib/thai-date';
import { toThaiDigits } from '@/lib/thai-digits';
import { GoalChips } from './GoalChips';
import { ShareButton } from './ShareButton';
import { useGoal } from './goal-context';

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

/**
 * คำนวณฝั่ง client ทั้งหมด วันเกิดไม่ถูกส่งขึ้น server ไม่เก็บ ไม่ log
 */
export function LuckyNumberTool() {
  const router = useRouter();
  const { goal: remembered, setGoal: remember } = useGoal();
  const [goal, setGoal] = useState<GoalSlug | null>(null);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [yearBE, setYearBE] = useState('');

  useEffect(() => {
    if (!goal && remembered) setGoal(remembered);
  }, [remembered, goal]);

  const currentYearBE = toBuddhistYear(bangkokDay().year);
  const years = useMemo(() => Array.from({ length: 101 }, (_, i) => currentYearBE - i), [currentYearBE]);

  const birth: BirthDate | null =
    day && month && yearBE ? { day: Number(day), month: Number(month), year: Number(yearBE) - 543 } : null;
  const invalid = birth !== null && !isValidBirthDate(birth);
  const result = birth && !invalid && goal ? calculateLuckyNumbers(birth, goal) : null;
  const goalInfo = goal ? getGoal(goal) : null;

  function askAi() {
    if (!birth || !result || !goal) return;
    const slug = `lucky-number-${goal}`;
    if (!getPromptTemplate(slug)) return;
    const iso = `${birth.year}-${String(birth.month).padStart(2, '0')}-${String(birth.day).padStart(2, '0')}`;
    setPromptHandoff(slug, {
      birth_date: iso,
      method: LUCKY_NUMBER_METHOD.name,
      lucky_numbers: `${result.luckyNumbers.join(', ')} (เลขเส้นทางชีวิต ${result.lifePath}, เลขวันเกิด ${result.birthday})`,
    });
    router.push(`/ai-prompts/p/${slug}`);
  }

  return (
    <>
      <form className="form container" onSubmit={(e) => e.preventDefault()} aria-label="กรอกวันเกิด">
        <fieldset className="field">
          <legend className="field__label">วันเกิด</legend>
          <div className="date-select">
            <label>
              <select aria-label="วันที่" className="select" value={day} onChange={(e) => setDay(e.target.value)}>
                <option value="">วัน</option>
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <select aria-label="เดือน" className="select" value={month} onChange={(e) => setMonth(e.target.value)}>
                <option value="">เดือน</option>
                {TH_MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <select aria-label="ปี พ.ศ." className="select" value={yearBE} onChange={(e) => setYearBE(e.target.value)}>
                <option value="">ปี พ.ศ.</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {invalid && <p className="field__error">วันที่นี้ไม่มีในปฏิทิน ลองเช็กอีกครั้ง</p>}
        </fieldset>
      </form>

      <h2 className="step-title container">อยากเสริมเรื่องอะไร</h2>
      <GoalChips
        value={goal}
        allowAll={false}
        onChange={(g) => {
          if (!g) return;
          setGoal(g);
          remember(g);
        }}
      />
      <p className="container note privacy-note">คำนวณในเครื่องคุณเท่านั้น เว็บไม่ได้ส่งหรือเก็บวันเกิดของคุณ</p>

      {result && goalInfo && birth && (
        <section className="lucky-result container" aria-live="polite" aria-label="ผลเลขมงคล">
          <div className="lucky-card">
            <div className="lucky-card__eyebrow">เลขมงคลด้าน{goalInfo.short}ของคุณ</div>
            <ul className="lucky-card__numbers">
              {result.luckyNumbers.map((n) => (
                <li key={n} className="lucky-num">
                  <span className="lucky-num__thai">{toThaiDigits(n)}</span>
                  <span className="lucky-num__arabic">{n}</span>
                </li>
              ))}
            </ul>
            <div className="lucky-card__actions">
              <ShareButton
                className="icon-btn icon-btn--gold"
                label="แชร์เครื่องคำนวณเลขมงคล"
                title={`เลขมงคลด้าน${goalInfo.short}ของฉันคือ ${result.luckyNumbers.join(' ')} ลองคำนวณของคุณ`}
                path="/tools/lucky-number"
              />
              <button type="button" className="btn btn--outline" onClick={askAi}>
                ถาม AI ต่อ
              </button>
            </div>
          </div>

          <dl className="core-numbers">
            <div className="core-number">
              <dt>เลขเส้นทางชีวิต (Life Path)</dt>
              <dd>
                <span className="core-number__value">{toThaiDigits(result.lifePath)}</span>
                <span>{NUMBER_MEANINGS[result.lifePath]?.text}</span>
              </dd>
            </div>
            <div className="core-number">
              <dt>เลขวันเกิด</dt>
              <dd>
                <span className="core-number__value">{toThaiDigits(result.birthday)}</span>
                <span>{NUMBER_MEANINGS[result.birthday]?.text}</span>
              </dd>
            </div>
          </dl>

          <div className="how-to">
            <h3 className="how-to__title">ที่มาของเลข</h3>
            <ul className="how-to__list">
              <li>
                เดือน {stepsText(result.lifePathParts.month)} · วัน {stepsText(result.lifePathParts.day)} · ปี ค.ศ.{' '}
                {stepsText(result.lifePathParts.year)}
              </li>
              <li>
                รวมกันได้ {stepsText(result.lifePathParts.total)} = เลขเส้นทางชีวิต {result.lifePath}
              </li>
              <li>
                เลขประจำเรื่อง{goalInfo.short}: {result.goalNumbers.join(', ')} (
                {result.goalNumbers.map((n) => NUMBER_MEANINGS[n].keyword).join(', ')})
              </li>
            </ul>
            <p className="note">
              เลขมงคลที่แนะนำ = เลขเส้นทางชีวิตและเลขวันเกิด (ทอนเหลือหลักเดียว) รวมกับเลขประจำเรื่องที่เลือก
              การจับคู่เลขกับเรื่องที่อยากเสริมเป็นการตีความจากความหมายของเลขในหลัก Numerology
            </p>
          </div>

          <Link
            href={`/fortune-tellers?goal=${goal}&discipline=numerology`}
            className="shortcut-card shortcut-card--flush"
            onClick={() => track('click_to_fortune_teller', { slug: 'lucky-number', goal: goal ?? undefined, discipline: 'numerology' })}
          >
            <span className="shortcut-card__body">
              <span className="shortcut-card__title">อยากคุยลึกกับหมอดูจริง</span>
              <span className="shortcut-card__sub">ดูหมอดูสายเลขศาสตร์ที่ถนัดเรื่อง{goalInfo.short}</span>
            </span>
          </Link>
        </section>
      )}

      <section className="container method-box" aria-label="หลักคำนวณ">
        <p>
          <strong>หลักคำนวณ: {LUCKY_NUMBER_METHOD.name}</strong>
        </p>
        <p>{LUCKY_NUMBER_METHOD.description}</p>
      </section>
    </>
  );
}

const stepsText = (steps: number[]) => steps.join(' → ');
