"use client";

import { useEffect, useRef } from "react";
import { randomBetween } from "@/component/utils/math";

interface Particle {
  x: number;
  y: number;
  vx: number;         // velocity X for mouse impulse
  vy: number;         // velocity Y for mouse impulse
  size: number;
  opacity: number;
  speed: number;
  phase: number;
  frequency: number;
}

const PARTICLE_COUNT = 110;
const PARTICLE_COLOR = "210, 225, 255";

function initParticle(w: number, h: number, randomY = true): Particle {
  return {
    x: randomBetween(0, w),
    y: randomY ? randomBetween(0, h) : h + randomBetween(5, 25),
    vx: 0,
    vy: 0,
    size: randomBetween(0.4, 2.4),
    opacity: randomBetween(0.04, 0.40),
    speed: randomBetween(0.018, 0.18),
    phase: randomBetween(0, Math.PI * 2),
    frequency: randomBetween(0.0004, 0.0012),
  };
}

/**
 * ParticleCanvas — Interactive Volumetric Atmosphere.
 *
 * 110 motes of cold light floating in the dark void.
 * When the searchlight / cursor passes near motes, they experience a subtle
 * physical repulsion force, creating realistic fluid displacement.
 */
export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, px: -1000, py: -1000 });
  const rafRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);

      particles.current = Array.from({ length: PARTICLE_COUNT }, () =>
        initParticle(window.innerWidth, window.innerHeight, true)
      );
    };

    const onMove = (e: MouseEvent) => {
      mouseRef.current.px = mouseRef.current.x;
      mouseRef.current.py = mouseRef.current.y;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const draw = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      ctx.clearRect(0, 0, W, H);
      timeRef.current += 0.016;

      for (const p of particles.current) {
        // Distance to cursor
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 160;

        // Fluid repulsion force when searchlight passes
        if (dist < radius && dist > 0) {
          const force = (1 - dist / radius) * 0.45;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Apply velocities with damping (drag)
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.92;
        p.vy *= 0.92;

        // Upward ambient drift
        p.y -= p.speed;

        // Sinusoidal sway
        const sway = Math.sin(timeRef.current * p.frequency * 1000 + p.phase) * 0.35;
        p.x += sway;

        // Recycle top particles
        if (p.y < -6) {
          const fresh = initParticle(W, H, false);
          Object.assign(p, fresh);
        }

        // Edge fade
        const topFade = Math.min(1, (H - p.y) / 120);
        const bottomFade = Math.min(1, p.y / 120);
        const edgeFade = Math.min(topFade, bottomFade);

        ctx.globalAlpha = p.opacity * edgeFade;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${PARTICLE_COLOR}, 1)`;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("mousemove", onMove, { passive: true });

    const observer = new ResizeObserver(resize);
    observer.observe(document.documentElement);

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[2]"
      aria-hidden="true"
    />
  );
}