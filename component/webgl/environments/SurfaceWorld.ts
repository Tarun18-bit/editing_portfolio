import * as THREE from "three";
import { waterSurfaceVertexShader, waterSurfaceFragmentShader } from "../shaders/waterSurfaceShader";

export class SurfaceWorld {
  public group = new THREE.Group();
  private waterMaterial: THREE.ShaderMaterial;
  private skyMesh: THREE.Mesh;
  private skyMaterial: THREE.ShaderMaterial;

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
      wireframe: false,
    });

    const waterMesh = new THREE.Mesh(waterGeo, this.waterMaterial);
    waterMesh.position.set(0, 0, 0);
    this.group.add(waterMesh);

    // 2. Horizon Upper Atmosphere Sky Dome (Upper Hemisphere only)
    const skyGeo = new THREE.SphereGeometry(140, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    this.skyMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColorTop;
        uniform vec3 uColorBottom;
        uniform float uOpacity;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition).y;
          float factor = clamp(h, 0.0, 1.0);
          factor = pow(factor, 0.8);
          vec3 finalColor = mix(uColorBottom, uColorTop, factor);
          gl_FragColor = vec4(finalColor, uOpacity);
        }
      `,
      uniforms: {
        uColorTop: { value: new THREE.Color(0x010c1e) },    // Deep zenith sky
        uColorBottom: { value: new THREE.Color(0x60b0d0) }, // Brighter horizon
        uOpacity: { value: 1.0 },
      },
      transparent: true,
      side: THREE.BackSide,
      depthWrite: false,
    }) as any;

    this.skyMesh = new THREE.Mesh(skyGeo, this.skyMaterial as any);
    this.skyMesh.position.set(0, 0, 0);
    this.group.add(this.skyMesh);

    // 3. Sun Source Light
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
    sunLight.position.set(40, 80, 40);
    this.group.add(sunLight);
  }

  public update(time: number, camera: THREE.Camera) {
    this.waterMaterial.uniforms.uTime.value = time;
    this.waterMaterial.uniforms.uCameraPosition.value.copy(camera.position);

    // Fade sky dome when diving underwater
    const uniforms = (this.skyMaterial as any).uniforms;
    if (camera.position.y < 0) {
      const underwaterFade = Math.max(0, 1.0 + camera.position.y * 0.05);
      if (uniforms) uniforms.uOpacity.value = underwaterFade;
      this.skyMesh.visible = underwaterFade > 0.01;
    } else {
      if (uniforms) uniforms.uOpacity.value = 1.0;
      this.skyMesh.visible = true;
    }
  }
}
