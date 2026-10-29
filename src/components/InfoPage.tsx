import { PageHeader } from '@/components/ComingSoon';
import { Markdown } from '@/lib/markdown';

/** หน้าข้อมูลเว็บ (เกี่ยวกับเรา ติดต่อ ข้อกำหนด ความเป็นส่วนตัว) เนื้อหาเป็น markdown แบบย่อ */
export function InfoPage({ title, body, updated }: { title: string; body: string; updated?: string }) {
  return (
    <main>
      <PageHeader title={title} />
      <div className="container place__body info-page">
        <div className="reading">
          <Markdown source={body} />
        </div>
        {updated && <p className="note">ปรับปรุงล่าสุด {updated}</p>}
      </div>
    </main>
  );
}
