# EP142 neighbour noise, 3D miniature diorama (Blender EEVEE). Run on the spare Mac:
#   Blender -b -P scene.py -- <out_dir> [still_frame ...]
# Timeline (s): party hook 0-3.6 · clock hits 23:00 3.6-4.4 · police car 4.6-5.8 · rule card (overlay) 6.4-9.8 ·
# party window goes dark 10.0 · toy guy in pyjamas, "Finalmente." 10.6 · his light off 12.6 · end 13.6
import bpy, math, sys, random
argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else ["/tmp/ep142"]
OUT = argv[0]; STILLS = [int(x) for x in argv[1:]]
FPS, DUR = 30, 13.6
F = lambda s: int(round(s * FPS)) + 1
random.seed(42)
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
w.node_tree.nodes["Background"].inputs[0].default_value = (0.012, 0.02, 0.05, 1); w.node_tree.nodes["Background"].inputs[1].default_value = 1.0

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
def key(o, path, frames, interp=None):
    for t, v in frames:
        setattr(o, path, v); o.keyframe_insert(path, frame=F(t))
def emit_keys(m, frames, interp="CONSTANT"):
    b = m.node_tree.nodes["Principled BSDF"]
    for t, col, st in frames:
        b.inputs["Emission Color"].default_value = (*col, 1); b.inputs["Emission Strength"].default_value = st
        b.inputs["Emission Color"].keyframe_insert("default_value", frame=F(t)); b.inputs["Emission Strength"].keyframe_insert("default_value", frame=F(t))
    for fc in (m.node_tree.animation_data.action.fcurves if m.node_tree.animation_data and hasattr(m.node_tree.animation_data.action, "fcurves") else []):
        for kp in fc.keyframe_points: kp.interpolation = interp

# ---- street ----
import os
sys.path.insert(0, os.path.expanduser("~/social-posts-workflow/tools/reel/blender")); import lisbon_kit as K
TEX = os.path.expanduser("~/social-posts-workflow/branding/characters/textures")
st = K.build_street(TEX, night=True)
asphalt = mat("tyre", hexc("1c1c1e"), .8)
dark = (0.0, 0.0, 0.0)
FY = st["front_y"] - .03
def winpane(x, z, w=.62, h=.95):
    m, em = K.glow_mat(f"pane{x}{z}", (1, .75, .4))
    bpy.ops.mesh.primitive_plane_add(size=1, location=(x, FY, z), rotation=(math.radians(90), 0, 0)); o = bpy.context.object; o.scale = (w, h, 1); o.data.materials.append(m)
    return em
def glow_keys(em, frames):
    for t, col, st_ in frames:
        em.inputs["Color"].default_value = (*col, 1); em.inputs["Strength"].default_value = st_
        em.inputs["Color"].keyframe_insert("default_value", frame=F(t)); em.inputs["Strength"].keyframe_insert("default_value", frame=F(t))
warm = hexc("ffbf69")
   # the toy guy's flat goes dark at the end
cols = [hexc("ff3b3b"), hexc("2bf0ff"), hexc("fff12b"), hexc("3bff6b")]
glow_keys(winpane(.03, 5.94), [(i * .25, cols[i % 4], 6.0) for i in range(int(10.0 / .25))] + [(10.0, dark, 0)])
party_light = bpy.data.lights.new("party", "POINT"); party_light.energy = 400
pl = bpy.data.objects.new("party", party_light); sc.collection.objects.link(pl); pl.location = (0, -2.0, 5.9)
for i in range(int(10.0 / .25)):
    party_light.color = cols[i % 4]; party_light.energy = 1600; party_light.keyframe_insert("color", frame=F(i * .25)); party_light.keyframe_insert("energy", frame=F(i * .25))
party_light.energy = 0; party_light.keyframe_insert("energy", frame=F(10.0))

# ---- toy guy in pyjamas with a nightcap, on the doorstep (1st-floor neighbour came down) ----
pj = mat("pj", hexc("7aa7e0"), .6); skin = mat("skin", hexc("f1c7a0"), .6); ink = mat("ink", (0.02, 0.02, 0.02), .3)
bpy.ops.mesh.primitive_cylinder_add(radius=.42, depth=1.0); guy = bpy.context.object; bevel(guy, .2, 6); guy.data.materials.append(pj); smooth(guy)
bpy.ops.mesh.primitive_uv_sphere_add(radius=.45, location=(0, 0, .88)); h = bpy.context.object; h.data.materials.append(skin); smooth(h); h.parent = guy
for ex in (-.16, .16):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=.06, location=(ex, -.41, .95)); e = bpy.context.object; e.data.materials.append(ink); e.parent = guy
    e.scale = (1.7, 1, .22)  # sleepy half-closed eyes
bpy.ops.mesh.primitive_cone_add(radius1=.42, depth=.9, location=(.1, .05, 1.45), rotation=(0, math.radians(-18), 0)); cap = bpy.context.object
cap.data.materials.append(mat("cap", hexc("e05a5a"), .7)); smooth(cap); cap.parent = guy
guy.location = (0, -1.5, .75)
for i in range(int(10.0 / .5)):  # fidgets, annoyed
    key(guy, "rotation_euler", [(i * .5, (0, 0, math.radians(8))), (i * .5 + .25, (0, 0, math.radians(-8)))])
key(guy, "rotation_euler", [(10.0, (0, 0, 0))])
key(guy, "scale", [(10.6, (1, 1, 1)), (11.0, (1.06, 1.06, .9)), (11.5, (1, 1, 1.04)), (12.0, (1, 1, 1))])  # relieved sigh

# ---- clock on a post ----
metal = mat("metal", hexc("2b2f36"), .4, .8)
bpy.ops.mesh.primitive_cylinder_add(radius=.1, depth=4.2, location=(-4.3, -2.0, 2.1)); bpy.context.object.data.materials.append(metal)
bpy.ops.mesh.primitive_cylinder_add(radius=.85, depth=.22, location=(-4.3, -2.1, 4.6), rotation=(math.radians(90), 0, 0)); face = bpy.context.object
bevel(face, .05); face.data.materials.append(mat("face", hexc("fbf6e8"), .5, emit=hexc("fff4d6"), es=.8)); smooth(face)
FONT = bpy.data.fonts.load("/System/Library/Fonts/Supplemental/Arial Rounded Bold.ttf")
bpy.ops.object.text_add(location=(-4.3, -2.25, 4.45), rotation=(math.radians(90), 0, 0)); clk = bpy.context.object
clk.data.body = "22:59"; clk.data.font = FONT; clk.data.size = .55; clk.data.extrude = .02; clk.data.align_x = "CENTER"; clk.data.align_y = "CENTER"
clk.data.materials.append(mat("clk", hexc("c0392b"), .4))
def upd(scene, *_):
    t = (scene.frame_current - 1) / FPS
    clk.data.body = "22:59" if t < 3.9 else "23:00"
bpy.app.handlers.frame_change_pre.append(upd)

# ---- police car rolls in ----
white = mat("white", hexc("f2f2f2"), .3); blue = mat("blue", hexc("1d3f8f"), .4); glass = mat("glass", hexc("1a2433"), .1)
car = box((0, 0, 0), (2.6, 1.2, .7), white, .18, "car")
box((0, 0, .02), (2.62, 1.22, .18), blue, .05).parent = car
cab = box((-.15, 0, .6), (1.4, 1.05, .55), glass, .15); cab.parent = car
lb = mat("lb", hexc("2b6bff"), .3, emit=hexc("2b6bff"), es=0); lr = mat("lr", hexc("ff2b2b"), .3, emit=hexc("ff2b2b"), es=0)
box((-.35, -.2, .95), (.35, .3, .14), lb, .03).parent = car; box((-.35, .2, .95), (.35, .3, .14), lr, .03).parent = car
for wx in (-.85, .85):
    for wy in (-.62, .62):
        bpy.ops.mesh.primitive_cylinder_add(radius=.3, depth=.22, location=(wx, wy, -.25), rotation=(math.radians(90), 0, 0)); wh = bpy.context.object; wh.data.materials.append(asphalt); wh.parent = car
emit_keys(lb, [(i * .2, hexc("2b6bff"), 12 if i % 2 == 0 else 0) for i in range(int(4.6 / .2), int(DUR / .2))])
emit_keys(lr, [(i * .2, hexc("ff2b2b"), 0 if i % 2 == 0 else 12) for i in range(int(4.6 / .2), int(DUR / .2))])
key(car, "location", [(0, (14, -5.0, .55)), (4.6, (14, -5.0, .55)), (5.8, (-1.4, -5.0, .55))])
key(car, "rotation_euler", [(5.6, (0, 0, 0)), (5.8, (0, math.radians(-2), 0)), (6.0, (0, 0, 0))])

# ---- street lamp and lights ----
def light(kind, loc, energy, col, size=4, rot=(0, 0, 0)):
    bpy.ops.object.light_add(type=kind, location=loc, rotation=rot); l = bpy.context.object.data; l.energy = energy; l.color = col
    if kind == "AREA": l.size = size
    return bpy.context.object
light("POINT", (5.2, -2.6, 4.4), 900, (1, .78, .5))
light("AREA", (-6, -10, 10), 550, (.55, .65, 1.0), 8)
light("SUN", (0, 0, 10), .35, (.6, .7, 1.0), rot=(math.radians(55), 0, math.radians(30)))
# stars
starm = mat("star", (1, 1, 1), .5, emit=(1, 1, 1), es=6)
for i in range(70):
    bpy.ops.mesh.primitive_ico_sphere_add(radius=random.uniform(.03, .07), location=(random.uniform(-22, 22), 25, random.uniform(6, 26))); bpy.context.object.data.materials.append(starm)

# ---- camera ----
bpy.ops.object.camera_add(); cam = bpy.context.object; sc.camera = cam
cam.data.lens = 50; cam.data.dof.use_dof = True; cam.data.dof.aperture_fstop = 2.0
tgt = bpy.data.objects.new("tgt", None); sc.collection.objects.link(tgt)
tc = cam.constraints.new("TRACK_TO"); tc.target = tgt; tc.track_axis = "TRACK_NEGATIVE_Z"; tc.up_axis = "UP_Y"; cam.data.dof.focus_object = tgt
key(cam, "location", [(0, (1.0, -11.5, 6.2)), (3.5, (.5, -12.5, 5.9)), (3.6, (-.7, -17, 4.4)), (5.8, (-.6, -17.5, 4.3)), (7.9, (-.5, -18, 4.4)), (9.9, (-.3, -12.5, 4.6)), (10.0, (-.3, -12.5, 4.6)),
                         (10.4, (.9, -8.5, 1.8)), (DUR, (.6, -7.2, 1.6))])
key(tgt, "location", [(0, (0, -.7, 5.5)), (3.5, (0, -.7, 5.5)), (3.6, (-.7, -1.0, 4.0)), (9.9, (-.5, -1.0, 4.1)), (10.4, (0, -1.5, 1.4)), (DUR, (0, -1.5, 1.4))])
for t_, L in ((0, 50), (3.5, 50), (3.6, 29), (10.0, 29), (10.4, 45), (DUR, 45)):
    cam.data.lens = L; cam.data.keyframe_insert("lens", frame=F(t_))
for ob in (cam, tgt):
    ad = ob.animation_data
    if ad and ad.action and hasattr(ad.action, "fcurves"):
        for fc in ad.action.fcurves:
            for kp in fc.keyframe_points: kp.interpolation = "BEZIER"

if STILLS:
    for s in STILLS:
        sc.frame_set(s); upd(sc); sc.render.filepath = f"{OUT}/still_{s:04d}.png"; bpy.ops.render.render(write_still=True)
else:
    sc.render.filepath = OUT + "/f_"; bpy.ops.render.render(animation=True)
