import Link from 'next/link';
import type { FestivalOccurrence } from '@/lib/festivals';
import { formatThaiRange } from '@/lib/thai-date';
import { CreditBadge } from './CreditBadge';

export function FestivalCard({ occurrence }: { occurrence: FestivalOccurrence }) {
  const { festival, date, status } = occurrence;
  return (
    <Link href={`/festival/${festival.slug}`} className="festival-card">
      {festival.image ? (
        <img src={festival.image.src} alt={festival.image.alt} className="festival-card__img" />
      ) : (
        <span className="festival-card__art" aria-hidden="true" />
      )}
      <span className="festival-card__scrim" />
      <span className="festival-card__badges">
        <span className="pill pill--gold">{formatThaiRange(date.start, date.end)}</span>
        {status === 'ongoing' && <span className="pill pill--vermilion">กำลังจัดงาน</span>}
      </span>
      {festival.image && <CreditBadge credit={festival.image.credit} position="top-right" />}
      <span className="festival-card__text">
        <span className="festival-card__name">{festival.name}</span>
        <span className="festival-card__tagline">{festival.tagline}</span>
      </span>
    </Link>
  );
}
