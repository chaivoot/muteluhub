import { Fragment, type ReactNode } from 'react';

/**
 * markdown แบบย่อสำหรับบทความ (เขียนจากหลังบ้าน) แปลงเป็น React โดยตรง ไม่ใช้ HTML ดิบ จึงปลอดภัยจาก script
 * รองรับ: ## หัวข้อ, ### หัวข้อย่อย, ย่อหน้า, - รายการ, 1. รายการเลข, > ข้อความเน้น,
 * ![คำอธิบาย](/media/xxx "เครดิต") รูปทั้งบรรทัด, **ตัวหนา**, [ลิงก์](https://...)
 */

const SAFE_URL = /^(https?:\/\/|\/|mailto:)[^\s]*$/;

export function renderInline(text: string, keyPrefix = 'i'): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let n = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = `${keyPrefix}-${n++}`;
    if (m[1] !== undefined) {
      out.push(<strong key={key}>{m[1]}</strong>);
    } else if (SAFE_URL.test(m[3])) {
      const external = /^https?:\/\//.test(m[3]);
      out.push(
        <a key={key} href={m[3]} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {m[2]}
        </a>,
      );
    } else {
      out.push(m[2]);
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const IMAGE_LINE = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)$/;

/** หัวข้อ ## ในบทความ (ใช้ทำสารบัญหรือทดสอบ) */
export function markdownHeadings(src: string): string[] {
  return src
    .split('\n')
    .filter((l) => l.startsWith('## '))
    .map((l) => l.slice(3).trim());
}

export function Markdown({ source }: { source: string }) {
  const lines = source.replace(/\r\n?/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let i = 0;
  let k = 0;
  const key = () => `b${k++}`;

  while (i < lines.length) {
    const line = lines[i].trimEnd();
    if (!line.trim()) {
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      blocks.push(<h3 key={key()}>{renderInline(line.slice(4), `h${k}`)}</h3>);
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      blocks.push(<h2 key={key()}>{renderInline(line.slice(3), `h${k}`)}</h2>);
      i++;
      continue;
    }
    const img = line.trim().match(IMAGE_LINE);
    if (img) {
      const [, alt, src, credit] = img;
      if (SAFE_URL.test(src)) {
        blocks.push(
          <figure key={key()} className="article-figure">
            <img src={src} alt={alt} loading="lazy" />
            {credit && <figcaption>ภาพ: {credit}</figcaption>}
          </figure>,
        );
      }
      i++;
      continue;
    }
    if (/^[-*] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) items.push(lines[i++].slice(2).trim());
      const b = key();
      blocks.push(
        <ul key={b} className="bullet-list">
          {items.map((t, j) => (
            <li key={j}>{renderInline(t, `${b}-${j}`)}</li>
          ))}
        </ul>,
      );
      continue;
    }
    if (/^\d+[.)] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+[.)] /.test(lines[i])) items.push(lines[i++].replace(/^\d+[.)] /, '').trim());
      const b = key();
      blocks.push(
        <ol key={b}>
          {items.map((t, j) => (
            <li key={j}>{renderInline(t, `${b}-${j}`)}</li>
          ))}
        </ol>,
      );
      continue;
    }
    if (line.startsWith('> ')) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) quote.push(lines[i++].slice(2).trim());
      const b = key();
      blocks.push(<blockquote key={b}>{renderInline(quote.join(' '), b)}</blockquote>);
      continue;
    }
    // ย่อหน้า: บรรทัดติดกันจนเจอบรรทัดว่างหรือบล็อกชนิดอื่น
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{2,3} |[-*] |\d+[.)] |> )/.test(lines[i]) &&
      !IMAGE_LINE.test(lines[i].trim())
    ) {
      para.push(lines[i++].trim());
    }
    const b = key();
    blocks.push(
      <p key={b}>
        {para.map((t, j) => (
          <Fragment key={j}>
            {j > 0 && <br />}
            {renderInline(t, `${b}-${j}`)}
          </Fragment>
        ))}
      </p>,
    );
  }
  return <div className="article-body">{blocks}</div>;
}
