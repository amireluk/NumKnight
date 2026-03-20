# Background Processing Pipeline

How to go from a raw AI-generated background image to a game-ready WebP.

---

## Why this output size (1440 × 1080)?

The backgrounds are rendered with `objectFit: cover` inside a portrait phone container.

With a landscape 4:3 source image and a portrait container (e.g. 390 × 844 px):
- The browser scales the image so its **height fills the container** (844 px)
- Display width = `(4/3) × 844 ≈ 1125 px` — but the container is only 390 px wide
- The browser center-crops, showing the middle ~35% of the image width
- `objectPosition: center center` ensures the crop is always centered

**1440 × 1080** covers this comfortably:
- Enough resolution for high-DPI phones and tablets without wasted file size
- Maintains exact 4:3 ratio (same as the generation prompt)
- At 1440 px wide, a portrait phone sees the center ≈ 500 px — plenty of margin for safe composition

Output: `public/assets/backgrounds/<name>.webp`

---

## Steps

1. Drop the raw generated image into `public/assets/backgrounds/_raw/`. Name it exactly `<name>.png` (e.g. `forest.png`) for a clean run, or anything starting with `<name>` (e.g. `forest-v2.png`) — the script will fuzzy-match it.
2. Run the pipeline below
3. Verify the result in the game (toggle raster mode with the `IMG/SVG` button in battle)

---

## Pipeline

```python
from PIL import Image
import os

# ── Settings ──────────────────────────────────────────────────────────────────

TARGET_W, TARGET_H = 1440, 1080   # output size — landscape 4:3
WEBP_QUALITY = 90                  # 90 is a good balance of quality vs file size
BLACK_THRESHOLD = 30               # pixel brightness below this = black

BACKGROUNDS = [
    'forest',
    'swamp',
    'mountains',
    'castle',
    'dragon-lair',
]

# ── Core helpers ──────────────────────────────────────────────────────────────

def crop_black_bar(img):
    """
    Scan from the bottom up and crop any rows where the average brightness
    is below BLACK_THRESHOLD. Stops as soon as it hits a non-black row.
    Handles bars of any height without relying on a fixed percentage.
    """
    import numpy as np
    arr = np.array(img)
    h = arr.shape[0]
    cut = h
    for y in range(h - 1, -1, -1):
        if arr[y].mean() > BLACK_THRESHOLD:
            cut = y + 1
            break
    if cut < h:
        print(f'    cropped black bar: {h - cut}px ({(h - cut) / h * 100:.1f}%)')
    return img.crop((0, 0, img.width, cut))

def resize_to_target(img, w=TARGET_W, h=TARGET_H):
    """Resize to exact target dimensions using high-quality Lanczos filter."""
    return img.resize((w, h), Image.LANCZOS)

def process_background(name, raw_dir, out_dir):
    # 1. Try exact match first, then fuzzy (first file starting with name-)
    src = None
    for ext in ('png', 'jpg', 'jpeg', 'webp'):
        candidate = os.path.join(raw_dir, f'{name}.{ext}')
        if os.path.exists(candidate):
            src = candidate
            break
    if src is None:
        for fname in sorted(os.listdir(raw_dir)):
            if fname.startswith(name) and fname.split('.')[-1] in ('png', 'jpg', 'jpeg', 'webp'):
                src = os.path.join(raw_dir, fname)
                print(f'    fuzzy match: {fname}')
                break
    if src is None:
        print(f'  SKIP {name} — no source file found in {raw_dir}')
        return

    img = Image.open(src).convert('RGB')
    print(f'  {name}: source {img.size}')

    img = crop_black_bar(img)
    img = resize_to_target(img)

    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, f'{name}.webp')
    img.save(out_path, 'WEBP', quality=WEBP_QUALITY)
    print(f'  saved {out_path}  {img.size}')

# ── Run ───────────────────────────────────────────────────────────────────────

RAW_DIR = 'public/assets/backgrounds/_raw'
OUT_DIR = 'public/assets/backgrounds'

for name in BACKGROUNDS:
    process_background(name, RAW_DIR, OUT_DIR)
```

---

## Checking results

After running, verify each background in the game:

1. **No black bar** — bottom of scene goes to the edge cleanly
2. **Ground sits high** — character torsos read against terrain, not sky
3. **Center looks good** — key scene elements visible on a narrow phone crop
4. **No obvious stretching** — 4:3 source + 4:3 output means no distortion

Toggle between SVG and raster with the `IMG/SVG` button (top-right in battle) to compare.
