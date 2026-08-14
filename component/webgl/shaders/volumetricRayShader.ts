export const volumetricRayVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * viewMatrix * vec4(vWorldPosition, 1.0);
  }
`;

export const volumetricRayFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uIntensity;

  varying vec2 vUv;
  varying vec3 vWorldPosition;

  void main() {
    // Cone falloff: high intensity at top vertex, fading downwards
    float verticalFade = pow(1.0 - vUv.y, 1.8);

    // Radial edge softening
    float radialEdge = sin(vUv.x * 3.14159265);

    // Dynamic wave shimmer pattern
    float shimmer = sin(vWorldPosition.x * 0.15 + uTime * 1.2) * cos(vWorldPosition.z * 0.15 + uTime * 0.9);
    float noise = 0.8 + 0.2 * shimmer;

    float alpha = verticalFade * radialEdge * uIntensity * noise;

    gl_FragColor = vec4(uColor, alpha);
  }
`;
