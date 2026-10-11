'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { importPlacesAction, previewImportAction, type ImportResult, type PreviewResult } from '../actions';

export function ImportForm() {
  const [text, setText] = useState('');
  const [preview, setPreview] = useState<PreviewResult | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [pending, start] = useTransition();

  const okCount = preview?.items.filter((i) => i.ok).length ?? 0;
  const badCount = (preview?.items.length ?? 0) - okCount;

  function check() {
    setResult(null);
    start(async () => setPreview(await previewImportAction(text)));
  }

  function save() {
    start(async () => {
      const r = await importPlacesAction(text);
      setResult(r);
      if (!r.error) setPreview(null);
    });
  }

  return (
    <div className="form">
      <div className="field">
        <label htmlFor="json" className="field__label">
          วาง JSON (array ของสถานที่ หรือ object เดียว)
        </label>
        <textarea
          id="json"
          className="input input--multi input--code"
          rows={14}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setPreview(null);
          }}
          spellCheck={false}
        />
      </div>
      <div className="actions">
        <button type="button" className="btn btn--outline" onClick={check} disabled={pending || !text.trim()}>
          ตรวจข้อมูล
        </button>
        <button
          type="button"
          className="btn btn--gold"
          onClick={save}
          disabled={pending || !preview || !!preview.error || badCount > 0 || okCount === 0}
        >
          นำเข้า {okCount > 0 ? `${okCount} รายการ` : ''}
        </button>
      </div>

      {preview?.error && <p className="field__error">{preview.error}</p>}
      {preview && !preview.error && (
        <>
          <p className="note">
            ผ่าน {okCount} · ผิด {badCount}
            {badCount > 0 && ' · แก้รายการที่ผิดให้ครบก่อน ระบบจะไม่นำเข้าบางส่วน'}
          </p>
          <ul className="admin-list">
            {preview.items.map((item) => (
              <li key={item.index} className={item.ok ? 'admin-item' : 'admin-item admin-item--error'}>
                <div className="admin-item__main">
                  <div className="admin-item__name">
                    #{item.index + 1} {item.name ?? '(ไม่มีชื่อ)'}
                  </div>
                  <div className="note">
                    {item.slug ?? '(ไม่มี slug)'}
                    {item.ok &&
                      ` · ${item.action === 'create' ? 'เพิ่มใหม่' : 'เขียนทับของเดิม'} · ${
                        item.published ? 'เผยแพร่ทันที' : 'ซ่อนไว้ก่อน'
                      } · รูป ${item.imageCount}`}
                  </div>
                  {item.errors.length > 0 && (
                    <ul className="bullet-list field__error">
                      {item.errors.map((e) => (
                        <li key={e}>{e}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {result?.error && <p className="field__error">{result.error}</p>}
      {result && !result.error && (
        <div className="coming-soon">
          <p className="coming-soon__title">นำเข้าแล้ว</p>
          <p>
            เพิ่มใหม่ {result.created?.length ?? 0} · อัปเดต {result.updated?.length ?? 0}
          </p>
          <Link href="/admin" className="btn btn--outline">
            กลับไปหน้ารายการ
          </Link>
        </div>
      )}
    </div>
  );
}
