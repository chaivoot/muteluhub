'use client';

import { useActionState } from 'react';
import { loginAction } from './actions';

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, {});
  return (
    <form action={action} className="form">
      <div className="field">
        <label htmlFor="password" className="field__label">
          รหัสผ่าน
        </label>
        <input id="password" name="password" type="password" className="input" autoComplete="current-password" required />
      </div>
      {state?.error && <p className="field__error">{state.error}</p>}
      <div>
        <button type="submit" className="btn btn--gold" disabled={pending}>
          {pending ? 'กำลังเข้า...' : 'เข้าสู่ระบบ'}
        </button>
      </div>
    </form>
  );
}
