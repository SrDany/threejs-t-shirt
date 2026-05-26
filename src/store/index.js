import {proxy} from 'valtio';

const state = proxy({
  intro: true,
  color: '#353934',
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: './threejs.png',
  fullDecal: './circuit.png',
  logoScale: 0.15,
  fullScale: 1,
});

export default state;