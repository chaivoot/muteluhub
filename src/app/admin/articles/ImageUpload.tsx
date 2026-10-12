'use client';

import { useRef, useState } from 'react';

const MAX_SIDE = 1600;

/** ย่อรูปในเบราว์เซอร์เป็น webp ด้านยาวไม่เกิน 1600px (ไฟล์เล็ก โหลดเร็ว ไม่เปลืองฐานข้อมูล) */
async function shrink(file: File): Promise<{ blob: Blob; width: number; height: number }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, width, height);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.82));
  if (!blob) throw new Error('แปลงรูปไม่สำเร็จ');
  return { blob, width, height };
}

/** ปุ่มอัปโหลดรูป ส่งไป /admin/media แล้วคืน src (/media/<id>) */
export function ImageUpload({ label, onUploaded }: { label: string; onUploaded: (src: string) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<{ busy: boolean; error?: string }>({ busy: false });

  const upload = async (file: File) => {
    setState({ busy: true });
    try {
      const { blob, width, height } = await shrink(file);
      const form = new FormData();
      form.append('file', blob, 'image.webp');
      form.append('width', String(width));
      form.append('height', String(height));
      const res = await fetch('/admin/media', { method: 'POST', body: form });
      const json = (await res.json()) as { src?: string; error?: string };
      if (!res.ok || !json.src) throw new Error(json.error ?? 'อัปโหลดไม่สำเร็จ');
      onUploaded(json.src);
      setState({ busy: false });
    } catch (e) {
      setState({ busy: false, error: e instanceof Error ? e.message : 'อัปโหลดไม่สำเร็จ' });
    } finally {
      if (input.current) input.current.value = '';
    }
  };

  return (
    <span className="upload">
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="visually-hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void upload(f);
        }}
      />
      <button type="button" className="btn btn--outline btn--sm" disabled={state.busy} onClick={() => input.current?.click()}>
        {state.busy ? 'กำลังอัปโหลด...' : label}
      </button>
      {state.error && <span className="field__error">{state.error}</span>}
    </span>
  );
}
