"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * CustomCursor — Water Touch Cursor
 *
 * Keeps the existing GSAP magnetic dot + trailing ring + VIEW hover badge.
 * Adds a canvas layer beneath that draws expanding water-touch ripple rings
 * on every mouse move (subtle) and a larger burst on click.
 * The magnetic hover properties are untouched.
 */
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [label, setLabel] = useState<string>("");
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // ─── Water Ripple Canvas Engine ───────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    interface Ripple {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
      lineWidth: number;
      speed: number;
      color: string;
    }

    const ripples: Ripple[] = [];
    let lastRippleX = -999;
    let lastRippleY = -999;
    let rafId = 0;

    const spawnRipple = (x: number, y: number, big = false) => {
      ripples.push({
        x,
        y,
        radius: big ? 4 : 2,
        maxRadius: big ? 80 : 30,
        alpha: big ? 0.55 : 0.3,
        lineWidth: big ? 1.5 : 0.8,
        speed: big ? 2.4 : 1.2,
        color: big ? "100, 210, 255" : "140, 220, 255",
      });

      // Burst spawns multiple rings on click
      if (big) {
        for (let i = 1; i <= 2; i++) {
          ripples.push({
            x,
            y,
            radius: 2 + i * 6,
            maxRadius: 55 + i * 20,
            alpha: 0.35 - i * 0.08,
            lineWidth: 0.9,
            speed: 1.8 + i * 0.5,
            color: "100, 210, 255",
          });
        }
      }
    };

    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - lastRippleX;
      const dy = e.clientY - lastRippleY;
      if (dx * dx + dy * dy > 600) {   // Only spawn every ~24px of movement
        spawnRipple(e.clientX, e.clientY);
        lastRippleX = e.clientX;
        lastRippleY = e.clientY;
      }
    };

    const onClick = (e: MouseEvent) => {
      spawnRipple(e.clientX, e.clientY, true);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("click", onClick, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.alpha -= r.alpha / (r.maxRadius / r.speed);

        if (r.alpha <= 0.01 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${r.color}, ${r.alpha})`;
        ctx.lineWidth = r.lineWidth;
        ctx.stroke();
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("click", onClick);
    };
  }, []);

  // ─── GSAP Magnetic Dot + Ring (unchanged) ────────────────────────────────
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    const xDot = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power2.out" });
    const yDot = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power2.out" });
    const xRing = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const yRing = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    const onMouseMove = (e: MouseEvent) => {
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);

      const target = e.target as HTMLElement | null;
      const projectItem = target?.closest(".group");
      const buttonItem = target?.closest("button, a");

      if (projectItem) {
        setIsHovered(true);
        setLabel("VIEW");
      } else if (buttonItem) {
        setIsHovered(true);
        setLabel("");
      } else {
        setIsHovered(false);
        setLabel("");
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <>
      {/* Water Ripple Canvas — sits beneath the cursor dot */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-40"
        style={{ willChange: "transform" }}
      />

      {/* Center Precision Dot */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-50 -ml-1 -mt-1 h-2 w-2 rounded-full bg-white/90 transition-opacity duration-300"
        style={{ willChange: "transform" }}
      />

      {/* Dynamic Follower Ring */}
      <div
        ref={ringRef}
        className={`pointer-events-none fixed left-0 top-0 z-50 flex items-center justify-center rounded-full border border-white/30 backdrop-blur-[2px] transition-all duration-500 -ml-5 -mt-5 ${
          isHovered ? "h-16 w-16 -ml-8 -mt-8 border-white/60 bg-white/10" : "h-10 w-10"
        }`}
        style={{ willChange: "transform" }}
      >
        {label && (
          <span className="font-mono text-[9px] tracking-[0.2em] text-white">
            {label}
          </span>
        )}
      </div>
    </>
  );
}
