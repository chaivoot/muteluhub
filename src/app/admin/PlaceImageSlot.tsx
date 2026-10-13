'use client';

import { useCallback, useState } from 'react';
import { BottomSheet } from '@/components/BottomSheet';
import type { PlaceImage } from '@/data/places';
import { PlaceImagesForm } from './PlaceImagesForm';

/** ช่องรูปของสถานที่ในหลังบ้าน: แตะรูป (หรือ + ใส่รูป) เพื่อเปิดแผ่นอัปโหลด */
export function PlaceImageSlot({
  slug,
  name,
  thumb,
  uploaded,
}: {
  slug: string;
  name: string;
  thumb: string | null;
  uploaded: PlaceImage[];
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  return (
    <>
      <button
        type="button"
        className={thumb ? 'admin-photo' : 'admin-photo admin-photo--missing'}
        aria-label={thumb ? `จัดการรูป ${name}` : `ใส่รูป ${name}`}
        onClick={() => setOpen(true)}
      >
        {thumb ? (
          <>
            <img src={thumb} alt="" loading="lazy" />
            <span className="admin-photo__badge">แก้รูป</span>
          </>
        ) : (
          <>
            <span className="admin-photo__plus" aria-hidden="true">
              +
            </span>
            ใส่รูป
          </>
        )}
      </button>
      <BottomSheet open={open} title={`รูป: ${name}`} onClose={close}>
        <PlaceImagesForm slug={slug} name={name} uploaded={uploaded} />
      </BottomSheet>
    </>
  );
}
