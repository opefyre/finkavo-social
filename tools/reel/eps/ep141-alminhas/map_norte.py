import json, math, os, io, urllib.request, numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
os.chdir(os.path.expanduser("~/reels-v2/mapwork"))
W, H = 2160, 3860            # 2x of the 1080x1930 frame
Z = 10
LON0, LON1, LAT_C = -10.35, -5.55, 39.75   # horizontal extent; vertical fitted to aspect

def mx(lon): return (lon + 180) / 360 * 256 * 2 ** Z
def my(lat):
    s = math.radians(lat); return (1 - math.log(math.tan(s) + 1 / math.cos(s)) / math.pi) / 2 * 256 * 2 ** Z
X0, X1 = mx(LON0), mx(LON1); sc = (X1 - X0) / W
YC = my(LAT_C); Y0 = YC - H * sc / 2; Y1 = YC + H * sc / 2
def P(lon, lat): return ((mx(lon) - X0) / sc, (my(lat) - Y0) / sc)

# ---- elevation mosaic (terrarium) ----
tx0, tx1, ty0, ty1 = int(X0 // 256), int(X1 // 256), int(Y0 // 256), int(Y1 // 256)
os.makedirs("tiles", exist_ok=True)
mos = np.zeros(((ty1 - ty0 + 1) * 256, (tx1 - tx0 + 1) * 256), np.float32)
for ty in range(ty0, ty1 + 1):
    for tx in range(tx0, tx1 + 1):
        f = f"tiles/{Z}_{tx}_{ty}.png"
        if not os.path.exists(f):
            urllib.request.urlretrieve(f"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{Z}/{tx}/{ty}.png", f)
        a = np.asarray(Image.open(f).convert("RGB"), np.float32)
        mos[(ty - ty0) * 256:(ty - ty0 + 1) * 256, (tx - tx0) * 256:(tx - tx0 + 1) * 256] = a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768
crop = mos[int(Y0 - ty0 * 256):int(Y1 - ty0 * 256), int(X0 - tx0 * 256):int(X1 - tx0 * 256)]
el = np.asarray(Image.fromarray(crop).resize((W, H), Image.BICUBIC), np.float32)

# hillshade
px = 40075016 * math.cos(math.radians(LAT_C)) / (256 * 2 ** Z) * sc
gy, gx = np.gradient(el, px)
zf = 2.2
slope = np.arctan(zf * np.hypot(gx, gy)); asp = np.arctan2(-gx, gy)
az, alt = math.radians(315), math.radians(42)
hs = np.sin(alt) * np.cos(slope) + np.cos(alt) * np.sin(slope) * np.cos(az - asp)
hs = np.clip(hs, 0, 1)

# ---- vectors ----
SS = 2
def rasterize(polys):
    m = Image.new("L", (W * SS, H * SS), 0); d = ImageDraw.Draw(m)
    for poly in polys:
        for i, ring in enumerate(poly):
            d.polygon([(P(*c)[0] * SS, P(*c)[1] * SS) for c in ring], fill=255 if i == 0 else 0)
    return np.asarray(m.resize((W, H), Image.LANCZOS), np.float32) / 255
def polys_of(g):
    return g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
adm0 = json.load(open("adm0.geojson"))
adm1 = json.load(open("adm1.geojson"))
land = []; prt = []
for f in adm0["features"]:
    if f["properties"]["ADM0_A3"] in ("PRT", "ESP", "FRA", "AND"):
        for p in polys_of(f["geometry"]):
            lons = [c[0] for c in p[0]]; lats = [c[1] for c in p[0]]
            if max(lons) < LON0 - 2 or min(lons) > LON1 + 2 or min(lats) > 45 or max(lats) < 35: continue
            land.append(p)
            if f["properties"]["ADM0_A3"] == "PRT": prt.append(p)
NORTE = {"Viana do Castelo", "Braga", "Porto", "Vila Real", "Bragança"}
dist = [f for f in adm1["features"] if f["properties"].get("adm0_a3") == "PRT" and f["geometry"]]
norte = [p for f in dist if f["properties"]["name"] in NORTE for p in polys_of(f["geometry"])]
print("districts", sorted(f["properties"]["name"] for f in dist))
mLand, mPrt, mNorte = rasterize(land), rasterize(prt), rasterize(norte)

# ---- colour ----
def lerp(a, b, t): return a + (b - a) * t[..., None]
e = np.clip(el / 1600, 0, 1)
low, high = np.array([92, 104, 62], np.float32), np.array([196, 168, 120], np.float32)
landc = lerp(low, high, e ** .7)
shade = (.35 + .85 * hs)[..., None]
portugal = landc * shade
spain = (np.array([70, 66, 60], np.float32) + 50 * e[..., None]) * (.35 + .75 * hs)[..., None]
d = np.clip(-el / 4000, 0, 1)
sea = lerp(np.array([22, 52, 82], np.float32), np.array([6, 16, 32], np.float32), d ** .6) * (.75 + .35 * hs)[..., None]
glow = lerp(np.zeros(3, np.float32), np.array([255, 190, 90], np.float32), mNorte * .0)  # placeholder
img = sea * (1 - mLand[..., None]) + spain * (mLand - mPrt)[..., None] + portugal * mPrt[..., None]
# north: warm golden wash, rest of Portugal slightly dimmed
gold = portugal * np.array([1.25, 1.05, .7], np.float32) + np.array([40, 22, 0], np.float32)
img = img * (1 - (mNorte * .85)[..., None]) + gold * (mNorte * .85)[..., None]
img = img * (1 - (mPrt - mNorte).clip(0)[..., None] * .18)
# vignette
yy, xx = np.mgrid[0:H, 0:W]
v = 1 - .55 * np.clip(np.hypot((xx - W * .5) / W, (yy - H * .32) / H) * 1.5, 0, 1) ** 1.6
img = np.clip(img * v[..., None], 0, 255).astype(np.uint8)
out = Image.fromarray(img, "RGB")

# ---- lines ----
ov = Image.new("RGBA", (W * SS, H * SS), (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
def line(coords, col, w):
    d.line([(P(*c)[0] * SS, P(*c)[1] * SS) for c in coords], fill=col, width=w * SS, joint="curve")
riv = json.load(open("rivers.geojson"))
for f in riv["features"]:
    g = f["geometry"]
    if not g: continue
    ls = g["coordinates"] if g["type"] == "MultiLineString" else [g["coordinates"]]
    for l in ls:
        if any(LON0 - .5 < c[0] < LON1 + .5 and 36.5 < c[1] < 43.5 for c in l):
            line(l, (110, 170, 215, 210), 3)
for f in dist:
    for p in polys_of(f["geometry"]):
        line(p[0], (255, 240, 210, 70), 2)
for p in prt:
    line(p[0], (255, 236, 200, 200), 3)
for p in norte:
    pass
# Norte outline glow: dilate mask edge
edge = Image.fromarray((mNorte * 255).astype(np.uint8)).filter(ImageFilter.FIND_EDGES)
ov = ov.resize((W, H), Image.LANCZOS)
out = Image.alpha_composite(out.convert("RGBA"), ov)
g1 = Image.new("RGBA", (W, H), (255, 200, 110, 0)); g1.putalpha(edge.filter(ImageFilter.MaxFilter(5)).filter(ImageFilter.GaussianBlur(10)).point(lambda a: min(255, a * 3)))
g2 = Image.new("RGBA", (W, H), (255, 214, 140, 0)); g2.putalpha(edge.filter(ImageFilter.MaxFilter(3)).point(lambda a: 255 if a > 40 else 0).filter(ImageFilter.GaussianBlur(1)))
out = Image.alpha_composite(Image.alpha_composite(out, g1), g2)

# ---- labels ----
d = ImageDraw.Draw(out)
FB = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"; FI = "/System/Library/Fonts/Supplemental/Georgia Italic.ttf"
def label(lon, lat, text, size, dx, dy, font=FB, dot=True, col=(255, 248, 235), anchor="lm"):
    x, y = P(lon, lat); f = ImageFont.truetype(font, size)
    if dot:
        d.ellipse([x - 13, y - 13, x + 13, y + 13], fill=(255, 248, 235), outline=(30, 20, 10), width=5)
        d.ellipse([x - 5, y - 5, x + 5, y + 5], fill=(200, 40, 30))
    d.text((x + dx, y + dy), text, font=f, fill=col, anchor=anchor, stroke_width=max(4, size // 9), stroke_fill=(15, 10, 6))
    return (round(x / 2), round(y / 2))
pos = {}
pos["Porto"] = label(-8.6110, 41.1496, "Porto", 64, 30, 6)
pos["Guimarães"] = label(-8.2918, 41.4425, "Guimarães", 64, 30, 6)
pos["Barroso"] = label(-7.7906, 41.8236, "Barroso", 64, 30, 0)
pos["Lisboa"] = label(-9.1393, 38.7223, "Lisboa", 56, 28, 6)
label(-7.0, 39.6, "ESPANHA", 54, 0, 0, FI, False, (205, 195, 180), "mm")
label(-8.0, 39.85, "PORTUGAL", 70, 0, 0, FB, False, (255, 236, 200), "mm")
label(-9.95, 40.2, "Oceano\nAtlântico", 52, 0, 0, FI, False, (150, 185, 215), "mm")
cx = sum(P(*c)[0] for p in norte for c in p[0]) / sum(len(p[0]) for p in norte)
cy = sum(P(*c)[1] for p in norte for c in p[0]) / sum(len(p[0]) for p in norte)
print("norte centroid (1080 frame)", round(cx / 2), round(cy / 2), "pos", pos)
out.convert("RGB").save("map_north.png")
out.convert("RGB").resize((540, 965), Image.LANCZOS).save("map_preview.jpg", quality=88)
