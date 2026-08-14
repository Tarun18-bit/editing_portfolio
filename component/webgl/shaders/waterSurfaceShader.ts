export const waterSurfaceVertexShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;

  // Gerstner Wave Formula
  vec3 gerstnerWave(vec4 wave, vec3 p, inout vec3 tangent, inout vec3 binormal) {
    float steepness = wave.z;
    float wavelength = wave.w;
    float k = 2.0 * 3.14159265 / wavelength;
    float c = sqrt(9.8 / k);
    vec2 d = normalize(wave.xy);
    float f = k * (dot(d, p.xz) - c * uTime * 0.6);
    float a = steepness / k;

    tangent += vec3(
      -d.x * d.x * (steepness * sin(f)),
      d.x * (steepness * cos(f)),
      -d.x * d.y * (steepness * sin(f))
    );
    binormal += vec3(
      -d.x * d.y * (steepness * sin(f)),
      d.y * (steepness * cos(f)),
      -d.y * d.y * (steepness * sin(f))
    );

    return vec3(
      d.x * (a * cos(f)),
      a * sin(f),
      d.y * (a * cos(f))
    );
  }

  void main() {
    vUv = uv;
    vec3 gridPoint = position;
    vec3 tangent = vec3(1.0, 0.0, 0.0);
    vec3 binormal = vec3(0.0, 0.0, 1.0);
    vec3 p = gridPoint;

    // Layer multiple wave harmonics
    p += gerstnerWave(vec4(1.0, 0.5, 0.18, 45.0), gridPoint, tangent, binormal);
    p += gerstnerWave(vec4(0.7, 0.9, 0.12, 22.0), gridPoint, tangent, binormal);
    p += gerstnerWave(vec4(-0.4, 0.8, 0.08, 12.0), gridPoint, tangent, binormal);
    p += gerstnerWave(vec4(0.2, -0.9, 0.05, 6.0), gridPoint, tangent, binormal);

    vNormal = normalize(cross(binormal, tangent));
    vWorldPosition = (modelMatrix * vec4(p, 1.0)).xyz;
    gl_Position = projectionMatrix * viewMatrix * vec4(vWorldPosition, 1.0);
  }
`;

export const waterSurfaceFragmentShader = /* glsl */ `
  uniform vec3 uSunDirection;
  uniform vec3 uWaterColorDeep;
  uniform vec3 uWaterColorShallow;
  uniform vec3 uSunColor;
  uniform vec3 uCameraPosition;
  uniform float uTime;

  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;

  void main() {
    vec3 viewDir = normalize(uCameraPosition - vWorldPosition);
    vec3 normal = normalize(vNormal);

    // Flip normal if viewing from underwater
    if (!gl_FrontFacing) {
      normal = -normal;
    }

    // Fresnel reflection factor (Schlick's approximation)
    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 4.0);

    // Specular sun highlight
    vec3 halfVector = normalize(uSunDirection + viewDir);
    float spec = pow(max(dot(normal, halfVector), 0.0), 256.0);
    vec3 specular = uSunColor * spec * 2.5;

    // Subsurface scatter depth tint
    float depthFactor = clamp((vWorldPosition.y + 2.0) / 4.0, 0.0, 1.0);
    vec3 waterColor = mix(uWaterColorDeep, uWaterColorShallow, depthFactor);

    // Combine sky reflection + water refraction + sun glint
    vec3 skyColor = vec3(0.7, 0.9, 1.0);
    vec3 finalColor = mix(waterColor, skyColor, fresnel * 0.75) + specular;

    // Subtle edge transparency
    gl_FragColor = vec4(finalColor, 0.88);
  }
`;
