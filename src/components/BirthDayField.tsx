'use client';

import { useState } from 'react';
import { BIRTH_DAYS, birthDaySlugFromWeekday } from '@/lib/phone-number/personal';

/** เลือกวันเกิดแบบทักษา 8 วัน (พุธแยกกลางวัน/กลางคืน) หรือกรอกวันที่ให้เว็บหาวันให้ */
export function BirthDayField({ value, onChange }: { value: string; onChange: (slug: string) => void }) {
  const [date, setDate] = useState('');

  function pickDate(iso: string) {
    setDate(iso);
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    if (!m) return;
    const w = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]))).getUTCDay();
    onChange(birthDaySlugFromWeekday(w));
  }

  return (
    <div className="field">
      <label htmlFor="birth-day" className="field__label">
        เกิดวันอะไร (ไม่บังคับ)
      </label>
      <select id="birth-day" className="select" value={value} onChange={(e) => onChange(e.target.value)}>
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
          <input className="input" type="date" value={date} onChange={(e) => pickDate(e.target.value)} />
        </label>
        <span>เกิดวันพุธหลัง 18.00 น. นับเป็นพุธกลางคืน เลือกเองในช่องด้านบน</span>
      </details>
    </div>
  );
}
