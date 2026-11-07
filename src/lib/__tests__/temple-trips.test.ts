import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PROVINCES } from '@/data/provinces';
import { TEMPLE_TRIPS } from '@/data/temple-trips';

// slug สถานที่ทั้งหมดในชุดข้อมูลเริ่มต้น ใช้ตรวจว่า place ในทริปสะกดถูก
const dir = join(process.cwd(), 'data/import');
const seedSlugs = new Set(
  readdirSync(dir)
    .filter((f) => f.startsWith('places-') && f.endsWith('.json'))
    .flatMap((f) => (JSON.parse(readFileSync(join(dir, f), 'utf8')) as { slug: string }[]).map((p) => p.slug)),
);

describe('temple trips', () => {
  it('has unique slugs, a known province, and a source for every stop', () => {
    expect(new Set(TEMPLE_TRIPS.map((t) => t.slug)).size).toBe(TEMPLE_TRIPS.length);
    for (const t of TEMPLE_TRIPS) {
      expect(PROVINCES[t.provinceSlug], t.slug).toBeTruthy();
      expect(t.stops.length).toBeGreaterThan(1);
      expect(t.description.length).toBeLessThanOrEqual(160);
      for (const s of t.stops) {
        expect(s.source, `${t.slug}: ${s.name}`).toMatch(/^https:\/\//);
        if (s.place) expect(seedSlugs.has(s.place), `${t.slug}: ${s.place}`).toBe(true);
      }
    }
  });
});
