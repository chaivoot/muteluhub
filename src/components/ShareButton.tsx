'use client';

import { useState } from 'react';
import { UiIcon } from './icons';

interface Props {
  label: string;
  title: string;
  path: string;
  className?: string;
}

/** ใช้ Web Share บนมือถือ ถ้าไม่มีให้คัดลอกลิงก์ */
export function ShareButton({ label, title, path, className }: Props) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = new URL(path, window.location.origin).toString();
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // ผู้ใช้กดยกเลิก
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(`${title}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('คัดลอกลิงก์', url);
    }
  }

  return (
    <button type="button" className={className} aria-label={copied ? 'คัดลอกลิงก์แล้ว' : label} onClick={share}>
      <UiIcon name="share" size={20} strokeWidth={2} />
      <span className="visually-hidden" aria-live="polite">
        {copied ? 'คัดลอกลิงก์แล้ว' : ''}
      </span>
    </button>
  );
}
