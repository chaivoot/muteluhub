'use client';

import { useId, useMemo, useRef, useState } from 'react';

export interface PickOption {
  value: string;
  label: string;
  count?: number;
}

/**
 * ช่องเลือกที่พิมพ์กรองได้ หรือแตะแล้วเลื่อนเลือกจากรายการทั้งหมด (แทน select ของจังหวัด/เมือง)
 * value = '' คือทั้งหมด (allLabel)
 */
export function PickCombobox({
  options,
  value,
  onChange,
  allLabel,
  label,
}: {
  options: PickOption[];
  value: string;
  onChange: (value: string) => void;
  allLabel: string;
  label: string;
}) {
  const id = useId();
  const listId = `${id}-list`;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<string | null>(null);
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const selected = options.find((o) => o.value === value);
  const shown = useMemo(() => {
    const q = query?.trim();
    if (!q) return [{ value: '', label: allLabel }, ...options];
    return options.filter((o) => o.label.includes(q) || o.value.toLowerCase().includes(q.toLowerCase()));
  }, [options, query, allLabel]);

  const close = () => {
    setOpen(false);
    setQuery(null);
    setActive(-1);
  };
  const pick = (o: PickOption) => {
    onChange(o.value);
    close();
    // ปิดคีย์บอร์ดบนมือถือหลังเลือก
    inputRef.current?.blur();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, shown.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const o = shown[active >= 0 ? active : 0];
      if (open && o) pick(o);
    } else if (e.key === 'Escape') {
      close();
    }
  };

  return (
    <div className="combo combo--pick">
      <label htmlFor={id} className="visually-hidden">
        {label}
      </label>
      <input
        id={id}
        ref={inputRef}
        className="select combo__input"
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
        autoComplete="off"
        placeholder={allLabel}
        value={query ?? selected?.label ?? ''}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={(e) => {
          setOpen(true);
          e.currentTarget.select();
        }}
        onClick={() => setOpen(true)}
        onBlur={close}
        onKeyDown={onKeyDown}
      />
      {value ? (
        <button
          type="button"
          className="combo__btn"
          aria-label={`ล้าง${label}`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            onChange('');
            close();
          }}
        >
          ×
        </button>
      ) : (
        <span className="combo__chevron" aria-hidden="true" />
      )}
      {open && (
        <ul id={listId} role="listbox" className="combo__list combo__list--end" aria-label={label}>
          {shown.length === 0 && <li className="combo__empty">ไม่พบ{label}นี้</li>}
          {shown.map((o, i) => (
            <li
              key={o.value || 'all'}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active || (active < 0 && o.value === value && !query)}
              className="combo__option"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(o)}
            >
              <span>{o.label}</span>
              {o.count != null && <span className="combo__count">{o.count}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
