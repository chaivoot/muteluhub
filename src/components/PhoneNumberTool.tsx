'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { PHONE_PAIRS, PHONE_SOURCES, type PhoneMeaning } from '@/data/phone-pairs';
import { track } from '@/lib/analytics';
import { getGoal, type GoalSlug } from '@/lib/goals';
import { PHONE_METHOD, analyzePhone, checkPhone, formatPhone, type PhoneResult } from '@/lib/phone-number';
import {
  BIRTH_DAYS,
  birthDaySlugFromWeekday,
  pairsWithAvoid,
  personalNumbers,
  type PersonalNumbers,
} from '@/lib/phone-number/personal';
import { setPromptHandoff } from '@/lib/prompt-handoff';
import { GoalChips } from './GoalChips';
import { ShareButton } from './ShareButton';
import { useGoal } from './goal-context';

const LEVEL_LABEL: Record<PhoneMeaning['level'], string> = { good: 'ดี', neutral: 'กลาง ๆ', bad: 'ควรเลี่ยง' };

const ERROR_TEXT = {
  short: 'เบอร์ยังไม่ครบ ใส่ให้ครบ 10 หลัก (เบอร์บ้าน 9 หลัก)',
  long: 'เบอร์ยาวเกินไป ลองเช็กอีกครั้ง',
  prefix: 'เบอร์มือถือไทยขึ้นต้นด้วย 06 08 หรือ 09',
} as const;

/**
 * เช็กเบอร์มงคล (ผลรวม + คู่เลข) + คู่เลขแนะนำตามวันเกิด (ทักษา)
 * คำนวณฝั่ง client ทั้งหมด เบอร์และวันเกิดไม่ถูกส่งขึ้น server ไม่เก็บ ไม่ใส่ใน URL
 */
export function PhoneNumberTool() {
  const router = useRouter();
  const { goal: remembered, setGoal: remember } = useGoal();
  const [goal, setGoal] = useState<GoalSlug | null>(null);
  const [phone, setPhone] = useState('');
  const [birth, setBirth] = useState('');
  const [birthDate, setBirthDate] = useState('');

  useEffect(() => {
    if (!goal && remembered) setGoal(remembered);
  }, [remembered, goal]);

  const check = phone.trim() ? checkPhone(phone) : null;
  const result = check?.ok ? analyzePhone(check.digits, goal) : null;
  const personal = birth && goal ? personalNumbers(birth, goal) : null;
  const goalInfo = goal ? getGoal(goal) : null;
  const showError = check && !check.ok && check.reason !== 'empty' && normalizedLength(phone) >= 9;

  function pickDate(iso: string) {
    setBirthDate(iso);
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    if (!m) return;
    const w = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]))).getUTCDay();
    setBirth(birthDaySlugFromWeekday(w));
  }

  function askAi() {
    if (!goal) return;
    setPromptHandoff(`phone-number-${goal}`, {
      phone_result: result ? phoneResultText(result) : 'ยังไม่มีเบอร์ กำลังหาเบอร์ใหม่',
      birth_numbers: personal ? personalText(personal) : 'ไม่ได้ใส่วันเกิด',
    });
    router.push(`/ai-prompts/p/phone-number-${goal}`);
  }

  return (
    <>
      <form className="form container" onSubmit={(e) => e.preventDefault()} aria-label="กรอกเบอร์และวันเกิด">
        <label className="field">
          <span className="field__label">เบอร์โทร</span>
          <input
            className="input phone-input"
            type="tel"
            inputMode="numeric"
            autoComplete="off"
            placeholder="08X XXX XXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <span className="note">ไม่มีเบอร์ในใจ เว้นว่างไว้ แล้วดูคู่เลขที่แนะนำจากวันเกิดได้</span>
          {showError && check && !check.ok && check.reason !== 'empty' && (
            <span className="field__error">{ERROR_TEXT[check.reason]}</span>
          )}
        </label>

        <div className="field">
          <label htmlFor="birth-day" className="field__label">
            เกิดวันอะไร (ไม่บังคับ)
          </label>
          <select id="birth-day" className="select" value={birth} onChange={(e) => setBirth(e.target.value)}>
            <option value="">ไม่ระบุ</option>
            {BIRTH_DAYS.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.label}
              </option>
            ))}
          </select>
          <details className="note">
            <summary>ไม่แน่ใจว่าเกิดวันอะไร</summary>
            <label className="field">
              <span>ใส่วันเดือนปีเกิด เว็บหาวันให้</span>
              <input className="input" type="date" value={birthDate} onChange={(e) => pickDate(e.target.value)} />
            </label>
            <span>เกิดวันพุธหลัง 18.00 น. นับเป็นพุธกลางคืน เลือกเองในช่องด้านบน</span>
          </details>
        </div>
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
      <p className="container note privacy-note">วิเคราะห์ในเครื่องคุณเท่านั้น เว็บไม่ได้ส่งหรือเก็บเบอร์และวันเกิดของคุณ</p>

      {(result || personal) && (
        <section className="lucky-result container" aria-live="polite" aria-label="ผลเช็กเบอร์">
          {result && <PhoneResultCard result={result} goalShort={goalInfo?.short ?? null} personal={personal} />}

          {personal && goalInfo && (
            <div className="lucky-card">
              <div className="lucky-card__eyebrow">
                เกิด{personal.birthLabel} อยากเสริมเรื่อง{goalInfo.short}
              </div>
              <dl className="phone-personal">
                <div>
                  <dt>เลขเสริมเรื่อง{goalInfo.short}</dt>
                  <dd>
                    <span className="phone-digit phone-digit--good">{personal.goalDigit}</span>
                    {personal.role} (ดาว{personal.goalPlanet})
                  </dd>
                </div>
                <div>
                  <dt>เลขที่ควรเลี่ยง</dt>
                  <dd>
                    <span className="phone-digit phone-digit--bad">{personal.avoidDigit}</span>
                    กาลกิณี (ดาว{personal.avoidPlanet})
                  </dd>
                </div>
              </dl>
              <h3 className="phone-sub">คู่เลขที่แนะนำสำหรับคุณ</h3>
              <ul className="phone-pairs">
                {personal.recommended.map((p) => (
                  <li key={p} className="phone-pair phone-pair--good">
                    <span className="phone-pair__num">{p}</span>
                    <span className="phone-pair__text">{PHONE_PAIRS[p].meaning}</span>
                  </li>
                ))}
              </ul>
              <p className="note">
                คู่ที่มีเลข {personal.goalDigit} ขึ้นก่อน ไม่มีคู่ไหนมีเลข {personal.avoidDigit} หาเบอร์ใหม่ลองมองหาคู่เหล่านี้ใน 4 ตัวท้าย
              </p>
            </div>
          )}

          {goalInfo && (
            <div className="lucky-card__actions">
              <ShareButton
                className="icon-btn icon-btn--gold"
                label="แชร์หน้าเช็กเบอร์มงคล"
                title={`ลองเช็กเบอร์มงคลด้าน${goalInfo.short}ของคุณ`}
                path="/tools/phone-number"
              />
              <button type="button" className="btn btn--outline" onClick={askAi}>
                ถาม AI ต่อ
              </button>
            </div>
          )}

          <Link
            href={`/fortune-tellers?${goal ? `goal=${goal}&` : ''}discipline=lucky-numbers`}
            className="shortcut-card shortcut-card--flush"
            onClick={() => track('click_to_fortune_teller', { slug: 'phone-number', goal: goal ?? undefined, discipline: 'lucky-numbers' })}
          >
            <span className="shortcut-card__body">
              <span className="shortcut-card__title">อยากให้ผู้เชี่ยวชาญช่วยเลือกเบอร์</span>
              <span className="shortcut-card__sub">ดูหมอดูสายเบอร์มงคล / ทะเบียนรถ</span>
            </span>
          </Link>
        </section>
      )}

      <section className="container method-box" aria-label="หลักคำนวณ">
        <p>
          <strong>หลักคำนวณ: {PHONE_METHOD.name}</strong>
        </p>
        <p>{PHONE_METHOD.description}</p>
        <ul className="how-to__list">
          {PHONE_METHOD.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
        <p>
          ความหมายคู่เลขเป็นความเชื่อ แต่ละตำราอาจต่างกัน เว็บเลือกความหมายที่แหล่งส่วนใหญ่ตรงกัน คู่ที่แหล่งเห็นต่างจะมีป้ายบอกไว้
          ส่วนเลขตามวันเกิดใช้หลักทักษาเดียวกับสีเสื้อมงคลของเว็บ
        </p>
        <details>
          <summary>แหล่งข้อมูล ({PHONE_SOURCES.length})</summary>
          <ul className="how-to__list">
            {PHONE_SOURCES.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </details>
      </section>
    </>
  );
}

function PhoneResultCard({
  result,
  goalShort,
  personal,
}: {
  result: PhoneResult;
  goalShort: string | null;
  personal: PersonalNumbers | null;
}) {
  const avoid = personal ? new Set(pairsWithAvoid(result.pairs, personal.avoidDigit).map((p) => p.index)) : new Set<number>();
  const strengths = useMemo(() => result.strengths.slice(0, 3).map((s) => getGoal(s.goal).short), [result]);
  return (
    <div className="lucky-card">
      <div className="lucky-card__eyebrow">เบอร์ {formatPhone(result.digits)}</div>
      <div className="phone-sum">
        <span className="phone-sum__value">{result.sum}</span>
        <span>
          <span className="phone-sum__label">ผลรวม</span>
          {result.sumMeaning && (
            <>
              <LevelTag m={result.sumMeaning} /> {result.sumMeaning.meaning}
            </>
          )}
        </span>
      </div>
      <p className="phone-summary">
        คู่ดี {result.counts.good} · กลาง ๆ {result.counts.neutral} · ควรเลี่ยง {result.counts.bad}
        {strengths.length > 0 && <> · เด่นเรื่อง{strengths.join(' ')}</>}
      </p>
      {result.goal && goalShort && (
        <p className="phone-summary phone-summary--goal">
          {result.goal.support.length > 0
            ? `ส่งเรื่อง${goalShort} ${result.goal.support.length} คู่ (${result.goal.support.map((p) => p.pair).join(', ')})`
            : `ยังไม่มีคู่ที่ส่งเรื่อง${goalShort}โดยตรง`}
          {result.goal.sumSupports && ` และผลรวมส่งเรื่อง${goalShort}`}
        </p>
      )}
      <ul className="phone-pairs">
        {result.pairs.map((p) => (
          <li key={p.index} className={`phone-pair phone-pair--${p.level}`}>
            <span className="phone-pair__num">{p.pair}</span>
            <span className="phone-pair__text">
              <LevelTag m={p} />
              {p.key && <span className="tag phone-tag">คู่หลัก</span>}
              {avoid.has(p.index) && <span className="tag phone-tag phone-tag--bad">มีเลขกาลกิณีของคุณ</span>} {p.meaning}
            </span>
          </li>
        ))}
      </ul>
      <p className="note">คู่หลัก = 3 คู่ใน 4 ตัวท้าย ซึ่งหลายตำราให้น้ำหนักมากที่สุด</p>
    </div>
  );
}

function LevelTag({ m }: { m: PhoneMeaning }) {
  return (
    <span className={`tag phone-tag phone-tag--${m.level}`}>
      {LEVEL_LABEL[m.level]}
      {m.agreement === 'low' ? ' (ตำราเห็นต่าง)' : ''}
    </span>
  );
}

const normalizedLength = (s: string) => s.replace(/\D/g, '').length;

function phoneResultText(r: PhoneResult): string {
  const sum = `ผลรวม ${r.sum}${r.sumMeaning ? ` (${LEVEL_LABEL[r.sumMeaning.level]}: ${r.sumMeaning.meaning})` : ''}`;
  const pairs = r.pairs.map((p) => `${p.pair}${p.key ? ' [คู่หลัก]' : ''} ${LEVEL_LABEL[p.level]}: ${p.meaning}`);
  return [sum, 'คู่เลข (7 ตัวท้าย):', ...pairs].join('\n');
}

function personalText(p: PersonalNumbers): string {
  return `เกิด${p.birthLabel} เลขเสริม ${p.goalDigit} (${p.role}) เลขที่ควรเลี่ยง ${p.avoidDigit} (กาลกิณี) คู่เลขแนะนำ ${p.recommended.join(', ')}`;
}
