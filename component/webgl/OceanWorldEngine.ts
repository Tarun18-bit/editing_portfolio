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
    this.fog = new THREE.FogExp2(0x021024, 0.015);
    this.scene.fog = this.fog;
    this.scene.background = new THREE.Color(0x021024);

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
    if (p < 0.15) {
      // Surface & Shallows
      const color = 0x0a2239;
      this.fog.color.setHex(color);
      if (this.scene.background instanceof THREE.Color) this.scene.background.setHex(color);
      this.fog.density = 0.012;
      this.ambientLight.color.setHex(0x005577);
      this.ambientLight.intensity = 1.4;
      this.cameraSpotlight.intensity = 0.5;
    } else if (p < 0.35) {
      // Coral Reef
      const color = 0x04182a;
      this.fog.color.setHex(color);
      if (this.scene.background instanceof THREE.Color) this.scene.background.setHex(color);
      this.fog.density = 0.016;
      this.ambientLight.color.setHex(0x003b55);
      this.ambientLight.intensity = 1.0;
      this.cameraSpotlight.intensity = 1.5;
    } else if (p < 0.55) {
      // Open Ocean
      const color = 0x010c1c;
      this.fog.color.setHex(color);
      if (this.scene.background instanceof THREE.Color) this.scene.background.setHex(color);
      this.fog.density = 0.014;
      this.ambientLight.color.setHex(0x001a33);
      this.ambientLight.intensity = 0.7;
      this.cameraSpotlight.intensity = 2.5;
    } else if (p < 0.75) {
      // Twilight Zone
      const color = 0x00060f;
      this.fog.color.setHex(color);
      if (this.scene.background instanceof THREE.Color) this.scene.background.setHex(color);
      this.fog.density = 0.018;
      this.ambientLight.color.setHex(0x000c1a);
      this.ambientLight.intensity = 0.3;
      this.cameraSpotlight.intensity = 3.0;
    } else {
      // Abyssal Trench & Ocean Floor
      const color = 0x000206;
      this.fog.color.setHex(color);
      if (this.scene.background instanceof THREE.Color) this.scene.background.setHex(color);
      this.fog.density = 0.022;
      this.ambientLight.color.setHex(0x00040a);
      this.ambientLight.intensity = 0.15;
      this.cameraSpotlight.intensity = 4.0;
    }
  }

  public destroy() {
    this.stop();
    window.removeEventListener("resize", this.onResize);
    this.renderer.dispose();
  }
}
