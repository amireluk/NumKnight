"""
Split 4-way sprite sheets into individual poses, remove background via chroma-key.
Layout: 2×2 grid — TL=idle, TR=attack, BL=hit, BR=dead
"""
import numpy as np
from PIL import Image
import os, sys

BASE = '/workspaces/NumKnight/public/assets/characters'

SHEETS = [
    # (sheet_path, output_folder, pose_names)
    (f'{BASE}/knight-4-way.png',       f'{BASE}/knight',       ['knight-idle', 'knight-attack', 'knight-hit', 'knight-dead']),
    (f'{BASE}/goblin-4-way.png',       f'{BASE}/goblin',       ['goblin-idle', 'goblin-attack', 'goblin-hit', 'goblin-dead']),
    (f'{BASE}/black-knight-4-way.png', f'{BASE}/black-knight', ['black-knight-idle', 'black-knight-attack', 'black-knight-hit', 'black-knight-dead']),
]

CELL_ORDER = [(0, 0), (1, 0), (0, 1), (1, 1)]  # (col, row) → idle, attack, hit, dead


def remove_background(img_rgba: Image.Image, tolerance: int = 30) -> Image.Image:
    """Chroma-key: sample background from corners, make matching pixels transparent."""
    arr = np.array(img_rgba, dtype=np.float32)
    h, w = arr.shape[:2]

    # Sample background color from the 4 corners (5×5 patch average)
    corners = [arr[:5, :5, :3], arr[:5, -5:, :3], arr[-5:, :5, :3], arr[-5:, -5:, :3]]
    bg = np.mean([c.mean(axis=(0, 1)) for c in corners], axis=0)
    print(f'  bg color detected: R={bg[0]:.0f} G={bg[1]:.0f} B={bg[2]:.0f}')

    # Euclidean distance from background in RGB space
    rgb = arr[:, :, :3]
    dist = np.sqrt(np.sum((rgb - bg) ** 2, axis=2))

    # Build alpha: smooth falloff between tolerance and tolerance*2
    lo, hi = tolerance, tolerance * 2
    alpha_mult = np.clip((dist - lo) / (hi - lo), 0, 1)

    # Preserve original alpha (image might already be RGBA)
    orig_alpha = arr[:, :, 3] / 255.0
    new_alpha = (alpha_mult * orig_alpha * 255).astype(np.uint8)

    result = arr.copy().astype(np.uint8)
    result[:, :, 3] = new_alpha
    return Image.fromarray(result, 'RGBA')


def crop_to_content(img: Image.Image, padding: int = 2) -> Image.Image:
    """Crop transparent padding, leave a small border."""
    bbox = img.getbbox()
    if bbox is None:
        return img
    l, t, r, b = bbox
    w, h = img.size
    l = max(0, l - padding)
    t = max(0, t - padding)
    r = min(w, r + padding)
    b = min(h, b + padding)
    return img.crop((l, t, r, b))


def process_sheet(sheet_path, out_folder, pose_names):
    print(f'\nProcessing: {os.path.basename(sheet_path)}')
    os.makedirs(out_folder, exist_ok=True)

    sheet = Image.open(sheet_path).convert('RGBA')
    W, H = sheet.size
    cell_w, cell_h = W // 2, H // 2
    print(f'  sheet={W}×{H}, cell={cell_w}×{cell_h}')

    for i, (col, row) in enumerate(CELL_ORDER):
        name = pose_names[i]
        x0, y0 = col * cell_w, row * cell_h
        cell = sheet.crop((x0, y0, x0 + cell_w, y0 + cell_h))

        # Remove background
        cell_nobg = remove_background(cell, tolerance=28)

        # Crop to content
        cell_cropped = crop_to_content(cell_nobg, padding=2)

        out_path = os.path.join(out_folder, f'{name}.webp')
        cell_cropped.save(out_path, 'WEBP', quality=95)
        print(f'  {name}: {cell.size} → {cell_cropped.size} → {out_path}')


for sheet_path, out_folder, pose_names in SHEETS:
    if not os.path.exists(sheet_path):
        print(f'SKIP (not found): {sheet_path}')
        continue
    process_sheet(sheet_path, out_folder, pose_names)

print('\nDone.')
