#!/usr/bin/env python3
"""cutout_mint.py src.png out.webp — cut a character generated on the flat mint background (#bfe8d6).

Flood-fills the background from the border (cutout.py, tolerance 40, no crop), then also clears every mint-coloured pixel that the
flood could not reach (gaps between legs, chair slats, inside an elbow) — by hue, not brightness, so white shirts, white jackets,
newspapers and napkins stay opaque. Crops to the content. Check the result on magenta like any cutout."""
import os, subprocess, sys, tempfile
import numpy as np
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
tmp = os.path.join(tempfile.mkdtemp(), "flood.png")
subprocess.run([sys.executable, os.path.join(os.path.dirname(__file__), "cutout.py"), src, tmp, "40"], check=True,
               env={**os.environ, "NOCROP": "1"}, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
s = np.asarray(Image.open(src).convert("RGB")).astype(float)
bg = np.median(np.concatenate([s[0], s[-1], s[:, 0], s[:, -1]]), axis=0)
f = np.array(Image.open(tmp).convert("RGBA")).astype(float)
d = np.sqrt(((s - bg) ** 2).sum(2)); R, G, B = s[..., 0], s[..., 1], s[..., 2]
mint = ((G - R) > 22) & ((G - B) > 4)                                  # greenish-cyan, like the background; whites and greys are not
keep = np.where(mint, np.clip((d - 18) / (40 - 18), 0, 1), 1.0)
a = np.minimum(f[..., 3] / 255, keep)
im = Image.fromarray(np.dstack([f[..., :3], a * 255]).astype(np.uint8))
im = im.crop(im.getbbox())
im.save(out, lossless=True) if out.endswith(".webp") else im.save(out)
print(out, im.size)
