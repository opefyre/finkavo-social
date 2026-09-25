#!/usr/bin/env python3
# usage: NOCROP=1 TOLHEAD=10 HEADROWS=1 python3 cutout.py src.png cut.png 30  →  python3 cutout_clean.py src.png cut.png out.png [shadow_tol 9] [gap_min_height .4]
# Use for images with white clothes/napkins/plates: a strict cutout keeps them, this removes the floor shadow and enclosed gaps.
# Raise gap_min_height (.62) when a cream item (a napkin) sits mid-body; lower shadow_tol (5) for white socks near the floor.
# post.py src.png cut.png out.png [shadow_tol] — clean a strict cutout: flood from the transparent area through pixels that match the
# source background (d<8) or, in the bottom 14 %, the floor-shadow colour (d<shadow_tol); then drop enclosed background-coloured gaps
# (d<5, >300 px, below 40 % height). Tight tolerances so white clothes survive.
import sys, numpy as np
from collections import deque
from PIL import Image
src, cut, out = sys.argv[1:4]; stol = float(sys.argv[4]) if len(sys.argv) > 4 else 9
o = np.asarray(Image.open(src).convert("RGB")).astype(float); c = np.array(Image.open(cut).convert("RGBA"))
h, w = o.shape[:2]; bg = o[5, 5]
dbg = np.sqrt(((o - bg) ** 2).sum(2))
SH = np.array([[244, 234, 214], [240, 232, 210], [244, 236, 216], [244, 232, 212], [246, 240, 222]], float)
dsh = np.min([np.sqrt(((o - s) ** 2).sum(2)) for s in SH], axis=0)
rows = np.arange(h)[:, None]
C = (dbg < 8) | ((rows > h * .86) & (dsh < stol))
A = c[..., 3]; T = A < 128
seen = T.copy(); dq = deque(zip(*np.nonzero(T)))
while dq:
    y, x = dq.popleft()
    for yy, xx in ((y+1, x), (y-1, x), (y, x+1), (y, x-1)):
        if 0 <= yy < h and 0 <= xx < w and not seen[yy, xx] and C[yy, xx]:
            seen[yy, xx] = True; dq.append((yy, xx))
A = np.where(seen, 0, A)
E = (dbg < 5) & (A > 0); lab = np.zeros((h, w), bool)
for y0, x0 in zip(*np.nonzero(E)):
    if lab[y0, x0]: continue
    comp = [(y0, x0)]; lab[y0, x0] = True; q = deque(comp)
    while q:
        y, x = q.popleft()
        for yy, xx in ((y+1, x), (y-1, x), (y, x+1), (y, x-1)):
            if 0 <= yy < h and 0 <= xx < w and E[yy, xx] and not lab[yy, xx]:
                lab[yy, xx] = True; q.append((yy, xx)); comp.append((yy, xx))
    ys = [p[0] for p in comp]
    if len(comp) > 300 and np.mean(ys) > h * (float(sys.argv[5]) if len(sys.argv) > 5 else .4):
        for y, x in comp: A[y, x] = 0
c[..., 3] = A
Image.fromarray(c).save(out)
