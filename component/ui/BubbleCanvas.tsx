"use client";

import { useEffect, useRef } from "react";
import { randomBetween } from "@/component/utils/math";

interface Bubble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseSpeed: number;
  opacity: number;
  wobblePhase: number;
  wobbleSpeed: number;
  highlightAngle: number;
}

const BUBBLE_COUNT = 80;

function initBubble(w: number, h: number, randomY = true): Bubble {
  const waterLine = Math.max(120, h * 0.42);
  return {
    x: randomBetween(0, w),
    y: randomY ? randomBetween(waterLine, h) : h + randomBetween(10, 50),
    vx: 0,
    vy: 0,
    radius: randomBetween(1.5, 6.5),
    baseSpeed: randomBetween(0.4, 1.4),
    opacity: randomBetween(0.12, 0.45),
    wobblePhase: randomBetween(0, Math.PI * 2),
    wobbleSpeed: randomBetween(0.015, 0.04),
    highlightAngle: randomBetween(-0.8, -0.2),
  };
}

/**
 * BubbleCanvas — Translucent Oceanic Bubble System.
 *
 * Replaces simple dust motes with rising aquatic bubbles.
 * Features:
 * - Sinusoidal horizontal wobble as bubbles ascend.
 * - Refractive rim highlights and soft interior transparency.
 * - Cursor fluid displacement repulsion.
 * - Acceleration responsive to scroll movement.
 */
export default function BubbleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubbles = useRef<Bubble[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const scrollRef = useRef({ lastY: 0, velocity: 0 });
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

      bubbles.current = Array.from({ length: BUBBLE_COUNT }, () =>
        initBubble(window.innerWidth, window.innerHeight, true)
      );
    };

    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const onScroll = () => {
      const sy = window.scrollY;
      const dy = sy - scrollRef.current.lastY;
      scrollRef.current.velocity = dy * 0.15;
      scrollRef.current.lastY = sy;
    };

    const draw = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      const waterLine = Math.max(120, H * 0.42);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Dampen scroll boost back to 0
      scrollRef.current.velocity *= 0.92;
      const scrollBoost = Math.max(0, scrollRef.current.velocity);

      ctx.clearRect(0, 0, W, H);

      for (const b of bubbles.current) {
        // Cursor repulsion
        const dx = b.x - mx;
        const dy = b.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 140;

        if (dist < radius && dist > 0) {
          const force = (1 - dist / radius) * 0.6;
          b.vx += (dx / dist) * force;
          b.vy += (dy / dist) * force;
        }

        // Apply velocities & damping
        b.x += b.vx;
        b.y += b.vy;
        b.vx *= 0.92;
        b.vy *= 0.92;

        // Ascend speed + scroll boost
        b.y -= b.baseSpeed + scrollBoost;

        // Horizontal sinusoidal wobble
        b.wobblePhase += b.wobbleSpeed;
        b.x += Math.sin(b.wobblePhase) * 0.45;

        // Recycle bubbles when reaching top, but keep them underwater only.
        if (b.y < waterLine - 24) {
          Object.assign(b, initBubble(W, H, false));
        }

        // Only draw if the bubble is underwater.
        if (b.y < waterLine - 10) continue;

        // Draw translucent bubble shell
        ctx.save();
        ctx.globalAlpha = b.opacity;

        // Bubble body
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(180, 220, 255, 0.08)";
        ctx.fill();

        // Outer rim highlight
        ctx.lineWidth = 0.8;
        ctx.strokeStyle = "rgba(220, 240, 255, 0.35)";
        ctx.stroke();

        // Interior specular highlight dot
        const hx = b.x + Math.cos(b.highlightAngle) * (b.radius * 0.45);
        const hy = b.y + Math.sin(b.highlightAngle) * (b.radius * 0.45);
        ctx.beginPath();
        ctx.arc(hx, hy, Math.max(0.6, b.radius * 0.22), 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
        ctx.fill();

        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new ResizeObserver(resize);
    observer.observe(document.documentElement);

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
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
