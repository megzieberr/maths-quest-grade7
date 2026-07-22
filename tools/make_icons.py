"""Genereer die app-ikone vir Wiskunde Avontuur in ../ (die repo se wortel,
waar manifest.json en sw.js woon).

Die ikoon is dieselfde vuurpyl as icon.svg — 'n wit vuurpyl met 'n violet
venster, oranje vlam en donker vinne op 'n violet teël.

Loop van enige plek af met:  python tools/make_icons.py
Benodig Pillow:              python -m pip install pillow
"""
import os

from PIL import Image, ImageDraw

OUT = os.path.normpath(os.path.join(os.path.dirname(__file__), ".."))

TOP = (167, 139, 250)          # #a78bfa  teël bo
BOT = (124, 58, 237)           # #7c3aed  teël onder
WHITE = (255, 255, 255, 255)
FIN = (109, 40, 217, 255)      # #6d28d9
FLAME_OUT = (251, 191, 36, 255)  # #fbbf24
FLAME_IN = (249, 115, 22, 255)   # #f97316
GLASS = (167, 139, 250, 255)   # #a78bfa
GLASS_LINE = (124, 58, 237, 255)

SS = 4   # supersteekproef vir gladde (anti-aliased) rande


def _bez(p0, c1, c2, p3, n=24):
    """Punte op 'n kubieke bezier — so volg ons presies icon.svg se paaie."""
    pts = []
    for i in range(n + 1):
        t = i / n
        u = 1 - t
        x = u**3 * p0[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t**3 * p3[0]
        y = u**3 * p0[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t**3 * p3[1]
        pts.append((x, y))
    return pts


def _gradient(size, radius=None, full_bleed=False):
    """Violet teël met 'n vertikale gradiënt (en opsionele ronde hoeke)."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    grad = Image.new("RGBA", (size, size))
    gd = ImageDraw.Draw(grad)
    for y in range(size):
        t = y / max(1, size - 1)
        gd.line([(0, y), (size, y)],
                fill=tuple(int(TOP[i] + (BOT[i] - TOP[i]) * t) for i in range(3)) + (255,))
    mask = Image.new("L", (size, size), 0)
    md = ImageDraw.Draw(mask)
    if full_bleed or radius is None:
        md.rectangle([0, 0, size - 1, size - 1], fill=255)
    else:
        md.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
    img.paste(grad, (0, 0), mask)
    return img


def make(size, pad_ratio=0.0, full_bleed=False):
    s = size * SS
    img = _gradient(s, radius=int(s * 0.25), full_bleed=full_bleed)
    d = ImageDraw.Draw(img)

    # icon.svg werk in 'n 64x64-ruimte; skaal dit in die (moontlik ingekeepte) blok in
    pad = s * pad_ratio
    k = (s - 2 * pad) / 64.0
    def P(x, y):
        return (pad + x * k, pad + y * k)
    def path(pts):
        return [P(x, y) for (x, y) in pts]

    # vlam (buitenste geel, dan binneste oranje)
    d.polygon(path(_bez((32, 50), (28, 46), (28, 42), (32, 38)) +
                   _bez((32, 38), (36, 42), (36, 46), (32, 50))), fill=FLAME_OUT)
    d.polygon(path(_bez((32, 47), (30, 44.5), (30, 42.5), (32, 40.5)) +
                   _bez((32, 40.5), (34, 42.5), (34, 44.5), (32, 47))), fill=FLAME_IN)

    # vinne
    d.polygon(path([(24, 34), (18, 44), (24, 41)]), fill=FIN)
    d.polygon(path([(40, 34), (46, 44), (40, 41)]), fill=FIN)

    # liggaam + neus
    body = _bez((32, 12), (39, 19), (41, 28), (41, 36))
    body += [(41, 41), (23, 41)]
    body += _bez((23, 36), (23, 28), (25, 19), (32, 12))
    d.polygon(path(body), fill=WHITE)

    # venster
    r = 5
    box = [P(32 - r, 27 - r), P(32 + r, 27 + r)]
    flat = [box[0][0], box[0][1], box[1][0], box[1][1]]
    d.ellipse(flat, fill=GLASS)
    d.ellipse(flat, outline=GLASS_LINE, width=max(2, int(1.6 * k)))

    return img.resize((size, size), Image.LANCZOS)


def main():
    make(192).save(os.path.join(OUT, "icon-192.png"))
    make(512).save(os.path.join(OUT, "icon-512.png"))
    # Maskable: ekstra spasie sodat 'n ronde masker niks van die vuurpyl afsny nie.
    make(512, pad_ratio=0.17, full_bleed=True).save(os.path.join(OUT, "icon-512-maskable.png"))
    # Apple: vol blok (iOS sit self die ronde hoeke by).
    make(180, full_bleed=True).save(os.path.join(OUT, "apple-touch-icon.png"))
    print("Geskryf: icon-192.png, icon-512.png, icon-512-maskable.png, apple-touch-icon.png ->", OUT)


if __name__ == "__main__":
    main()
