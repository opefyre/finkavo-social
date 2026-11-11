# EP145 cigarette butt, 3D miniature diorama (Blender EEVEE). Run on the spare Mac:
#   Blender -b -P scene.py -- <out_dir> [still_frame ...]
# Timeline (s): macro hook, the butt falls and bounces 0-4.4 · wide street, fine sign springs up 6.6 · the toy guy walks over,
# picks it up, drops it in the ashtray bin 10.8-12.4 · pigeon nods, "Pronto." 12.8 · end 14.4
import bpy, math, sys, random
argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else ["/tmp/ep145"]
OUT = argv[0]; STILLS = [int(x) for x in argv[1:]]
FPS, DUR = 30, 14.4
F = lambda s: int(round(s * FPS)) + 1
random.seed(45)
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.engine = "BLENDER_EEVEE"
sc.render.resolution_x, sc.render.resolution_y = 1080, 1932
sc.render.fps = FPS; sc.frame_start, sc.frame_end = 1, F(DUR)
sc.view_settings.view_transform = "AgX"; sc.view_settings.look = "AgX - Medium High Contrast"
sc.eevee.taa_render_samples = 16
try: sc.eevee.use_raytracing = True
except Exception: pass
w = bpy.data.worlds.new("w"); sc.world = w; w.use_nodes = True
w.node_tree.nodes["Background"].inputs[0].default_value = (0.45, 0.62, 0.9, 1); w.node_tree.nodes["Background"].inputs[1].default_value = 0.8

def hexc(h): return tuple((int(h[i:i + 2], 16) / 255) ** 2.2 for i in (0, 2, 4))
def mat(name, col, rough=0.55, metal=0.0, emit=None, es=3.0):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*col, 1); b.inputs["Roughness"].default_value = rough; b.inputs["Metallic"].default_value = metal
    if emit is not None: b.inputs["Emission Color"].default_value = (*emit, 1); b.inputs["Emission Strength"].default_value = es
    return m
def bevel(o, wd=0.04, seg=4):
    m = o.modifiers.new("b", "BEVEL"); m.width = wd; m.segments = seg; m.limit_method = "ANGLE"
def smooth(o):
    for p in o.data.polygons: p.use_smooth = True
def box(loc, size, m, bv=0.04, name="box"):
    bpy.ops.mesh.primitive_cube_add(location=loc); o = bpy.context.object; o.name = name; o.scale = (size[0] / 2, size[1] / 2, size[2] / 2)
    bpy.ops.object.transform_apply(scale=True); bevel(o, bv); o.data.materials.append(m); return o
def key(o, path, frames):
    for t, v in frames:
        setattr(o, path, v); o.keyframe_insert(path, frame=F(t))
FONT = bpy.data.fonts.load("/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf")

# ---- a detailed Lisbon street (painted facades, calçada sidewalk, roofs, lamps, tram rails): tools/reel/blender/lisbon_kit.py ----
import os
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))   # repo root (laptop or spare Mac)
sys.path.insert(0, os.path.join(ROOT, "tools/reel/blender")); import lisbon_kit as K
TEX = os.path.join(ROOT, "branding/characters/textures")
K.build_street(TEX, night=False, facades=("facade_pink", "facade_yellow", "facade_azulejo"), front_y=1.5)
Z = .2   # sidewalk top

# ---- the cigarette butt ----
filt = mat("filter", hexc("d9893b"), .6); paper = mat("paper", hexc("f2f0ea"), .7); ash = mat("ash", hexc("3a3532"), .9)
bpy.ops.mesh.primitive_cylinder_add(radius=.07, depth=.32); butt = bpy.context.object; butt.data.materials.append(filt); smooth(butt)
bpy.ops.mesh.primitive_cylinder_add(radius=.07, depth=.14, location=(0, 0, .23)); p2 = bpy.context.object; p2.data.materials.append(paper); p2.parent = butt
bpy.ops.mesh.primitive_cylinder_add(radius=.068, depth=.04, location=(0, 0, .32)); p3 = bpy.context.object; p3.data.materials.append(ash); p3.parent = butt
REST = (.3, -.6, .25)
key(butt, "location", [(0, (.3, -.6, 1.45)), (.35, (.3, -.6, 1.35)), (1.0, (.3, -.6, .33)), (1.25, (.36, -.62, .65)), (1.5, (.42, -.64, .33)), (1.65, (.45, -.65, .4)), (1.8, (.3, -.65, .33))])
key(butt, "rotation_euler", [(0, (0.3, 0, 0)), (1.0, (1.2, 0, .4)), (1.5, (math.radians(90), 0, .9)), (10.9, (math.radians(90), 0, .9))])
# picked up and carried to the bin at 11.0-12.3
BIN = (-1.8, -.4)
key(butt, "location", [(10.9, (.3, -.65, .33)), (11.2, (.55, -.95, .85)), (11.9, (-1.25, -.95, .85)), (12.15, (BIN[0], BIN[1] - .1, 2.05)), (12.4, (BIN[0], BIN[1], 1.6))])
key(butt, "scale", [(12.3, (1, 1, 1)), (12.42, (0, 0, 0))])

# ---- ashtray bin on a pole ----
metal = mat("metal", hexc("4a5560"), .4, .8)
bpy.ops.mesh.primitive_cylinder_add(radius=.06, depth=1.2, location=(BIN[0], BIN[1], .8)); bpy.context.object.data.materials.append(metal)
bpy.ops.mesh.primitive_cylinder_add(radius=.32, depth=.55, location=(BIN[0], BIN[1], 1.55)); bn = bpy.context.object; bevel(bn, .05); bn.data.materials.append(mat("bin", hexc("2f6d4f"), .5)); smooth(bn)
bpy.ops.mesh.primitive_cylinder_add(radius=.3, depth=.04, location=(BIN[0], BIN[1], 1.83)); bpy.context.object.data.materials.append(metal)

# ---- the fine sign springs up ----
red = mat("red", hexc("e0412f"), .35); cream = mat("cream", hexc("fbf6e8"), .5)
sign = box((1.6, -.4, 1.4), (2.4, .18, 1.1), cream, .08, "sign")
bpy.ops.object.text_add(location=(1.6, -.52, 1.2), rotation=(math.radians(90), 0, 0)); tx = bpy.context.object
tx.data.body = "€25–€250"; tx.data.font = FONT; tx.data.size = .5; tx.data.extrude = .03; tx.data.align_x = "CENTER"; tx.data.align_y = "CENTER"; tx.data.materials.append(red); tx.location = (1.6, -.62, 1.4)
bpy.ops.mesh.primitive_cylinder_add(radius=.05, depth=1.0, location=(1.6, -.4, .7)); post = bpy.context.object; post.data.materials.append(metal)
sign.parent = None
for o in (sign, post):
    o.scale = (1, 1, 1)
for o_ in (sign, tx):
    key(o_, "scale", [(0, (0, 0, 0)), (6.5, (0, 0, 0)), (6.75, (1.15, 1.15, 1.15)), (6.9, (1, 1, 1))])
key(post, "scale", [(0, (1, 1, 0)), (6.5, (1, 1, 0)), (6.7, (1, 1, 1))])
key(sign, "rotation_euler", [(6.9, (0, 0, 0)), (7.1, (0, math.radians(4), 0)), (7.3, (0, math.radians(-3), 0)), (7.5, (0, 0, 0))])

# ---- toy guy ----
green = mat("green", hexc("3cae5c"), .5); skin = mat("skin", hexc("f1c7a0"), .6); ink = mat("ink", (0.02, 0.02, 0.02), .3)
bpy.ops.mesh.primitive_cylinder_add(radius=.42, depth=1.0); guy = bpy.context.object; bevel(guy, .2, 6); guy.data.materials.append(green); smooth(guy)
bpy.ops.mesh.primitive_uv_sphere_add(radius=.45, location=(0, 0, .88)); h = bpy.context.object; h.data.materials.append(skin); smooth(h); h.parent = guy
for ex in (-.16, .16):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=.065, location=(ex, -.41, .95)); e = bpy.context.object; e.data.materials.append(ink); e.parent = guy
bpy.ops.mesh.primitive_uv_sphere_add(radius=.47, location=(0, .05, 1.12)); hr = bpy.context.object; hr.scale = (1, 1, .55); hr.data.materials.append(mat("hair", hexc("4a2c1a"), .8)); hr.parent = guy
key(guy, "location", [(0, (3.6, -.3, .95)), (10.4, (3.6, -.3, .95)), (10.9, (.95, -.5, .95))])
for k in range(4):
    t = 10.4 + k * .125
    key(guy, "location", [(t + .06, (3.6 - (k + .5) * .66, -.3 - (k + .5) * .05, 1.15))])
key(guy, "rotation_euler", [(10.9, (0, 0, 0)), (11.1, (math.radians(-25), 0, 0)), (11.4, (0, 0, 0))])  # bends to pick up
key(guy, "location", [(11.2, (.95, -.5, .95)), (11.9, (-.9, -.45, .95))])   # walks it over to the bin
key(guy, "scale", [(12.8, (1, 1, 1)), (13.0, (1.05, 1.05, .93)), (13.2, (1, 1, 1))])

# ---- pigeon (low-poly toy) ----
grey = mat("pg", hexc("8d929c"), .6); irid = mat("pi", hexc("4f6b5d"), .4, .3); beak = mat("bk", hexc("3a3230"), .5)
bpy.ops.mesh.primitive_uv_sphere_add(radius=.32, location=(0, 0, 0)); pig = bpy.context.object; pig.scale = (.8, 1.2, .85); pig.data.materials.append(grey); smooth(pig)
bpy.ops.mesh.primitive_uv_sphere_add(radius=.18, location=(0, -.32, .3)); ph = bpy.context.object; ph.data.materials.append(irid); smooth(ph); ph.parent = pig
bpy.ops.mesh.primitive_cone_add(radius1=.05, depth=.15, location=(0, -.52, .3), rotation=(math.radians(90), 0, 0)); pb = bpy.context.object; pb.data.materials.append(beak); pb.parent = pig
for ex in (-.09, .09):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=.03, location=(ex, -.45, .36)); e = bpy.context.object; e.data.materials.append(ink); e.parent = pig
pig.location = (-1.0, -.8, .65); pig.rotation_euler = (0, 0, math.radians(-30))
for k, t in enumerate([2.0, 3.0, 8.0, 12.5, 12.9]):
    key(pig, "rotation_euler", [(t, (0, 0, math.radians(-30))), (t + .15, (math.radians(25), 0, math.radians(-30))), (t + .3, (0, 0, math.radians(-30)))])

# ---- light ----
def light(kind, loc, energy, col, size=4, rot=(0, 0, 0)):
    bpy.ops.object.light_add(type=kind, location=loc, rotation=rot); l = bpy.context.object.data; l.energy = energy; l.color = col
    if kind == "AREA": l.size = size
    return bpy.context.object
light("SUN", (0, 0, 10), 3.5, (1, .93, .8), rot=(math.radians(48), math.radians(10), math.radians(-35)))
light("AREA", (-5, -8, 6), 500, (.8, .9, 1.0), 6)

# ---- camera ----
bpy.ops.object.camera_add(); cam = bpy.context.object; sc.camera = cam
cam.data.dof.use_dof = True; cam.data.dof.aperture_fstop = 1.6
tgt = bpy.data.objects.new("tgt", None); sc.collection.objects.link(tgt)
tc = cam.constraints.new("TRACK_TO"); tc.target = tgt; tc.track_axis = "TRACK_NEGATIVE_Z"; tc.up_axis = "UP_Y"; cam.data.dof.focus_object = tgt
key(cam, "location", [(0, (1.3, -2.6, .8)), (4.4, (.9, -2.2, .62)), (4.5, (.4, -6.4, 2.2)), (6.4, (.3, -6.6, 2.2)), (10.5, (.0, -7.0, 2.4)), (10.7, (-.1, -6.4, 2.1)), (DUR, (-.4, -5.8, 2.0))])
key(tgt, "location", [(0, (.35, -.65, .95)), (.9, (.35, -.65, .55)), (1.4, (.35, -.65, .36)), (4.4, (.35, -.65, .36)), (4.5, (.4, -.4, 1.35)), (10.5, (.4, -.4, 1.4)), (10.7, (-.4, -.5, 1.3)), (DUR, (-1.1, -.5, 1.3))])
for t_, L in ((0, 55), (4.4, 55), (4.5, 25), (10.5, 25), (10.7, 30), (DUR, 31)):
    cam.data.lens = L; cam.data.keyframe_insert("lens", frame=F(t_))

if STILLS:
    for s in STILLS:
        sc.frame_set(s); sc.render.filepath = f"{OUT}/still_{s:04d}.png"; bpy.ops.render.render(write_still=True)
else:
    sc.render.filepath = OUT + "/f_"; bpy.ops.render.render(animation=True)
