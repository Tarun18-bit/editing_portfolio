import * as THREE from "three";

export class OceanFloorWorld {
  public group = new THREE.Group();
  private ventParticles!: THREE.Points;
  private ventLight!: THREE.PointLight;

  constructor() {
    this.group.position.set(0, -570, 0);

    // 1. 3D Seabed Sand Terrain with Dunes
    this.createSeabedTerrain();

    // 2. Hydrothermal Vent Chimneys & Glowing Fissures
    this.createHydrothermalVents();
  }

  private createSeabedTerrain() {
    const floorGeo = new THREE.PlaneGeometry(140, 140, 64, 64);
    floorGeo.rotateX(-Math.PI / 2);

    const pos = floorGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = Math.sin(x * 0.08) * Math.cos(z * 0.08) * 3.5 + Math.sin(x * 0.3) * 0.8;
      pos.setY(i, y);
    }
    floorGeo.computeVertexNormals();

    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x050a12,
      roughness: 0.95,
      metalness: 0.05,
    });

    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.set(0, -10, 0);
    this.group.add(floorMesh);

    // Seabed Boulder Formations
    const rockGeo = new THREE.DodecahedronGeometry(4, 1);
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0x0a1420,
      roughness: 0.9,
    });

    for (let i = 0; i < 8; i++) {
      const rock = new THREE.Mesh(rockGeo, rockMat);
      const angle = (i / 8) * Math.PI * 2;
      const r = 20 + Math.random() * 25;
      rock.position.set(Math.cos(angle) * r, -8 + Math.random() * 2, Math.sin(angle) * r);
      rock.scale.set(1 + Math.random() * 1.5, 0.8 + Math.random(), 1 + Math.random());
      this.group.add(rock);
    }
  }

  private createHydrothermalVents() {
    const chimneyGeo = new THREE.CylinderGeometry(1.2, 3.5, 14, 12);
    chimneyGeo.translate(0, 7, 0);
    const chimneyMat = new THREE.MeshStandardMaterial({
      color: 0x030810,
      roughness: 0.95,
    });

    const chimney = new THREE.Mesh(chimneyGeo, chimneyMat);
    chimney.position.set(0, -10, -15);
    this.group.add(chimney);

    this.ventLight = new THREE.PointLight(0x00d2ff, 4.0, 35);
    this.ventLight.position.set(0, 5, -15);
    this.group.add(this.ventLight);

    const count = 120;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = Math.random() * 25;
      positions[i * 3 + 2] = -15 + (Math.random() - 0.5) * 4;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 1.8,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    this.ventParticles = new THREE.Points(geo, mat);
    this.ventParticles.position.set(0, -10, 0);
    this.group.add(this.ventParticles);
  }

  public update(time: number) {
    if (this.ventLight) {
      this.ventLight.intensity = 3.5 + Math.sin(time * 4) * 0.8;
    }

    if (this.ventParticles) {
      const pos = this.ventParticles.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let y = pos.getY(i) + 0.12;
        if (y > 28) y = 0;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }
  }
}
