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
