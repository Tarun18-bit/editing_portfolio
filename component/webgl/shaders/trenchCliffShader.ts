export const trenchCliffVertexShader = /* glsl */ `
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * viewMatrix * vec4(vWorldPosition, 1.0);
  }
`;

export const trenchCliffFragmentShader = /* glsl */ `
  uniform vec3 uSearchlightPosition;
  uniform vec3 uSearchlightDirection;
  uniform float uSearchlightCone;
  uniform vec3 uBaseColor;
  uniform vec3 uLightColor;

  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying vec2 vUv;

  void main() {
    vec3 lightDir = normalize(vWorldPosition - uSearchlightPosition);
    vec3 normal = normalize(vNormal);

    // Distance attenuation
    float dist = length(vWorldPosition - uSearchlightPosition);
    float atten = 1.0 / (1.0 + 0.005 * dist + 0.00008 * dist * dist);

    // Spot cone angular falloff
    float spotEffect = dot(lightDir, normalize(uSearchlightDirection));
    float spotFactor = smoothstep(uSearchlightCone, uSearchlightCone + 0.15, spotEffect);

    // Diffuse shading
    float diff = max(dot(normal, -lightDir), 0.0);

    // Ambient deep abyssal light
    vec3 ambient = uBaseColor * 0.15;

    // Direct spotlight illumination
    vec3 diffuse = uLightColor * diff * spotFactor * atten * 4.5;

    // Rock striations / texture procedural noise
    float striations = sin(vWorldPosition.y * 0.4) * 0.15 + cos(vWorldPosition.x * 0.3) * 0.1;
    vec3 rockColor = uBaseColor + vec3(striations);

    gl_FragColor = vec4(rockColor * (ambient + diffuse), 1.0);
  }
`;
