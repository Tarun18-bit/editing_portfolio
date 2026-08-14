export const jellyfishVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPulseSpeed;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);

    // Dynamic bell contraction pulse
    float pulse = sin(uTime * uPulseSpeed);
    vec3 transformed = position;

    // Flare out base when contracting top
    if (position.y < 0.0) {
      transformed.xz *= (1.0 + 0.25 * pulse);
    } else {
      transformed.y += 0.15 * pulse;
      transformed.xz *= (1.0 - 0.15 * pulse);
    }

    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const jellyfishFragmentShader = /* glsl */ `
  uniform vec3 uColorInner;
  uniform vec3 uColorGlow;
  uniform float uTime;

  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);

    // Fresnel rim glow
    float fresnel = pow(1.0 - abs(dot(viewDir, normal)), 2.5);

    // Internal bioluminescent pulsation
    float internalGlow = 0.5 + 0.5 * sin(uTime * 2.5 + vUv.y * 5.0);

    vec3 finalColor = mix(uColorInner, uColorGlow, fresnel) + uColorGlow * internalGlow * 0.4;
    float alpha = clamp(fresnel * 0.9 + 0.25, 0.0, 0.95);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;
