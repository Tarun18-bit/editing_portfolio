import * as THREE from "three";

export class OpenOceanWorld {
  public group = new THREE.Group();
  private mantaRay!: THREE.Group;
  private wingVerticesOriginal!: Float32Array;
  private mantaGeo!: THREE.BufferGeometry;
  private particles!: THREE.Points;

  constructor() {
    this.group.position.set(0, -180, 0);

    // 1. Giant Gliding 3D Manta Ray
    this.createMantaRay();

    // 2. Deep Open Ocean Marine Particulates
    this.createMarineParticles();
  }

  private createMantaRay() {
    this.mantaRay = new THREE.Group();

    // Procedural Manta Ray Wing Shape Geometry
    const shape = new THREE.Shape();
    shape.moveTo(0, 8);
    shape.bezierCurveTo(12, 6, 26, -4, 32, -8);
    shape.bezierCurveTo(24, -12, 10, -14, 0, -12);
    shape.bezierCurveTo(-10, -14, -24, -12, -32, -8);
    shape.bezierCurveTo(-26, -4, -12, 6, 0, 8);

    const extrudeSettings = {
      depth: 1.8,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 8,
      bevelSize: 0.8,
      bevelThickness: 0.8,
    };

    this.mantaGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    this.mantaGeo.rotateX(Math.PI / 2);
    this.mantaGeo.center();

    const pos = this.mantaGeo.attributes.position;
    this.wingVerticesOriginal = new Float32Array(pos.array);

    const mantaMat = new THREE.MeshStandardMaterial({
      color: 0x051a2e,
      roughness: 0.8,
      metalness: 0.2,
      emissive: 0x002244,
      emissiveIntensity: 0.2,
    });

    const mantaMesh = new THREE.Mesh(this.mantaGeo, mantaMat);
    this.mantaRay.add(mantaMesh);

    // Long Whip Tail
    const tailGeo = new THREE.CylinderGeometry(0.15, 0.6, 28, 8);
    tailGeo.rotateX(Math.PI / 2);
    tailGeo.translate(0, 0, -16);
    const tailMesh = new THREE.Mesh(tailGeo, mantaMat);
    this.mantaRay.add(tailMesh);

    // Position Manta Ray in deep background space
    this.mantaRay.position.set(-60, 10, -65);
    this.mantaRay.scale.set(1.4, 1.4, 1.4);
    this.group.add(this.mantaRay);
  }

  private createMarineParticles() {
    const count = 300;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 140;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 140;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0x70c0ff,
      size: 0.8,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });

    this.particles = new THREE.Points(geo, mat);
    this.group.add(this.particles);
  }

  public update(time: number) {
    if (this.mantaRay && this.mantaGeo) {
      this.mantaRay.position.x += 0.08;
      this.mantaRay.position.y = 10 + Math.sin(time * 0.4) * 3.0;

      if (this.mantaRay.position.x > 80) {
        this.mantaRay.position.x = -80;
      }

      this.mantaRay.rotation.z = Math.sin(time * 0.4) * 0.08;
      this.mantaRay.rotation.x = -Math.PI / 18 + Math.cos(time * 0.4) * 0.04;

      const pos = this.mantaGeo.attributes.position;
      const orig = this.wingVerticesOriginal;

      for (let i = 0; i < pos.count; i++) {
        const ox = orig[i * 3 + 0];
        const oy = orig[i * 3 + 1];
        const oz = orig[i * 3 + 2];

        const distFromCenter = Math.abs(ox) / 32.0;
        const flap = Math.sin(time * 1.8 - distFromCenter * 2.0) * distFromCenter * distFromCenter * 3.2;

        pos.setXYZ(i, ox, oy + flap, oz);
      }
      pos.needsUpdate = true;
    }

    if (this.particles) {
      this.particles.rotation.y = time * 0.02;
    }
  }
}
