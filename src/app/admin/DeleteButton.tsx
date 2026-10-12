'use client';

/** ปุ่มลบในฟอร์ม server action ถามยืนยันก่อนส่ง */
export function DeleteButton({ name, message }: { name: string; message?: string }) {
  return (
    <button
      type="submit"
      className="btn btn--danger btn--sm"
      onClick={(e) => {
        if (!window.confirm(message ?? `ลบ "${name}" ออกจากฐานข้อมูล? กู้คืนได้จากการนำเข้า JSON เดิมอีกครั้งเท่านั้น`)) e.preventDefault();
      }}
    >
      ลบ
    </button>
  );
}
