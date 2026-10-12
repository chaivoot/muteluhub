import Link from 'next/link';
import type { FortuneTeller } from '@/data/fortune-tellers';
import { artPath } from '@/lib/art/discipline-art';
import { DISCIPLINES, type Discipline } from '@/lib/disciplines';

const SHOWN = 6;

function DisciplineTile({ d, count }: { d: Discipline; count: number }) {
  return (
    <Link href={`/fortune-tellers/${d.slug}`} className="disc-tile">
      <img src={artPath(d.slug, 1)} alt="" className="disc-tile__img"  width={56} height={56} />
      <span className="disc-tile__name">{d.name.replace(/\s*\(.*\)$/, '')}</span>
      <span className="disc-tile__count">{count} คน</span>
    </Link>
  );
}

/**
 * แถว "ดูตามศาสตร์" ใต้ปุ่มเรื่องที่อยากเสริม ในหน้ารวมหมอดู
 * สำหรับคนที่รู้อยู่แล้วว่าอยากดูศาสตร์ไหน (และให้ Google เห็นลิงก์ไปหน้าศาสตร์)
 * แสดงศาสตร์ที่มีหมอดูมากสุด 6 อย่าง ที่เหลือกดดูเพิ่ม
 */
export function DisciplineNav({ tellers }: { tellers: FortuneTeller[] }) {
  const counts = new Map<string, number>();
  for (const t of tellers) for (const d of new Set(t.disciplines)) counts.set(d, (counts.get(d) ?? 0) + 1);
  const list = DISCIPLINES.filter((d) => counts.has(d.slug)).sort(
    (a, b) => counts.get(b.slug)! - counts.get(a.slug)! || a.name.localeCompare(b.name, 'th'),
  );
  if (list.length === 0) return null;
  const top = list.slice(0, SHOWN);
  const rest = list.slice(SHOWN);
  return (
    <section className="container disc-nav" aria-labelledby="disc-nav-title">
      <h2 id="disc-nav-title" className="disc-nav__title">
        ดูตามศาสตร์
      </h2>
      <div className="disc-grid">
        {top.map((d) => (
          <DisciplineTile key={d.slug} d={d} count={counts.get(d.slug)!} />
        ))}
      </div>
      {rest.length > 0 && (
        <details className="disc-nav__more">
          <summary>ดูศาสตร์ทั้งหมด ({list.length})</summary>
          <div className="disc-grid">
            {rest.map((d) => (
              <DisciplineTile key={d.slug} d={d} count={counts.get(d.slug)!} />
            ))}
          </div>
        </details>
      )}
    </section>
  );
}
