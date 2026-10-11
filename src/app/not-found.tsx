import { ComingSoon, PageHeader } from '@/components/ComingSoon';

export default function NotFound() {
  return (
    <main>
      <PageHeader title="MuteluHub" />
      <ComingSoon title="ไม่พบหน้านี้">
        <p>ลิงก์อาจผิดหรือหน้านี้ถูกย้ายแล้ว</p>
      </ComingSoon>
    </main>
  );
}
