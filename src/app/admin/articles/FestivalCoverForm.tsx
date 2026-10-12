'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { ArticleImage } from '@/data/articles';
import { setFestivalCoverAction } from './actions';
import { ImageUpload } from './ImageUpload';

/** รูปปกหน้าเทศกาล: อัปโหลดแทนรูปในโค้ด หรือกลับไปใช้รูปเดิม */
export function FestivalCoverForm({
  slug,
  name,
  current,
  fromDb,
}: {
  slug: string;
  name: string;
  current: ArticleImage | null;
  /** true = รูปที่เห็นมาจากหลังบ้าน (ลบได้) */
  fromDb: boolean;
}) {
  const [draft, setDraft] = useState<ArticleImage | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();
  const shown = draft ?? current;

  const run = (cover: ArticleImage | null) =>
    start(async () => {
      setMsg(null);
      const res = await setFestivalCoverAction(slug, cover);
      if (res.error) return setMsg(res.error);
      setDraft(null);
      setMsg('บันทึกแล้ว');
      router.refresh();
    });

  return (
    <li className="admin-item admin-cover">
      {shown ? (
        <img src={shown.src} alt="" className="admin-item__thumb" />
      ) : (
        <span className="admin-item__thumb admin-item__thumb--missing">ไม่มีภาพ</span>
      )}
      <div className="admin-item__main">
        <div className="admin-item__name">{name}</div>
        {shown && <div className="note">เครดิต: {shown.credit}</div>}
        {draft && (
          <span className="article-editor__pair">
            <input className="input" placeholder="คำอธิบายรูป" value={draft.alt} onChange={(e) => setDraft({ ...draft, alt: e.target.value })} />
            <input className="input" placeholder="เครดิต" value={draft.credit} onChange={(e) => setDraft({ ...draft, credit: e.target.value })} />
          </span>
        )}
        <span className="actions actions--wrap">
          <ImageUpload
            label={shown ? 'เปลี่ยนรูปปก' : 'อัปโหลดรูปปก'}
            onUploaded={(src) => setDraft({ src, alt: name, credit: 'ภาพประกอบ' })}
          />
          {draft && (
            <button type="button" className="btn btn--gold btn--sm" disabled={pending} onClick={() => run(draft)}>
              บันทึกรูปปก
            </button>
          )}
          {!draft && fromDb && (
            <button type="button" className="btn btn--outline btn--sm" disabled={pending} onClick={() => run(null)}>
              กลับไปใช้รูปเดิม
            </button>
          )}
        </span>
        {msg && <span className="note">{msg}</span>}
      </div>
    </li>
  );
}
