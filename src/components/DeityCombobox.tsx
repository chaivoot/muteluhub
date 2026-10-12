'use client';

import { useId, useMemo, useState } from 'react';
import type { Place } from '@/data/places';
import { deitySuggestions, type DeitySuggestion } from '@/lib/places';

export type DeityValue = { kind: 'group'; slug: string; label: string } | { kind: 'text'; text: string } | null;

/** ช่ององค์เทพ: พิมพ์แล้วมีคำแนะนำ หรือแตะเพื่อดูรายการทั้งหมด */
export function DeityCombobox({
  places,
  value,
  onChange,
}: {
  places: Place[];
  value: DeityValue;
  onChange: (v: DeityValue) => void;
}) {
  const id = useId();
  const listId = `${id}-list`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const text = value?.kind === 'group' ? value.label : (value?.text ?? '');
  // เลือกกลุ่มแล้วเปิดรายการใหม่: แสดงทุกกลุ่ม ไม่กรองด้วยชื่อกลุ่มที่เลือกอยู่
  const query = value?.kind === 'text' ? value.text : '';
  const options = useMemo(() => deitySuggestions(places, query), [places, query]);

  const pick = (o: DeitySuggestion) => {
    onChange(o.kind === 'group' ? { kind: 'group', slug: o.slug, label: o.label } : { kind: 'text', text: o.label });
    setOpen(false);
    setActive(-1);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      if (open && active >= 0 && options[active]) {
        e.preventDefault();
        pick(options[active]);
      } else {
        setOpen(false);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className="combo">
      <label htmlFor={id} className="visually-hidden">
        องค์เทพ / สิ่งศักดิ์สิทธิ์
      </label>
      <input
        id={id}
        className="select combo__input"
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
        placeholder="ทุกองค์เทพ"
        autoComplete="off"
        enterKeyHint="search"
        value={text}
        onChange={(e) => {
          const t = e.target.value;
          onChange(t.trim() ? { kind: 'text', text: t } : null);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={(e) => {
          setOpen(true);
          if (value?.kind === 'group') e.currentTarget.select();
        }}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
      />
      {value ? (
        <button
          type="button"
          className="combo__btn"
          aria-label="ล้างองค์เทพ"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            onChange(null);
            setOpen(false);
          }}
        >
          ×
        </button>
      ) : (
        <span className="combo__chevron" aria-hidden="true" />
      )}
      {open && (
        <ul id={listId} role="listbox" className="combo__list" aria-label="องค์เทพ">
          {options.length === 0 ? (
            <li className="combo__empty">ไม่พบองค์เทพนี้</li>
          ) : (
            options.map((o, i) => (
              <li
                key={`${o.kind}-${o.label}`}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                className="combo__option"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(o)}
              >
                <span>{o.label}</span>
                <span className="combo__count">{o.count}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
