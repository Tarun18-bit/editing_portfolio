"use client";

import { useEffect, useRef } from "react";
import { randomBetween } from "@/component/utils/math";

interface Fish {
  x: number;
  y: number;
  speed: number;
  size: number;
  opacity: number;
  sinPhase: number;
  sinFrequency: number;
  direction: number; // 1 = right, -1 = left
}

const FISH_COUNT = 130;

function initFish(w: number, h: number): Fish {
  const direction = Math.random() > 0.5 ? 1 : -1;
  const waterLine = Math.max(120, h * 0.42);
  return {
    x: direction === 1 ? randomBetween(-200, w) : randomBetween(0, w + 200),
    y: randomBetween(waterLine + 20, h - 30),
    speed: randomBetween(0.6, 2.2),
    size: randomBetween(2.0, 5.5),
    opacity: randomBetween(0.18, 0.65),
    sinPhase: randomBetween(0, Math.PI * 2),
    sinFrequency: randomBetween(0.01, 0.03),
    direction,
  };
}

/**
 * FishSchoolCanvas — Spatially Distributed Marine Fish Schools.
 *
 * Spreads 130 fish across the entire viewport width and height in distributed
 * depth layers, eliminating central clustering and creating natural oceanic motion.
 */
export default function FishSchoolCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fishes = useRef<Fish[]>([]);
  const rafRef = useRef<number>(0);

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

      // Evenly distribute fish across full viewport height & width
      fishes.current = Array.from({ length: FISH_COUNT }, () =>
        initFish(window.innerWidth, window.innerHeight)
      );
    };

    const draw = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const waterLine = Math.max(120, H * 0.42);

      ctx.clearRect(0, 0, W, H);

      for (const f of fishes.current) {
        // Forward swimming motion
        f.x += f.speed * f.direction;

        // Serpentine vertical wave motion
        f.sinPhase += f.sinFrequency;
        const waveY = f.y + Math.sin(f.sinPhase) * 12;

        // Keep fish within underwater region only.
        if (waveY < waterLine - 12) {
          f.y = waterLine + randomBetween(40, H * 0.2);
        }

        // Wrap around screen boundaries seamlessly
        if (f.direction === 1 && f.x > W + 60) {
          f.x = -60;
          f.y = randomBetween(waterLine + 20, H - 30);
        } else if (f.direction === -1 && f.x < -60) {
          f.x = W + 60;
          f.y = randomBetween(waterLine + 20, H - 30);
        }

        // Skip drawing if fish drift above the water line, maintaining the sky clean.
        if (waveY < waterLine - 22) continue;

        // Draw individual fish silhouette
        ctx.save();
        ctx.translate(f.x, waveY);
        if (f.direction === -1) ctx.scale(-1, 1);

        const len = f.size * 3.8;
        const wid = f.size * 1.3;

        ctx.fillStyle = `rgba(170, 220, 255, ${f.opacity})`;

        // Body
        ctx.beginPath();
        ctx.moveTo(len * 0.5, 0);
        ctx.quadraticCurveTo(0, -wid, -len * 0.5, 0);
        ctx.quadraticCurveTo(0, wid, len * 0.5, 0);
        ctx.fill();

        // Tail Fin
        const tailFlap = Math.sin(f.sinPhase * 2) * (wid * 0.5);
        ctx.beginPath();
        ctx.moveTo(-len * 0.45, 0);
        ctx.lineTo(-len * 0.75, -wid * 1.1 + tailFlap);
        ctx.lineTo(-len * 0.75, wid * 1.1 + tailFlap);
        ctx.closePath();
        ctx.fillStyle = `rgba(130, 200, 255, ${f.opacity * 0.75})`;
        ctx.fill();

        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[5]"
      aria-hidden="true"
    />
  );
}
