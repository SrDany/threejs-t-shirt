import trimesh
import numpy as np

# Polo
print("Procesando shirt_polo.glb...")
scene = trimesh.load('./public/shirt_polo.glb', force='scene')
box = scene.bounding_box.bounds
size = box[1] - box[0]
center = (box[0] + box[1]) / 2
T = trimesh.transformations.translation_matrix([0, -center[1], 0])
scene.apply_transform(T)
scale_factor = 0.9 / size[1]
S = trimesh.transformations.scale_matrix(scale_factor)
scene.apply_transform(S)
scene.export('./public/shirt_polo.glb')
print("  shirt_polo.glb actualizado!")

# Saco/Hoodie
print("Procesando shirt_saco.glb...")
scene2 = trimesh.load('./public/shirt_saco.glb', force='scene')
box = scene2.bounding_box.bounds
size = box[1] - box[0]
center = (box[0] + box[1]) / 2
T = trimesh.transformations.translation_matrix([-center[0], -center[1], -center[2]])
scene2.apply_transform(T)
scale_factor = 0.9 / size[1]
S = trimesh.transformations.scale_matrix(scale_factor)
scene2.apply_transform(S)
scene2.export('./public/shirt_saco.glb')
print("  shirt_saco.glb actualizado!")

print("\nListo! Ambos modelos normalizados.")
