"""Generate MuteluHub logo SVGs (Trirong glyphs as paths).

Usage: pip install fonttools brotli
       python3 scripts/make-logo.py public/fonts/trirong-latin-700-normal.woff2 <out-dir>
Outputs logo-badge.svg, logo-mark.svg, icon.svg (copy to design/logo, public, src/app)
"""
import math, sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

FONT = sys.argv[1]
OUT = sys.argv[2]
GOLD = '#D6B064'
INDIGO = '#172038'

font = TTFont(FONT)
gs = font.getGlyphSet()
cmap = font.getBestCmap()
upm = font['head'].unitsPerEm
cap = font['OS/2'].sCapHeight or 0.7 * upm

def glyph(ch):
    name = cmap[ord(ch)]
    return name, gs[name].width

def glyph_path(ch, transform):
    name, _ = glyph(ch)
    pen = SVGPathPen(gs)
    gs[name].draw(TransformPen(pen, transform))
    return pen.getCommands()

def f(v):
    return f'{v:.2f}'.rstrip('0').rstrip('.')

def text_width(s, size, tracking):
    sc = size / upm
    return sum(glyph(c)[1] * sc for c in s) + tracking * (len(s) - 1)

def arc_text(s, cx, cy, r, size, tracking, top=True):
    """Letters upright around a circle. top: baseline on radius r, reading clockwise over the top.
    bottom: cap tops on radius r, reading left to right under the bottom."""
    sc = size / upm
    total = text_width(s, size, tracking)
    ref_r = r if top else r + cap * sc  # baseline radius
    span = total / ref_r
    start = (-math.pi / 2 - span / 2) if top else (math.pi / 2 + span / 2)
    pos = 0.0
    paths = []
    for c in s:
        _, adv = glyph(c)
        w = adv * sc
        mid = pos + w / 2
        if top:
            a = start + mid / ref_r
            rot = a + math.pi / 2
        else:
            a = start - mid / ref_r
            rot = a - math.pi / 2
        bx = cx + ref_r * math.cos(a)
        by = cy + ref_r * math.sin(a)
        cos, sin = math.cos(rot), math.sin(rot)
        # glyph space: x right, y up -> local: x' = x - w/2 (centered), y' = -y ; then rotate, translate
        # matrix (a,b,c,d,e,f) maps (x,y) -> (a x + c y + e, b x + d y + f)
        ox = -w / 2
        A, B = sc * cos, sc * sin
        C, D = sc * sin, -sc * cos  # y flipped
        E = bx + ox * cos
        F = by + ox * sin
        paths.append(glyph_path(c, (A, B, C, D, E, F)))
        pos += w + tracking
    return ' '.join(paths)

def centered_text(s, cx, cy, size):
    """Text centered horizontally, cap height centered vertically on cy."""
    sc = size / upm
    w = text_width(s, size, 0)
    x = cx - w / 2
    baseline = cy + cap * sc / 2
    out = []
    for c in s:
        _, adv = glyph(c)
        out.append(glyph_path(c, (sc, 0, 0, -sc, x, baseline)))
        x += adv * sc
    return ' '.join(out)

def crescent(cx, cy, r, angle_deg=0):
    """Crescent opening to the right (rotated by angle): outer circle r, inner cut circle offset."""
    a = math.radians(angle_deg)
    d = r * 0.42  # offset of the cutting circle
    rc = r * 0.86
    # intersection points of circle(0,0,r) and circle(d,0,rc) in local coords
    x = (r * r - rc * rc + d * d) / (2 * d)
    y = math.sqrt(max(r * r - x * x, 0))
    def p(px, py):
        return cx + px * math.cos(a) - py * math.sin(a), cy + px * math.sin(a) + py * math.cos(a)
    x1, y1 = p(x, -y)
    x2, y2 = p(x, y)
    return (f'M{f(x1)} {f(y1)} A{f(r)} {f(r)} 0 1 0 {f(x2)} {f(y2)} '
            f'A{f(rc)} {f(rc)} 0 0 1 {f(x1)} {f(y1)}Z')

C = 256
# ---------- full badge ----------
top = arc_text('MUTELU', C, C, 176, 62, 6, top=True)
bottom = arc_text('HUB', C, C, 176, 62, 10, top=False)
m_big = centered_text('M', C, C + 2, 150)
badge = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-labelledby="t">
<title id="t">MuteluHub</title>
<circle cx="{C}" cy="{C}" r="246" fill="none" stroke="{GOLD}" stroke-width="7"/>
<circle cx="{C}" cy="{C}" r="232" fill="none" stroke="{GOLD}" stroke-width="2"/>
<path fill="{GOLD}" d="{top}"/>
<path fill="{GOLD}" d="{bottom}"/>
<circle cx="{C}" cy="{C}" r="128" fill="{GOLD}"/>
<path fill="{INDIGO}" d="{m_big}"/>
<path fill="{GOLD}" d="{crescent(C - 192, C, 20, 0)}"/>
<path fill="{GOLD}" d="{crescent(C + 192, C, 20, 180)}"/>
</svg>
'''

# ---------- compact mark (header / favicon / app icon) ----------
# วงแหวนเว้นช่องมุมขวาบน มีพระจันทร์เสี้ยววางในช่อง
def ring_arc(cx, cy, r, gap_center_deg, gap_deg):
    a1 = math.radians(gap_center_deg + gap_deg / 2)
    a2 = math.radians(gap_center_deg - gap_deg / 2 + 360)
    x1, y1 = cx + r * math.cos(a1), cy + r * math.sin(a1)
    x2, y2 = cx + r * math.cos(a2), cy + r * math.sin(a2)
    return f'M{f(x1)} {f(y1)} A{f(r)} {f(r)} 0 1 1 {f(x2)} {f(y2)}'

GAP = -45
RING_R = 232
mx = C + RING_R * math.cos(math.radians(GAP))
my = C + RING_R * math.sin(math.radians(GAP))
m_small = centered_text('M', C, C + 4, 200)
mark = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-labelledby="t">
<title id="t">MuteluHub</title>
<path d="{ring_arc(C, C, RING_R, GAP, 62)}" fill="none" stroke="{GOLD}" stroke-width="18" stroke-linecap="round"/>
<path fill="{GOLD}" d="{crescent(mx, my, 44, 180 + GAP)}"/>
<circle cx="{C}" cy="{C}" r="190" fill="{GOLD}"/>
<path fill="{INDIGO}" d="{m_small}"/>
</svg>
'''

# favicon: compact mark on an indigo rounded square so it reads on light and dark tabs
fav_inner = mark.split('\n', 2)[2].rsplit('</svg>', 1)[0]
favicon = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
<rect width="512" height="512" rx="112" fill="{INDIGO}"/>
<g transform="translate(36 36) scale(0.859375)">
{fav_inner}</g>
</svg>
'''

for name, svg in [('logo-badge.svg', badge), ('logo-mark.svg', mark), ('icon.svg', favicon)]:
    open(f'{OUT}/{name}', 'w').write(svg)
    print(name, len(svg))
