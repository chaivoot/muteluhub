'use client';

import { useEffect, useState } from 'react';
import { TEXT_SIZE_KEY } from '@/lib/text-size';

const SIZES = [
  { key: 'm', label: 'ก', aria: 'ตัวอักษรขนาดปกติ' },
  { key: 'l', label: 'ก', aria: 'ตัวอักษรใหญ่' },
  { key: 'xl', label: 'ก', aria: 'ตัวอักษรใหญ่มาก' },
] as const;
type Size = (typeof SIZES)[number]['key'];
/** ปุ่มปรับขนาดตัวอักษรทั้งเว็บ (ผู้อ่านสายมูหลายคนสูงอายุ) จำค่าไว้ในเบราว์เซอร์ */
export function TextSizeToggle() {
  const [size, setSize] = useState<Size>('m');

  useEffect(() => {
    const cur = document.documentElement.dataset.textSize;
    if (cur === 'l' || cur === 'xl') setSize(cur);
  }, []);

  const choose = (s: Size) => {
    setSize(s);
    document.documentElement.dataset.textSize = s;
    try {
      localStorage.setItem(TEXT_SIZE_KEY, s);
    } catch {}
  };

  return (
    <div className="text-size" role="group" aria-label="ขนาดตัวอักษร">
      <span className="text-size__label">ขนาดตัวอักษร</span>
      {SIZES.map((s) => (
        <button
          key={s.key}
          type="button"
          className={`text-size__btn text-size__btn--${s.key}`}
          aria-label={s.aria}
          aria-pressed={size === s.key}
          onClick={() => choose(s.key)}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
