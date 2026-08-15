import * as THREE from "three";
import gsap from "gsap";
import { SurfaceWorld } from "./environments/SurfaceWorld";
import { ReefWorld } from "./environments/ReefWorld";
import { OpenOceanWorld } from "./environments/OpenOceanWorld";
import { TwilightWorld } from "./environments/TwilightWorld";
import { AbyssTrenchWorld } from "./environments/AbyssTrenchWorld";
import { OceanFloorWorld } from "./environments/OceanFloorWorld";

export class OceanWorldEngine {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;

  private surfaceWorld: SurfaceWorld;
  private reefWorld: ReefWorld;
  private openOceanWorld: OpenOceanWorld;
  private twilightWorld: TwilightWorld;
  private abyssTrenchWorld: AbyssTrenchWorld;
  private oceanFloorWorld: OceanFloorWorld;

  private cameraSpotlight: THREE.SpotLight;
  private ambientLight: THREE.AmbientLight;
  private fog: THREE.FogExp2;

  private isRunning = false;
  private animFrameId = 0;
  private clock = new THREE.Clock();

  public targetScrollProgress = 0;
  public currentScrollProgress = 0;
  public mouse = { x: 0, y: 0, nx: 0, ny: 0 };
  public isDiving = false;

  constructor(canvas: HTMLCanvasElement) {
    // 1. Scene
    this.scene = new THREE.Scene();
    this.fog = new THREE.FogExp2(0x60c0ff, 0.007);
    this.scene.fog = this.fog;
    this.scene.background = new THREE.Color(0x60c0ff);

    // 2. Camera
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 800);
    this.camera.position.set(0, 10, 24); // Starting above surface

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
      alpha: false,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    // 4. Lighting
    this.ambientLight = new THREE.AmbientLight(0x004466, 1.2);
    this.scene.add(this.ambientLight);

    // Submarine Camera Searchlight
    this.cameraSpotlight = new THREE.SpotLight(0xa0ecff, 3.5, 120, Math.PI / 4, 0.6, 1.5);
    this.cameraSpotlight.position.set(0, 0, 0);
    this.camera.add(this.cameraSpotlight);
    this.cameraSpotlight.target.position.set(0, 0, -20);
    this.camera.add(this.cameraSpotlight.target);
    this.scene.add(this.camera);

    // 5. Instantiate all 6 Continuous 3D Worlds
    this.surfaceWorld = new SurfaceWorld();
    this.scene.add(this.surfaceWorld.group);

    this.reefWorld = new ReefWorld();
    this.scene.add(this.reefWorld.group);

    this.openOceanWorld = new OpenOceanWorld();
    this.scene.add(this.openOceanWorld.group);

    this.twilightWorld = new TwilightWorld();
    this.scene.add(this.twilightWorld.group);

    this.abyssTrenchWorld = new AbyssTrenchWorld();
    this.scene.add(this.abyssTrenchWorld.group);

    this.oceanFloorWorld = new OceanFloorWorld();
    this.scene.add(this.oceanFloorWorld.group);

    // Bind Resize
    this.onResize = this.onResize.bind(this);
    window.addEventListener("resize", this.onResize);
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.renderLoop();
  }

  public stop() {
    this.isRunning = false;
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
  }

  public onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public executeDive(onComplete?: () => void) {
    if (this.isDiving) return;
    this.isDiving = true;

    // Plunge camera through the water surface plane mesh
    const tl = gsap.timeline({
      onComplete: () => {
        this.isDiving = false;
        onComplete?.();
      },
    });

    // 1. Tilt down and accelerate into the water plane
    tl.to(this.camera.position, {
      y: -35,
      z: 18,
      duration: 2.2,
      ease: "power3.inOut",
    });

    tl.to(
      this.camera.rotation,
      {
        x: -0.15,
        duration: 2.2,
        ease: "power3.inOut",
      },
      0
    );
  }

  private renderLoop = () => {
    if (!this.isRunning) return;
    const time = this.clock.getElapsedTime();

    // 1. Smooth Scroll Interpolation (Camera Vertical Trajectory: Y = +10 -> -570)
    this.currentScrollProgress += (this.targetScrollProgress - this.currentScrollProgress) * 0.08;
    const targetY = 10 - this.currentScrollProgress * 580;

    if (!this.isDiving) {
      // Natural floating sine wave + mouse parallax
      const floatY = Math.sin(time * 0.8) * 0.8;
      const floatX = Math.cos(time * 0.6) * 0.6;
      this.camera.position.y = targetY + floatY;
      this.camera.position.x += ((this.mouse.nx * 6 + floatX) - this.camera.position.x) * 0.05;
      this.camera.position.z = 24 + (this.mouse.ny * 3);

      // Camera tilt reaction
      this.camera.rotation.y = -this.mouse.nx * 0.08;
      this.camera.rotation.x = -this.mouse.ny * 0.06;
    }

    // 2. Dynamic Depth Atmosphere & Fog Attenuation
    this.updateAtmosphere(this.currentScrollProgress);

    // 3. Update Individual Worlds
    this.surfaceWorld.update(time, this.camera);
    this.reefWorld.update(time);
    this.openOceanWorld.update(time);
    this.twilightWorld.update(time);
    this.abyssTrenchWorld.update(time, this.camera.position);
    this.oceanFloorWorld.update(time);

    // 4. Render Scene
    this.renderer.render(this.scene, this.camera);
    this.animFrameId = requestAnimationFrame(this.renderLoop);
  };

  private updateAtmosphere(p: number) {
    const keyframes = [
      { p: 0.0,  fogColor: 0x60c0ff, fogDensity: 0.007, ambientColor: 0x0077aa, ambientInt: 1.6, spotInt: 0.2 },
      { p: 0.25, fogColor: 0x04182a, fogDensity: 0.016, ambientColor: 0x003b55, ambientInt: 1.0, spotInt: 1.5 },
      { p: 0.45, fogColor: 0x010c1c, fogDensity: 0.014, ambientColor: 0x001a33, ambientInt: 0.7, spotInt: 2.5 },
      { p: 0.65, fogColor: 0x00060f, fogDensity: 0.018, ambientColor: 0x000c1a, ambientInt: 0.3, spotInt: 3.0 },
      { p: 0.85, fogColor: 0x000206, fogDensity: 0.022, ambientColor: 0x00040a, ambientInt: 0.15, spotInt: 4.0 },
      { p: 1.0,  fogColor: 0x000104, fogDensity: 0.020, ambientColor: 0x000206, ambientInt: 0.12, spotInt: 4.0 }
    ];

    let startIndex = 0;
    for (let i = 0; i < keyframes.length - 1; i++) {
      if (p >= keyframes[i].p && p <= keyframes[i+1].p) {
        startIndex = i;
        break;
      }
    }

    const k0 = keyframes[startIndex];
    const k1 = keyframes[startIndex + 1];
    const t = (p - k0.p) / (k1.p - k0.p);

    this.fog.density = k0.fogDensity + t * (k1.fogDensity - k0.fogDensity);
    this.ambientLight.intensity = k0.ambientInt + t * (k1.ambientInt - k0.ambientInt);
    this.cameraSpotlight.intensity = k0.spotInt + t * (k1.spotInt - k0.spotInt);

    const cFog0 = new THREE.Color(k0.fogColor);
    const cFog1 = new THREE.Color(k1.fogColor);
    this.fog.color.copy(cFog0).lerp(cFog1, t);
    if (this.scene.background instanceof THREE.Color) {
      this.scene.background.copy(this.fog.color);
    }

    const cAmb0 = new THREE.Color(k0.ambientColor);
    const cAmb1 = new THREE.Color(k1.ambientColor);
    this.ambientLight.color.copy(cAmb0).lerp(cAmb1, t);
  }

  public destroy() {
    this.stop();
    window.removeEventListener("resize", this.onResize);
    this.renderer.dispose();
  }
}
