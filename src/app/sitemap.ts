import type { MetadataRoute } from 'next';
import { COUNTRIES } from '@/data/countries';
import { EVENT_TYPES } from '@/data/auspicious';
import { FESTIVALS } from '@/data/festivals';
import { PROMPT_TEMPLATES } from '@/data/prompt-templates';
import { GOALS } from '@/lib/goals';
import { abroadPlaces, provincesWithPlaces, thaiPlaces } from '@/lib/places';
import { listPublishedPlaces } from '@/lib/places-repo';
import { SITE_URL } from '@/lib/site';
import { listPublishedTellers } from '@/lib/tellers-repo';
import { listPublishedArticles } from '@/lib/articles-repo';

// อ่านสถานที่/หมอดูจาก DB รายการใหม่เข้า sitemap ภายใน 1 ชั่วโมง
export const revalidate = 3600;

type Entry = MetadataRoute.Sitemap[number];

const url = (path: string) => `${SITE_URL}${path}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [places, tellers, articles] = await Promise.all([
    listPublishedPlaces(),
    listPublishedTellers(),
    listPublishedArticles(),
  ]);
  const thai = thaiPlaces(places);

  const page = (
    path: string,
    changeFrequency: Entry['changeFrequency'],
    priority: number,
    lastModified?: string,
  ): Entry => ({
    url: url(path),
    changeFrequency,
    priority,
    ...(lastModified ? { lastModified } : {}),
  });

  return [
    page('/', 'daily', 1),
    page('/color-today', 'daily', 0.9),
    page('/tools/lucky-number', 'monthly', 0.8),
    page('/tools/phone-number', 'monthly', 0.8),
    page('/tools/license-plate', 'monthly', 0.8),
    page('/calendar', 'weekly', 0.8),
    ...EVENT_TYPES.map((e) => page(`/calendar/${e.slug}`, 'weekly', 0.7)),
    ...GOALS.map((g) => page(`/${g.slug}`, 'weekly', 0.8)),
    page('/festival', 'weekly', 0.7),
    ...FESTIVALS.map((f) => page(`/festival/${f.slug}`, 'weekly', 0.8, f.content?.checkedAt)),
    ...articles.map((a) => page(`/articles/${a.slug}`, 'monthly', 0.7, a.updatedAt)),

    page('/places', 'weekly', 0.8),
    ...provincesWithPlaces(thai).map((p) => page(`/places/${p.slug}`, 'weekly', 0.6)),
    ...places.map((p) => page(`/places/${p.slug}`, 'monthly', 0.7, p.checkedAt)),

    page('/abroad', 'weekly', 0.7),
    ...COUNTRIES.filter((c) => abroadPlaces(places, c.code).length > 0).map((c) =>
      page(`/abroad/${c.slug}`, 'weekly', 0.6),
    ),

    page('/fortune-tellers', 'weekly', 0.8),
    ...[...new Set(tellers.flatMap((t) => t.disciplines))].map((d) => page(`/fortune-tellers/${d}`, 'weekly', 0.6)),
    ...tellers.map((t) => page(`/fortune-tellers/${t.slug}`, 'monthly', 0.6, t.checkedAt)),

    page('/ai-prompts', 'monthly', 0.6),
    ...GOALS.map((g) => page(`/ai-prompts/${g.slug}`, 'monthly', 0.5)),
    ...PROMPT_TEMPLATES.map((t) => page(`/ai-prompts/p/${t.slug}`, 'monthly', 0.4)),
    page('/tools/prompt-generator', 'monthly', 0.4),
  ];
}
