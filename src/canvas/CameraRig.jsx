import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { useSnapshot } from "valtio";

import state from "../store";

const CameraRig = ({ children }) => {
  const group = useRef();
  const snap = useSnapshot(state);
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;

    const handleWheel = (e) => {
      e.preventDefault();
      const zoomSpeed = 0.001;
      state.cameraZ = Math.min(4, Math.max(1, state.cameraZ + e.deltaY * zoomSpeed));
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, [gl]);

  useFrame((state, delta) => {
    const isBreakpoint = window.innerWidth <= 1260;
    const isMobile = window.innerWidth <= 600;

    let targetPosition = [-0.4, 0, snap.cameraZ];
    if (snap.intro) {
      if (isBreakpoint) targetPosition = [0, 0, snap.cameraZ];
      if (isMobile) targetPosition = [0, 0.2, snap.cameraZ];
    } else {
      if (isMobile) {
        targetPosition = [0, 0, snap.cameraZ];
      } else {
        targetPosition = [0, 0, snap.cameraZ];
      }
    }

    easing.damp3(state.camera.position, targetPosition, 0.25, delta);

    easing.dampE(
      group.current.rotation,
      [state.pointer.y / 7, -state.pointer.x / 2, 0],
      0.20,
      delta
    );
  });

  return <group ref={group}>{children}</group>;
};

export default CameraRig;