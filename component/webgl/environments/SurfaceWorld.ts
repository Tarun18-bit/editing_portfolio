import * as THREE from "three";
import { waterSurfaceVertexShader, waterSurfaceFragmentShader } from "../shaders/waterSurfaceShader";

// ─── Sky Gradient Shader ────────────────────────────────────────────────────
// Recreates the exact look the user loved: bright near-white sun at the top
// fading through pale blue → sky blue → deep navy at the horizon.
// Matches the CSS: radial-gradient(ellipse at 50% 24%,
//   rgba(255,255,255,0.96) 0%, rgba(184,232,255,0.78) 12%,
//   rgba(94,188,255,0.5) 24%, rgba(22,120,190,0.8) 42%,
//   rgba(7,64,112,0.96) 62%, rgba(3,25,43,1) 100%)

const skyVertexShader = /* glsl */ `
  varying vec3 vWorldPos;
  void main() {
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const skyFragmentShader = /* glsl */ `
  varying vec3 vWorldPos;
  uniform float uOpacity;

  void main() {
    // t = 0 at equator, 1 at zenith
    float t = clamp(vWorldPos.y / 140.0, 0.0, 1.0);

    // Gradient stops (matching the CSS radial gradient)
    vec3 colVoid      = vec3(0.012, 0.098, 0.169); // rgba(3,25,43)     - horizon base
    vec3 colDeepNavy  = vec3(0.027, 0.251, 0.439); // rgba(7,64,112)    - deep navy
    vec3 colMidBlue   = vec3(0.086, 0.471, 0.745); // rgba(22,120,190)  - mid blue
    vec3 colSkyBlue   = vec3(0.369, 0.737, 1.000); // rgba(94,188,255)  - sky blue
    vec3 colPaleBlue  = vec3(0.722, 0.910, 1.000); // rgba(184,232,255) - pale blue
    vec3 colWhite     = vec3(0.980, 0.992, 1.000); // rgba(250,253,255) - near-white sun

    vec3 col;
    if (t < 0.15) {
      col = mix(colVoid, colDeepNavy, t / 0.15);
    } else if (t < 0.38) {
      col = mix(colDeepNavy, colMidBlue, (t - 0.15) / 0.23);
    } else if (t < 0.58) {
      col = mix(colMidBlue, colSkyBlue, (t - 0.38) / 0.20);
    } else if (t < 0.78) {
      col = mix(colSkyBlue, colPaleBlue, (t - 0.58) / 0.20);
    } else {
      col = mix(colPaleBlue, colWhite, (t - 0.78) / 0.22);
    }

    gl_FragColor = vec4(col, uOpacity);
  }
`;
// ────────────────────────────────────────────────────────────────────────────

export class SurfaceWorld {
  public group = new THREE.Group();
  private waterMaterial: THREE.ShaderMaterial;
  private skyMaterial: THREE.ShaderMaterial;
  private skyMesh: THREE.Mesh;

  constructor() {
    this.group.position.set(0, 0, 0);

    // 1. Animated Gerstner 3D Water Surface Plane
    const waterGeo = new THREE.PlaneGeometry(180, 180, 128, 128);
    waterGeo.rotateX(-Math.PI / 2);

    this.waterMaterial = new THREE.ShaderMaterial({
      vertexShader: waterSurfaceVertexShader,
      fragmentShader: waterSurfaceFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSunDirection: { value: new THREE.Vector3(0.5, 0.8, 0.3).normalize() },
        uWaterColorDeep: { value: new THREE.Color(0x02162e) },
        uWaterColorShallow: { value: new THREE.Color(0x00b4d8) },
        uSunColor: { value: new THREE.Color(0xffffff) },
        uCameraPosition: { value: new THREE.Vector3() },
      },
      transparent: true,
      side: THREE.DoubleSide,
    });

    const waterMesh = new THREE.Mesh(waterGeo, this.waterMaterial);
    waterMesh.position.set(0, 0, 0);
    this.group.add(waterMesh);

    // 2. Gradient Sky Dome — upper hemisphere only
    const skyGeo = new THREE.SphereGeometry(140, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    this.skyMaterial = new THREE.ShaderMaterial({
      vertexShader: skyVertexShader,
      fragmentShader: skyFragmentShader,
      uniforms: {
        uOpacity: { value: 1.0 },
      },
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
      fog: false,
    });
    this.skyMesh = new THREE.Mesh(skyGeo, this.skyMaterial);
    this.skyMesh.position.set(0, 0, 0);
    this.group.add(this.skyMesh);

    // 3. Sun Light Source
    const sunLight = new THREE.DirectionalLight(0xffeedd, 2.4);
    sunLight.position.set(40, 80, 40);
    this.group.add(sunLight);
  }

  public update(time: number, camera: THREE.Camera) {
    this.waterMaterial.uniforms.uTime.value = time;
    this.waterMaterial.uniforms.uCameraPosition.value.copy(camera.position);

    // Fade sky dome when diving underwater
    if (camera.position.y < 0) {
      const fade = Math.max(0, 1.0 + camera.position.y * 0.06);
      this.skyMaterial.uniforms.uOpacity.value = fade;
      this.skyMesh.visible = fade > 0.01;
    } else {
      this.skyMaterial.uniforms.uOpacity.value = 1.0;
      this.skyMesh.visible = true;
    }
  }
}
