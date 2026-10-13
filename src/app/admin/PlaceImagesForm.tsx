'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { PlaceImage } from '@/data/places';
import { ImageUpload } from './articles/ImageUpload';
import { addPlaceImageAction, removePlaceImageAction } from './actions';

const LICENSES = ['ถ่ายเอง', 'ได้รับอนุญาตจากเจ้าของภาพ', 'CC BY 4.0', 'CC BY-SA 4.0', 'Public domain'];

/** อัปโหลดรูปสถานที่จากหลังบ้าน (ภาพจริงพร้อมเครดิตเท่านั้น) */
export function PlaceImagesForm({ slug, name, uploaded }: { slug: string; name: string; uploaded: PlaceImage[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<PlaceImage | null>(null);
  const [cover, setCover] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const set = (patch: Partial<PlaceImage>) => setDraft((d) => (d ? { ...d, ...patch } : d));

  const save = () =>
    start(async () => {
      if (!draft) return;
      setMsg(null);
      const res = await addPlaceImageAction(slug, draft, cover);
      if (res.error) return setMsg(res.error);
      setDraft(null);
      setConfirmed(false);
      setMsg('บันทึกแล้ว รูปขึ้นหน้าเว็บภายในไม่กี่วินาที');
      router.refresh();
    });

  const remove = (src: string) =>
    start(async () => {
      if (!window.confirm('เอารูปนี้ออก?')) return;
      const res = await removePlaceImageAction(slug, src);
      setMsg(res.error ?? 'เอารูปออกแล้ว');
      router.refresh();
    });

  return (
    <div className="place-images">
      {uploaded.length > 0 && (
        <ul className="place-images__list">
          {uploaded.map((img) => (
            <li key={img.src}>
              <img src={img.src} alt={img.alt} className="admin-item__thumb" />
              <span className="note">
                {img.author} / {img.license}
              </span>
              <button type="button" className="link-btn" disabled={pending} onClick={() => remove(img.src)}>
                เอาออก
              </button>
            </li>
          ))}
        </ul>
      )}

      {!draft ? (
        <ImageUpload
          label={uploaded.length ? '+ เพิ่มรูปอีก' : '+ เลือกรูปจากเครื่อง'}
          className="btn btn--gold place-images__pick"
          onUploaded={(src) => setDraft({ src, alt: name, author: '', license: 'ถ่ายเอง', sourceUrl: '' })}
        />
      ) : (
        <div className="stack">
          <img src={draft.src} alt="" className="place-images__preview" />
          <label className="field">
            <span className="field__label">คำอธิบายรูป</span>
            <input className="input" value={draft.alt} onChange={(e) => set({ alt: e.target.value })} />
          </label>
          <label className="field">
            <span className="field__label">เจ้าของภาพ / ช่างภาพ (ขึ้นเป็นเครดิต)</span>
            <input className="input" placeholder="เช่น ชื่อคุณ หรือชื่อเพจ" value={draft.author} onChange={(e) => set({ author: e.target.value })} />
          </label>
          <label className="field">
            <span className="field__label">สิทธิ์การใช้ภาพ</span>
            <select className="select" value={draft.license} onChange={(e) => set({ license: e.target.value })}>
              {LICENSES.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field__label">ลิงก์ที่มาของภาพ (ไม่บังคับ ถ้าถ่ายเองเว้นว่าง)</span>
            <input className="input" placeholder="https://" value={draft.sourceUrl} onChange={(e) => set({ sourceUrl: e.target.value })} />
          </label>
          <label className="admin-pins__opt">
            <input type="checkbox" checked={cover} onChange={(e) => setCover(e.target.checked)} />
            ใช้เป็นรูปหลัก (ขึ้นการ์ดและหัวหน้า)
          </label>
          <label className="admin-pins__opt">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} />
            เป็นภาพจริงของสถานที่นี้ ไม่ใช่ภาพ AI และไม่ได้เอามาจาก Google Maps
          </label>
          <span className="actions actions--wrap">
            <button type="button" className="btn btn--gold btn--sm" disabled={pending || !confirmed} onClick={save}>
              บันทึกรูป
            </button>
            <button type="button" className="btn btn--outline btn--sm" disabled={pending} onClick={() => setDraft(null)}>
              ยกเลิก
            </button>
          </span>
        </div>
      )}
      {msg && <p className="note">{msg}</p>}
    </div>
  );
}
