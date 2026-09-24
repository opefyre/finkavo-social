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
# TOLHEAD=14 HEADROWS=.55: the head area gets a much stricter tolerance, so pale faces and white beards (close to the cream
# background) are not flooded away; the rest of the image keeps the normal tolerance (it also removes the floor shadow).
tolmap = np.full(h, tol, dtype=np.float32)
if os.environ.get("TOLHEAD"): tolmap[:int(h * float(os.environ.get("HEADROWS", .55)))] = float(os.environ["TOLHEAD"])
near = dist < tolmap[:, None]
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
soft = np.clip((dist - tolmap[:, None] * .55) / (tolmap[:, None] * .9), 0, 1) * 255
alpha = np.where(edge & ~seen, np.minimum(alpha + 255, soft + 40).clip(0, 255), alpha)
alpha = np.asarray(Image.fromarray(alpha.astype(np.uint8)).filter(ImageFilter.GaussianBlur(.8)))
alpha = np.where(seen, 0, alpha)
# FILLROWS=0.5: a near-cream feature (a white beard) can be flooded away together with the background. In the top part of the
# image, treat everything between the outermost solid pixels of each row as the character.
fr = os.environ.get("FILLROWS")
if fr:
    # Work on the character's main body only: open the mask (drops thin strands and detached marks such as burst lines or a "?"),
    # keep the piece connected to the coat, and fill every row of the head area between that body's outer edges.
    solid = alpha > 128
    m = Image.fromarray((solid * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(11)).filter(ImageFilter.MaxFilter(11))
    op = np.asarray(m) > 0
    body = np.zeros((h, w), bool)                                    # every big piece (head, ears, coat), not just the one joined to the coat
    seen2 = np.zeros((h, w), bool)
    for y0 in range(h):
        for x0 in np.flatnonzero(op[y0] & ~seen2[y0]):
            if seen2[y0, x0]: continue
            comp = [(y0, x0)]; seen2[y0, x0] = True; i = 0
            while i < len(comp):
                y, x = comp[i]; i += 1
                for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < h and 0 <= nx < w and op[ny, nx] and not seen2[ny, nx]:
                        seen2[ny, nx] = True; comp.append((ny, nx))
            if len(comp) >= 700:
                for y, x in comp: body[y, x] = True
    for y in range(int(h * float(fr))):
        xs = np.flatnonzero(body[y])
        if len(xs) > 1: alpha[y, xs[0]:xs[-1] + 1] = 255

# holes: transparent regions not connected to the image border (flood the outside over alpha<128, everything else in there is solid)
outside = np.zeros((h, w), bool); dq2 = deque()
for x in range(w):
    for y in (0, h - 1):
        if alpha[y, x] < 128 and not outside[y, x]: outside[y, x] = True; dq2.append((y, x))
for y in range(h):
    for x in (0, w - 1):
        if alpha[y, x] < 128 and not outside[y, x]: outside[y, x] = True; dq2.append((y, x))
while dq2:
    y, x = dq2.popleft()
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        ny, nx = y + dy, x + dx
        if 0 <= ny < h and 0 <= nx < w and alpha[ny, nx] < 128 and not outside[ny, nx]:
            outside[ny, nx] = True; dq2.append((ny, nx))
alpha = np.where(outside, alpha, 255)
out = Image.fromarray(np.dstack([a.astype(np.uint8), alpha.astype(np.uint8)]), "RGBA")
bbox = out.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
import os
res = out if os.environ.get("NOCROP") else out.crop(bbox)
res.save(dst, lossless=True, method=6) if dst.endswith(".webp") else res.save(dst)
print(dst, out.size, "bg", bg.astype(int).tolist())
