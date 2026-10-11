'use client';

import type { ReactNode } from 'react';

/** ปุ่ม submit ในฟอร์ม server action ที่ถามยืนยันก่อนส่ง */
export function ConfirmButton({ message, className, children }: { message: string; className: string; children: ReactNode }) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
