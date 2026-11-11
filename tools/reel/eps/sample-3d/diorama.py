# Style sample 1: 3D miniature diorama (Blender, EEVEE). Run on the spare Mac:
#   Blender -b -P diorama.py -- <out_dir> [still_frame ...]
# Crypto fact (EP140): hold 365 days -> gain not taxed; sooner -> 28%. Timeline matches the overlay reel (30 fps, 16 s).
import bpy, math, sys, random
from mathutils import Vector
argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else ["/tmp/dio"]
OUT = argv[0]; STILLS = [int(x) for x in argv[1:]]
FPS, DUR = 30, 16.0
F = lambda s: int(round(s * FPS)) + 1
random.seed(7)

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
for eng in ("BLENDER_EEVEE", "BLENDER_EEVEE_NEXT"):
    try: sc.render.engine = eng; break
    except Exception: pass
sc.render.resolution_x, sc.render.resolution_y = 1080, 1920
sc.render.fps = FPS; sc.frame_start, sc.frame_end = 1, F(DUR)
sc.render.image_settings.file_format = "PNG"
sc.view_settings.view_transform = "AgX"; sc.view_settings.look = "AgX - Medium High Contrast"
try:
    sc.eevee.taa_render_samples = 16
    sc.eevee.use_shadows = True
    sc.eevee.use_raytracing = True
except Exception: pass
w = bpy.data.worlds.new("w"); sc.world = w; w.use_nodes = True
w.node_tree.nodes["Background"].inputs[0].default_value = (0.32, 0.26, 0.22, 1); w.node_tree.nodes["Background"].inputs[1].default_value = 0.6

def mat(name, col, rough=0.55, metal=0.0, emit=None):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*col, 1); b.inputs["Roughness"].default_value = rough; b.inputs["Metallic"].default_value = metal
    if emit: b.inputs["Emission Color"].default_value = (*emit, 1); b.inputs["Emission Strength"].default_value = 2.0
    return m
def hexc(h): return tuple((int(h[i:i + 2], 16) / 255) ** 2.2 for i in (0, 2, 4))
def bevel(o, w=0.04, seg=4):
    m = o.modifiers.new("b", "BEVEL"); m.width = w; m.segments = seg; m.limit_method = "ANGLE"
def shade(o):
    for p in o.data.polygons: p.use_smooth = True
def box(name, loc, size, m, bv=0.04):
    bpy.ops.mesh.primitive_cube_add(location=loc); o = bpy.context.object; o.name = name; o.scale = (size[0] / 2, size[1] / 2, size[2] / 2)
    bpy.ops.object.transform_apply(scale=True); bevel(o, bv); o.data.materials.append(m); return o
def key(o, path, frames):
    for fr, v in frames:
        setattr(o, path, v) if not isinstance(v, tuple) else setattr(o, path, v)
        o.keyframe_insert(path, frame=F(fr))
FONT = bpy.data.fonts.load("/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf")
def text(body, loc, size, m, depth=0.12, rot=(math.radians(90), 0, 0)):
    bpy.ops.object.text_add(location=loc, rotation=rot); t = bpy.context.object; t.data.body = body; t.data.font = FONT
    t.data.size = size; t.data.extrude = depth; t.data.bevel_depth = 0.02; t.data.bevel_resolution = 3
    t.data.align_x = "CENTER"; t.data.align_y = "CENTER"; t.data.materials.append(m); return t

# ---- table and room ----
wood = mat("wood", hexc("8a5a36"), 0.45)
nt = wood.node_tree; tex = nt.nodes.new("ShaderNodeTexWave"); tex.inputs["Scale"].default_value = 1.2; tex.inputs["Distortion"].default_value = 6
ramp = nt.nodes.new("ShaderNodeValToRGB"); ramp.color_ramp.elements[0].color = (*hexc("6b4126"), 1); ramp.color_ramp.elements[1].color = (*hexc("a8754a"), 1)
nt.links.new(tex.outputs[0], ramp.inputs[0]); nt.links.new(ramp.outputs[0], nt.nodes["Principled BSDF"].inputs["Base Color"])
bpy.ops.mesh.primitive_plane_add(size=60); bpy.context.object.data.materials.append(wood)
wall = mat("wall", hexc("e9d8bf"), 0.9); bpy.ops.mesh.primitive_plane_add(size=60, location=(0, 14, 10), rotation=(math.radians(90), 0, 0)); bpy.context.object.data.materials.append(wall)

# ---- diorama: a hill of Lisbon houses on a cork base ----
cork = mat("cork", hexc("b98b5b"), 0.95)
base = box("base", (0, 2, 0.25), (7.5, 5.5, 0.5), cork, 0.15)
pastel = ["f2b6a0", "f6dc8c", "a8d4e6", "f1f0e8", "c9e3b4", "f5c6d6", "ffd7a0"]
roof = mat("roof", hexc("c0603a"), 0.7); win = mat("win", hexc("33465c"), 0.3)
for row in range(3):
    for i in range(5):
        x = -3 + i * 1.5 + random.uniform(-.1, .1); y = 0.6 + row * 1.6; z0 = 0.5 + row * 0.55
        h = random.uniform(1.0, 1.6)
        if row > 0: box(f"step{row}{i}", (x, y, z0 / 2 + .25), (1.4, 1.5, z0 - .5 + .01), cork, .05)
        hs = box(f"h{row}{i}", (x, y, z0 + h / 2), (1.25, 1.2, h), mat(f"p{row}{i}", hexc(random.choice(pastel)), .6), .03)
        bpy.ops.mesh.primitive_cone_add(vertices=4, radius1=0.95, depth=0.55, location=(x, y, z0 + h + 0.27), rotation=(0, 0, math.radians(45)))
        r = bpy.context.object; r.scale = (1, 0.9, 1); r.data.materials.append(roof)
        for wx in (-.3, .3):
            box(f"w{row}{i}{wx}", (x + wx, y - .61, z0 + h * .6), (.28, .05, .38), win, .02)

# tram on the front street
yel = mat("yel", hexc("f2c230"), .4); dark = mat("dark", hexc("2b2b2b"), .5)
tram = box("tram", (-1.8, -0.4, 0.95), (2.2, .9, 1.1), yel, .12)
box("tramtop", (-1.8, -0.4, 1.58), (1.8, .8, .18), dark, .06).parent = tram
key(tram, "location", [(0, (-3.6, -0.4, .95)), (DUR, (1.2, -0.4, .95))])

# ---- toy character (the seller) ----
green = mat("green", hexc("3cae5c"), .5); skin = mat("skin", hexc("f1c7a0"), .6); ink = mat("ink", (0.02, 0.02, 0.02), .3)
bpy.ops.mesh.primitive_cylinder_add(radius=.45, depth=1.1, location=(0, 0, 0)); body = bpy.context.object; bevel(body, .2, 6); body.data.materials.append(green); shade(body)
bpy.ops.mesh.primitive_uv_sphere_add(radius=.48, location=(0, 0, .95)); head = bpy.context.object; head.data.materials.append(skin); shade(head); head.parent = body
for ex in (-.17, .17):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=.07, location=(ex, -.44, 1.02)); e = bpy.context.object; e.data.materials.append(ink); e.parent = body
bpy.ops.mesh.primitive_uv_sphere_add(radius=.5, location=(0, .05, 1.2)); hair = bpy.context.object; hair.scale = (1, 1, .55); hair.data.materials.append(mat("hair", hexc("4a2c1a"), .8)); hair.parent = body
phone = box("phone", (.5, -.25, .35), (.22, .06, .4), dark, .03); phone.parent = body
glow = box("screen", (.5, -.29, .35), (.18, .01, .33), mat("scr", hexc("7dff8a"), .3, emit=hexc("7dff8a")), .005); glow.parent = body
body.location = (1.6, -0.9, 1.05)

# ---- coin stack (generic coins, no real currency logo) ----
gold = mat("gold", hexc("f2b632"), .25, 1.0)
coins = []
for k in range(7):
    bpy.ops.mesh.primitive_cylinder_add(radius=.38, depth=.12, location=(2.9, -1.9, .06 + k * .13)); c = bpy.context.object; bevel(c, .03, 3); c.data.materials.append(gold); shade(c); coins.append(c)
for k, c in enumerate(coins):  # coins drop in one by one during the hook
    z = c.location.z; t0 = .3 + k * .22
    key(c, "location", [(0, (2.9, -1.9, z + 6)), (t0, (2.9, -1.9, z + 6)), (t0 + .25, (2.9, -1.9, z))])

# ---- calendar block with live counter ----
white = mat("paper", hexc("fbfaf6"), .8); red = mat("red", hexc("d63a2f"), .5); greenT = mat("gT", hexc("39c45a"), .35); redT = mat("rT", hexc("e0412f"), .35)
cal = box("cal", (-.2, -4.6, 1.3), (2.6, .8, 2.6), white, .12)
box("calTop", (-.2, -4.6, 2.85), (2.6, .82, .55), red, .1).parent = cal
label = text("DAYS HELD", (-.2, -5.05, 2.85), .32, white, .03)
num = text("1", (-.2, -5.05, 1.15), 1.05, ink, .08)
def upd(scene, *_):
    t = (scene.frame_current - 1) / FPS
    if t < 4.4: d = 1
    elif t < 6.2: u = (t - 4.4) / 1.8; d = round(1 + 364 * u * u)
    elif t < 10.7: d = 365
    else: d = 364
    num.data.body = str(d)
bpy.app.handlers.frame_change_pre.append(upd)
for o in (cal, label, num):
    pass

# verdict letters
zero = text("€0", (-.2, -4.9, 4.4), 1.3, greenT, .3); zero.hide_render = True
key(zero, "location", [(0, (-.2, -4.9, 12)), (6.3, (-.2, -4.9, 12)), (6.6, (-.2, -4.9, 4.4)), (6.75, (-.2, -4.9, 4.7)), (6.9, (-.2, -4.9, 4.4)), (8.4, (-.2, -4.9, 4.4))])
key(zero, "scale", [(8.4, (1, 1, 1)), (8.55, (1.3, 1, .15))])
key(zero, "location", [(8.56, (-.2, -4.9, 4.4)), (8.6, (-.2, -4.9, -6))])
key(zero, "hide_render", [(0, False)])
t28 = text("28%", (-.2, -4.9, 4.5), 1.25, redT, .35)
key(t28, "location", [(0, (-.2, -4.9, 14)), (8.35, (-.2, -4.9, 14)), (8.55, (-.2, -4.9, 4.5)), (10.6, (-.2, -4.9, 4.5)), (10.8, (-.2, -4.9, 14)), (13.6, (-.2, -4.9, 14)), (13.8, (-.2, -4.9, 4.5))])
key(t28, "scale", [(8.55, (1.15, 1, .8)), (8.7, (1, 1, 1)), (13.8, (1.2, 1, .7)), (13.95, (1, 1, 1))])

# character moves to the calendar for the punchline
key(body, "location", [(0, (1.6, -0.9, 1.05)), (10.6, (1.6, -0.9, 1.05)), (10.9, (2.1, -4.4, 1.05))])
for k in range(8):  # idle hops in the hook, a celebratory hop at SELL
    t = .2 + k * .45
    key(body, "location", [(t, (1.6, -0.9, 1.05)), (t + .2, (1.6, -0.9, 1.45)), (t + .4, (1.6, -0.9, 1.05))]) if t < 3.8 else None
key(body, "location", [(11.0, (2.1, -4.4, 1.05)), (11.25, (2.1, -4.4, 1.8)), (11.5, (2.1, -4.4, 1.05))])
key(body, "rotation_euler", [(0, (0, 0, 0)), (13.75, (0, 0, 0)), (14.1, (0, math.radians(-82), math.radians(10)))])
key(body, "location", [(13.75, (2.1, -4.4, 1.05)), (14.1, (2.35, -4.4, .5))])

# ---- lights ----
def light(kind, loc, energy, col, size=4, rot=(0, 0, 0)):
    bpy.ops.object.light_add(type=kind, location=loc, rotation=rot); l = bpy.context.object.data; l.energy = energy; l.color = col
    if kind == "AREA": l.size = size
    return bpy.context.object
light("AREA", (-6, -8, 9), 2200, (1, .86, .7), 6)
light("AREA", (7, -4, 5), 600, (.7, .8, 1), 4)
light("SUN", (0, 0, 10), 2.0, (1, .92, .8), rot=(math.radians(50), 0, math.radians(-30)))
sl = light("POINT", (2.7, -2.2, 2.0), 150, (1, .8, .3))  # coin glow

# ---- camera with depth of field (the miniature look) ----
bpy.ops.object.camera_add(); cam = bpy.context.object; sc.camera = cam
cam.data.lens = 55; cam.data.dof.use_dof = True; cam.data.dof.aperture_fstop = 1.4
tgt = bpy.data.objects.new("tgt", None); sc.collection.objects.link(tgt)
tc = cam.constraints.new("TRACK_TO"); tc.target = tgt; tc.track_axis = "TRACK_NEGATIVE_Z"; tc.up_axis = "UP_Y"; cam.data.dof.focus_object = tgt
key(cam, "location", [(0, (6.5, -13, 5.5)), (4.0, (4.5, -10.5, 3.8)), (4.1, (1.2, -14.5, 3.4)), (8.3, (.4, -13.8, 3.2)), (8.4, (.3, -13.2, 3.4)), (10.7, (.1, -12.8, 3.3)), (10.8, (4.0, -13.5, 3.0)), (DUR, (3.2, -12.2, 2.8))])
key(tgt, "location", [(0, (1.8, -.8, 1.3)), (4.0, (2.2, -1.1, 1.0)), (4.1, (-.2, -4.6, 2.6)), (10.7, (-.2, -4.6, 2.8)), (10.8, (.6, -4.5, 2.6)), (DUR, (.7, -4.4, 2.4))])
# a little shake on each slam
for t0 in (6.6, 8.55, 13.8):
    key(tgt, "location", [])
for fc in (cam.animation_data.action.fcurves if hasattr(cam.animation_data.action, "fcurves") else []):
    for kp in fc.keyframe_points: kp.interpolation = "BEZIER"

sc.render.filepath = OUT + "/f_"
if STILLS:
    for s in STILLS:
        sc.frame_set(s); upd(sc); sc.render.filepath = f"{OUT}/still_{s:04d}.png"; bpy.ops.render.render(write_still=True)
else:
    bpy.ops.render.render(animation=True)
