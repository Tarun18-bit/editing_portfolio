"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * MouseGlow — the submarine searchlight system.
 *
 * Three concentric layers at different speeds, creating a sense of
 * weight and inertia as if light itself has mass:
 *
 *  Ambient   (900px)  — the diffuse light the observer carries.  Slowest.
 *  Spotlight (420px)  — the main cone of light. Medium speed.
 *  Highlight (130px)  — the sharp centre point. Fastest.
 *
 * All three use GSAP quickTo for direct, zero-allocation DOM writes.
 */
export default function MouseGlow() {
  const ambientRef   = useRef<HTMLDivElement>(null);
  const spotRef      = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const AMBIENT_W   = 900;
    const SPOT_W      = 420;
    const HIGHLIGHT_W = 130;

    // Seed at viewport centre so there is no flash from (0, 0)
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;

    gsap.set(ambientRef.current,   { x: cx - AMBIENT_W   / 2, y: cy - AMBIENT_W   / 2 });
    gsap.set(spotRef.current,      { x: cx - SPOT_W      / 2, y: cy - SPOT_W      / 2 });
    gsap.set(highlightRef.current, { x: cx - HIGHLIGHT_W / 2, y: cy - HIGHLIGHT_W / 2 });

    // quickTo — GSAP's fastest path to animating a property
    const ambX = gsap.quickTo(ambientRef.current,   "x", { duration: 1.9, ease: "power3.out" });
    const ambY = gsap.quickTo(ambientRef.current,   "y", { duration: 1.9, ease: "power3.out" });

    const spX  = gsap.quickTo(spotRef.current,      "x", { duration: 0.95, ease: "power3.out" });
    const spY  = gsap.quickTo(spotRef.current,      "y", { duration: 0.95, ease: "power3.out" });

    const hlX  = gsap.quickTo(highlightRef.current, "x", { duration: 0.32, ease: "power2.out" });
    const hlY  = gsap.quickTo(highlightRef.current, "y", { duration: 0.32, ease: "power2.out" });

    const onMove = (e: MouseEvent) => {
      const mx = e.clientX;
      const my = e.clientY;

      ambX(mx - AMBIENT_W   / 2);
      ambY(my - AMBIENT_W   / 2);

      spX(mx  - SPOT_W      / 2);
      spY(my  - SPOT_W      / 2);

      hlX(mx  - HIGHLIGHT_W / 2);
      hlY(my  - HIGHLIGHT_W / 2);
    };

    window.addEventListener("mousemove", onMove, { passive: true });

    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      {/* ── Ambient — diffuse light the observer carries ──────── */}
      <div
        ref={ambientRef}
        className="pointer-events-none fixed left-0 top-0 z-[1]"
        style={{
          width:  900,
          height: 900,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(140,165,220,0.055) 0%, rgba(100,130,200,0.028) 42%, transparent 75%)",
          willChange: "transform",
        }}
      />

      {/* ── Spotlight — the main beam ─────────────────────────── */}
      <div
        ref={spotRef}
        className="pointer-events-none fixed left-0 top-0 z-[1]"
        style={{
          width:  420,
          height: 420,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(210,225,255,0.10) 0%, rgba(180,200,248,0.05) 46%, transparent 75%)",
          willChange: "transform",
        }}
      />

      {/* ── Highlight — sharp centre point ───────────────────── */}
      <div
        ref={highlightRef}
        className="pointer-events-none fixed left-0 top-0 z-[1]"
        style={{
          width:  130,
          height: 130,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.13) 0%, rgba(225,238,255,0.07) 52%, transparent 78%)",
          willChange: "transform",
        }}
      />
    </>
  );
}