#!/usr/bin/env python3
"""cutout.py in.(webp|png) out.png — make a flat cream background transparent.
Flood-fills from the image border over pixels close to the border colour, so cream inside the character
(a polo shirt, a page) stays. Edge pixels get a soft alpha. Needs only PIL + numpy."""
import sys, os
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

src, dst = sys.argv[1], sys.argv[2]   # dst may be .png or .webp (lossless)
tol = float(sys.argv[3]) if len(sys.argv) > 3 else 46
im = Image.open(src).convert("RGB")
a = np.asarray(im).astype(np.float32)
h, w, _ = a.shape
bg = np.median(np.concatenate([a[0, :], a[-1, :], a[:, 0], a[:, -1]]), axis=0)
dist = np.sqrt(((a - bg) ** 2).sum(axis=2))
near = dist < tol
seen = np.zeros((h, w), bool)
dq = deque()
for x in range(w):
    for y in (0, h - 1):
        if near[y, x] and not seen[y, x]: seen[y, x] = True; dq.append((y, x))
for y in range(h):
    for x in (0, w - 1):
        if near[y, x] and not seen[y, x]: seen[y, x] = True; dq.append((y, x))
while dq:
    y, x = dq.popleft()
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        ny, nx = y + dy, x + dx
        if 0 <= ny < h and 0 <= nx < w and near[ny, nx] and not seen[ny, nx]:
            seen[ny, nx] = True; dq.append((ny, nx))
alpha = np.where(seen, 0.0, 255.0)
# soften: pixels next to the removed area fade with their distance from the background colour
edge = np.asarray(Image.fromarray(seen.astype(np.uint8) * 255).filter(ImageFilter.MaxFilter(5))) > 0
soft = np.clip((dist - tol * .55) / (tol * .9), 0, 1) * 255
alpha = np.where(edge & ~seen, np.minimum(alpha + 255, soft + 40).clip(0, 255), alpha)
alpha = np.asarray(Image.fromarray(alpha.astype(np.uint8)).filter(ImageFilter.GaussianBlur(.8)))
alpha = np.where(seen, 0, alpha)
# FILLROWS=0.5: a near-cream feature (a white beard) can be flooded away together with the background. In the top part of the
# image, treat everything between the outermost solid pixels of each row as the character.
fr = os.environ.get("FILLROWS")
if fr:
    solid = alpha > 128
    for y in range(int(h * float(fr))):
        xs = np.flatnonzero(solid[y])
        if len(xs) > 1: alpha[y, xs[0]:xs[-1] + 1] = 255
out = Image.fromarray(np.dstack([a.astype(np.uint8), alpha.astype(np.uint8)]), "RGBA")
bbox = out.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
import os
res = out if os.environ.get("NOCROP") else out.crop(bbox)
res.save(dst, lossless=True, method=6) if dst.endswith(".webp") else res.save(dst)
print(dst, out.size, "bg", bg.astype(int).tolist())
