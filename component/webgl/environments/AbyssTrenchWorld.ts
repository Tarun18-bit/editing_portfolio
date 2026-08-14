import * as THREE from "three";
import { trenchCliffVertexShader, trenchCliffFragmentShader } from "../shaders/trenchCliffShader";

export class AbyssTrenchWorld {
  public group = new THREE.Group();
  private leftWallMat!: THREE.ShaderMaterial;
  private rightWallMat!: THREE.ShaderMaterial;
  private monolithMesh!: THREE.Mesh;

  constructor() {
    this.group.position.set(0, -450, 0);

    // 1. Towering 3D Canyon Cliff Walls (Left & Right)
    this.createCanyonWalls();

    // 2. Giant Submerged Basalt Monolith
    this.createMonolith();
  }

  private createCanyonWalls() {
    const wallGeo = new THREE.PlaneGeometry(60, 140, 32, 64);
    const pos = wallGeo.attributes.position;

    // Displace vertices to form jagged cliff crevices and rocky ledges
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = Math.sin(y * 0.15) * 6.0 + Math.cos(x * 0.2) * 4.0 + (Math.sin(y * 0.6) * 1.5);
      pos.setZ(i, z);
    }
    wallGeo.computeVertexNormals();

    const shaderParams = {
      vertexShader: trenchCliffVertexShader,
      fragmentShader: trenchCliffFragmentShader,
      uniforms: {
        uSearchlightPosition: { value: new THREE.Vector3(0, 0, 0) },
        uSearchlightDirection: { value: new THREE.Vector3(0, 0, -1) },
        uSearchlightCone: { value: 0.82 },
        uBaseColor: { value: new THREE.Color(0x0a1018) },
        uLightColor: { value: new THREE.Color(0x90e0ef) },
      },
    };

    // Left Cliff Wall
    this.leftWallMat = new THREE.ShaderMaterial({ ...shaderParams });
    const leftWall = new THREE.Mesh(wallGeo, this.leftWallMat);
    leftWall.position.set(-28, 0, -10);
    leftWall.rotation.y = Math.PI / 2.6;
    this.group.add(leftWall);

    // Right Cliff Wall
    this.rightWallMat = new THREE.ShaderMaterial({ ...shaderParams });
    const rightWall = new THREE.Mesh(wallGeo, this.rightWallMat);
    rightWall.position.set(28, 0, -10);
    rightWall.rotation.y = -Math.PI / 2.6;
    this.group.add(rightWall);
  }

  private createMonolith() {
    // Massive Submerged Monolith Slab
    const monoGeo = new THREE.BoxGeometry(16, 42, 6);
    const monoMat = new THREE.MeshStandardMaterial({
      color: 0x050c14,
      roughness: 0.9,
      metalness: 0.2,
    });

    this.monolithMesh = new THREE.Mesh(monoGeo, monoMat);
    this.monolithMesh.position.set(0, 0, -25);
    this.group.add(this.monolithMesh);

    // Subtle Monolith Glowing Core Inlay
    const coreGeo = new THREE.PlaneGeometry(10, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x00d2ff,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.set(0, 0, -21.9);
    this.group.add(core);
  }

  public update(time: number, cameraPos: THREE.Vector3) {
    if (this.leftWallMat && this.rightWallMat) {
      this.leftWallMat.uniforms.uSearchlightPosition.value.copy(cameraPos);
      this.rightWallMat.uniforms.uSearchlightPosition.value.copy(cameraPos);
    }
  }
}
