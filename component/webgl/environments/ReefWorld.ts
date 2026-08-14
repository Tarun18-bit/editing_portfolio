import * as THREE from "three";
import { volumetricRayVertexShader, volumetricRayFragmentShader } from "../shaders/volumetricRayShader";

export class ReefWorld {
  public group = new THREE.Group();
  private rayMaterials: THREE.ShaderMaterial[] = [];
  private fishMesh!: THREE.InstancedMesh;
  private fishCount = 60;
  private fishData: Array<{ pos: THREE.Vector3; speed: number; radius: number; angle: number; yOffset: number }> = [];

  constructor() {
    this.group.position.set(0, -70, 0);

    // 1. Procedural 3D Coral Formations
    this.createCoralReef();

    // 2. Volumetric God Ray Light Cones
    this.createGodRays();

    // 3. Instanced Swimming 3D Fish School
    this.createFishSchool();
  }

  private createCoralReef() {
    // Coral Base Mound
    const moundGeo = new THREE.DodecahedronGeometry(18, 2);
    const pos = moundGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(pos, i);
      v.multiplyScalar(1.0 + (Math.sin(v.x * 0.5) * Math.cos(v.z * 0.5)) * 0.2);
      pos.setXYZ(i, v.x, v.y * 0.6, v.z);
    }
    moundGeo.computeVertexNormals();

    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x1b3b4b,
      roughness: 0.85,
      metalness: 0.1,
    });

    const leftMound = new THREE.Mesh(moundGeo, rockMat);
    leftMound.position.set(-25, -20, -15);
    leftMound.scale.set(1.5, 1.2, 1.5);
    this.group.add(leftMound);

    const rightMound = new THREE.Mesh(moundGeo, rockMat);
    rightMound.position.set(28, -22, -10);
    rightMound.scale.set(1.6, 1.3, 1.6);
    this.group.add(rightMound);

    // Coral Branches (Staghorn Coral)
    const branchMat = new THREE.MeshStandardMaterial({
      color: 0x00d4ff,
      roughness: 0.6,
      emissive: 0x004466,
      emissiveIntensity: 0.4,
    });

    const branchGeo = new THREE.CylinderGeometry(0.3, 0.9, 12, 8);
    for (let i = 0; i < 24; i++) {
      const branch = new THREE.Mesh(branchGeo, branchMat);
      const angle = (i / 24) * Math.PI * 2;
      const r = 8 + Math.random() * 8;
      branch.position.set(
        -25 + Math.cos(angle) * r,
        -14 + Math.random() * 6,
        -15 + Math.sin(angle) * r
      );
      branch.rotation.set(
        (Math.random() - 0.5) * 0.8,
        Math.random() * Math.PI,
        (Math.random() - 0.5) * 0.8
      );
      this.group.add(branch);
    }

    // Tube Sponges
    const spongeGeo = new THREE.CylinderGeometry(0.8, 1.2, 8, 12, 1, true);
    const spongeMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x002244,
      side: THREE.DoubleSide,
    });

    for (let i = 0; i < 12; i++) {
      const sponge = new THREE.Mesh(spongeGeo, spongeMat);
      sponge.position.set(
        22 + (Math.random() - 0.5) * 12,
        -18 + Math.random() * 4,
        -10 + (Math.random() - 0.5) * 12
      );
      sponge.rotation.set(
        (Math.random() - 0.5) * 0.4,
        0,
        (Math.random() - 0.5) * 0.4
      );
      this.group.add(sponge);
    }
  }

  private createGodRays() {
    const coneGeo = new THREE.CylinderGeometry(1, 16, 80, 16, 1, true);
    coneGeo.translate(0, -40, 0);

    for (let i = 0; i < 5; i++) {
      const mat = new THREE.ShaderMaterial({
        vertexShader: volumetricRayVertexShader,
        fragmentShader: volumetricRayFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(0x70e0ff) },
          uIntensity: { value: 0.35 },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      this.rayMaterials.push(mat);
      const rayMesh = new THREE.Mesh(coneGeo, mat);
      rayMesh.position.set(-20 + i * 12, 35, -10 + (i % 2) * 8);
      rayMesh.rotation.z = -0.15 + (i * 0.06);
      this.group.add(rayMesh);
    }
  }

  private createFishSchool() {
    const fishGeo = new THREE.ConeGeometry(0.4, 2.0, 6);
    fishGeo.rotateX(Math.PI / 2);

    const fishMat = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x0088aa,
      emissiveIntensity: 0.6,
      roughness: 0.3,
    });

    this.fishMesh = new THREE.InstancedMesh(fishGeo, fishMat, this.fishCount);

    const dummy = new THREE.Object3D();
    for (let i = 0; i < this.fishCount; i++) {
      const radius = 15 + Math.random() * 22;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.8 + Math.random() * 0.6;
      const yOffset = (Math.random() - 0.5) * 16;

      this.fishData.push({
        pos: new THREE.Vector3(),
        speed,
        radius,
        angle,
        yOffset,
      });

      dummy.position.set(Math.cos(angle) * radius, yOffset, Math.sin(angle) * radius);
      dummy.updateMatrix();
      this.fishMesh.setMatrixAt(i, dummy.matrix);
    }

    this.fishMesh.instanceMatrix.needsUpdate = true;
    this.group.add(this.fishMesh);
  }

  public update(time: number) {
    for (const mat of this.rayMaterials) {
      mat.uniforms.uTime.value = time;
    }

    if (this.fishMesh) {
      const dummy = new THREE.Object3D();
      for (let i = 0; i < this.fishCount; i++) {
        const f = this.fishData[i];
        f.angle += 0.012 * f.speed;

        const x = Math.cos(f.angle) * f.radius;
        const z = Math.sin(f.angle) * f.radius - 8;
        const y = f.yOffset + Math.sin(time * 2 + i) * 1.5;

        dummy.position.set(x, y, z);
        dummy.rotation.y = -f.angle + Math.PI / 2;
        dummy.rotation.z = Math.sin(time * 6 + i) * 0.15;
        dummy.updateMatrix();

        this.fishMesh.setMatrixAt(i, dummy.matrix);
      }
      this.fishMesh.instanceMatrix.needsUpdate = true;
    }
  }
}
