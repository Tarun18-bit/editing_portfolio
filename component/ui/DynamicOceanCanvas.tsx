"use client";

import React, { useEffect, useRef } from "react";
import { useWorld } from "@/component/worlds/WorldProvider";
import { WORLDS, WorldTheme, getCurrentWorld } from "@/component/worlds/worldConfig";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  pulseSpeed: number;
  pulsePhase: number;
  color: string;
}

interface Creature {
  x: number;
  y: number;
  vx: number;
  vy: number;
  scale: number;
  angle: number;
  type: "reef_fish" | "manta_ray" | "jellyfish" | "whale" | "seabed_glow";
  phase: number;
}

export default function DynamicOceanCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { scrollProgress, mouse } = useWorld();

  const particlesRef = useRef<Particle[]>([]);
  const creaturesRef = useRef<Creature[]>([]);
  const animFrameRef = useRef<number>(0);
  const scrollRef = useRef<number>(0);
  const mouseRef = useRef(mouse);

  scrollRef.current = scrollProgress;
  mouseRef.current = mouse;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      initParticles();
      initCreatures();
    };

    const initParticles = () => {
      const particles: Particle[] = [];
      const count = 180;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -0.2 - Math.random() * 0.5,
          size: 1 + Math.random() * 3.5,
          alpha: 0.2 + Math.random() * 0.7,
          pulseSpeed: 0.02 + Math.random() * 0.04,
          pulsePhase: Math.random() * Math.PI * 2,
          color: "#ffffff",
        });
      }
      particlesRef.current = particles;
    };

    const initCreatures = () => {
      const creatures: Creature[] = [];
      // 1. Reef Fish
      for (let i = 0; i < 15; i++) {
        creatures.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.5,
          vx: 0.8 + Math.random() * 1.2,
          vy: (Math.random() - 0.5) * 0.3,
          scale: 0.6 + Math.random() * 0.4,
          angle: 0,
          type: "reef_fish",
          phase: Math.random() * Math.PI * 2,
        });
      }

      // 2. Manta Rays
      creatures.push({
        x: -200,
        y: height * 0.45,
        vx: 0.4,
        vy: 0.05,
        scale: 1.8,
        angle: 0,
        type: "manta_ray",
        phase: 0,
      });

      // 3. Jellyfish
      for (let i = 0; i < 6; i++) {
        creatures.push({
          x: (0.15 + i * 0.14) * width,
          y: height * (0.6 + Math.random() * 0.3),
          vx: (Math.random() - 0.5) * 0.1,
          vy: -0.3 - Math.random() * 0.2,
          scale: 1.0 + Math.random() * 0.5,
          angle: 0,
          type: "jellyfish",
          phase: Math.random() * Math.PI * 2,
        });
      }

      // 4. Whale Silhouette
      creatures.push({
        x: width + 400,
        y: height * 0.65,
        vx: -0.2,
        vy: -0.02,
        scale: 3.2,
        angle: 0,
        type: "whale",
        phase: 0,
      });

      creaturesRef.current = creatures;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // ── Main Render Loop ───────────────────────────────────────────────────────
    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      const p = scrollRef.current;
      const world = getCurrentWorld(p);
      const m = mouseRef.current;

      // ── 1. Volumetric Lighting & Caustics ────────────────────────────────────
      renderLighting(ctx, width, height, world, p, m, time);

      // ── 2. Particle Dynamics ────────────────────────────────────────────────
      renderParticles(ctx, width, height, world, m, time);

      // ── 3. Marine Creatures ─────────────────────────────────────────────────
      renderCreatures(ctx, width, height, world, p, m, time);

      animFrameRef.current = requestAnimationFrame(render);
    };

    const renderLighting = (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      world: WorldTheme,
      p: number,
      m: { nx: number; ny: number },
      t: number
    ) => {
      const type = world.environment.lightType;

      if (type === "sunlight" || type === "caustics") {
        const numRays = type === "sunlight" ? 7 : 5;
        const opacity = type === "sunlight" ? 0.35 : 0.22;
        ctx.save();
        ctx.globalCompositeOperation = "screen";

        for (let i = 0; i < numRays; i++) {
          const originX = w * (0.2 + i * 0.12 + Math.sin(t * 0.5 + i) * 0.04) + m.nx * 30;
          const rayWidth = 60 + i * 25;
          const grad = ctx.createLinearGradient(originX, 0, originX + m.nx * 100, h * 0.85);

          if (type === "sunlight") {
            grad.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
            grad.addColorStop(0.4, `rgba(180, 240, 255, ${opacity * 0.6})`);
            grad.addColorStop(1, "transparent");
          } else {
            grad.addColorStop(0, `rgba(120, 235, 255, ${opacity})`);
            grad.addColorStop(0.5, `rgba(0, 180, 240, ${opacity * 0.5})`);
            grad.addColorStop(1, "transparent");
          }

          ctx.beginPath();
          ctx.moveTo(originX - rayWidth / 2, 0);
          ctx.lineTo(originX + rayWidth / 2, 0);
          ctx.lineTo(originX + rayWidth * 2.5 + m.nx * 80, h * 0.85);
          ctx.lineTo(originX - rayWidth * 1.5 + m.nx * 80, h * 0.85);
          ctx.closePath();
          ctx.fillStyle = grad;
          ctx.fill();
        }
        ctx.restore();
      } else if (type === "twilight" || type === "abyssal") {
        // Bioluminescent radial light cones
        ctx.save();
        ctx.globalCompositeOperation = "screen";

        const mouseX = (m.nx * 0.5 + 0.5) * w;
        const mouseY = (m.ny * 0.5 + 0.5) * h;
        const radGrad = ctx.createRadialGradient(mouseX, mouseY, 10, mouseX, mouseY, 320);

        if (type === "twilight") {
          radGrad.addColorStop(0, "rgba(0, 229, 255, 0.25)");
          radGrad.addColorStop(0.5, "rgba(0, 120, 210, 0.08)");
          radGrad.addColorStop(1, "transparent");
        } else {
          radGrad.addColorStop(0, "rgba(100, 200, 255, 0.18)");
          radGrad.addColorStop(0.5, "rgba(10, 50, 100, 0.05)");
          radGrad.addColorStop(1, "transparent");
        }

        ctx.fillStyle = radGrad;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
      }
    };

    const renderParticles = (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      world: WorldTheme,
      m: { nx: number; ny: number },
      t: number
    ) => {
      const particles = particlesRef.current;
      const { type, color, speed } = world.particles;

      particles.forEach((pt) => {
        // Hydrodynamic mouse reaction
        const dx = pt.x - (m.nx * 0.5 + 0.5) * w;
        const dy = pt.y - (m.ny * 0.5 + 0.5) * h;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 180) {
          const force = (180 - dist) / 180;
          pt.x += (dx / dist) * force * 2.5;
          pt.y += (dy / dist) * force * 2.5;
        }

        // Particle Movement based on world
        if (type === "bubbles") {
          pt.y -= speed * (0.8 + Math.sin(t * 2 + pt.pulsePhase) * 0.3);
          pt.x += Math.sin(t + pt.pulsePhase) * 0.4;
          if (pt.y < -20) {
            pt.y = h + 20;
            pt.x = Math.random() * w;
          }
        } else if (type === "snow" || type === "hydrothermal") {
          pt.y += (type === "snow" ? 1 : -1) * speed * 0.8;
          pt.x += Math.cos(t * 0.8 + pt.pulsePhase) * 0.3;
          if (pt.y > h + 20) pt.y = -20;
          if (pt.y < -20) pt.y = h + 20;
        } else {
          // Plankton & Bioluminescent float
          pt.x += Math.sin(t * 0.5 + pt.pulsePhase) * 0.3;
          pt.y += Math.cos(t * 0.4 + pt.pulsePhase) * 0.3;
        }

        // Wrap around bounds
        if (pt.x < -20) pt.x = w + 20;
        if (pt.x > w + 20) pt.x = -20;

        // Render Particle
        const alpha = Math.max(0.1, pt.alpha * (0.7 + Math.sin(t * pt.pulseSpeed * 60 + pt.pulsePhase) * 0.3));

        ctx.save();
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);

        if (world.particles.glow) {
          ctx.shadowBlur = pt.size * 3;
          ctx.shadowColor = world.particles.color;
        }

        ctx.fillStyle = color.replace(/[\d\.]+\)$/, `${alpha})`);
        ctx.fill();
        ctx.restore();
      });
    };

    const renderCreatures = (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      world: WorldTheme,
      p: number,
      m: { nx: number; ny: number },
      t: number
    ) => {
      const creatures = creaturesRef.current;

      creatures.forEach((c) => {
        if (c.type === "reef_fish" && p >= 0.1 && p <= 0.4) {
          // Render Reef Fish School
          c.x += c.vx;
          c.y += Math.sin(t * 2 + c.phase) * 0.5;

          if (c.x > w + 60) {
            c.x = -60;
            c.y = Math.random() * h * 0.5;
          }

          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.scale(c.scale, c.scale);
          ctx.fillStyle = "rgba(0, 220, 255, 0.75)";

          // Fish shape
          ctx.beginPath();
          ctx.ellipse(0, 0, 12, 5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Tail fin
          ctx.beginPath();
          ctx.moveTo(-10, 0);
          ctx.lineTo(-18, -6 + Math.sin(t * 12 + c.phase) * 3);
          ctx.lineTo(-18, 6 + Math.sin(t * 12 + c.phase) * 3);
          ctx.closePath();
          ctx.fillStyle = "rgba(100, 240, 255, 0.85)";
          ctx.fill();
          ctx.restore();

        } else if (c.type === "manta_ray" && p >= 0.3 && p <= 0.6) {
          // Render Giant Manta Ray Silhouette
          c.x += c.vx;
          c.y += Math.sin(t * 0.6) * 0.4;

          if (c.x > w + 300) {
            c.x = -300;
          }

          const wingFlap = Math.sin(t * 1.5) * 8;

          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.scale(c.scale, c.scale);
          ctx.fillStyle = "rgba(2, 20, 45, 0.65)";
          ctx.shadowBlur = 20;
          ctx.shadowColor = "rgba(0, 160, 230, 0.4)";

          // Manta Ray Body & Wings
          ctx.beginPath();
          ctx.moveTo(40, 0);
          ctx.quadraticCurveTo(0, -50 + wingFlap, -40, -10);
          ctx.quadraticCurveTo(-60, 0, -80, 0); // Tail start
          ctx.quadraticCurveTo(-60, 0, -40, 10);
          ctx.quadraticCurveTo(0, 50 - wingFlap, 40, 0);
          ctx.fill();

          // Tail whip
          ctx.beginPath();
          ctx.moveTo(-80, 0);
          ctx.lineTo(-140, Math.sin(t * 2) * 6);
          ctx.strokeStyle = "rgba(2, 20, 45, 0.65)";
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.restore();

        } else if (c.type === "jellyfish" && p >= 0.5 && p <= 0.8) {
          // Render Bioluminescent Jellyfish
          c.y += c.vy;
          c.x += Math.sin(t + c.phase) * 0.6;

          if (c.y < -100) {
            c.y = h + 100;
            c.x = Math.random() * w;
          }

          const pulse = 1 + Math.sin(t * 2 + c.phase) * 0.15;

          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.scale(c.scale * pulse, c.scale / pulse);

          // Glowing Cap
          const capGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 24);
          capGrad.addColorStop(0, "rgba(0, 255, 230, 0.85)");
          capGrad.addColorStop(0.6, "rgba(0, 150, 240, 0.4)");
          capGrad.addColorStop(1, "transparent");

          ctx.beginPath();
          ctx.arc(0, 0, 24, Math.PI, 0, false);
          ctx.fillStyle = capGrad;
          ctx.shadowBlur = 18;
          ctx.shadowColor = "rgba(0, 225, 255, 0.9)";
          ctx.fill();

          // Tentacles
          for (let i = -3; i <= 3; i++) {
            ctx.beginPath();
            ctx.moveTo(i * 6, 0);
            ctx.quadraticCurveTo(
              i * 8 + Math.sin(t * 3 + i) * 6,
              25,
              i * 4 + Math.cos(t * 2 + i) * 8,
              50
            );
            ctx.strokeStyle = "rgba(140, 240, 255, 0.6)";
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }

          ctx.restore();

        } else if (c.type === "whale" && p >= 0.7 && p <= 0.95) {
          // Render Abyssal Leviathan Whale Silhouette
          c.x += c.vx;
          c.y += Math.sin(t * 0.4) * 0.2;

          if (c.x < -600) {
            c.x = w + 600;
          }

          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.scale(c.scale, c.scale);
          ctx.fillStyle = "rgba(1, 8, 20, 0.85)";
          ctx.shadowBlur = 40;
          ctx.shadowColor = "rgba(0, 100, 180, 0.3)";

          // Whale Body
          ctx.beginPath();
          ctx.ellipse(0, 0, 180, 45, 0, 0, Math.PI * 2);
          ctx.fill();

          // Tail
          ctx.beginPath();
          ctx.moveTo(160, 0);
          ctx.lineTo(230, -25 + Math.sin(t * 0.8) * 12);
          ctx.lineTo(230, 25 + Math.sin(t * 0.8) * 12);
          ctx.closePath();
          ctx.fill();

          ctx.restore();
        }
      });
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-10 opacity-90 transition-opacity duration-700"
    />
  );
}
