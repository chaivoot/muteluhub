import Link from 'next/link';
import { CHANNEL_LABEL, type FortuneTeller } from '@/data/fortune-tellers';
import { provinceShortName } from '@/data/provinces';
import { tellerArtPath } from '@/lib/art/discipline-art';
import { getDiscipline } from '@/lib/disciplines';
import { getGoal } from '@/lib/goals';
import { formatPrice } from '@/lib/tellers';
import { GoalTag } from './GoalTag';

/** การ์ดหมอดู (list): ภาพ default ตามศาสตร์หลัก ชื่อ tag ศาสตร์ (ทอง) + เป้าหมาย ช่องทาง จังหวัด ราคา */
export function TellerCard({ teller }: { teller: FortuneTeller }) {
  const primary = getDiscipline(teller.disciplines[0]);
  const where = [
    ...teller.channels.map((c) => CHANNEL_LABEL[c]),
    teller.provinceSlug ? provinceShortName(teller.provinceSlug) : null,
  ].filter(Boolean);
  return (
    <Link href={`/fortune-tellers/${teller.slug}`} className="teller-card">
      <img
        src={tellerArtPath(teller)}
        alt={`ภาพประกอบศาสตร์${primary?.name ?? ''}`}
        className="teller-card__img"
        width={104}
        height={104}
        loading="lazy"
      />
      <span className="teller-card__body">
        <span className="teller-card__name">{teller.name}</span>
        <span className="tag-row">
          {teller.disciplines.slice(0, 1).map((d) => (
            <span key={d} className="tag tag--discipline">
              {getDiscipline(d)?.name ?? d}
            </span>
          ))}
          {teller.goals.slice(0, 2).map((g) => (
            <GoalTag key={g} goal={getGoal(g)} />
          ))}
        </span>
        <span className="teller-card__meta">{where.join(' · ')}</span>
        {teller.priceFrom != null && <span className="teller-card__price">เริ่ม {formatPrice(teller.priceFrom)}</span>}
      </span>
    </Link>
  );
}
