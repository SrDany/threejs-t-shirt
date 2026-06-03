import {proxy} from 'valtio';

const state = proxy({
  intro: true,
  color: '#353934',
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: './threejs.png',
  fullDecal: './circuit.png',
  logoScaleX: 0.15,
  logoScaleY: 0.15,
  fullScaleX: 1,
  fullScaleY: 1,
  cameraZ: 2,
  currentModel: 'shirt_baked.glb', // nuevo: modelo activo
});

export default state;