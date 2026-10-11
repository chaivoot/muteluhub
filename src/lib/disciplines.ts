import groupsJson from '@data/disciplines.json';

export interface Discipline {
  slug: string;
  name: string;
  groupSlug: string;
  groupName: string;
}

interface GroupJson {
  slug: string;
  name: string;
  disciplines: { slug: string; name: string }[];
}

/** ศาสตร์ทั้งหมดจาก data/disciplines.json (แบนเป็นชั้นเดียว) */
export const DISCIPLINES: readonly Discipline[] = (groupsJson as GroupJson[]).flatMap((g) =>
  g.disciplines.map((d) => ({ slug: d.slug, name: d.name, groupSlug: g.slug, groupName: g.name })),
);

const bySlug = new Map(DISCIPLINES.map((d) => [d.slug, d]));

export function getDiscipline(slug: string): Discipline | undefined {
  return bySlug.get(slug);
}
