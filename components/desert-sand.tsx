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
