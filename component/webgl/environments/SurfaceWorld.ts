import * as THREE from "three";
import { waterSurfaceVertexShader, waterSurfaceFragmentShader } from "../shaders/waterSurfaceShader";

export class SurfaceWorld {
  public group = new THREE.Group();
  private waterMaterial: THREE.ShaderMaterial;

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

    // 2. Sun Light Source
    const sunLight = new THREE.DirectionalLight(0xffeedd, 2.4);
    sunLight.position.set(40, 80, 40);
    this.group.add(sunLight);
  }

  public update(time: number, camera: THREE.Camera) {
    this.waterMaterial.uniforms.uTime.value = time;
    this.waterMaterial.uniforms.uCameraPosition.value.copy(camera.position);
  }
}
