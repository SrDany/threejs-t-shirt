import { easing } from "maath";
import { useSnapshot } from "valtio";
import { useFrame } from "@react-three/fiber";
import { Decal, useGLTF, useTexture } from "@react-three/drei";

import state from "../store";

const Shirt = () => {
  const snap = useSnapshot(state);
  const { nodes, materials } = useGLTF(`/${snap.currentModel}`);

  const logoTexture = useTexture(snap.logoDecal);
  const fullTexture = useTexture(snap.fullDecal);

  const material = Object.values(materials)[0];
  const mesh = Object.values(nodes).find((n) => n.isMesh);

  useFrame((state, delta) => {
    if (material) easing.dampC(material.color, snap.color, 0.25, delta);
  });

  const stateString = JSON.stringify(snap);

  if (!mesh) return null;

  const isSaco = snap.currentModel === 'shirt_saco.glb';

  return (
    <group key={stateString}>
      <mesh
        castShadow
        geometry={mesh.geometry}
        material={material}
        material-roughness={1}
        dispose={null}
      >
        {snap.isFullTexture && (
          <Decal
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={[snap.fullScaleX, snap.fullScaleY, 1]}
            map={fullTexture}
            depthTest={isSaco}
            depthWrite={!isSaco}
          />
        )}
        {snap.isLogoTexture && (
          <Decal
            position={[0, 0.04, 0.15]}
            rotation={[0, 0, 0]}
            scale={[snap.logoScaleX, snap.logoScaleY, 1]}
            map={logoTexture}
            anisotropy={16}
            depthTest={isSaco}
            depthWrite={!isSaco}
          />
        )}
      </mesh>
    </group>
  );
};

useGLTF.preload('/shirt_baked.glb');
useGLTF.preload('/shirt_polo.glb');
useGLTF.preload('/shirt_saco.glb');

export default Shirt;