'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { EVENT_TYPES, getEventType, SPECIAL_LABEL, type EventSlug } from '@/data/auspicious';
import { CALENDAR_RANGE, dayInfo, rateDay, type DayLevel } from '@/lib/auspicious';
import { formatLunar } from '@/lib/lunar';
import { parseIsoDay, TH_MONTHS, TH_MONTHS_SHORT, TH_WEEKDAYS, toBuddhistYear } from '@/lib/thai-date';
import { toThaiDigits } from '@/lib/thai-digits';

const LEVEL_LABEL: Record<DayLevel, string> = {
  good: 'วันดี',
  ok: 'ทั่วไป',
  caution: 'ไม่นิยม',
  avoid: 'ควรเลี่ยง',
  unknown: 'รอประกาศ',
};

const WEEK_HEAD = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

const pad = (n: number) => String(n).padStart(2, '0');
const isoOf = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;
const monthKey = (iso: string) => iso.slice(0, 7);
const shiftMonth = (key: string, delta: number) => {
  const d = new Date(Date.UTC(+key.slice(0, 4), +key.slice(5, 7) - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}`;
};

/** ปฏิทินมงคลรายเดือน: เลือกประเภทงาน วันที่เป็นเลขอารบิก วันจันทรคติเป็นเลขไทย */
export function CalendarView({ initialEvent, todayIso }: { initialEvent: EventSlug; todayIso: string }) {
  const [eventSlug, setEventSlug] = useState<EventSlug>(initialEvent);
  const [month, setMonth] = useState(monthKey(todayIso));
  const [selected, setSelected] = useState<string>(todayIso);
  const event = getEventType(eventSlug)!;

  const days = useMemo(() => {
    const y = +month.slice(0, 4);
    const m = +month.slice(5, 7);
    const count = new Date(Date.UTC(y, m, 0)).getUTCDate();
    return Array.from({ length: count }, (_, i) => {
      const iso = isoOf(y, m, i + 1);
      const info = dayInfo(iso);
      return { iso, day: i + 1, info, rating: rateDay(info, event) };
    });
  }, [month, event]);

  const firstWeekday = parseIsoDay(`${month}-01`).weekday;
  const canPrev = shiftMonth(month, -1) >= monthKey(CALENDAR_RANGE.from) && shiftMonth(month, -1) >= monthKey(todayIso);
  const canNext = shiftMonth(month, 1) <= monthKey(CALENDAR_RANGE.to);
  const goodDays = days.filter((d) => d.rating.level === 'good' && d.iso >= todayIso);
  const sel = days.find((d) => d.iso === selected) ?? null;
  const [y, m] = [+month.slice(0, 4), +month.slice(5, 7)];

  return (
    <>
      <div className="chip-row chip-row--wrap container" role="radiogroup" aria-label="ประเภทงาน">
        {EVENT_TYPES.map((e) => (
          <button
            key={e.slug}
            type="button"
            role="radio"
            aria-checked={e.slug === eventSlug}
            className="chip"
            onClick={() => {
              setEventSlug(e.slug);
              window.history.replaceState(null, '', `/calendar/${e.slug}`);
            }}
          >
            {e.name}
          </button>
        ))}
      </div>

      <section className="container cal" aria-label={`ปฏิทิน${TH_MONTHS[m - 1]} ${toBuddhistYear(y)}`}>
        <div className="cal__head">
          <button type="button" className="icon-btn" aria-label="เดือนก่อน" disabled={!canPrev} onClick={() => setMonth(shiftMonth(month, -1))}>
            ‹
          </button>
          <span className="cal__title">
            {TH_MONTHS[m - 1]} {toBuddhistYear(y)}
          </span>
          <button type="button" className="icon-btn" aria-label="เดือนถัดไป" disabled={!canNext} onClick={() => setMonth(shiftMonth(month, 1))}>
            ›
          </button>
        </div>
        <div className="cal__grid" role="grid">
          {WEEK_HEAD.map((w) => (
            <span key={w} className="cal__wd" role="columnheader">
              {w}
            </span>
          ))}
          {Array.from({ length: firstWeekday }, (_, i) => (
            <span key={`b${i}`} />
          ))}
          {days.map((d) => (
            <button
              key={d.iso}
              type="button"
              role="gridcell"
              className={`cal__day cal__day--${d.rating.level}${d.iso === todayIso ? ' cal__day--today' : ''}${d.iso < todayIso ? ' cal__day--past' : ''}`}
              aria-pressed={d.iso === selected}
              aria-label={`${d.day} ${TH_MONTHS[m - 1]} ${LEVEL_LABEL[d.rating.level]}`}
              onClick={() => setSelected(d.iso)}
            >
              <span className="cal__num">{d.day}</span>
              {d.info.lunar && (
                <span className="cal__lunar">
                  {d.info.lunar.waxing ? '' : '-'}
                  {toThaiDigits(d.info.lunar.day)}
                </span>
              )}
              {d.info.holyDay && <span className="cal__holy" aria-hidden="true" />}
            </button>
          ))}
        </div>
        <ul className="cal__legend">
          {(['good', 'ok', 'caution', 'avoid'] as DayLevel[]).map((l) => (
            <li key={l}>
              <span className={`cal__swatch cal__day--${l}`} />
              {LEVEL_LABEL[l]}
            </li>
          ))}
          <li>
            <span className="cal__holy cal__holy--legend" />
            วันพระ
          </li>
        </ul>
        <p className="note">เลขเล็กใต้วันที่คือค่ำ (มีขีดนำหน้า = ข้างแรม)</p>
      </section>

      {sel && (
        <section className="container" aria-live="polite">
          <div className={`day-detail day-detail--${sel.rating.level}`}>
            <div className="day-detail__date">
              วัน{TH_WEEKDAYS[parseIsoDay(sel.iso).weekday]} {sel.day} {TH_MONTHS[m - 1]} {toBuddhistYear(y)}
            </div>
            {sel.info.lunar && <div className="day-detail__lunar">{formatLunar(sel.info.lunar)}</div>}
            <div className="tag-row">
              <span className={`tag day-tag--${sel.rating.level}`}>
                {event.name}: {LEVEL_LABEL[sel.rating.level]}
              </span>
              {sel.info.special.map((s) => (
                <span key={s} className="tag">
                  {SPECIAL_LABEL[s]}
                </span>
              ))}
              {sel.info.holyDay && <span className="tag">วันพระ</span>}
              {sel.info.mahasun && <span className="tag">ดิถีมหาสูญ</span>}
            </div>
            {sel.rating.reasons.length > 0 && <p className="note">{sel.rating.reasons.join(' · ')}</p>}
          </div>
        </section>
      )}

      <section className="container">
        <div className="section-header section-header--flush">
          <h2 className="section-header__title">วันดีสำหรับ{event.name}เดือนนี้</h2>
        </div>
        {goodDays.length > 0 ? (
          <ul className="good-days">
            {goodDays.map((d) => (
              <li key={d.iso}>
                <button type="button" className="good-day" onClick={() => setSelected(d.iso)}>
                  <span className="good-day__date">
                    {TH_WEEKDAYS[parseIsoDay(d.iso).weekday]} {d.day} {TH_MONTHS_SHORT[m - 1]}
                  </span>
                  <span className="good-day__why">{d.rating.reasons.join(' · ')}</span>
                  {d.info.lunar && <span className="good-day__lunar">{formatLunar(d.info.lunar)}</span>}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="note">เดือนนี้ไม่มีวันที่เข้าเกณฑ์วันดีสำหรับ{event.name} ลองดูเดือนถัดไป หรือเลือกวันทั่วไปที่ไม่ติดข้อห้าม</p>
        )}
      </section>

      <section className="container">
        <div className="section-header section-header--flush">
          <h2 className="section-header__title">หลักที่ใช้สำหรับ{event.name}</h2>
        </div>
        <ul className="bullet-list">
          {event.rules.map((r) => (
            <li key={r.text}>
              {r.text}{' '}
              <a href={r.source} target="_blank" rel="noopener noreferrer" className="note">
                ที่มา
              </a>
            </li>
          ))}
        </ul>
        <Link href={`/fortune-tellers?discipline=auspicious-timing&goal=${event.goals[0]}`} className="shortcut-card shortcut-card--flush cal__cta">
          <span className="shortcut-card__body">
            <span className="shortcut-card__title">อยากได้ฤกษ์เฉพาะตัว</span>
            <span className="shortcut-card__sub">ดูหมอดูที่รับหาฤกษ์ ฤกษ์จากดวงเจ้าของงานละเอียดกว่าปฏิทินทั่วไป</span>
          </span>
        </Link>
      </section>
    </>
  );
}
