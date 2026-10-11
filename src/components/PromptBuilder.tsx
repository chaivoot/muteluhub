'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import type { PromptField, PromptTemplate } from '@/data/prompt-templates';
import { track } from '@/lib/analytics';
import { getDiscipline } from '@/lib/disciplines';
import { getGoal, isGoalSlug } from '@/lib/goals';
import { fieldOptions, missingFields, renderPrompt, valuesFromParams, type PromptValues } from '@/lib/prompts';
import { bangkokDay, TH_WEEKDAYS } from '@/lib/thai-date';
import { CopyButton } from './CopyButton';
import { useGoal } from './goal-context';

/**
 * ฟอร์มกรอกข้อมูล + preview + คัดลอก
 * ข้อมูลที่กรอกอยู่ใน state ของเบราว์เซอร์เท่านั้น ไม่ส่งขึ้น server ไม่เก็บ ไม่ log
 */
export function PromptBuilder({ template }: { template: PromptTemplate }) {
  const params = useSearchParams();
  const { goal: rememberedGoal } = useGoal();
  const [values, setValues] = useState<PromptValues>(() => valuesFromParams(template, params));

  // ค่าเริ่มต้นอัตโนมัติ เติมเฉพาะช่องที่ยังว่าง
  useEffect(() => {
    setValues((prev) => {
      const next = { ...prev };
      for (const f of template.requiredFields) {
        if (next[f.key]) continue;
        if (f.defaultFrom === 'today-weekday') next[f.key] = TH_WEEKDAYS[bangkokDay().weekday];
        if (f.defaultFrom === 'selected-goal' && rememberedGoal) next[f.key] = rememberedGoal;
      }
      return next;
    });
  }, [template, rememberedGoal]);

  const prompt = useMemo(() => renderPrompt(template, values), [template, values]);
  const missing = missingFields(template, values);
  const set = (key: string, value: string) => setValues((v) => ({ ...v, [key]: value }));

  // goal ใช้เพื่อ analytics / ลิงก์หมอดู: ค่าจากฟอร์มก่อน แล้วค่อยเป้าหมายเดียวของ template
  const goal = isGoalSlug(values.goal) ? values.goal : template.goals.length === 1 ? template.goals[0] : undefined;
  const discipline = template.discipline ?? (values.discipline || undefined);
  const eventProps = { slug: template.slug, goal, discipline };

  const tellerParams = new URLSearchParams();
  if (goal) tellerParams.set('goal', goal);
  if (discipline) tellerParams.set('discipline', discipline);
  const tellerHref = `/fortune-tellers${tellerParams.size ? `?${tellerParams}` : ''}`;
  const tellerTopic = [goal && `เรื่อง${getGoal(goal).short}`, discipline && getDiscipline(discipline)?.name]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="prompt-builder">
      <form className="form container" onSubmit={(e) => e.preventDefault()} aria-label="กรอกข้อมูลสำหรับ prompt">
        {template.requiredFields.map((f) => (
          <Field key={f.key} field={f} value={values[f.key] ?? ''} onChange={(v) => set(f.key, v)} />
        ))}
        <p className="note">ข้อมูลที่กรอกอยู่ในเครื่องคุณเท่านั้น เว็บไม่ได้ส่งหรือเก็บไว้</p>
      </form>

      <section className="container" aria-labelledby="preview-title">
        <div className="section-header section-header--flush">
          <h2 id="preview-title" className="section-header__title">prompt ของคุณ</h2>
        </div>
        <pre className="prompt-preview">{prompt}</pre>
        {missing.length > 0 && (
          <p className="note">ยังไม่ได้กรอก: {missing.map((f) => f.label).join(', ')}</p>
        )}
        <div className="actions">
          <CopyButton text={prompt} label="คัดลอก prompt" onCopied={() => track('copy_prompt', eventProps)} />
        </div>
        <p className="note">คัดลอกแล้ววางใน ChatGPT, Claude หรือ Gemini ได้เลย</p>
      </section>

      {template.followUps.length > 0 && (
        <section className="container" aria-labelledby="followups-title">
          <div className="section-header section-header--flush">
            <h2 id="followups-title" className="section-header__title">ถามต่อ</h2>
          </div>
          <ul className="stack">
            {template.followUps.map((q) => (
              <li key={q} className="followup">
                <span>{q}</span>
                <CopyButton
                  text={q}
                  label="คัดลอก"
                  className="btn btn--outline btn--sm"
                  onCopied={() => track('open_followup', eventProps)}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      <Link href={tellerHref} className="shortcut-card" onClick={() => track('click_to_fortune_teller', eventProps)}>
        <span className="shortcut-card__body">
          <span className="shortcut-card__title">อยากคุยลึกกับหมอดูจริง</span>
          <span className="shortcut-card__sub">ดูหมอดูที่ถนัด{tellerTopic ? ` ${tellerTopic}` : ''}</span>
        </span>
      </Link>
    </div>
  );
}

function Field({ field, value, onChange }: { field: PromptField; value: string; onChange: (v: string) => void }) {
  const id = `f-${field.key}`;
  if (field.type === 'cards') {
    return <CardsField field={field} value={value} onChange={onChange} />;
  }
  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {field.label}
      </label>
      {field.type === 'select' ? (
        <select id={id} className="select" value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">เลือก</option>
          {fieldOptions(field).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : field.multiline ? (
        <textarea
          id={id}
          className="input input--multi"
          rows={field.key === 'chart_data' ? 6 : 3}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          id={id}
          className="input"
          type={field.type === 'date' || field.type === 'time' ? field.type : 'text'}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

/** ไพ่ทีละตำแหน่ง ค่าที่ส่งเข้า prompt คือชื่อไพ่คั่นด้วย " / " ตามลำดับตำแหน่ง */
function CardsField({ field, value, onChange }: { field: PromptField; value: string; onChange: (v: string) => void }) {
  const positions = field.options?.length ? field.options : ['ใบที่ 1'];
  const [cards, setCards] = useState<string[]>(() => {
    const parts = value ? value.split(' / ') : [];
    return positions.map((_, i) => (parts[i] === '?' ? '' : (parts[i] ?? '')));
  });

  function update(i: number, v: string) {
    const next = cards.map((c, j) => (j === i ? v : c));
    setCards(next);
    onChange(next.every((c) => !c.trim()) ? '' : next.map((c) => c.trim() || '?').join(' / '));
  }

  return (
    <fieldset className="field">
      <legend className="field__label">{field.label}</legend>
      <div className="cards-grid">
        {positions.map((pos, i) => (
          <label key={pos} className="cards-grid__item">
            <span className="field__sub">{pos}</span>
            <input className="input" value={cards[i]} placeholder={field.placeholder} onChange={(e) => update(i, e.target.value)} />
          </label>
        ))}
      </div>
    </fieldset>
  );
}
