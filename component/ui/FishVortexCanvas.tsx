"use client";

import { useEffect, useRef } from "react";

interface VortexFish {
  angle: number;
  radius: number;
  z: number;
  speed: number;
  size: number;
  opacity: number;
}

const FISH_COUNT = 90;

/**
 * FishVortexCanvas — Swirling Oceanic Fish Tornado.
 *
 * Inspired by Reference Image 2:
 * Simulates a cyclone of fish swirling around a central sunburst beam.
 * Fish orbit in 3D polar coordinates with depth scale and opacity falloff.
 */
export default function FishVortexCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize, { passive: true });

    // Initialize 3D Vortex Fish
    const fishes: VortexFish[] = Array.from({ length: FISH_COUNT }, (_, i) => ({
      angle: (i / FISH_COUNT) * Math.PI * 8 + Math.random() * 0.5,
      radius: 80 + Math.random() * 260,
      z: Math.random() * 300 - 150,
      speed: 0.008 + Math.random() * 0.012,
      size: 2.5 + Math.random() * 4.5,
      opacity: 0.25 + Math.random() * 0.55,
    }));

    let rafId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const scrollY = window.scrollY;
      const scrollRatio = scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1);

      // Only render vortex in mid-depth (scrollRatio 0.10 to 0.75)
      if (scrollRatio > 0.08 && scrollRatio < 0.80) {
        const centerX = width * 0.5;
        const centerY = height * 0.38;

        // Fade in/out at section boundaries
        const sectionFade =
          scrollRatio < 0.25
            ? (scrollRatio - 0.08) / 0.17
            : scrollRatio > 0.65
            ? (0.80 - scrollRatio) / 0.15
            : 1;

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, sectionFade));

        for (const f of fishes) {
          f.angle += f.speed;

          // Polar to Cartesian conversion with elliptical perspective
          const rx = f.radius * Math.cos(f.angle);
          const ry = (f.radius * 0.45 + f.z * 0.2) * Math.sin(f.angle);

          const x = centerX + rx;
          const y = centerY + ry;

          // Perspective scale based on Z depth
          const scale = (f.z + 200) / 250;
          const fishLength = f.size * 3.5 * scale;
          const fishWidth = f.size * 1.2 * scale;

          // Tangent angle for fish swimming direction
          const swimAngle = Math.atan2(
            -f.radius * 0.45 * Math.cos(f.angle),
            -f.radius * Math.sin(f.angle)
          );

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(swimAngle);

          // Draw sleek fish silhouette
          ctx.beginPath();
          ctx.moveTo(fishLength * 0.5, 0);
          ctx.quadraticCurveTo(0, -fishWidth, -fishLength * 0.5, 0);
          ctx.quadraticCurveTo(0, fishWidth, fishLength * 0.5, 0);

          ctx.fillStyle = `rgba(180, 225, 255, ${f.opacity * 0.75})`;
          ctx.fill();

          // Tail Fin
          ctx.beginPath();
          ctx.moveTo(-fishLength * 0.45, 0);
          ctx.lineTo(-fishLength * 0.75, -fishWidth * 1.2);
          ctx.lineTo(-fishLength * 0.75, fishWidth * 1.2);
          ctx.closePath();
          ctx.fillStyle = `rgba(140, 205, 255, ${f.opacity * 0.5})`;
          ctx.fill();

          ctx.restore();
        }

        ctx.restore();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[1]"
      aria-hidden="true"
    />
  );
}
