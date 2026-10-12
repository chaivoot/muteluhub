import Link from 'next/link';
import type { Article } from '@/data/articles';
import { CreditBadge } from './CreditBadge';

/** การ์ดบทความ (หน้าเทศกาลและบทความ / อ่านต่อในหน้าเทศกาล) ใช้หน้าตาเดียวกับการ์ดเทศกาล */
export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/articles/${article.slug}`} className="festival-card">
      {article.cover ? (
        <img src={article.cover.src} alt={article.cover.alt} className="festival-card__img" loading="lazy" />
      ) : (
        <span className="festival-card__art" aria-hidden="true" />
      )}
      <span className="festival-card__scrim" />
      <span className="festival-card__badges">
        <span className="pill pill--gold">บทความ</span>
      </span>
      {article.cover && <CreditBadge credit={article.cover.credit} position="bottom-right" />}
      <span className="festival-card__text">
        <span className="festival-card__name">{article.title}</span>
        <span className="festival-card__tagline">{article.excerpt}</span>
      </span>
    </Link>
  );
}
