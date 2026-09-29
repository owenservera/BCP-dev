#!/usr/bin/env python3
"""Generate OpenCode OS application icons (PNG + ICO) — rounded square with
'OC' monogram on the brand gradient. Deterministic, no network."""
from PIL import Image, ImageDraw, ImageFont
import os

ROOT = os.path.join(os.path.dirname(__file__), "..", "src-tauri", "icons")
os.makedirs(ROOT, exist_ok=True)

GRAD = [(15, 108, 189), (76, 194, 255)]  # accent -> accent-2


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def rounded_gradient(size):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    grad = Image.new("RGBA", (size, size))
    px = grad.load()
    for y in range(size):
        for x in range(size):
            t = (x + y) / (2 * size)
            px[x, y] = lerp(GRAD[0], GRAD[1], t) + (255,)
    mask = Image.new("L", (size, size), 0)
    d = ImageDraw.Draw(mask)
    radius = max(4, size // 5)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
    img.paste(grad, (0, 0), mask)
    # monogram
    dr = ImageDraw.Draw(img)
    font = None
    for fp in [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    ]:
        if os.path.exists(fp):
            font = ImageFont.truetype(fp, int(size * 0.46))
            break
    if font is None:
        font = ImageFont.load_default()
    text = "OC"
    bbox = dr.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    dr.text(((size - tw) / 2 - bbox[0], (size - th) / 2 - bbox[1] - size * 0.02),
            text, font=font, fill=(255, 255, 255, 255))
    return img


def main():
    master = rounded_gradient(512)
    master.save(os.path.join(ROOT, "icon.png"))
    for name, size in [("32x32.png", 32), ("128x128.png", 128), ("128x128@2x.png", 256)]:
        master.resize((size, size), Image.LANCZOS).save(os.path.join(ROOT, name))
    # Windows ICO with embedded sizes
    ico_sizes = [16, 24, 32, 48, 64, 128, 256]
    master.resize((256, 256), Image.LANCZOS).save(
        os.path.join(ROOT, "icon.ico"), format="ICO", sizes=[(s, s) for s in ico_sizes]
    )
    print("icons written to", os.path.abspath(ROOT))


if __name__ == "__main__":
    main()
