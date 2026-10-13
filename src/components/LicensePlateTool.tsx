'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { PhoneMeaning } from '@/data/phone-pairs';
import { PLATE_RULES, PLATE_SOURCES, PLATE_SUMS } from '@/data/plate-letters';
import { track } from '@/lib/analytics';
import { getGoal, type GoalSlug } from '@/lib/goals';
import {
  PLATE_METHOD,
  analyzePlate,
  parsePlate,
  platePersonal,
  plateWarnings,
  type PlatePersonal,
  type PlateResult,
} from '@/lib/license-plate';
import { BirthDayField } from './BirthDayField';
import { GoalChips } from './GoalChips';
import { ShareButton } from './ShareButton';
import { useGoal } from './goal-context';

const LEVEL_LABEL: Record<PhoneMeaning['level'], string> = { good: 'ดี', neutral: 'กลาง ๆ', bad: 'ควรเลี่ยง' };

const ERROR_TEXT = {
  format: 'พิมพ์หมวดอักษรตามด้วยตัวเลข เช่น 1กข 1234 หรือ กข 1234',
  letters: 'หมวดอักษรมีตัวที่ไม่ใช้ในทะเบียน ลองเช็กอีกครั้ง',
  number: 'ใส่เลขทะเบียนต่อจากหมวดอักษรด้วย',
} as const;

/**
 * เช็กทะเบียนรถมงคล + อักษร/เลขตามวันเกิด (ทักษา)
 * คำนวณฝั่ง client ทั้งหมด ไม่ส่งทะเบียนหรือวันเกิดขึ้น server
 */
export function LicensePlateTool() {
  const { goal: remembered, setGoal: remember } = useGoal();
  const [goal, setGoal] = useState<GoalSlug | null>(null);
  const [input, setInput] = useState('');
  const [birth, setBirth] = useState('');

  useEffect(() => {
    if (!goal && remembered) setGoal(remembered);
  }, [remembered, goal]);

  const check = input.trim() ? parsePlate(input) : null;
  const result = check?.ok ? analyzePlate(check.plate, goal) : null;
  const personal = birth && goal ? platePersonal(birth, goal) : null;
  const goalInfo = goal ? getGoal(goal) : null;
  const showError = check && !check.ok && check.reason !== 'empty' && input.replace(/\s/g, '').length >= 3;

  return (
    <>
      <form className="form container" onSubmit={(e) => e.preventDefault()} aria-label="กรอกทะเบียนรถและวันเกิด">
        <label className="field">
          <span className="field__label">ทะเบียนรถ</span>
          <input
            className="input phone-input"
            type="text"
            autoComplete="off"
            placeholder="1กข 1234"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <span className="note">ไม่ต้องใส่จังหวัด ยังไม่มีทะเบียน เว้นว่างไว้ แล้วดูอักษรและผลรวมที่เหมาะกับคุณ</span>
          {showError && check && !check.ok && check.reason !== 'empty' && (
            <span className="field__error">{ERROR_TEXT[check.reason]}</span>
          )}
        </label>
        <BirthDayField value={birth} onChange={setBirth} />
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
      <p className="container note privacy-note">คำนวณในเครื่องคุณเท่านั้น เว็บไม่ได้ส่งหรือเก็บทะเบียนและวันเกิดของคุณ</p>

      {(result || personal) && (
        <section className="lucky-result container" aria-live="polite" aria-label="ผลเช็กทะเบียน">
          {result && <PlateResultCard result={result} goalShort={goalInfo?.short ?? null} personal={personal} />}

          {personal && goalInfo && <PersonalCard personal={personal} goalShort={goalInfo.short} />}

          {goalInfo && (
            <div className="lucky-card__actions">
              <ShareButton
                className="icon-btn icon-btn--gold"
                label="แชร์หน้าเช็กทะเบียนรถมงคล"
                title={`ลองเช็กทะเบียนรถมงคลด้าน${goalInfo.short}ของคุณ`}
                path="/tools/license-plate"
              />
            </div>
          )}

          <Link
            href={`/fortune-tellers?${goal ? `goal=${goal}&` : ''}discipline=lucky-numbers`}
            className="shortcut-card shortcut-card--flush"
            onClick={() => track('click_to_fortune_teller', { slug: 'license-plate', goal: goal ?? undefined, discipline: 'lucky-numbers' })}
          >
            <span className="shortcut-card__body">
              <span className="shortcut-card__title">อยากให้ผู้เชี่ยวชาญช่วยเลือกทะเบียน</span>
              <span className="shortcut-card__sub">ดูหมอดูสายเบอร์มงคล / ทะเบียนรถ</span>
            </span>
          </Link>
        </section>
      )}

      <section className="container method-box" aria-label="หลักคำนวณ">
        <p>
          <strong>หลักคำนวณ: {PLATE_METHOD.name}</strong>
        </p>
        <p>{PLATE_METHOD.description}</p>
        <ul className="how-to__list">
          {PLATE_RULES.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
        <p>
          ความหมายเป็นความเชื่อ แต่ละตำราอาจต่างกัน คู่หรือผลรวมที่แหล่งเห็นต่างจะมีป้ายบอกไว้
          อักษรและเลขตามวันเกิดใช้หลักทักษาเดียวกับสีเสื้อมงคลของเว็บ ส่วนการจับคู่อักษรกับเรื่องที่อยากเสริมเป็นการตีความของเว็บ
        </p>
        <details>
          <summary>แหล่งข้อมูล ({PLATE_SOURCES.length})</summary>
          <ul className="how-to__list">
            {PLATE_SOURCES.map((s) => (
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

function PlateResultCard({
  result,
  goalShort,
  personal,
}: {
  result: PlateResult;
  goalShort: string | null;
  personal: PlatePersonal | null;
}) {
  const { plate } = result;
  const warn = personal ? plateWarnings(result, personal) : null;
  const steps = [
    ...result.letterValues.map((l) => `${l.letter} ${l.value}`),
    ...(plate.prefix + plate.number).split(''),
  ].join(' + ');
  return (
    <div className="lucky-card">
      <div className="lucky-card__eyebrow">
        ทะเบียน {plate.prefix}
        {plate.letters} {plate.number}
      </div>
      <div className="phone-sum">
        <span className="phone-sum__value">{result.total}</span>
        <span>
          <span className="phone-sum__label">ผลรวมทะเบียน</span>
          {result.totalMeaning ? (
            <>
              <LevelTag m={result.totalMeaning} /> {result.totalMeaning.meaning}
            </>
          ) : (
            'ยังไม่มีความหมายของผลรวมนี้ในตาราง'
          )}
        </span>
      </div>
      <p className="note">
        {steps} = {result.total}
      </p>
      <p className="phone-summary">บวกเฉพาะตัวเลขแล้วย่อเหลือหลักเดียว (อีกสายที่นิยม) ได้ {result.digitRoot}</p>
      {result.goal && goalShort && (
        <p className="phone-summary phone-summary--goal">
          {result.goal.totalSupports ? `ผลรวมนี้ส่งเรื่อง${goalShort}` : `ผลรวมนี้ไม่ได้ส่งเรื่อง${goalShort}โดยตรง`}
          {result.goal.support.length > 0 && ` · คู่เลขที่ส่ง ${result.goal.support.map((p) => p.pair).join(', ')}`}
        </p>
      )}
      {warn && (warn.letters.length > 0 || warn.digitCount > 0) && (
        <p className="phone-summary phone-warn">
          {warn.letters.length > 0 && `มีอักษรกาลกิณีของคุณ (${warn.letters.join(' ')}) `}
          {warn.digitCount > 0 && `มีเลขกาลกิณีของคุณ (${personal!.avoidDigit}) ${warn.digitCount} ตัว`}
          {warn.lastIsAvoid && ' และอยู่ตัวท้ายสุด'}
        </p>
      )}
      {result.pairs.length > 0 && (
        <ul className="phone-pairs">
          {result.pairs.map((p) => (
            <li key={p.index} className={`phone-pair phone-pair--${p.level}`}>
              <span className="phone-pair__num">{p.pair}</span>
              <span className="phone-pair__text">
                <LevelTag m={p} />
                {p.groups.map((g) => (
                  <span key={g.label} className={`tag phone-tag ${g.good ? 'phone-tag--good' : 'phone-tag--bad'}`}>
                    {g.label}
                  </span>
                ))}{' '}
                {p.meaning}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PersonalCard({ personal, goalShort }: { personal: PlatePersonal; goalShort: string }) {
  return (
    <div className="lucky-card">
      <div className="lucky-card__eyebrow">
        เกิด{personal.birthLabel} อยากเสริมเรื่อง{goalShort}
      </div>
      <dl className="phone-personal">
        <div>
          <dt>อักษรและเลขเสริม</dt>
          <dd>
            <span className="phone-digit phone-digit--good">{personal.goalDigit}</span>
            <span className="plate-letters">{personal.goalLetters.join(' ')}</span>
          </dd>
        </div>
        <div>
          <dt>อักษรและเลขกาลกิณี ควรเลี่ยง</dt>
          <dd>
            <span className="phone-digit phone-digit--bad">{personal.avoidDigit}</span>
            <span className="plate-letters">{personal.avoidLetters.join(' ')}</span>
          </dd>
        </div>
      </dl>
      <h3 className="phone-sub">ผลรวมที่ส่งเรื่อง{goalShort}</h3>
      <ul className="plate-totals">
        {personal.goodTotals.map((n) => (
          <li key={n} className="plate-total" title={PLATE_SUMS[n]?.meaning}>
            {n}
          </li>
        ))}
      </ul>
      <p className="note">ใช้ตอนจองหรือประมูลทะเบียน: เลือกหมวดที่ไม่มีอักษรกาลกิณี และให้ผลรวมออกมาเป็นเลขข้างบน</p>
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
