'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState, useTransition } from 'react';
import type { Article, ArticleImage } from '@/data/articles';
import { GOALS } from '@/lib/goals';
import { Markdown } from '@/lib/markdown';
import { saveArticleAction } from './actions';
import { ImageUpload } from './ImageUpload';

type Draft = Omit<Article, 'publishedAt' | 'updatedAt'>;

const EMPTY: Draft = {
  slug: '',
  title: '',
  excerpt: '',
  body: '',
  cover: null,
  goals: [],
  festival: null,
  seoTitle: null,
  published: false,
};

/** ฟอร์มเขียน/แก้บทความ เนื้อหาเป็น markdown แบบย่อ มีปุ่มแทรกรูปและดูตัวอย่าง */
export function ArticleEditor({
  initial,
  festivals,
}: {
  initial: Draft | null;
  festivals: { slug: string; name: string }[];
}) {
  const isNew = initial === null;
  const [d, setD] = useState<Draft>(initial ?? EMPTY);
  const [preview, setPreview] = useState(false);
  const [msg, setMsg] = useState<{ ok?: string; error?: string }>({});
  const [pending, startTransition] = useTransition();
  const body = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }));

  const insertAtCursor = (text: string) => {
    const el = body.current;
    const pos = el ? el.selectionStart : d.body.length;
    const before = d.body.slice(0, pos);
    const after = d.body.slice(pos);
    const pad = before && !before.endsWith('\n\n') ? (before.endsWith('\n') ? '\n' : '\n\n') : '';
    set('body', `${before}${pad}${text}\n\n${after}`);
  };

  const save = () =>
    startTransition(async () => {
      setMsg({});
      const res = await saveArticleAction(d, isNew);
      if (res.error) return setMsg({ error: res.error });
      setMsg({ ok: d.published ? 'บันทึกและเผยแพร่แล้ว' : 'บันทึกฉบับร่างแล้ว' });
      if (isNew) router.replace(`/admin/articles/${res.slug}`);
      else router.refresh();
    });

  const setCover = (patch: Partial<ArticleImage>) =>
    set('cover', { src: '', alt: d.title, credit: 'ภาพประกอบ', ...(d.cover ?? {}), ...patch });

  return (
    <div className="article-editor stack">
      <label className="field">
        <span className="field__label">ชื่อบทความ</span>
        <input className="input" value={d.title} onChange={(e) => set('title', e.target.value)} />
      </label>
      <label className="field">
        <span className="field__label">slug (ส่วนท้าย URL ภาษาอังกฤษ)</span>
        <input
          className="input input--code"
          value={d.slug}
          disabled={!isNew}
          placeholder="halloween-mutelu-tips"
          onChange={(e) => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
        />
        {!isNew && <span className="note">เปลี่ยน slug ไม่ได้หลังสร้าง (ลิงก์เดิมจะเสีย)</span>}
      </label>
      <label className="field">
        <span className="field__label">สรุปสั้น (ขึ้นบนการ์ดและผลค้นหา Google)</span>
        <textarea className="input input--multi" rows={2} value={d.excerpt} onChange={(e) => set('excerpt', e.target.value)} />
      </label>

      <fieldset className="field">
        <legend className="field__label">รูปปก</legend>
        {d.cover?.src && <img src={d.cover.src} alt="" className="article-editor__cover" />}
        <span className="actions actions--wrap">
          <ImageUpload label={d.cover?.src ? 'เปลี่ยนรูปปก' : 'อัปโหลดรูปปก'} onUploaded={(src) => setCover({ src })} />
          {d.cover && (
            <button type="button" className="btn btn--outline btn--sm" onClick={() => set('cover', null)}>
              เอารูปปกออก
            </button>
          )}
        </span>
        {d.cover && (
          <span className="article-editor__pair">
            <input className="input" placeholder="คำอธิบายรูป" value={d.cover.alt} onChange={(e) => setCover({ alt: e.target.value })} />
            <input className="input" placeholder="เครดิต เช่น ภาพประกอบ" value={d.cover.credit} onChange={(e) => setCover({ credit: e.target.value })} />
          </span>
        )}
      </fieldset>

      <fieldset className="field">
        <legend className="field__label">เนื้อหา</legend>
        <span className="actions actions--wrap">
          <button type="button" className="btn btn--outline btn--sm" onClick={() => setPreview((p) => !p)}>
            {preview ? 'กลับไปแก้' : 'ดูตัวอย่าง'}
          </button>
          {!preview && (
            <>
              <button type="button" className="btn btn--outline btn--sm" onClick={() => insertAtCursor('## หัวข้อ')}>
                + หัวข้อ
              </button>
              <ImageUpload label="+ แทรกรูป" onUploaded={(src) => insertAtCursor(`![คำอธิบายรูป](${src} "ภาพประกอบ")`)} />
            </>
          )}
        </span>
        {preview ? (
          <div className="article-editor__preview">
            <Markdown source={d.body} />
          </div>
        ) : (
          <textarea
            ref={body}
            className="input input--multi article-editor__body"
            rows={18}
            value={d.body}
            onChange={(e) => set('body', e.target.value)}
          />
        )}
        <details className="note">
          <summary>วิธีจัดรูปแบบ</summary>
          <ul className="bullet-list">
            <li>## หัวข้อใหญ่ / ### หัวข้อย่อย</li>
            <li>เว้นบรรทัดว่าง = ขึ้นย่อหน้าใหม่</li>
            <li>- ข้อความ = รายการแบบจุด, 1. ข้อความ = รายการแบบเลข</li>
            <li>**ตัวหนา** และ [ข้อความลิงก์](https://...)</li>
            <li>&gt; ข้อความ = กล่องเน้น</li>
            <li>รูป: ![คำอธิบาย](/media/... &quot;เครดิต&quot;) ปุ่มแทรกรูปใส่ให้อัตโนมัติ แก้คำอธิบายและเครดิตได้</li>
          </ul>
        </details>
      </fieldset>

      <fieldset className="field">
        <legend className="field__label">เรื่องที่เกี่ยวข้อง</legend>
        <span className="admin-pins__form">
          {GOALS.map((g) => (
            <label key={g.slug} className="admin-pins__opt">
              <input
                type="checkbox"
                checked={d.goals.includes(g.slug)}
                onChange={(e) =>
                  set('goals', e.target.checked ? [...d.goals, g.slug] : d.goals.filter((x) => x !== g.slug))
                }
              />
              {g.short}
            </label>
          ))}
        </span>
      </fieldset>
      <label className="field">
        <span className="field__label">ผูกกับหน้าเทศกาล (ไม่บังคับ)</span>
        <select className="select" value={d.festival ?? ''} onChange={(e) => set('festival', e.target.value || null)}>
          <option value="">ไม่ผูก</option>
          {festivals.map((f) => (
            <option key={f.slug} value={f.slug}>
              {f.name}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span className="field__label">ชื่อสำหรับ Google (ไม่บังคับ ถ้าว่างใช้ชื่อบทความ)</span>
        <input className="input" value={d.seoTitle ?? ''} onChange={(e) => set('seoTitle', e.target.value || null)} />
      </label>
      <label className="admin-pins__opt">
        <input type="checkbox" checked={d.published} onChange={(e) => set('published', e.target.checked)} />
        เผยแพร่ (ไม่ติ๊ก = เก็บเป็นฉบับร่าง)
      </label>

      <div className="actions actions--wrap">
        <button type="button" className="btn btn--gold" disabled={pending} onClick={save}>
          {pending ? 'กำลังบันทึก...' : 'บันทึก'}
        </button>
        {!isNew && d.published && (
          <Link href={`/articles/${d.slug}`} target="_blank" className="btn btn--outline">
            ดูหน้าจริง
          </Link>
        )}
      </div>
      {msg.error && <p className="field__error">{msg.error}</p>}
      {msg.ok && <p className="note">{msg.ok}</p>}
    </div>
  );
}
