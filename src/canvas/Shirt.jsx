import { easing } from "maath";
import { useSnapshot } from "valtio";
import { useFrame } from "@react-three/fiber";
import { Decal, useGLTF, useTexture } from "@react-three/drei";
import { useRef, useState } from "react";

import state from "../store";

const Shirt = () => {
  const snap = useSnapshot(state);
  const { nodes, materials } = useGLTF(`/${snap.currentModel}`);

  const logoTexture = useTexture(snap.logoDecal);
  const fullTexture = useTexture(snap.fullDecal);

  const material = Object.values(materials)[0];
  const mesh = Object.values(nodes).find((n) => n.isMesh);

  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const posStartRef = useRef({ x: snap.logoPositionX, y: snap.logoPositionY });

  useFrame((state, delta) => {
    if (material) easing.dampC(material.color, snap.color, 0.25, delta);
  });

  const handlePointerDown = (e) => {
    state.logoSelected = true;
    setIsDragging(true);
    setHasMoved(false);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    posStartRef.current = { x: snap.logoPositionX, y: snap.logoPositionY };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;

    const moved = Math.abs(e.clientX - dragStartRef.current.x) > 5 || 
                  Math.abs(e.clientY - dragStartRef.current.y) > 5;
    setHasMoved(moved);

    if (moved) {
      const deltaX = (e.clientX - dragStartRef.current.x) * 0.001;
      const deltaY = (e.clientY - dragStartRef.current.y) * 0.001;

      let newX = posStartRef.current.x + deltaX;
      let newY = posStartRef.current.y - deltaY;

      newX = Math.max(-0.3, Math.min(0.3, newX));
      newY = Math.max(-0.4, Math.min(0.4, newY));

      state.logoPositionX = newX;
      state.logoPositionY = newY;
    }
  };

  const handlePointerUp = () => {
    if (isDragging && !hasMoved) {
      state.logoSelected = false;
    }
    setIsDragging(false);
    setHasMoved(false);
  };

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
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
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
            position={[snap.logoPositionX, snap.logoPositionY, snap.logoPositionZ]}
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
