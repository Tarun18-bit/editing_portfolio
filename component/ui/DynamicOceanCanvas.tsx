"use client";

import React, { useEffect, useRef } from "react";
import { useWorld } from "@/component/worlds/WorldProvider";
import { WorldTheme, getCurrentWorld } from "@/component/worlds/worldConfig";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  pulseSpeed: number;
  pulsePhase: number;
}

interface Creature {
  x: number;
  y: number;
  vx: number;
  vy: number;
  scale: number;
  type: "reef_fish" | "manta_ray" | "jellyfish" | "whale";
  phase: number;
}

export default function DynamicOceanCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { scrollProgressRef, mouseRef } = useWorld();

  const particlesRef = useRef<Particle[]>([]);
  const creaturesRef = useRef<Creature[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animFrameId: number;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
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
      const count = 90; // Optimized count for silky 60 FPS
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -0.2 - Math.random() * 0.4,
          size: 1.2 + Math.random() * 2.5,
          alpha: 0.3 + Math.random() * 0.6,
          pulseSpeed: 0.02 + Math.random() * 0.03,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
      particlesRef.current = particles;
    };

    const initCreatures = () => {
      const creatures: Creature[] = [];
      // Reef Fish
      for (let i = 0; i < 10; i++) {
        creatures.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.5,
          vx: 0.9 + Math.random() * 0.8,
          vy: (Math.random() - 0.5) * 0.2,
          scale: 0.7 + Math.random() * 0.3,
          type: "reef_fish",
          phase: Math.random() * Math.PI * 2,
        });
      }

      // Manta Ray
      creatures.push({
        x: -200,
        y: height * 0.4,
        vx: 0.4,
        vy: 0.05,
        scale: 1.6,
        type: "manta_ray",
        phase: 0,
      });

      // Jellyfish
      for (let i = 0; i < 4; i++) {
        creatures.push({
          x: (0.2 + i * 0.2) * width,
          y: height * (0.5 + Math.random() * 0.3),
          vx: 0,
          vy: -0.35,
          scale: 1.0,
          type: "jellyfish",
          phase: Math.random() * Math.PI * 2,
        });
      }

      // Whale
      creatures.push({
        x: width + 400,
        y: height * 0.6,
        vx: -0.25,
        vy: 0,
        scale: 2.8,
        type: "whale",
        phase: 0,
      });

      creaturesRef.current = creatures;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      const p = scrollProgressRef.current || 0;
      const m = mouseRef.current || { x: 0, y: 0, nx: 0, ny: 0 };
      const world = getCurrentWorld(p);

      // 1. Volumetric Light Rays (Shallow & Reef)
      if (world.environment.lightType === "sunlight" || world.environment.lightType === "caustics") {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        const isSun = world.environment.lightType === "sunlight";
        const opacity = isSun ? 0.25 : 0.15;

        for (let i = 0; i < 4; i++) {
          const originX = width * (0.2 + i * 0.2) + m.nx * 25;
          const rayW = 80 + i * 20;

          ctx.beginPath();
          ctx.moveTo(originX - rayW / 2, 0);
          ctx.lineTo(originX + rayW / 2, 0);
          ctx.lineTo(originX + rayW * 2 + m.nx * 60, height * 0.85);
          ctx.lineTo(originX - rayW + m.nx * 60, height * 0.85);
          ctx.closePath();

          ctx.fillStyle = isSun
            ? `rgba(180, 240, 255, ${opacity})`
            : `rgba(0, 200, 255, ${opacity})`;
          ctx.fill();
        }
        ctx.restore();
      }

      // 2. Optimized Particle Dynamics
      const particles = particlesRef.current;
      const { type, color, speed } = world.particles;

      ctx.fillStyle = color;

      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];

        // Particle Movement
        if (type === "bubbles") {
          pt.y -= speed * 0.9;
          pt.x += Math.sin(time + pt.pulsePhase) * 0.3;
          if (pt.y < -10) {
            pt.y = height + 10;
            pt.x = Math.random() * width;
          }
        } else if (type === "snow") {
          pt.y += speed * 0.7;
          pt.x += Math.cos(time * 0.8 + pt.pulsePhase) * 0.3;
          if (pt.y > height + 10) pt.y = -10;
        } else {
          pt.x += Math.sin(time * 0.5 + pt.pulsePhase) * 0.25;
          pt.y += Math.cos(time * 0.4 + pt.pulsePhase) * 0.25;
        }

        // Draw particle without expensive shadowBlur
        ctx.globalAlpha = Math.max(0.1, pt.alpha * (0.7 + Math.sin(time * 2 + pt.pulsePhase) * 0.3));
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Optimized Creatures (Fast path, no shadowBlur)
      const creatures = creaturesRef.current;
      ctx.globalAlpha = 1;

      for (let i = 0; i < creatures.length; i++) {
        const c = creatures[i];

        if (c.type === "reef_fish" && p >= 0.1 && p <= 0.4) {
          c.x += c.vx;
          c.y += Math.sin(time * 2 + c.phase) * 0.4;
          if (c.x > width + 50) c.x = -50;

          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.scale(c.scale, c.scale);
          ctx.fillStyle = "rgba(0, 220, 255, 0.7)";
          ctx.beginPath();
          ctx.ellipse(0, 0, 10, 4, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

        } else if (c.type === "manta_ray" && p >= 0.3 && p <= 0.6) {
          c.x += c.vx;
          if (c.x > width + 250) c.x = -250;

          const wing = Math.sin(time * 1.5) * 6;
          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.scale(c.scale, c.scale);
          ctx.fillStyle = "rgba(2, 20, 45, 0.6)";

          ctx.beginPath();
          ctx.moveTo(30, 0);
          ctx.quadraticCurveTo(0, -40 + wing, -30, -8);
          ctx.quadraticCurveTo(-45, 0, -60, 0);
          ctx.quadraticCurveTo(-45, 0, -30, 8);
          ctx.quadraticCurveTo(0, 40 - wing, 30, 0);
          ctx.fill();
          ctx.restore();

        } else if (c.type === "jellyfish" && p >= 0.5 && p <= 0.8) {
          c.y += c.vy;
          if (c.y < -80) c.y = height + 80;

          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.fillStyle = "rgba(0, 225, 255, 0.45)";
          ctx.beginPath();
          ctx.arc(0, 0, 18, Math.PI, 0, false);
          ctx.fill();
          ctx.restore();

        } else if (c.type === "whale" && p >= 0.7 && p <= 0.95) {
          c.x += c.vx;
          if (c.x < -500) c.x = width + 500;

          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.scale(c.scale, c.scale);
          ctx.fillStyle = "rgba(1, 8, 20, 0.8)";
          ctx.beginPath();
          ctx.ellipse(0, 0, 140, 35, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animFrameId);
    };
  }, [scrollProgressRef, mouseRef]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-10 opacity-90"
    />
  );
}
