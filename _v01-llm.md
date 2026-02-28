# Directory Structure
```
app/
  globals.css
  layout.tsx
  page.tsx
components/
  desert-sand.tsx
lib/
  shader-constants.ts
types/
  shader.types.ts
package.json
tsconfig.json
```

# Files

## File: app/globals.css
```css
@import "tailwindcss";

@theme {
  --color-sand-light: #EEEBE5;
  --color-sand-mid: #E2D2C3;
  --color-sand-text: #4A443F;
  --color-sand-subtle: #6B635B;
}
```

## File: app/layout.tsx
```typescript
// file: app/layout.tsx
// description: Root layout component for Next.js application
// reference: Next.js App Router layout structure

import { type Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Granular Sand Shader',
  description: 'High-definition micro-sands texture simulation using WebGL shaders'
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): React.JSX.Element {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className='antialiased'>{children}</body>
    </html>
  );
}
```

## File: app/page.tsx
```typescript
// file: app/page.tsx
// description: Main page component with granular sand shader and UI overlay
// reference: Next.js page component with client-side rendering

'use client';
import { DesertSand } from '@/components/desert-sand';

export default function Home(): React.JSX.Element {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-sand-light'>
      <div className='fixed inset-0 z-0'>
        <DesertSand />
      </div>

      <div className='relative z-10 w-full max-w-4xl px-8 flex flex-col items-center'>
        <div className='space-y-4 text-center'>
          <h1 className='text-6xl md:text-8xl font-thin tracking-tight text-sand-text/80 drop-shadow-sm'>Granular</h1>
          <p className='text-sand-subtle/60 tracking-[0.6em] uppercase text-xs font-light'>High-definition micro-sands</p>
        </div>

        <div className='mt-16'>
          <button className='px-10 py-4 bg-white/20 backdrop-blur-xl border border-white/30 text-sand-text text-[10px] uppercase tracking-[0.3em] rounded-full hover:bg-white/40 transition-all duration-500 shadow-xl shadow-black/5'>
            Initialize Sequence
          </button>
        </div>
      </div>

      <div className='fixed bottom-12 w-full px-12 flex justify-between items-end z-10 pointer-events-none'>
        <div className='flex flex-col gap-1 opacity-30'>
          <span className='text-[10px] font-mono tracking-tighter'>GRN_SIZE: 0.004mm</span>
          <span className='text-[10px] font-mono tracking-tighter'>DENSITY: HIGH</span>
        </div>
        <div className='text-[9px] uppercase tracking-[0.5em] text-sand-text opacity-30'>Tactile Texture Simulation</div>
      </div>
    </div>
  );
}
```

## File: components/desert-sand.tsx
```typescript
// file: components/desert-sand.tsx
// description: WebGL shader component for granular sand texture using Three.js
// reference: Three.js ShaderMaterial and animation loop implementation

'use client';
import { FRAGMENT_SHADER, SAND_COLORS, VERTEX_SHADER } from '@/lib/shader-constants';
import { type ShaderUniforms } from '@/types/shader.types';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function DesertSand(): React.JSX.Element {
  const mount_ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mount_ref.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(mount_ref.current.clientWidth, mount_ref.current.clientHeight);
    mount_ref.current.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms: ShaderUniforms = {
      uTime: { value: 0 },
      uColorLight: { value: new THREE.Color(SAND_COLORS.light) },
      uColorDark: { value: new THREE.Color(SAND_COLORS.dark) }
    };

    const material = new THREE.ShaderMaterial({ vertexShader: VERTEX_SHADER, fragmentShader: FRAGMENT_SHADER, uniforms });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animation_id: number;

    const animate = (time: number): void => {
      uniforms.uTime.value = time * 0.001;
      renderer.render(scene, camera);
      animation_id = requestAnimationFrame(animate);
    };

    animate(0);

    const handle_resize = (): void => {
      if (!mount_ref.current) return;
      renderer.setSize(mount_ref.current.clientWidth, mount_ref.current.clientHeight);
    };

    window.addEventListener('resize', handle_resize);

    return () => {
      window.removeEventListener('resize', handle_resize);
      cancelAnimationFrame(animation_id);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (mount_ref.current) {
        mount_ref.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mount_ref} className='w-full h-full' />;
}
```

## File: lib/shader-constants.ts
```typescript
// file: lib/shader-constants.ts
// description: GLSL shader source code for granular white sand texture
// reference: Three.js ShaderMaterial vertex and fragment shaders

export const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const FRAGMENT_SHADER = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColorLight;
  uniform vec3 uColorDark;

  // --- Classic Simplex Noise ---
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 a0 = x - floor(x + 0.5);
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  void main() {
    // 1. Slow rolling base dunes
    vec2 duneUv = vUv * vec2(1.2, 3.5);
    float baseDunes = snoise(duneUv + uTime * 0.015) * 0.5 + 0.5;

    // 2. Wind Veils (Elongated streaks)
    vec2 windUv = vUv * vec2(0.4, 10.0);
    float windStreaks = snoise(windUv - uTime * 0.12) * 0.5 + 0.5;
    
    // 3. High-Frequency "Graininess"
    // Sample random noise at a very high frequency for individual grains
    float grainPattern = random(vUv * 2500.0);
    // Sample a secondary high-frequency noise for "clumping"
    float microTexture = snoise(vUv * 150.0 + uTime * 0.05) * 0.5 + 0.5;
    
    // 4. Soft lighting slope calculation
    float eps = 0.02;
    float d1 = snoise((vUv + vec2(eps, 0.0)) * vec2(1.2, 3.5) + uTime * 0.015);
    float d2 = snoise(vUv * vec2(1.2, 3.5) + uTime * 0.015);
    float slope = clamp((d1 - d2) / eps, -1.0, 1.0);

    // Base color mix
    vec3 color = mix(uColorDark, uColorLight, 0.75 + slope * 0.25);
    
    // Add granular micro-texture (subtle variation in surface)
    color -= (1.0 - microTexture) * 0.03;
    
    // Add individual "sand specs"
    // Use grainPattern to create dark and light tiny pixels
    color += (grainPattern - 0.5) * 0.07;
    
    // 5. Sharpened Glints (Granular Shimmer)
    // We use a high power function to isolate tiny bright spots
    float glints = pow(windStreaks * grainPattern, 12.0) * 0.4;
    color += glints;

    // Ensure wind streaks still provide that "floating" feel
    color = mix(color, uColorLight, windStreaks * 0.1);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export const SAND_COLORS = { light: '#EEEBE5', dark: '#E2D2C3' } as const;
```

## File: types/shader.types.ts
```typescript
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
```

## File: package.json
```json
{
  "name": "granular-sand-shader",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^16.1.6",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "three": "^0.183.1"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.2.1",
    "@types/bun": "^1.3.9",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@types/three": "^0.183.1",
    "tailwindcss": "^4.2.1",
    "typescript": "^5.9.3"
  }
}
```

## File: tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2024",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "noUncheckedIndexedAccess": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts", ".next/dev/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```
