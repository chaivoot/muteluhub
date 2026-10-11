"""
เพิ่มวรรณยุกต์ตำแหน่งสูงให้ฟอนต์ OG (src/assets/og/*.ttf)

Satori (next/og) ไม่ทำ OpenType mark positioning วรรณยุกต์ที่อยู่เหนือสระบน (เช่น ที่ เรื่อง)
จึงทับสระจนมองไม่เห็น สคริปต์นี้สร้างสำเนาวรรณยุกต์ ่ ้ ๊ ๋ ์ ที่ยกสูงขึ้น แล้วผูกกับ
U+F70A-U+F70E (ตำแหน่ง PUA แบบเดียวกับฟอนต์ไทยรุ่นเก่า) ฝั่งโค้ดสลับตัวอักษรให้ใน src/lib/og/thai.ts

รันซ้ำได้ (ข้ามถ้ามีแล้ว): python3 scripts/og-thai-marks.py
"""
import copy
import sys
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.ttLib import TTFont

DIR = Path(__file__).resolve().parent.parent / 'src/assets/og'
TONES = [0x0E48, 0x0E49, 0x0E4A, 0x0E4B, 0x0E4C]
# วัดความสูงจากสระบนที่พบบ่อย (ี ื) ไม่ใช้ไม้ไต่คู้ที่สูงเกิน
UPPER_VOWELS = [0x0E35, 0x0E37]
PUA_BASE = 0xF70A
GAP = 40


def bounds(font, name):
    gs = font.getGlyphSet()
    pen = BoundsPen(gs)
    gs[name].draw(pen)
    return pen.bounds


def patch(path: Path):
    font = TTFont(path)
    cmap = font.getBestCmap()
    if PUA_BASE in cmap:
        print(f'{path.name}: มีอยู่แล้ว ข้าม')
        return
    vowel_top = max(bounds(font, cmap[c])[3] for c in UPPER_VOWELS)
    tone_bottom = min(bounds(font, cmap[c])[1] for c in TONES)
    shift = int(vowel_top - tone_bottom + GAP)
    glyf = font['glyf']
    hmtx = font['hmtx']
    order = list(font.getGlyphOrder())
    for i, cp in enumerate(TONES):
        src = cmap[cp]
        name = f'{src}.raised'
        g = copy.deepcopy(glyf[src])
        if g.isComposite():
            for comp in g.components:
                comp.y += shift
        elif g.numberOfContours > 0:
            g.coordinates.translate((0, shift))
        glyf.glyphs[name] = g
        order.append(name)
        hmtx[name] = hmtx[src]
        for table in font['cmap'].tables:
            if table.isUnicode():
                table.cmap[PUA_BASE + i] = name
    font.setGlyphOrder(order)
    glyf.setGlyphOrder(order)
    for name in order[-len(TONES):]:
        glyf[name].recalcBounds(glyf)
    font.save(path)
    print(f'{path.name}: เพิ่มวรรณยุกต์ยกสูง {shift} หน่วย')


if __name__ == '__main__':
    for p in sorted(DIR.glob('*.ttf')) if len(sys.argv) < 2 else map(Path, sys.argv[1:]):
        patch(p)
