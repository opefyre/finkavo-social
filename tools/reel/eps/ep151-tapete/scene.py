# EP151 rug shaking out of the window (Lisbon), 3D miniature diorama on the Lisbon street kit (Blender EEVEE).
#   Blender -b -P scene.py -- <out_dir> [still_frame ...]
# Timeline (s): hook, a rug shaken from a 3rd-floor balcony, dust puffs 0-4.2 · wide street, rule card (overlay) 4.5-10.0 ·
# a big dust cloud drops on the toy guy below, he turns grey 10.2-11.4 · "A sério?!" 11.6 · the shutter closes 12.8 · end 14.3
import bpy, math, sys, os, random
argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else ["/tmp/ep151"]
OUT = argv[0]; STILLS = [int(x) for x in argv[1:]]
FPS, DUR = 30, 14.3
F = lambda s: int(round(s * FPS)) + 1
random.seed(151)
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
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.."))
sys.path.insert(0, os.path.join(ROOT, "tools/reel/blender")); import lisbon_kit as K
from lisbon_kit import hexc, mat, box, bevel
TEX = os.path.join(ROOT, "branding/characters/textures")
FY = 1.5
K.build_street(TEX, night=False, facades=("facade_yellow", "facade_azulejo", "facade_pink"), front_y=FY)
def smooth(o):
    for p in o.data.polygons: p.use_smooth = True
def key(o, path, frames):
    for t, v in frames:
        setattr(o, path, v); o.keyframe_insert(path, frame=F(t))
def col_keys(m, frames):
    b = m.node_tree.nodes["Principled BSDF"].inputs["Base Color"]
    for t, c in frames:
        b.default_value = (*c, 1); b.keyframe_insert("default_value", frame=F(t))

WIN = (.03, FY - .25, 5.55)   # 3rd-floor middle balcony of the azulejo building

# ---- the rug: a striped Arraiolos-style rug hanging out of the window, waving ----
rugm = bpy.data.materials.new("rug"); rugm.use_nodes = True; N = rugm.node_tree.nodes; L = rugm.node_tree.links
wv = N.new("ShaderNodeTexWave"); wv.inputs["Scale"].default_value = 3.0; wv.wave_type = "BANDS"
cr = N.new("ShaderNodeValToRGB"); cr.color_ramp.interpolation = "CONSTANT"
cr.color_ramp.elements[0].color = (*hexc("b23a2e"), 1); cr.color_ramp.elements[1].position = .5; cr.color_ramp.elements[1].color = (*hexc("e9cf8e"), 1)
L.new(wv.outputs["Fac"], cr.inputs[0]); L.new(cr.outputs["Color"], N["Principled BSDF"].inputs["Base Color"]); N["Principled BSDF"].inputs["Roughness"].default_value = .9
bpy.ops.mesh.primitive_plane_add(size=1); rug = bpy.context.object; rug.scale = (1.3, 1.8, 1); bpy.ops.object.transform_apply(scale=True)
bpy.ops.object.mode_set(mode="EDIT"); bpy.ops.mesh.subdivide(number_cuts=24); bpy.ops.object.mode_set(mode="OBJECT")
rug.data.materials.append(rugm); smooth(rug)
for v in rug.data.vertices: v.co.y -= .9                       # pivot at the top edge
rug.rotation_euler = (math.radians(80), 0, 0); rug.location = (WIN[0], WIN[1] - .1, WIN[2] + .1)
vg = rug.vertex_groups.new(name="hang")                        # held edge stays still, the wave grows toward the free end
for v in rug.data.vertices: vg.add([v.index], min(1.0, (-v.co.y / 1.8) ** 1.6), "REPLACE")
wave = rug.modifiers.new("wave", "WAVE"); wave.vertex_group = "hang"; wave.use_normal = True; wave.height = .22; wave.width = .7; wave.speed = .45; wave.use_x = False
sol = rug.modifiers.new("sol", "SOLIDIFY"); sol.thickness = .03
for i in range(int(10.5 / .18)):                               # shaking: flicks out and back
    t = i * .18
    key(rug, "rotation_euler", [(t, (math.radians(80 - (25 if i % 2 else -6)), 0, 0))])
key(rug, "rotation_euler", [(10.6, (math.radians(85), 0, 0)), (12.6, (math.radians(85), 0, 0)), (12.9, (math.radians(170), 0, 0))])
key(rug, "location", [(12.6, (WIN[0], WIN[1] - .1, WIN[2] + .1)), (12.9, (WIN[0], WIN[1] + .4, WIN[2] + .1))])   # pulled back in
# a forearm holding it
skin = mat("skin", hexc("f1c7a0"), .6)
for ax in (-.45, .45):
    bpy.ops.mesh.primitive_cylinder_add(radius=.07, depth=.6, location=(WIN[0] + ax, WIN[1] + .18, WIN[2] + .1), rotation=(math.radians(90), 0, 0)); a = bpy.context.object
    a.data.materials.append(skin)   # the held edge is the pivot, so the forearms stay put while the rug flaps below
    key(a, "location", [(12.6, (WIN[0] + ax, WIN[1] + .18, WIN[2] + .1)), (12.9, (WIN[0] + ax, WIN[1] + .9, WIN[2] + .1))])
# green shutter that slams shut at 12.8
sh = box((WIN[0] - .75, FY - .08, WIN[2] - .1), (.7, .06, 1.25), mat("shutter", hexc("2f6b45"), .6), .02)
key(sh, "rotation_euler", [(0, (0, 0, math.radians(-95))), (12.75, (0, 0, math.radians(-95))), (12.95, (0, 0, 0))])
sh.location = (WIN[0] - .75, FY - .4, WIN[2] - .1)

# ---- dust: puffs while shaking, then one big cloud onto the guy ----
dust = bpy.data.materials.new("dust"); dust.use_nodes = True; Nd = dust.node_tree.nodes; Ld = dust.node_tree.links
Nd.remove(Nd["Principled BSDF"]); dif = Nd.new("ShaderNodeBsdfDiffuse"); dif.inputs["Color"].default_value = (*hexc("b9ad98"), 1)
tr = Nd.new("ShaderNodeBsdfTransparent"); mx = Nd.new("ShaderNodeMixShader"); mx.inputs["Fac"].default_value = .55
Ld.new(tr.outputs[0], mx.inputs[1]); Ld.new(dif.outputs[0], mx.inputs[2]); Ld.new(mx.outputs[0], Nd["Material Output"].inputs["Surface"])
GUY = (.25, -.2, .95)
for i in range(70):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=random.uniform(.08, .2)); d = bpy.context.object; d.data.materials.append(dust); smooth(d)
    if i < 40:   # puffs off the rug while shaking
        t0 = random.uniform(.2, 9.5); sx, sz = WIN[0] + random.uniform(-.6, .6), WIN[2] - random.uniform(.3, 1.6)
        key(d, "location", [(0, (sx, WIN[1] - .4, -5)), (t0 - .01, (sx, WIN[1] - .4, -5)), (t0, (sx, WIN[1] - .4, sz)), (t0 + 1.6, (sx + random.uniform(-.8, .8), WIN[1] - .9, sz - 1.8))])
        key(d, "scale", [(t0, (.3, .3, .3)), (t0 + .4, (1, 1, 1)), (t0 + 1.6, (0, 0, 0))])
    else:        # the big cloud falls on him 10.2-11.4 and lingers
        t0 = 10.2 + random.uniform(0, .3); ex = GUY[0] + random.uniform(-.6, .6); ez = GUY[2] + random.uniform(-.3, 1.2)
        key(d, "location", [(0, (0, 0, -5)), (t0 - .01, (0, 0, -5)), (t0, (WIN[0] + random.uniform(-.5, .5), WIN[1] - .4, WIN[2] - .6)), (t0 + 1.0, (ex, GUY[1] + random.uniform(-.4, .3), ez)), (12.2, (ex + random.uniform(-.6, .6), GUY[1] - .3, ez + .8))])
        key(d, "scale", [(t0, (.5, .5, .5)), (t0 + 1.0, (1.4, 1.4, 1.4)), (11.5, (.9, .9, .9)), (12.2, (0, 0, 0))])

# ---- toy guy below, turns dusty grey ----
green = mat("green", hexc("3cae5c"), .5); skinG = mat("skinG", hexc("f1c7a0"), .6); hair = mat("hair", hexc("4a2c1a"), .8); ink = mat("ink", (0.02, 0.02, 0.02), .3)
bpy.ops.mesh.primitive_cylinder_add(radius=.42, depth=1.0); guy = bpy.context.object; bevel(guy, .2, 6); guy.data.materials.append(green); smooth(guy)
bpy.ops.mesh.primitive_uv_sphere_add(radius=.45, location=(0, 0, .88)); h = bpy.context.object; h.data.materials.append(skinG); smooth(h); h.parent = guy
for ex in (-.16, .16):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=.065, location=(ex, -.41, .95)); e = bpy.context.object; e.data.materials.append(ink); e.parent = guy
bpy.ops.mesh.primitive_uv_sphere_add(radius=.47, location=(0, .05, 1.12)); hr = bpy.context.object; hr.scale = (1, 1, .55); hr.data.materials.append(hair); hr.parent = guy
guy.location = GUY
grey = hexc("9a948a")
col_keys(green, [(10.6, hexc("3cae5c")), (11.2, grey)]); col_keys(skinG, [(10.6, hexc("f1c7a0")), (11.2, hexc("b8b0a4"))]); col_keys(hair, [(10.6, hexc("4a2c1a")), (11.2, hexc("a39c90"))])
key(guy, "rotation_euler", [(11.6, (0, 0, 0)), (11.75, (math.radians(-12), 0, 0)), (11.95, (math.radians(6), 0, 0)), (12.2, (0, 0, 0))])   # looks up, outraged
key(guy, "scale", [(11.6, (1, 1, 1)), (11.75, (1.08, 1.08, .9)), (11.95, (.96, .96, 1.08)), (12.2, (1, 1, 1))])

# ---- lights ----
def light(kind, loc, energy, col, size=4, rot=(0, 0, 0)):
    bpy.ops.object.light_add(type=kind, location=loc, rotation=rot); l = bpy.context.object.data; l.energy = energy; l.color = col
    if kind == "AREA": l.size = size
light("SUN", (0, 0, 10), 3.5, (1, .93, .8), rot=(math.radians(48), math.radians(10), math.radians(-35)))
light("AREA", (-5, -10, 6), 600, (.8, .9, 1.0), 8)

# ---- camera ----
bpy.ops.object.camera_add(); cam = bpy.context.object; sc.camera = cam
cam.data.dof.use_dof = True; cam.data.dof.aperture_fstop = 2.8
tgt = bpy.data.objects.new("tgt", None); sc.collection.objects.link(tgt)
tc = cam.constraints.new("TRACK_TO"); tc.target = tgt; tc.track_axis = "TRACK_NEGATIVE_Z"; tc.up_axis = "UP_Y"; cam.data.dof.focus_object = tgt
key(cam, "location", [(0, (1.4, -3.6, 1.6)), (4.2, (1.0, -3.9, 1.8)), (4.3, (.2, -11.5, 3.6)), (9.9, (.1, -10.8, 3.4)), (10.0, (1.5, -4.2, 1.6)), (DUR, (1.2, -3.8, 1.5))])
key(tgt, "location", [(0, (WIN[0], WIN[1], WIN[2] - .3)), (4.2, (WIN[0], WIN[1], WIN[2] - .5)), (4.3, (0, .5, 3.6)), (9.9, (0, .5, 3.6)), (10.0, (.2, -.1, 2.6)), (11.0, (.25, -.2, 1.6)), (DUR, (.25, -.2, 1.5))])
for t_, L in ((0, 30), (4.2, 30), (4.3, 26), (9.9, 26), (10.0, 30), (DUR, 32)):
    cam.data.lens = L; cam.data.keyframe_insert("lens", frame=F(t_))

if STILLS:
    for s in STILLS:
        sc.frame_set(s); sc.render.filepath = f"{OUT}/still_{s:04d}.png"; bpy.ops.render.render(write_still=True)
else:
    sc.render.filepath = OUT + "/f_"; bpy.ops.render.render(animation=True)
