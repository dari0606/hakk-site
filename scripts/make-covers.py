# Рисует обложки книг в едином фиолетовом стиле.
# Запуск: python3 scripts/make-covers.py
import json, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT = '/System/Library/Fonts/Supplemental/Georgia.ttf'
FONT_B = '/System/Library/Fonts/Supplemental/Georgia Bold.ttf'
W, H = 700, 980

BOOKS = [
    ('elikteuge-kim-laiyq', 'Еліктеуге кім лайық', 'Серікбосын Мұсабекұлы'),
    ('quran-mysaldary',     'Құран мысалдары', ''),
    ('napil-namaz',         'Нәпіл намаз', 'Дастан Құрманбаев'),
    ('dugalar',             'Дұғалар', ''),
    ('mubarak-30-kun',      'Мубарак 30 күн', 'Бейсенәлі Олжас'),
    ('arab-tirkester',      'Араб тіліндегі танымал тіркестер', ''),
    ('sanlaq-sahabalar',    'Саңлақ сахабалар', ''),
    ('kozdi-qorgau',        'Көзді күнәдан қалай қорғаймыз', ''),
    ('haziret-aisha',       'Хазірет Айша', ''),
]

def gradient():
    top, mid, bot = (58, 42, 134), (106, 92, 196), (155, 140, 224)
    im = Image.new('RGB', (1, H))
    d = ImageDraw.Draw(im)
    for y in range(H):
        t = y / H
        if t < .55:
            k = t / .55
            c = tuple(round(top[i] + (mid[i] - top[i]) * k) for i in range(3))
        else:
            k = (t - .55) / .45
            c = tuple(round(mid[i] + (bot[i] - mid[i]) * k) for i in range(3))
        d.point((0, y), fill=c)
    return im.resize((W, H))

def pattern(im):
    """Тонкая сетка ромбов поверх фона."""
    lay = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(lay)
    step = 78
    for y in range(-step, H + step, step):
        for x in range(-step, W + step, step):
            d.line([(x + step // 2, y), (x + step, y + step // 2),
                    (x + step // 2, y + step), (x, y + step // 2),
                    (x + step // 2, y)], fill=(255, 255, 255, 16), width=1)
    im.alpha_composite(lay)

def glow(im):
    g = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(g).ellipse((W // 2 - 300, 210, W // 2 + 300, 700), fill=(255, 230, 190, 42))
    im.alpha_composite(g.filter(ImageFilter.GaussianBlur(110)))

def wrap(draw, text, font, max_w):
    words, lines, cur = text.split(), [], ''
    for w in words:
        t = (cur + ' ' + w).strip()
        if draw.textlength(t, font=font) <= max_w:
            cur = t
        else:
            if cur: lines.append(cur)
            cur = w
    if cur: lines.append(cur)
    return lines

def ornament(d, cy):
    gold = (233, 202, 138)
    d.line([(W // 2 - 120, cy), (W // 2 - 26, cy)], fill=gold, width=2)
    d.line([(W // 2 + 26, cy), (W // 2 + 120, cy)], fill=gold, width=2)
    r = 9
    d.polygon([(W // 2, cy - r), (W // 2 + r, cy), (W // 2, cy + r), (W // 2 - r, cy)], outline=gold, width=2)

def cover(slug, title, author):
    im = gradient().convert('RGBA')
    pattern(im)
    glow(im)
    d = ImageDraw.Draw(im)

    gold = (233, 202, 138)
    d.rectangle((26, 26, W - 27, H - 27), outline=(255, 255, 255, 60), width=2)
    d.rectangle((36, 36, W - 37, H - 37), outline=gold, width=1)

    size = 62 if len(title) < 22 else 52 if len(title) < 32 else 44
    f_title = ImageFont.truetype(FONT_B, size)
    lines = wrap(d, title.upper(), f_title, W - 160)
    lh = size * 1.28
    y = H / 2 - (len(lines) * lh) / 2 - 30
    ornament(d, y - 52)
    for ln in lines:
        d.text((W / 2, y), ln, font=f_title, fill=(255, 252, 246), anchor='ma')
        y += lh

    if author:
        f_a = ImageFont.truetype(FONT, 27)
        d.text((W / 2, y + 26), author, font=f_a, fill=(226, 216, 250), anchor='ma')
        y += 26 + 34
    ornament(d, y + 46)

    f_b = ImageFont.truetype(FONT_B, 22)
    d.text((W / 2, H - 116), 'HAKK ACADEMY', font=f_b, fill=(255, 250, 240), anchor='ma')
    f_s = ImageFont.truetype(FONT, 15)
    d.text((W / 2, H - 84), 'Қ Ұ Р А Н   ·   Т Ә Ж У И Д   ·   А Р А Б   Т І Л І',
           font=f_s, fill=(214, 202, 242), anchor='ma')

    out = os.path.join(ROOT, f'public/art/cover-{slug}.jpg')
    im.convert('RGB').save(out, quality=82, optimize=True)
    return out

if __name__ == '__main__':
    for slug, title, author in BOOKS:
        print('  ', os.path.basename(cover(slug, title, author)))
    print(f'{len(BOOKS)} обложек готово.')
