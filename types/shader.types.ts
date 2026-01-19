// file: types/shader.types.ts
// description: Type definitions for WebGL shader uniforms and Three.js objects
// reference: Three.js TypeScript definitions

import * as THREE from 'three';

export interface ShaderUniforms {
  [uniform: string]: THREE.IUniform<unknown>;
  uTime: { value: number };
  uColorLight: { value: THREE.Color };
  uColorDark: { value: THREE.Color };
}

export interface DesertSandColors {
  light: string;
  dark: string;
}
