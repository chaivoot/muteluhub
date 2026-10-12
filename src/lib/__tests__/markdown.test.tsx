import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { articleSchema } from '@/lib/import/article-schema';
import { Markdown, markdownHeadings } from '@/lib/markdown';

const html = (src: string) => renderToStaticMarkup(<Markdown source={src} />);

describe('Markdown', () => {
  it('renders headings, paragraphs, lists, quotes and images', () => {
    const out = html(
      '## หัวข้อ\n\nย่อหน้าแรก **หนา**\nบรรทัดสอง\n\n- หนึ่ง\n- สอง\n\n1. ก\n2. ข\n\n> เน้น\n\n![รูป](/media/abc123 "ภาพประกอบ")',
    );
    expect(out).toContain('<h2>หัวข้อ</h2>');
    expect(out).toContain('<p>ย่อหน้าแรก <strong>หนา</strong><br/>บรรทัดสอง</p>');
    expect(out).toContain('<li>หนึ่ง</li><li>สอง</li>');
    expect(out).toContain('<ol><li>ก</li><li>ข</li></ol>');
    expect(out).toContain('<blockquote>เน้น</blockquote>');
    expect(out).toContain('<img src="/media/abc123" alt="รูป" loading="lazy"/><figcaption>ภาพ: ภาพประกอบ</figcaption>');
    expect(markdownHeadings('## ก\ntext\n## ข')).toEqual(['ก', 'ข']);
  });

  it('never renders raw HTML or unsafe links', () => {
    const out = html('<script>alert(1)</script>\n\n[x](javascript:alert(1)) [ok](https://example.com)\n\n![x](javascript:1)');
    expect(out).not.toContain('<script>');
    expect(out).toContain('&lt;script&gt;');
    expect(out).not.toContain('javascript:');
    expect(out).toContain('href="https://example.com" target="_blank" rel="noopener noreferrer"');
  });
});

describe('articleSchema', () => {
  const base = {
    slug: 'halloween-tips',
    title: 'ฮาโลวีนสายมู',
    excerpt: 'ข้อควรรู้ก่อนออกไปปาร์ตี้',
    body: 'เนื้อหาบทความยาวพอสมควรสำหรับทดสอบ',
    cover: { src: '/media/abc123', alt: 'ฟักทอง', credit: 'ภาพประกอบ' },
    goals: ['protection'],
    festival: 'halloween',
    seoTitle: null,
    published: true,
  };
  it('accepts a valid article and rejects bad slugs, foreign images and unknown festivals', () => {
    expect(articleSchema.safeParse(base).success).toBe(true);
    expect(articleSchema.safeParse({ ...base, slug: 'ฮาโลวีน' }).success).toBe(false);
    expect(articleSchema.safeParse({ ...base, cover: { ...base.cover, src: 'https://evil.example/x.jpg' } }).success).toBe(false);
    expect(articleSchema.safeParse({ ...base, festival: 'nope' }).success).toBe(false);
  });
});
