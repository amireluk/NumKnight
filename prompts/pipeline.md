# Sprite Processing Pipeline

How to go from a raw AI-generated 2×2 sprite sheet to clean in-game WebP sprites.

---

## Overview

1. Generate a 2×2 sprite sheet (see `characters.md` for prompts)
2. Save the source PNG as `public/assets/characters/<name>-4-way.png`
3. Run the pipeline below — outputs 4 WebP files per character
4. Verify direction and flip if needed (see [Direction rules](#direction-rules))

---

## Pipeline (copy-paste into a Python script or terminal)

```python
from PIL import Image
import numpy as np
from collections import deque
import os

# ── Core helpers ──────────────────────────────────────────────────────────────

def bfs_flood_fill_alpha(arr_rgba, seed_r, seed_c, bg_rgb, tol=55):
    """BFS from corner seed — marks any pixel within tol of bg_rgb as transparent."""
    h, w = arr_rgba.shape[:2]
    visited = np.zeros((h, w), bool)
    queue = deque([(seed_r, seed_c)])
    visited[seed_r, seed_c] = True
    bg = np.array(bg_rgb, dtype=float)
    while queue:
        r, c = queue.popleft()
        px = arr_rgba[r, c, :3].astype(float)
        if np.linalg.norm(px - bg) > tol:
            continue
        arr_rgba[r, c, 3] = 0
        for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
            nr, nc = r+dr, c+dc
            if 0 <= nr < h and 0 <= nc < w and not visited[nr, nc]:
                visited[nr, nc] = True
                queue.append((nr, nc))

def remove_bg_bfs(img_rgba, bg_rgb, tol=55):
    """Flood-fill background removal from all 4 corners."""
    arr = np.array(img_rgba, dtype=np.uint8)
    h, w = arr.shape[:2]
    for r, c in [(0,0),(0,w-1),(h-1,0),(h-1,w-1)]:
        bfs_flood_fill_alpha(arr, r, c, bg_rgb, tol)
    return Image.fromarray(arr)

def binarize_alpha(img_rgba, thresh=128):
    """Hard-threshold alpha: fully opaque or fully transparent."""
    arr = np.array(img_rgba)
    arr[:, :, 3] = np.where(arr[:, :, 3] >= thresh, 255, 0)
    return Image.fromarray(arr)

def erode_alpha(img_rgba, passes=2):
    """Shrink the opaque region by N pixels to remove fringe."""
    arr = np.array(img_rgba)
    for _ in range(passes):
        a = arr[:, :, 3].copy()
        eroded = a.copy()
        eroded[1:,  :] = np.minimum(eroded[1:,  :], a[:-1, :])
        eroded[:-1, :] = np.minimum(eroded[:-1, :], a[1:,  :])
        eroded[:,  1:] = np.minimum(eroded[:,  1:], a[:, :-1])
        eroded[:, :-1] = np.minimum(eroded[:, :-1], a[:, 1:] )
        arr[:, :, 3] = eroded
    return Image.fromarray(arr)

def autocrop(img_rgba):
    """Trim transparent border."""
    arr = np.array(img_rgba)
    mask = arr[:, :, 3] > 10
    rows, cols = np.any(mask, axis=1), np.any(mask, axis=0)
    r0, r1 = np.where(rows)[0][[0, -1]]
    c0, c1 = np.where(cols)[0][[0, -1]]
    return img_rgba.crop((c0, r0, c1+1, r1+1))

def normalize_heights(sprites):
    """Pad all sprites at the TOP so feet stay at the same Y (seamless swap)."""
    max_h = max(img.size[1] for img in sprites.values())
    out = {}
    for name, img in sprites.items():
        w, h = img.size
        if h < max_h:
            new_img = Image.new('RGBA', (w, max_h), (0,0,0,0))
            new_img.paste(img, (0, max_h - h))
            out[name] = new_img
        else:
            out[name] = img
    return out

def erase_by_color(img_rgba, target_rgb, tol=40):
    """Erase any opaque pixel close to target_rgb (handles leftover bg specks)."""
    arr = np.array(img_rgba)
    rgb = arr[:,:,:3].astype(float)
    target = np.array(target_rgb, dtype=float)
    dist = np.linalg.norm(rgb - target, axis=2)
    close = (dist < tol) & (arr[:,:,3] > 30)
    arr[close, 3] = 0
    return Image.fromarray(arr)

def erase_greenish(img_rgba):
    """Extra pass for green-background sources: erase pixels where G >> R."""
    arr = np.array(img_rgba)
    rgb = arr[:,:,:3].astype(float)
    greenish = (rgb[:,:,1] > rgb[:,:,0] + 15) & (arr[:,:,3] > 30)
    arr[greenish, 3] = 0
    return Image.fromarray(arr)

# ── Main pipeline ─────────────────────────────────────────────────────────────

def process_character(name, sheet_path, bg_rgb, out_dir,
                      tol=60, erode_passes=2,
                      flip_poses=None,       # list of pose names to flip horizontally
                      green_bg=False):       # True if bg colour is greenish
    """
    Full pipeline: split → chroma-key → binarize → erode → autocrop → normalize → save.

    Args:
        name:        character name, e.g. 'goblin'
        sheet_path:  path to 2×2 PNG source sheet
        bg_rgb:      background colour as (R, G, B) tuple
        out_dir:     output directory for the 4 WebP files
        tol:         colour distance tolerance for BFS (default 60)
        erode_passes: number of erosion passes (default 2)
        flip_poses:  poses to flip horizontally, e.g. ['idle', 'hit']
        green_bg:    apply extra green-channel erase pass (for green backgrounds)
    """
    if flip_poses is None:
        flip_poses = []

    sheet = Image.open(sheet_path).convert('RGB')
    W, H = sheet.size
    cw, ch = W // 2, H // 2

    cells = {
        'idle':   sheet.crop((0,  0,  cw, ch)),
        'attack': sheet.crop((cw, 0,  W,  ch)),
        'hit':    sheet.crop((0,  ch, cw, H)),
        'dead':   sheet.crop((cw, ch, W,  H)),
    }

    processed = {}
    for pose, cell in cells.items():
        rgba = cell.convert('RGBA')
        rgba = remove_bg_bfs(rgba, bg_rgb, tol)
        rgba = binarize_alpha(rgba)
        rgba = erode_alpha(rgba, erode_passes)
        if green_bg:
            rgba = erase_greenish(rgba)
        rgba = autocrop(rgba)
        if pose in flip_poses:
            rgba = rgba.transpose(Image.FLIP_LEFT_RIGHT)
        processed[pose] = rgba

    normalized = normalize_heights(processed)

    os.makedirs(out_dir, exist_ok=True)
    for pose, img in normalized.items():
        out_path = os.path.join(out_dir, f'{name}-{pose}.webp')
        img.save(out_path, 'WEBP', quality=95)
        print(f'  saved {out_path}  {img.size}')
```

---

## Per-character settings

| Character | BG colour (approx) | tol | erode | flip_poses | green_bg | Notes |
|-----------|-------------------|-----|-------|------------|----------|-------|
| Knight (player) | `(168, 39, 131)` magenta | 60 | 2 | `[]` | — | Player, not an enemy |
| Goblin | `(168, 39, 131)` magenta | 60 | 2 | `['idle', 'hit']` | — | Flip idle + hit |
| Skeleton | `(19, 185, 52)` green | 60 | 2 | `['idle', 'attack', 'hit', 'dead']` | `True` | Use `skeleton-4-way-swampy.png`; flip all poses |
| Orc | `(181, 66, 135)` magenta | 60 | 2 | `[]` | — | |
| Dark Knight (black-knight) | `(168, 39, 131)` magenta | 60 | 2 | `['idle', 'hit']` | — | Source faces RIGHT — flip idle+hit |
| Dragon | `(75, 170, 73)` green | 60 | 2 | `['idle', 'hit']` | `True` | Source faces mixed — flip idle+hit; run `erase_greenish` |

> **Tip:** To detect the background colour, open the sheet in any viewer and sample the top-left corner pixel.

---

## Direction rules

All enemies must face **LEFT** in the saved WebP (no `scaleX` is applied in raster mode).

- If a character's face/weapon points **right** in the raw image → **flip** that pose.
- Check every pose individually — AI-generated sheets sometimes have inconsistent facing across poses.
- The `flip_poses` parameter in `process_character()` handles this per pose.

---

## Example usage

```python
BASE = 'public/assets/characters'

process_character(
    name='goblin',
    sheet_path=f'{BASE}/goblin-4-way.png',
    bg_rgb=(168, 39, 131),
    out_dir=f'{BASE}/goblin',
)

process_character(
    name='dragon',
    sheet_path=f'{BASE}/dragon-4-way.png',
    bg_rgb=(75, 170, 73),
    out_dir=f'{BASE}/dragon',
    flip_poses=['idle', 'hit'],
    green_bg=True,
)
```

---

## Checking results

After running the pipeline, view the output WebP files to verify:

1. **Facing left** — character's face/weapon points left
2. **No fringe** — no coloured border around the sprite outline
3. **Consistent height** — all 4 poses have the same pixel height (feet aligned)
4. **No floating artifacts** — no stray pixels from adjacent cells or source decoration

If floating artifacts remain (disconnected blobs), apply an additional connected-components pass or use `erase_by_color()` targeting the artifact's sampled RGB.
