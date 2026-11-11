# EP148 driving-licence renewal ages, 3D miniature diorama on the Lisbon street kit (Blender EEVEE). Run on the spare Mac:
#   Blender -b -P scene.py -- <out_dir> [still_frame ...]
# Timeline (s): hook, grandpa's red convertible rolls down a Lisbon street 0-3.3 · it passes age signs 60 (4.3), 65 (5.6),
# 70 (6.9), "+2" (8.0) · stops, medical-certificate beat (overlay cards) 8.5-14.8 · "Ainda estou ótimo!" 15.1, honk-hop · end 17.8
import bpy, math, sys, os
argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else ["/tmp/ep148"]
OUT = argv[0]; STILLS = [int(x) for x in argv[1:]]
FPS, DUR = 30, 17.8
F = lambda s: int(round(s * FPS)) + 1
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
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))   # repo root (works on the laptop and the spare Mac)
sys.path.insert(0, os.path.join(ROOT, "tools/reel/blender")); import lisbon_kit as K
from lisbon_kit import hexc, mat, box, bevel
TEX = os.path.join(ROOT, "branding/characters/textures")
K.build_street(TEX, night=False, facades=("facade_azulejo", "facade_yellow", "facade_pink", "facade_azulejo", "facade_yellow"), front_y=1.5)
def smooth(o):
    for p in o.data.polygons: p.use_smooth = True
def key(o, path, frames):
    for t, v in frames:
        setattr(o, path, v); o.keyframe_insert(path, frame=F(t))
FONT = bpy.data.fonts.load("/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf")
ROAD_Y = -2.6

# ---- age signs on the sidewalk edge (Portuguese-style white plates with a red border) ----
metal = mat("metal", hexc("8d949c"), .4, .8); white = mat("plate", hexc("fbfbf8"), .4); red = mat("red", hexc("d32f2f"), .4); ink = mat("ink", (0.02, 0.02, 0.02), .3)
SIGNS = [(-6.0, "60", 4.3), (-2.0, "65", 5.6), (2.0, "70", 6.9), (6.0, "+2", 8.0)]
for x, label, t in SIGNS:
    bpy.ops.mesh.primitive_cylinder_add(radius=.05, depth=2.2, location=(x, -.85, 1.3)); bpy.context.object.data.materials.append(metal)
    bpy.ops.mesh.primitive_cylinder_add(radius=.55, depth=.08, location=(x, -.9, 2.6), rotation=(math.radians(90), 0, 0)); d = bpy.context.object; d.data.materials.append(red); smooth(d)
    bpy.ops.mesh.primitive_cylinder_add(radius=.44, depth=.09, location=(x, -.91, 2.6), rotation=(math.radians(90), 0, 0)); d2 = bpy.context.object; d2.data.materials.append(white); smooth(d2)
    bpy.ops.object.text_add(location=(x, -.97, 2.6), rotation=(math.radians(90), 0, 0)); tx = bpy.context.object
    tx.data.body = label; tx.data.font = FONT; tx.data.size = .42; tx.data.extrude = .01; tx.data.align_x = "CENTER"; tx.data.align_y = "CENTER"; tx.data.materials.append(ink)
    for o in (d, d2, tx):  # each sign flips up as the car reaches it
        key(o, "scale", [(0, (1, 1, 1)), (t - .3, (1, 1, 1)), (t - .15, (1.25, 1.25, 1.25)), (t, (1, 1, 1))])

# ---- grandpa's red convertible ----
redp = mat("paint", hexc("c62828"), .25, .2); chrome = mat("chrome", hexc("d9dde2"), .15, 1.0); tyre = mat("tyre", hexc("1c1c1e"), .8)
seat = mat("seat", hexc("f1e3c8"), .6); glass = mat("glass", hexc("a9c6d8"), .05)
car = box((0, 0, 0), (2.8, 1.3, .55), redp, .22)
box((.75, 0, .38), (1.1, 1.24, .25), redp, .15).parent = car                 # bonnet
box((-.95, 0, .36), (.8, 1.24, .22), redp, .12).parent = car                 # boot
box((-.42, 0, .5), (.22, 1.0, .55), seat, .08).parent = car                  # seat back
ws = box((.2, 0, .65), (.06, 1.1, .45), glass, .02); ws.parent = car; ws.rotation_euler = (0, math.radians(-25), 0)
for bx in (-1.42, 1.42):
    box((bx, 0, -.05), (.08, 1.3, .14), chrome, .03).parent = car
for hx in (1.4,):
    for hy in (-.4, .4):
        bpy.ops.mesh.primitive_uv_sphere_add(radius=.11, location=(hx, hy, .12)); hl = bpy.context.object; hl.data.materials.append(mat("hl", hexc("fff6d8"), .2, emit=hexc("fff1c4"), es=1.5)); hl.parent = car
for wx in (-.9, .9):
    for wy in (-.62, .62):
        bpy.ops.mesh.primitive_cylinder_add(radius=.3, depth=.2, location=(wx, wy, -.22), rotation=(math.radians(90), 0, 0)); wh = bpy.context.object; wh.data.materials.append(tyre); wh.parent = car
        bpy.ops.mesh.primitive_cylinder_add(radius=.16, depth=.21, location=(wx, wy, -.22), rotation=(math.radians(90), 0, 0)); hb = bpy.context.object; hb.data.materials.append(chrome); hb.parent = car
# grandpa: white hair, glasses, brown cardigan
skin = mat("skin", hexc("f0c7a2"), .6); hair = mat("hair", hexc("f2f2f0"), .9); card = mat("cardigan", hexc("8a5a36"), .7)
bpy.ops.mesh.primitive_cylinder_add(radius=.3, depth=.5, location=(-.05, 0, .55)); body = bpy.context.object; bevel(body, .12, 5); body.data.materials.append(card); smooth(body); body.parent = car
bpy.ops.mesh.primitive_uv_sphere_add(radius=.32, location=(-.05, 0, 1.08)); head = bpy.context.object; head.data.materials.append(skin); smooth(head); head.parent = car
for hy in (-.24, .24):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=.14, location=(-.12, hy, 1.15)); h = bpy.context.object; h.scale = (1, .7, .8); h.data.materials.append(hair); smooth(h); h.parent = car
bpy.ops.mesh.primitive_uv_sphere_add(radius=.13, location=(.12, 0, .98)); m = bpy.context.object; m.scale = (.6, 1.6, .5); m.data.materials.append(hair); smooth(m); m.parent = car   # moustache
for gy in (-.12, .12):
    bpy.ops.mesh.primitive_torus_add(major_radius=.085, minor_radius=.015, location=(.27, gy, 1.12), rotation=(0, math.radians(90), 0)); g = bpy.context.object; g.data.materials.append(ink); g.parent = car
    bpy.ops.mesh.primitive_uv_sphere_add(radius=.035, location=(.28, gy, 1.12)); e = bpy.context.object; e.data.materials.append(ink); e.parent = car
car.location = (-11, ROAD_Y, .55)
key(car, "location", [(0, (-11, ROAD_Y, .55)), (3.4, (-7.6, ROAD_Y, .55)), (8.3, (7.4, ROAD_Y, .55)), (9.0, (8.6, ROAD_Y, .55)), (9.3, (8.7, ROAD_Y, .55))])
for k in range(28):  # cobble judder
    t = k * .3
    key(car, "rotation_euler", [(t, (math.radians(1.2 if k % 2 else -1.2), 0, 0))])
key(car, "rotation_euler", [(9.3, (0, 0, 0)), (15.1, (0, 0, 0)), (15.25, (0, math.radians(-4), 0)), (15.45, (0, math.radians(3), 0)), (15.65, (0, 0, 0))])
key(car, "location", [(15.1, (8.7, ROAD_Y, .55)), (15.25, (8.7, ROAD_Y, .95)), (15.45, (8.7, ROAD_Y, .55))])

# ---- lights ----
def light(kind, loc, energy, col, size=4, rot=(0, 0, 0)):
    bpy.ops.object.light_add(type=kind, location=loc, rotation=rot); l = bpy.context.object.data; l.energy = energy; l.color = col
    if kind == "AREA": l.size = size
    return bpy.context.object
light("SUN", (0, 0, 10), 3.5, (1, .93, .8), rot=(math.radians(48), math.radians(10), math.radians(-35)))
light("AREA", (-5, -10, 6), 600, (.8, .9, 1.0), 8)

# ---- camera: low tracking shot beside the car ----
bpy.ops.object.camera_add(); cam = bpy.context.object; sc.camera = cam
cam.data.dof.use_dof = True; cam.data.dof.aperture_fstop = 2.2
tgt = bpy.data.objects.new("tgt", None); sc.collection.objects.link(tgt)
tc = cam.constraints.new("TRACK_TO"); tc.target = tgt; tc.track_axis = "TRACK_NEGATIVE_Z"; tc.up_axis = "UP_Y"; cam.data.dof.focus_object = tgt
key(cam, "location", [(0, (-8.3, -6.0, 1.3)), (3.4, (-6.0, -6.6, 1.5)), (3.5, (-7.0, -9.5, 2.3)), (8.3, (7.0, -9.5, 2.3)), (8.5, (6.0, -9.5, 2.4)),
                     (14.8, (7.4, -8.0, 2.0)), (15.0, (11.6, -4.0, 1.7)), (DUR, (11.3, -3.8, 1.6))])
key(tgt, "location", [(0, (-9.6, ROAD_Y, .9)), (3.4, (-7.6, ROAD_Y, 1.0)), (3.5, (-7.4, -1.6, 1.8)), (8.3, (7.2, -1.6, 1.8)), (8.5, (7.6, -1.8, 1.8)),
                     (14.8, (8.4, -2.2, 1.4)), (15.0, (8.65, ROAD_Y, 1.1)), (DUR, (8.65, ROAD_Y, 1.1))])
for t_, L in ((0, 38), (3.4, 38), (3.5, 30), (8.3, 30), (8.5, 32), (14.8, 34), (15.0, 40), (DUR, 42)):
    cam.data.lens = L; cam.data.keyframe_insert("lens", frame=F(t_))

if STILLS:
    for s in STILLS:
        sc.frame_set(s); sc.render.filepath = f"{OUT}/still_{s:04d}.png"; bpy.ops.render.render(write_still=True)
else:
    sc.render.filepath = OUT + "/f_"; bpy.ops.render.render(animation=True)
