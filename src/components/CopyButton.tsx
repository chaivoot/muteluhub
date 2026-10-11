'use client';

import { useState } from 'react';

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // fallback สำหรับเบราว์เซอร์ที่ไม่มี clipboard API / ไม่ใช่ https
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    el.remove();
    return ok;
  }
}

interface Props {
  text: string;
  label: string;
  className?: string;
  onCopied?: () => void;
}

export function CopyButton({ text, label, className = 'btn btn--gold', onCopied }: Props) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');

  async function handle() {
    const ok = await copyText(text);
    setState(ok ? 'copied' : 'failed');
    if (ok) onCopied?.();
    setTimeout(() => setState('idle'), 2000);
  }

  return (
    <button type="button" className={className} onClick={handle}>
      <span aria-live="polite">{state === 'copied' ? 'คัดลอกแล้ว' : state === 'failed' ? 'คัดลอกไม่สำเร็จ' : label}</span>
    </button>
  );
}
