import bpy
import bmesh
import math
import os
import random

OUTPUT_DIR = "/Users/apple/Documents/CODING/Bubu Balloon/public/gallery"
os.makedirs(OUTPUT_DIR, exist_ok=True)


def hex_to_rgba(hex_str, alpha=1.0):
    hex_str = hex_str.lstrip("#")
    r = int(hex_str[0:2], 16) / 255.0
    g = int(hex_str[2:4], 16) / 255.0
    b = int(hex_str[4:6], 16) / 255.0
    # sRGB to linear
    def to_lin(c):
        return ((c + 0.055) / 1.055) ** 2.4 if c > 0.04045 else c / 12.92
    return (to_lin(r), to_lin(g), to_lin(b), alpha)


def clear_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def set_bsdf_input(bsdf, names, value):
    for name in names:
        if name in bsdf.inputs:
            bsdf.inputs[name].default_value = value
            return


def make_material(name, hex_color, roughness=0.22, metallic=0.0, coat=0.0, emission=0.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    rgba = hex_to_rgba(hex_color)
    bsdf.inputs["Base Color"].default_value = rgba
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    if coat > 0:
        set_bsdf_input(bsdf, ["Coat Weight", "Clearcoat"], coat)
        set_bsdf_input(bsdf, ["Coat Roughness", "Clearcoat Roughness"], 0.08)
    if emission > 0:
        set_bsdf_input(bsdf, ["Emission Color", "Emission"], rgba)
        set_bsdf_input(bsdf, ["Emission Strength"], emission)
    return mat


def setup_render(width=768, height=544):
    scene = bpy.context.scene
    # Use Cycles CPU with OpenImageDenoise & adaptive sampling for fast, clean studio renders
    scene.render.engine = "CYCLES"
    scene.cycles.device = "CPU"
    scene.cycles.samples = 14
    scene.cycles.use_adaptive_sampling = True
    scene.cycles.adaptive_threshold = 0.05
    scene.cycles.use_denoising = True
    scene.cycles.max_bounces = 4
    scene.cycles.diffuse_bounces = 2
    scene.cycles.glossy_bounces = 2

    scene.render.resolution_x = width
    scene.render.resolution_y = height
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.view_settings.view_transform = "AgX" if "AgX" in [i.identifier for i in scene.view_settings.bl_rna.properties["view_transform"].enum_items] else "Filmic"
    try:
        scene.view_settings.look = "AgX - Medium High Contrast"
    except Exception:
        pass
    scene.view_settings.exposure = 0.15


def setup_studio(wall_hex, floor_hex, world_hex="#FFF8F9"):
    scene = bpy.context.scene
    # Bright airy world light
    world = bpy.data.worlds.new("StudioWorld")
    scene.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes.get("Background")
    bg.inputs["Color"].default_value = hex_to_rgba(world_hex)
    bg.inputs["Strength"].default_value = 0.65

    # Floor
    bpy.ops.mesh.primitive_plane_add(size=18, location=(0, 0, 0))
    floor = bpy.context.active_object
    floor.data.materials.append(make_material("FloorMat", floor_hex, roughness=0.58))

    # Back Wall
    bpy.ops.mesh.primitive_plane_add(size=18, location=(0, 2.2, 4.0), rotation=(math.pi / 2, 0, 0))
    wall = bpy.context.active_object
    wall.data.materials.append(make_material("WallMat", wall_hex, roughness=0.72))

    # Key Softbox Light (Front Left Top)
    bpy.ops.object.light_add(type="AREA", location=(-3.2, -4.5, 4.4))
    key = bpy.context.active_object
    key.data.energy = 420
    key.data.size = 4.2
    key.data.color = (1.0, 0.97, 0.95)
    key.rotation_euler = (math.radians(56), 0, math.radians(-32))

    # Fill Light (Front Right)
    bpy.ops.object.light_add(type="AREA", location=(3.8, -3.6, 2.8))
    fill = bpy.context.active_object
    fill.data.energy = 210
    fill.data.size = 4.8
    fill.data.color = (1.0, 0.93, 0.96)
    fill.rotation_euler = (math.radians(68), 0, math.radians(42))

    # Rim Top Light
    bpy.ops.object.light_add(type="AREA", location=(0.0, 0.8, 5.2))
    rim = bpy.context.active_object
    rim.data.energy = 160
    rim.data.size = 5.0
    rim.rotation_euler = (math.radians(15), 0, 0)

    # Camera (pulled back slightly for clean studio breathing room around full arch)
    bpy.ops.object.camera_add(location=(0.0, -6.35, 1.50), rotation=(math.radians(86.2), 0, 0))
    cam = bpy.context.active_object
    cam.data.lens = 48
    scene.camera = cam


def create_arch_panel(name, x, y, width, height, depth, mat):
    # Create clean arch using bmesh extruded from 2D points
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)

    bm = bmesh.new()
    radius = width / 2.0
    straight_h = max(0.2, height - radius)
    segs = 28

    verts = []
    # Bottom left to top-left of straight part
    verts.append(bm.verts.new((-radius, 0, 0)))
    verts.append(bm.verts.new((radius, 0, 0)))
    # Semi-circle top from right to left
    for i in range(segs + 1):
        ang = (i / segs) * math.pi
        vx = math.cos(ang) * radius
        vz = straight_h + math.sin(ang) * radius
        verts.append(bm.verts.new((vx, 0, vz)))

    bm.faces.new(verts)
    geom = bmesh.ops.extrude_face_region(bm, geom=bm.faces[:])
    extruded_verts = [e for e in geom["geom"] if isinstance(e, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, verts=extruded_verts, vec=(0, depth, 0))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    bm.to_mesh(mesh)
    bm.free()

    obj.location = (x, y, 0)
    obj.data.materials.append(mat)
    # Smooth shading with bevel
    bev = obj.modifiers.new(name="Bevel", type="BEVEL")
    bev.width = 0.025
    bev.segments = 3
    for p in obj.data.polygons:
        p.use_smooth = True
    return obj


def add_balloon(x, y, z, radius, mat):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=16, radius=radius, location=(x, y, z))
    b = bpy.context.active_object
    b.scale = (1.0, 0.96, 1.08)
    b.rotation_euler = (random.uniform(-0.3, 0.3), random.uniform(-0.3, 0.3), random.uniform(0, 6.28))
    b.data.materials.append(mat)
    for p in b.data.polygons:
        p.use_smooth = True
    return b


def build_garland(curve_points, materials, seed=42, density=38, base_radius=0.22):
    rng = random.Random(seed)
    n_pts = len(curve_points)
    for i in range(density):
        t = i / max(1, density - 1)
        idx_f = t * (n_pts - 1)
        i0 = min(int(idx_f), n_pts - 2)
        frac = idx_f - i0
        p0 = curve_points[i0]
        p1 = curve_points[i0 + 1]
        cx = p0[0] + (p1[0] - p0[0]) * frac
        cy = p0[1] + (p1[1] - p0[1]) * frac
        cz = p0[2] + (p1[2] - p0[2]) * frac

        # Main balloon
        r = base_radius * rng.uniform(0.75, 1.25)
        ox = rng.uniform(-0.14, 0.14)
        oy = rng.uniform(-0.12, 0.12)
        oz = rng.uniform(-0.12, 0.12)
        add_balloon(cx + ox, cy + oy, max(r, cz + oz), r, rng.choice(materials))

        # Cute mini filler clusters
        if i % 2 == 0:
            for _ in range(2):
                mr = base_radius * rng.uniform(0.38, 0.62)
                add_balloon(
                    cx + rng.uniform(-0.24, 0.24),
                    cy - rng.uniform(0.08, 0.22),
                    max(mr, cz + rng.uniform(-0.2, 0.2)),
                    mr,
                    rng.choice(materials),
                )


def add_cylinder_plinth(x, y, radius, height, mat):
    bpy.ops.mesh.primitive_cylinder_add(vertices=40, radius=radius, depth=height, location=(x, y, height / 2))
    cyl = bpy.context.active_object
    cyl.data.materials.append(mat)
    bev = cyl.modifiers.new("Bevel", type="BEVEL")
    bev.width = 0.015
    bev.segments = 3
    for p in cyl.data.polygons:
        p.use_smooth = True
    return cyl


def add_ribbon_bow(x, y, z, mat, scale=1.0):
    # Center knot
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.06 * scale, location=(x, y, z))
    k = bpy.context.active_object
    k.data.materials.append(mat)
    for p in k.data.polygons:
        p.use_smooth = True

    # Two loops
    for side in (-1, 1):
        bpy.ops.mesh.primitive_torus_add(
            major_radius=0.11 * scale,
            minor_radius=0.036 * scale,
            location=(x + side * 0.12 * scale, y, z + 0.02 * scale),
            rotation=(math.radians(82), math.radians(side * 16), 0),
        )
        loop = bpy.context.active_object
        loop.scale = (1.15, 0.55, 0.72)
        loop.data.materials.append(mat)
        for p in loop.data.polygons:
            p.use_smooth = True

        # Tail
        bpy.ops.mesh.primitive_cube_add(
            size=1.0,
            location=(x + side * 0.07 * scale, y - 0.01, z - 0.18 * scale),
            rotation=(0, math.radians(-side * 16), 0),
        )
        tail = bpy.context.active_object
        tail.scale = (0.045 * scale, 0.012 * scale, 0.28 * scale)
        tail.data.materials.append(mat)


def add_3d_text(text_str, x, y, z, size, mat, depth=0.02):
    bpy.ops.object.text_add(location=(x, y, z), rotation=(math.pi / 2, 0, 0))
    txt = bpy.context.active_object
    txt.data.body = text_str
    txt.data.align_x = "CENTER"
    txt.data.size = size
    txt.data.extrude = depth
    txt.data.bevel_depth = 0.005
    txt.data.materials.append(mat)
    return txt


def render_blush_ribbon():
    clear_scene()
    setup_render()
    setup_studio("#FFF4F6", "#F7E6EA", "#FFF7F8")

    m_cream = make_material("Cream", "#FFFDFC", roughness=0.45)
    m_blush_panel = make_material("BlushPanel", "#FDEBED", roughness=0.45)
    m_pink = make_material("PinkBalloon", "#F2B3BD", roughness=0.18, coat=0.95)
    m_navy = make_material("NavyBalloon", "#162A4C", roughness=0.16, coat=1.0)
    m_pearl = make_material("PearlBalloon", "#FFFDFC", roughness=0.22, coat=0.9)
    m_rose = make_material("RoseBalloon", "#D98395", roughness=0.18, coat=0.95)
    m_gold = make_material("GoldAccent", "#DFBE8A", roughness=0.16, metallic=0.85)
    m_bow = make_material("BowSatin", "#EFAAB6", roughness=0.35, coat=0.35)

    # Double arch backdrop
    create_arch_panel("MainArch", -0.22, 0.55, 1.75, 2.55, 0.12, m_cream)
    create_arch_panel("SideArch", 0.68, 0.42, 1.25, 2.08, 0.12, m_blush_panel)

    # Text on backdrop (cleanly centered on left arch, zero overlap)
    add_3d_text("HAPPY BIRTHDAY", -0.38, 0.52, 1.72, 0.105, m_navy, depth=0.01)
    add_3d_text("Nadia", -0.38, 0.52, 1.44, 0.22, m_rose, depth=0.012)

    # Organic Balloon Garland
    curve = [
        (-1.18, 0.15, 0.28),
        (-1.12, 0.18, 1.05),
        (-0.98, 0.22, 1.85),
        (-0.55, 0.25, 2.42),
        (0.15, 0.24, 2.48),
        (0.85, 0.20, 2.15),
        (1.26, 0.16, 1.55),
        (1.32, 0.14, 0.95),
    ]
    build_garland(curve, [m_pink, m_navy, m_pearl, m_pink, m_rose], seed=101, density=34, base_radius=0.21)

    # Cute satin bows
    add_ribbon_bow(1.28, -0.05, 1.25, m_bow, scale=1.1)
    add_ribbon_bow(-1.12, -0.05, 1.45, m_bow, scale=0.85)

    # Cylinder cake table + cute 2-tier cake
    add_cylinder_plinth(-0.1, -0.35, 0.34, 0.84, m_cream)
    add_cylinder_plinth(-0.1, -0.35, 0.20, 0.18, m_blush_panel).location.z = 0.93
    add_cylinder_plinth(-0.1, -0.35, 0.13, 0.14, m_cream).location.z = 1.09
    # Gold candle
    c = add_cylinder_plinth(-0.1, -0.35, 0.012, 0.12, m_gold)
    c.location.z = 1.22

    bpy.context.scene.render.filepath = os.path.join(OUTPUT_DIR, "blush-ribbon.png")
    bpy.ops.render.render(write_still=True)


def render_sweet_seventeen():
    clear_scene()
    setup_render()
    setup_studio("#FAF2EA", "#EFE3D6", "#FFF8F0")

    m_cream = make_material("Cream", "#FFFDF9", roughness=0.45)
    m_blush = make_material("Blush", "#FDEBED", roughness=0.45)
    m_gold = make_material("GoldChrome", "#DFBE8A", roughness=0.14, metallic=0.86, coat=0.9)
    m_pearl = make_material("Pearl", "#FFFDFC", roughness=0.2, coat=0.95)
    m_pink = make_material("Pink", "#F2B3BD", roughness=0.18, coat=0.95)
    m_navy = make_material("Navy", "#162A4C", roughness=0.16, coat=1.0)
    m_glow = make_material("WarmGlow", "#FFE49E", roughness=0.2, emission=4.5)

    # Warm glowing LED ring behind arch
    bpy.ops.mesh.primitive_torus_add(
        major_radius=1.02, minor_radius=0.035, location=(0.0, 0.72, 1.62), rotation=(math.pi / 2, 0, 0)
    )
    ring = bpy.context.active_object
    ring.data.materials.append(m_glow)

    create_arch_panel("MainArch", 0.0, 0.55, 1.92, 2.65, 0.12, m_cream)
    create_arch_panel("SideArch", 0.82, 0.44, 1.15, 2.0, 0.12, m_blush)

    add_3d_text("SWEET SEVENTEEN", -0.24, 0.52, 1.88, 0.105, m_navy, depth=0.01)
    add_3d_text("Clarissa", -0.24, 0.52, 1.58, 0.22, m_gold, depth=0.012)

    curve = [
        (-1.15, 0.15, 0.25),
        (-1.08, 0.18, 1.1),
        (-0.92, 0.22, 1.95),
        (-0.42, 0.25, 2.52),
        (0.32, 0.24, 2.55),
        (0.95, 0.20, 2.15),
        (1.32, 0.15, 1.4),
    ]
    build_garland(curve, [m_gold, m_pearl, m_pink, m_pearl, m_navy], seed=202, density=36, base_radius=0.21)

    # Marquee "17" glowing numbers
    add_3d_text("17", -0.45, -0.32, 0.08, 0.88, m_cream, depth=0.09)
    add_3d_text("17", -0.45, -0.38, 0.09, 0.85, m_glow, depth=0.02)

    # Pedestal + cake
    add_cylinder_plinth(0.55, -0.35, 0.32, 0.86, m_cream)
    add_cylinder_plinth(0.55, -0.35, 0.18, 0.20, m_blush).location.z = 0.96

    bpy.context.scene.render.filepath = os.path.join(OUTPUT_DIR, "sweet-seventeen.png")
    bpy.ops.render.render(write_still=True)


def render_pastel_cloud():
    clear_scene()
    setup_render()
    setup_studio("#F3F9FF", "#F3E8DC", "#FAF7F2")

    m_cream = make_material("Cream", "#FFFDF9", roughness=0.48)
    m_blue_panel = make_material("BluePanel", "#E3F1FC", roughness=0.45)
    m_blue = make_material("BlueB", "#BFDDF0", roughness=0.22, coat=0.85)
    m_butter = make_material("ButterB", "#F7E6B5", roughness=0.22, coat=0.85)
    m_pink = make_material("PinkB", "#F4C6D0", roughness=0.22, coat=0.85)
    m_white = make_material("WhiteB", "#FFFDF8", roughness=0.25, coat=0.85)
    m_teddy = make_material("Teddy", "#C99B72", roughness=0.78)
    m_teddy_light = make_material("TeddyLight", "#F0DAC3", roughness=0.75)
    m_navy = make_material("Navy", "#162A4C", roughness=0.25)

    create_arch_panel("LeftArch", -0.45, 0.55, 1.55, 2.38, 0.12, m_cream)
    create_arch_panel("RightArch", 0.55, 0.45, 1.52, 2.48, 0.12, m_blue_panel)

    add_3d_text("HAPPY 1ST BIRTHDAY", 0.42, 0.42, 1.78, 0.088, m_navy, depth=0.008)
    add_3d_text("Baby Theo", 0.42, 0.42, 1.50, 0.20, m_navy, depth=0.01)

    curve = [
        (-1.26, 0.16, 0.25),
        (-1.18, 0.18, 1.15),
        (-0.92, 0.22, 1.95),
        (-0.25, 0.25, 2.45),
        (0.55, 0.24, 2.52),
        (1.22, 0.18, 2.02),
        (1.36, 0.15, 1.18),
    ]
    build_garland(curve, [m_blue, m_butter, m_pink, m_white], seed=303, density=36, base_radius=0.22)

    # Plinth + cute sculpted 3D Teddy Bear
    add_cylinder_plinth(-0.48, -0.35, 0.34, 0.78, m_cream)
    # Teddy body, head, ears, snout
    for pos, rad, mat in [
        ((-0.48, -0.35, 0.96), 0.18, m_teddy),
        ((-0.48, -0.35, 1.24), 0.15, m_teddy),
        ((-0.59, -0.35, 1.37), 0.055, m_teddy),
        ((-0.37, -0.35, 1.37), 0.055, m_teddy),
        ((-0.48, -0.48, 1.21), 0.058, m_teddy_light),
        ((-0.53, -0.49, 1.27), 0.016, m_navy),
        ((-0.43, -0.49, 1.27), 0.016, m_navy),
    ]:
        bpy.ops.mesh.primitive_uv_sphere_add(radius=rad, location=pos)
        o = bpy.context.active_object
        o.data.materials.append(mat)
        for p in o.data.polygons:
            p.use_smooth = True

    # Cute fluffy 3D cloud on right floor
    for cx, cz, r in [(0.75, 0.20, 0.20), (0.98, 0.26, 0.24), (1.22, 0.18, 0.18)]:
        bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=(cx, -0.32, cz))
        o = bpy.context.active_object
        o.data.materials.append(m_white)
        for p in o.data.polygons:
            p.use_smooth = True

    bpy.context.scene.render.filepath = os.path.join(OUTPUT_DIR, "pastel-cloud.png")
    bpy.ops.render.render(write_still=True)


def render_bridal_intimate():
    clear_scene()
    setup_render()
    setup_studio("#FFF5F7", "#F2E1E4", "#FFF8F9")

    m_cream = make_material("Cream", "#FFFDFC", roughness=0.45)
    m_rose = make_material("Rose", "#EFAAB6", roughness=0.18, coat=0.95)
    m_deep_rose = make_material("DeepRose", "#D98395", roughness=0.18, coat=0.95)
    m_pearl = make_material("Pearl", "#FAF5F2", roughness=0.22, coat=0.95)
    m_gold = make_material("Gold", "#DFBE8A", roughness=0.14, metallic=0.88, coat=0.9)
    m_flame = make_material("Flame", "#FFD166", roughness=0.2, emission=5.0)

    # Golden hoop + cream arch
    create_arch_panel("MainArch", 0.0, 0.55, 1.82, 2.58, 0.10, m_cream)
    bpy.ops.mesh.primitive_torus_add(
        major_radius=0.96, minor_radius=0.024, location=(0.0, 0.50, 1.56), rotation=(math.pi / 2, 0, 0)
    )
    hoop = bpy.context.active_object
    hoop.data.materials.append(m_gold)

    add_3d_text("Bride to Be", 0.0, 0.48, 1.62, 0.24, m_deep_rose, depth=0.012)
    add_3d_text("INTIMATE SOIREE", 0.0, 0.48, 1.38, 0.095, m_gold, depth=0.008)

    # Asymmetric romantic draped garland
    curve = [
        (-1.05, 0.20, 1.55),
        (-0.82, 0.22, 2.15),
        (-0.22, 0.24, 2.52),
        (0.45, 0.22, 2.42),
        (0.96, 0.18, 1.98),
        (1.12, 0.14, 1.32),
        (1.06, 0.12, 0.65),
        (1.15, 0.10, 0.22),
    ]
    build_garland(curve, [m_pearl, m_rose, m_deep_rose, m_gold, m_pearl], seed=404, density=36, base_radius=0.20)

    add_ribbon_bow(-0.98, 0.02, 1.48, m_rose, scale=1.05)

    # Intimate table + taper candles + rose spheres
    add_cylinder_plinth(0.0, -0.45, 0.48, 0.72, m_cream)
    for cx in (-0.24, 0.24):
        c = add_cylinder_plinth(cx, -0.45, 0.016, 0.24, m_gold)
        c.location.z = 0.84
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.022, location=(cx, -0.45, 0.98))
        fl = bpy.context.active_object
        fl.data.materials.append(m_flame)

    # Mini floral cluster in center of table
    for fx, fy, fz, m in [
        (0.0, -0.45, 0.82, m_rose),
        (-0.07, -0.42, 0.80, m_pearl),
        (0.07, -0.43, 0.81, m_deep_rose),
        (0.0, -0.48, 0.86, m_pearl),
    ]:
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.065, location=(fx, fy, fz))
        o = bpy.context.active_object
        o.data.materials.append(m)
        for p in o.data.polygons:
            p.use_smooth = True

    bpy.context.scene.render.filepath = os.path.join(OUTPUT_DIR, "bridal-intimate.png")
    bpy.ops.render.render(write_still=True)


if __name__ == "__main__":
    print("=== Rendering Bubu Balloon 3D Studio Gallery ===")
    render_blush_ribbon()
    render_sweet_seventeen()
    render_pastel_cloud()
    render_bridal_intimate()
    print("=== All 4 renders completed! ===")
