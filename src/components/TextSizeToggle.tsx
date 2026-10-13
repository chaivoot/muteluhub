'use client';

import { useEffect, useState } from 'react';

const SIZES = [
  { key: 'm', label: 'ก', aria: 'ตัวอักษรขนาดปกติ' },
  { key: 'l', label: 'ก', aria: 'ตัวอักษรใหญ่' },
  { key: 'xl', label: 'ก', aria: 'ตัวอักษรใหญ่มาก' },
] as const;
type Size = (typeof SIZES)[number]['key'];
const STORAGE_KEY = 'mh_text_size';

/** ปุ่มปรับขนาดตัวอักษรของเนื้อหาบทความ จำค่าไว้ในเบราว์เซอร์ (ผู้อ่านสายมูหลายคนสูงอายุ) */
export function TextSizeToggle() {
  const [size, setSize] = useState<Size>('m');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'l' || saved === 'xl') setSize(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.dataset.textSize = size;
    try {
      localStorage.setItem(STORAGE_KEY, size);
    } catch {}
  }, [size]);

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
          onClick={() => setSize(s.key)}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
