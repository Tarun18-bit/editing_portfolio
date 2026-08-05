"use client";

import { useEffect, useRef } from "react";

/**
 * OceanCreatures — Spatially Distributed Marine Wildlife Ecosystem.
 *
 * Spreads marine species cleanly across distinct vertical Y-lanes (Top 18%,
 * Mid 38%, Lower-mid 58%, Deep 78%, Abyss 90%) and staggered swim timings,
 * ensuring balanced, non-overlapping distribution across the entire viewport.
 */
export default function OceanCreatures() {
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

    // Staggered initial X coordinates spread across screen
    let dolphinX = -180;
    let turtleX = width * 0.7;
    let mantaX = -280;
    let sharkX = width + 220;
    let whaleX = -480;
    let squidX = width * 0.85;
    let time = 0;
    let rafId: number;

    // ── 1. Dolphin Draw ─────────────────────────────────────────
    const drawDolphin = (x: number, y: number, t: number) => {
      ctx.save();
      ctx.translate(x, y);
      const tailWave = Math.sin(t * 3.8) * 10;

      ctx.fillStyle = "rgba(175, 220, 255, 0.26)";
      ctx.beginPath();
      ctx.moveTo(55, 0);
      ctx.quadraticCurveTo(28, -22, -18, -14);
      ctx.lineTo(-14, -32);
      ctx.lineTo(-28, -14);
      ctx.quadraticCurveTo(-65, -4 + tailWave * 0.4, -100, tailWave);
      ctx.lineTo(-115, tailWave - 14);
      ctx.lineTo(-110, tailWave);
      ctx.lineTo(-115, tailWave + 14);
      ctx.quadraticCurveTo(-55, 14, -18, 14);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // ── 2. Sea Turtle Draw ──────────────────────────────────────
    const drawTurtle = (x: number, y: number, t: number) => {
      ctx.save();
      ctx.translate(x, y);
      const flipperAngle = Math.sin(t * 1.8) * 0.35;

      ctx.fillStyle = "rgba(135, 185, 215, 0.22)";
      ctx.beginPath();
      ctx.ellipse(0, 0, 42, 30, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.rotate(flipperAngle);
      ctx.fillStyle = "rgba(155, 205, 240, 0.24)";
      ctx.beginPath();
      ctx.ellipse(14, -35, 32, 11, -0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.beginPath();
      ctx.ellipse(-48, 0, 13, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // ── 3. Manta Ray Draw ───────────────────────────────────────
    const drawManta = (x: number, y: number, t: number) => {
      ctx.save();
      ctx.translate(x, y);
      const flap = Math.sin(t * 2.0) * 15;
      ctx.fillStyle = "rgba(145, 190, 235, 0.19)";

      ctx.beginPath();
      ctx.moveTo(55, 0);
      ctx.quadraticCurveTo(14, -18 + flap, -32, flap);
      ctx.quadraticCurveTo(-50, 0, -65, 4);
      ctx.quadraticCurveTo(-50, 0, -32, -flap);
      ctx.quadraticCurveTo(14, 18 - flap, 55, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // ── 4. Shark Draw ───────────────────────────────────────────
    const drawShark = (x: number, y: number, t: number) => {
      ctx.save();
      ctx.translate(x, y);
      const swish = Math.sin(t * 3.2) * 9;

      ctx.fillStyle = "rgba(105, 145, 185, 0.17)";
      ctx.beginPath();
      ctx.moveTo(-90, 0);
      ctx.quadraticCurveTo(-45, -22, 0, -16);
      ctx.lineTo(8, -38);
      ctx.lineTo(-8, -14);
      ctx.quadraticCurveTo(70, -8 + swish, 118, swish);
      ctx.lineTo(132, swish - 20);
      ctx.lineTo(125, swish);
      ctx.lineTo(132, swish + 16);
      ctx.quadraticCurveTo(55, 18, 0, 16);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // ── 5. Whale Draw ───────────────────────────────────────────
    const drawWhale = (x: number, y: number, t: number) => {
      ctx.save();
      ctx.translate(x, y);
      const fluke = Math.sin(t * 1.1) * 18;

      ctx.fillStyle = "rgba(85, 120, 165, 0.13)";
      ctx.beginPath();
      ctx.moveTo(200, 0);
      ctx.quadraticCurveTo(130, -36, 0, -28);
      ctx.quadraticCurveTo(-100, -16 + fluke * 0.4, -180, fluke);
      ctx.lineTo(-210, fluke - 20);
      ctx.lineTo(-200, fluke);
      ctx.lineTo(-210, fluke + 20);
      ctx.quadraticCurveTo(-100, 16 + fluke * 0.4, 0, 36);
      ctx.quadraticCurveTo(130, 40, 200, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // ── 6. Giant Squid Draw ─────────────────────────────────────
    const drawSquid = (x: number, y: number, t: number) => {
      ctx.save();
      ctx.translate(x, y);

      ctx.fillStyle = "rgba(135, 155, 195, 0.15)";
      ctx.beginPath();
      ctx.ellipse(-35, 0, 32, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(155, 180, 220, 0.20)";
      ctx.lineWidth = 1.4;
      for (let i = -10; i <= 10; i += 5) {
        ctx.beginPath();
        ctx.moveTo(-4, i);
        const wave = Math.sin(t * 2.2 + i * 0.3) * 12;
        ctx.quadraticCurveTo(45 + wave, i * 1.5, 100 + wave * 1.4, i * 2);
        ctx.stroke();
      }

      ctx.restore();
    };

    // ── Render Loop — Distributed Across Height Lanes ────────────
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.016;

      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight || 1;
      const scrollRatio = scrollY / maxScroll;
      const waterLine = Math.max(120, height * 0.42);

      // Deep water only: creatures should begin below the surface and never enter the sky zone.
      if (scrollRatio < 0.35) {
        dolphinX += 1.8;
        if (dolphinX > width + 220) dolphinX = -220;
        const y = waterLine + height * 0.12 + Math.sin(time * 1.2) * 25;
        drawDolphin(dolphinX, y, time);
      }

      if (scrollRatio > 0.10 && scrollRatio < 0.55) {
        turtleX -= 0.75;
        if (turtleX < -220) turtleX = width + 220;
        const y = waterLine + height * 0.18 + Math.cos(time * 0.7) * 18;
        drawTurtle(turtleX, y, time);
      }

      if (scrollRatio > 0.25 && scrollRatio < 0.72) {
        mantaX += 1.1;
        if (mantaX > width + 260) mantaX = -260;
        const y = waterLine + height * 0.26 + Math.sin(time * 0.6) * 22;
        drawManta(mantaX, y, time);
      }

      if (scrollRatio > 0.42 && scrollRatio < 0.88) {
        sharkX -= 1.2;
        if (sharkX < -280) sharkX = width + 280;
        const y = waterLine + height * 0.33 + Math.sin(time * 0.85) * 25;
        drawShark(sharkX, y, time);
      }

      if (scrollRatio > 0.48) {
        whaleX += 0.7;
        if (whaleX > width + 480) whaleX = -480;
        const y = waterLine + height * 0.42 + Math.cos(time * 0.4) * 28;
        drawWhale(whaleX, y, time);
      }

      if (scrollRatio > 0.68) {
        squidX -= 0.65;
        if (squidX < -240) squidX = width + 240;
        const y = waterLine + height * 0.52 + Math.sin(time * 0.55) * 18;
        drawSquid(squidX, y, time);
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
      className="pointer-events-none fixed inset-0 z-[5]"
      aria-hidden="true"
    />
  );
}
