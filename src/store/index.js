import {proxy} from 'valtio';

const state = proxy({
  intro: true,
  color: '#353934',
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: './threejs.png',
  fullDecal: './circuit.png',
  logoScaleX: 0.25,
  logoScaleY: 0.15,
  fullScaleX: 1,
  fullScaleY: 1,
  logoPositionX: 0,
  logoPositionY: 0.04,
  logoPositionZ: 0.15,
  logoSelected: false,
  cameraZ: 2,
  currentModel: 'shirt_baked.glb',
});

export default state;
