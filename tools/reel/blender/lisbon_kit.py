# lisbon_kit.py — a detailed Lisbon street for the 3D-diorama reels (Blender, imported by each scene.py).
# Facades are painted elevations (Higgsfield, branding/characters/textures/facade_*.png) on planes in front of real blocks,
# with real 3D depth added on top: cornices, roofs with real roof-tile texture, calçada pavement, Lisbon street lamps,
# tram rails and overhead wires. Call build_street(TEX, night=...) after the scene is reset.
import bpy, math

def hexc(h): return tuple((int(h[i:i + 2], 16) / 255) ** 2.2 for i in (0, 2, 4))

def mat(name, col, rough=0.55, metal=0.0, emit=None, es=3.0):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*col, 1); b.inputs["Roughness"].default_value = rough; b.inputs["Metallic"].default_value = metal
    if emit is not None: b.inputs["Emission Color"].default_value = (*emit, 1); b.inputs["Emission Strength"].default_value = es
    return m

def img_mat(name, path, rough=.8, scale=None, bump=0.0, value=1.0):
    m = bpy.data.materials.new(name); m.use_nodes = True; N = m.node_tree.nodes; L = m.node_tree.links
    b = N["Principled BSDF"]; b.inputs["Roughness"].default_value = rough
    t = N.new("ShaderNodeTexImage"); t.image = bpy.data.images.load(path); t.interpolation = "Cubic"
    if scale:
        tc = N.new("ShaderNodeTexCoord"); mp = N.new("ShaderNodeMapping"); mp.inputs["Scale"].default_value = scale
        L.new(tc.outputs["UV"], mp.inputs["Vector"]); L.new(mp.outputs["Vector"], t.inputs["Vector"])
    if value != 1.0:
        hs = N.new("ShaderNodeHueSaturation"); hs.inputs["Value"].default_value = value
        L.new(t.outputs["Color"], hs.inputs["Color"]); L.new(hs.outputs["Color"], b.inputs["Base Color"])
    else:
        L.new(t.outputs["Color"], b.inputs["Base Color"])
    if bump:
        bw = N.new("ShaderNodeRGBToBW"); bp = N.new("ShaderNodeBump"); bp.inputs["Strength"].default_value = bump; bp.inputs["Distance"].default_value = .02
        L.new(t.outputs["Color"], bw.inputs[0]); L.new(bw.outputs[0], bp.inputs["Height"]); L.new(bp.outputs["Normal"], b.inputs["Normal"])
    return m

def cal_slab(m): return m

def glow_mat(name, col, strength=4.0, mix=.55):
    """A soft warm glow laid over a painted window: half emission, half see-through."""
    m = bpy.data.materials.new(name); m.use_nodes = True; N = m.node_tree.nodes; L = m.node_tree.links
    out = N["Material Output"]; N.remove(N["Principled BSDF"])
    em = N.new("ShaderNodeEmission"); em.inputs["Color"].default_value = (*col, 1); em.inputs["Strength"].default_value = strength
    tr = N.new("ShaderNodeBsdfTransparent"); mx = N.new("ShaderNodeMixShader"); mx.inputs["Fac"].default_value = mix
    L.new(tr.outputs[0], mx.inputs[1]); L.new(em.outputs[0], mx.inputs[2]); L.new(mx.outputs[0], out.inputs["Surface"])
    return m, em

def bevel(o, wd=0.04, seg=4):
    m = o.modifiers.new("b", "BEVEL"); m.width = wd; m.segments = seg; m.limit_method = "ANGLE"

def box(loc, size, m, bv=0.04):
    bpy.ops.mesh.primitive_cube_add(location=loc); o = bpy.context.object; o.scale = (size[0] / 2, size[1] / 2, size[2] / 2)
    bpy.ops.object.transform_apply(scale=True); bevel(o, bv); o.data.materials.append(m); return o

def plane(loc, w, h, m, rot=(math.radians(90), 0, 0)):
    bpy.ops.mesh.primitive_plane_add(size=1, location=loc, rotation=rot); o = bpy.context.object; o.scale = (w, h, 1)
    bpy.ops.object.transform_apply(scale=True); o.data.materials.append(m); return o

def lamp(x, y, night):
    """A Lisbon wall-arm street lantern on a post: dark green iron, glass lantern."""
    iron = mat("iron", hexc("1f3b2e"), .45, .6)
    bpy.ops.mesh.primitive_cylinder_add(radius=.07, depth=4.4, location=(x, y, 2.2)); bpy.context.object.data.materials.append(iron)
    bpy.ops.mesh.primitive_cylinder_add(radius=.14, depth=.5, location=(x, y, .25)); bpy.context.object.data.materials.append(iron)
    bpy.ops.mesh.primitive_torus_add(major_radius=.35, minor_radius=.03, location=(x + .3, y, 4.3), rotation=(math.radians(90), 0, 0)); bpy.context.object.data.materials.append(iron)
    glow = mat("lantern", hexc("ffe0a0"), .2, emit=hexc("ffc46a"), es=(9 if night else 1.5))
    bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=.2, depth=.42, location=(x + .62, y, 4.15)); bpy.context.object.data.materials.append(glow)
    bpy.ops.mesh.primitive_cone_add(vertices=6, radius1=.28, depth=.22, location=(x + .62, y, 4.48)); bpy.context.object.data.materials.append(iron)
    if night:
        bpy.ops.object.light_add(type="POINT", location=(x + .62, y - .1, 4.0)); l = bpy.context.object.data; l.energy = 700; l.color = (1, .78, .5)

def build_street(TEX, night=False, road_depth=30, facades=("facade_yellow", "facade_azulejo", "facade_pink"), W=6.0, H=9.0, front_y=-.7):
    """Three painted Lisbon facades side by side (centre one at x=0), roofs, pavement, lamps, tram rails and wires.
    Returns {"facade_x": [...], "W": W, "H": H, "front_y": front_y}."""
    xs = [(i - (len(facades) - 1) / 2) * (W + .1) for i in range(len(facades))]
    V = .42 if night else 1.0
    trim = mat("trim", hexc("efe8da" if not night else "6d675d"), .7)
    roof = img_mat("roof", f"{TEX}/roof.png", .7, scale=(3, 1.2, 1), bump=.6, value=V)
    for x, f in zip(xs, facades):
        box((x, front_y + 1.6, H / 2), (W, 3.2, H), mat("block", hexc("cdbfa8"), .9), .02)
        plane((x, front_y - .01, H / 2), W, H, img_mat(f, f"{TEX}/{f}.png", .8, bump=.25, value=V))
        box((x, front_y - .12, H + .12), (W + .1, .35, .25), trim, .04)                          # cornice
        bpy.ops.mesh.primitive_plane_add(size=1, location=(x, front_y + 1.0, H + 1.0), rotation=(math.radians(-58), 0, 0)); r = bpy.context.object
        r.scale = (W + .2, 3.0, 1); bpy.ops.object.transform_apply(scale=True); r.data.materials.append(roof)
        for k in (-1, 1):                                                                            # chimneys
            box((x + k * W * .3, front_y + 1.6, H + 1.6), (.5, .5, 1.0), mat("chim", hexc("e7dccb"), .8), .03)
    # pavement: calçada everywhere, a dark road strip with tram rails
    cal = img_mat("calcada", f"{TEX}/calcada.png", .75, scale=(14, 14, 1), bump=.4, value=V)
    bpy.ops.mesh.primitive_plane_add(size=60, location=(0, -10, 0)); bpy.context.object.data.materials.append(cal)
    kerb = mat("kerb", hexc("bdb6a8"), .8)
    box((0, front_y - 2.4, .07), (60, .25, .18), kerb, .03)
    road = mat("road", hexc("3a3836"), .85)
    box((0, front_y - 3.0 - road_depth / 2, .02), (60, road_depth, .04), road, .0)
    steel = mat("steel", hexc("b9bcc0"), .3, 1.0)
    for ry in (front_y - 4.3, front_y - 5.7):
        box((0, ry, .06), (60, .08, .04), steel, .0)
    box((0, front_y - 1.35, .1), (60, 2.3, .2), kerb, .02)   # raised sidewalk...
    side = img_mat("calcada_side", f"{TEX}/calcada.png", .75, scale=(28, 1.07, 1), bump=.4, value=V)
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, front_y - 1.35, .205)); sp = bpy.context.object; sp.scale = (60, 2.3, 1); bpy.ops.object.transform_apply(scale=True); sp.data.materials.append(side)   # ...paved in calçada
    # overhead tram wires
    wire = mat("wire", hexc("1a1a1a"), .5, .5)
    for wy in (front_y - 4.3, front_y - 5.7):
        bpy.ops.mesh.primitive_cylinder_add(radius=.012, depth=60, location=(0, wy, 6.4), rotation=(0, math.radians(90), 0)); bpy.context.object.data.materials.append(wire)
    for lx in (-3.3, 3.3):
        lamp(lx, front_y - 2.1, night)
    return {"facade_x": xs, "W": W, "H": H, "front_y": front_y}
