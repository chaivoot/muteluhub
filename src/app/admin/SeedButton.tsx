'use client';

import { useActionState } from 'react';
import { seedAction } from './actions';

export function SeedButton({ batch, label }: { batch: string; label: string }) {
  const [state, action, pending] = useActionState(seedAction, {});
  return (
    <form action={action} className="seed-row">
      <input type="hidden" name="batch" value={batch} />
      <span className="seed-row__label">{label}</span>
      <button type="submit" className="btn btn--outline btn--sm" disabled={pending}>
        {pending ? 'กำลังนำเข้า...' : 'นำเข้า'}
      </button>
      {state.error && <span className="field__error">{state.error}</span>}
      {state.created && (
        <span className="note">
          เพิ่มใหม่ {state.created.length} · มีอยู่แล้ว (ข้าม) {state.skipped?.length ?? 0}
        </span>
      )}
    </form>
  );
}
