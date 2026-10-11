import { describe, expect, it } from 'vitest';
import { PROMPT_TEMPLATES } from '@/data/prompt-templates';
import { getDiscipline } from '@/lib/disciplines';
import { isGoalSlug } from '@/lib/goals';
import {
  GUARD_BLOCK,
  filterTemplates,
  getPromptTemplate,
  missingFields,
  placeholderKeys,
  recommendedForGoal,
  renderPrompt,
  valuesFromParams,
} from '@/lib/prompts';

describe('prompt templates seed', () => {
  it.each(PROMPT_TEMPLATES.map((t) => [t.slug, t] as const))('%s is consistent', (_, t) => {
    // ทุก placeholder ต้องมีช่องกรอก และทุกช่องต้องถูกใช้ใน template
    expect(placeholderKeys(t.template).sort()).toEqual(t.requiredFields.map((f) => f.key).sort());
    expect(t.goals.every(isGoalSlug)).toBe(true);
    if (t.discipline) expect(getDiscipline(t.discipline)).toBeDefined();
    // guard block ต่อท้ายตอน render ห้ามใส่ซ้ำใน template
    expect(t.template).not.toContain('ข้อกำหนดในการตอบ');
  });

  it('has unique slugs', () => {
    const slugs = PROMPT_TEMPLATES.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe('renderPrompt', () => {
  const tarot = getPromptTemplate('tarot-love')!;

  it('fills placeholders and always appends the guard block once', () => {
    const out = renderPrompt(tarot, {
      question: 'เขาคิดยังไงกับฉัน',
      cards: 'The Lovers / Two of Cups / The Sun',
      relationship_status: 'กำลังคุย',
    });
    expect(out).toContain('คำถามของฉัน: เขาคิดยังไงกับฉัน');
    expect(out).toContain('The Lovers / Two of Cups / The Sun');
    expect(out.endsWith(GUARD_BLOCK)).toBe(true);
    expect(out.split('ข้อกำหนดในการตอบ').length).toBe(2);
    expect(out).not.toMatch(/\{\{\w+\}\}/);
  });

  it('shows missing fields as [label]', () => {
    const out = renderPrompt(tarot, {});
    expect(out).toContain('คำถามของฉัน: [คำถาม / สถานการณ์]');
    expect(missingFields(tarot, { question: '  ' }).map((f) => f.key)).toEqual(['question', 'cards', 'relationship_status']);
  });

  it('renders goal, discipline and birth date in Thai', () => {
    const chart = getPromptTemplate('chart-reading-general')!;
    const out = renderPrompt(chart, { discipline: 'bazi', chart_data: 'x', goal: 'money', question: 'q' });
    expect(out).toContain('ตามหลัก ปาจื้อ / ดวงจีน:');
    expect(out).toContain('เรื่องที่อยากรู้: การเงิน / โชคลาภ - q');
    const lucky = getPromptTemplate('lucky-number-money')!;
    expect(renderPrompt(lucky, { birth_date: '1990-03-05' })).toContain('ฉันเกิดวันที่ 5 มีนาคม 2533');
  });
});

describe('valuesFromParams', () => {
  it('only accepts keys the template declares', () => {
    const t = getPromptTemplate('lucky-number-money')!;
    const values = valuesFromParams(t, new URLSearchParams('lucky_numbers=5,9&evil=1'));
    expect(values).toEqual({ lucky_numbers: '5,9' });
  });
});

describe('filterTemplates', () => {
  it('filters by goal and discipline', () => {
    expect(filterTemplates({ goal: 'love' }).map((t) => t.slug)).toContain('tarot-love');
    expect(filterTemplates({ goal: 'money' }).map((t) => t.slug)).not.toContain('tarot-love');
    expect(filterTemplates({ discipline: 'tarot' }).map((t) => t.slug)).toEqual(['tarot-love']);
    expect(filterTemplates({ discipline: 'general' }).every((t) => t.discipline === null)).toBe(true);
  });

  it('recommends goal-specific prompts first', () => {
    const rec = recommendedForGoal('love');
    expect(rec[0].slug).toBe('tarot-love');
    expect(rec.length).toBeLessThanOrEqual(3);
  });
});
