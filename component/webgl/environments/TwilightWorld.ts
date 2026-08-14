import * as THREE from "three";
import { jellyfishVertexShader, jellyfishFragmentShader } from "../shaders/jellyfishShader";

export class TwilightWorld {
  public group = new THREE.Group();
  private jellyfishList: Array<{ group: THREE.Group; mat: THREE.ShaderMaterial; baseY: number; phase: number }> = [];
  private spores!: THREE.Points;

  constructor() {
    this.group.position.set(0, -310, 0);

    // 1. Procedural 3D Translucent Pulsing Jellyfish
    this.createJellyfishSwarm();

    // 2. Bioluminescent Spores / Floating Glowing Polyps
    this.createBioluminescentSpores();
  }

  private createJellyfishSwarm() {
    const jellyGeo = new THREE.SphereGeometry(3.5, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.55);

    const positions = [
      new THREE.Vector3(-18, 12, -15),
      new THREE.Vector3(16, -4, -20),
      new THREE.Vector3(-8, -16, -28),
      new THREE.Vector3(22, 18, -35),
      new THREE.Vector3(0, 0, -18),
    ];

    positions.forEach((pos, idx) => {
      const jellyGroup = new THREE.Group();
      jellyGroup.position.copy(pos);

      const mat = new THREE.ShaderMaterial({
        vertexShader: jellyfishVertexShader,
        fragmentShader: jellyfishFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uPulseSpeed: { value: 2.2 + idx * 0.3 },
          uColorInner: { value: new THREE.Color(0x003366) },
          uColorGlow: { value: new THREE.Color(idx % 2 === 0 ? 0x00ffff : 0x44ddff) },
        },
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const bellMesh = new THREE.Mesh(jellyGeo, mat);
      jellyGroup.add(bellMesh);

      // Trailing Tentacles
      const tentacleGeo = new THREE.CylinderGeometry(0.06, 0.02, 14, 6, 16);
      tentacleGeo.translate(0, -7, 0);
      const tentacleMat = new THREE.MeshBasicMaterial({
        color: 0x00e5ff,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });

      for (let t = 0; t < 8; t++) {
        const tentacle = new THREE.Mesh(tentacleGeo, tentacleMat);
        const angle = (t / 8) * Math.PI * 2;
        tentacle.position.set(Math.cos(angle) * 2.2, -0.5, Math.sin(angle) * 2.2);
        jellyGroup.add(tentacle);
      }

      // Point Light source attached to jellyfish body
      const light = new THREE.PointLight(0x00e5ff, 2.5, 30);
      light.position.set(0, 0, 0);
      jellyGroup.add(light);

      this.group.add(jellyGroup);
      this.jellyfishList.push({
        group: jellyGroup,
        mat,
        baseY: pos.y,
        phase: idx * 1.5,
      });
    });
  }

  private createBioluminescentSpores() {
    const count = 400;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

      colors[i * 3 + 0] = 0.0;
      colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
      colors[i * 3 + 2] = 1.0;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 1.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    this.spores = new THREE.Points(geo, mat);
    this.group.add(this.spores);
  }

  public update(time: number) {
    this.jellyfishList.forEach((j) => {
      j.mat.uniforms.uTime.value = time;
      j.group.position.y = j.baseY + Math.sin(time * 1.4 + j.phase) * 3.5;
      j.group.rotation.z = Math.sin(time * 0.8 + j.phase) * 0.08;
      j.group.rotation.x = Math.cos(time * 0.7 + j.phase) * 0.06;
    });

    if (this.spores) {
      this.spores.rotation.y = time * 0.03;
    }
  }
}
