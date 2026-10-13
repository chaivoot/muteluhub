'use client';

import { useRef, useState } from 'react';

const MAX_SIDE = 1600;
const MAX_BYTES = 2.8 * 1024 * 1024; // เซิร์ฟเวอร์รับไม่เกิน 3 MB

/** อ่านรูป: createImageBitmap ก่อน ถ้าเบราว์เซอร์ทำไม่ได้ (เช่น HEIC บนบางเครื่อง) ใช้ <img> แทน */
async function decode(file: File): Promise<{ source: CanvasImageSource; width: number; height: number }> {
  try {
    const bitmap = await createImageBitmap(file);
    return { source: bitmap, width: bitmap.width, height: bitmap.height };
  } catch {
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      return { source: img, width: img.naturalWidth, height: img.naturalHeight };
    } catch {
      throw new Error('เปิดไฟล์รูปนี้ไม่ได้ ลองส่งเป็น JPG หรือถ่ายหน้าจอรูปแล้วอัปโหลดแทน');
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

const toBlob = (canvas: HTMLCanvasElement, type: string, quality: number) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));

/**
 * ย่อรูปในเบราว์เซอร์ ด้านยาวไม่เกิน 1600px (ไฟล์เล็ก โหลดเร็ว ไม่เปลืองฐานข้อมูล)
 * ใช้ webp ถ้าเบราว์เซอร์ทำได้ Safari/iPhone บางรุ่นทำ webp ไม่ได้ (ได้ PNG ไฟล์ใหญ่) จึงใช้ JPG แทน
 * ถ้ายังใหญ่เกินจะลดคุณภาพและขนาดลงจนพอดี
 */
async function shrink(file: File): Promise<{ blob: Blob; width: number; height: number }> {
  const img = await decode(file);
  let side = MAX_SIDE;
  for (let attempt = 0; attempt < 4; attempt++) {
    const scale = Math.min(1, side / Math.max(img.width, img.height));
    const width = Math.round(img.width * scale);
    const height = Math.round(img.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d')!.drawImage(img.source, 0, 0, width, height);
    let blob = await toBlob(canvas, 'image/webp', 0.82);
    if (!blob || blob.type !== 'image/webp') blob = await toBlob(canvas, 'image/jpeg', attempt === 0 ? 0.85 : 0.75);
    if (blob && blob.size <= MAX_BYTES) return { blob, width, height };
    side = Math.round(side * 0.75);
  }
  throw new Error('รูปใหญ่เกินไป ลองรูปอื่นหรือครอปให้เล็กลง');
}

/** ปุ่มอัปโหลดรูป ส่งไป /admin/media แล้วคืน src (/media/<id>) */
export function ImageUpload({
  label,
  onUploaded,
  className = 'btn btn--outline btn--sm',
}: {
  label: string;
  onUploaded: (src: string) => void;
  className?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<{ busy: boolean; error?: string }>({ busy: false });

  const upload = async (file: File) => {
    setState({ busy: true });
    try {
      const { blob, width, height } = await shrink(file);
      const form = new FormData();
      form.append('file', blob, blob.type === 'image/webp' ? 'image.webp' : 'image.jpg');
      form.append('width', String(width));
      form.append('height', String(height));
      const res = await fetch('/admin/media', { method: 'POST', body: form });
      const json = (await res.json().catch(() => ({}))) as { src?: string; error?: string };
      if (res.status === 401) throw new Error('หลุดจากระบบหลังบ้าน เข้าสู่ระบบใหม่แล้วลองอีกครั้ง');
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
        accept="image/*"
        className="visually-hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void upload(f);
        }}
      />
      <button type="button" className={className} disabled={state.busy} onClick={() => input.current?.click()}>
        {state.busy ? 'กำลังอัปโหลด...' : label}
      </button>
      {state.error && <span className="field__error">{state.error}</span>}
    </span>
  );
}
