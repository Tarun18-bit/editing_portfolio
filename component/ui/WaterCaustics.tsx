"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * WaterCaustics — Reference-Matched Underwater Cavern Light Aperture.
 *
 * Recreates the key lighting from the reference image:
 *  1. Bright circular sky opening at the very top centre (the "portal to surface").
 *  2. Multiple god-ray sun beams streaming down vertically from that aperture.
 *  3. Soft turquoise caustic shimmer around the opening rim.
 *  4. Light attenuates and fades to deep blue as it descends into the trench.
 *  5. Entire system fades gently as you scroll deeper.
 */
export default function WaterCaustics() {
  const containerRef = useRef<HTMLDivElement>(null);
  const apertureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !apertureRef.current) return;

    gsap.to(apertureRef.current, {
      scale: 1.06,
      opacity: 0.92,
      duration: 5.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    const onScroll = () => {
      const scrollY = window.scrollY;
      const fadeProgress = Math.min(1, scrollY / (window.innerHeight * 1.8));
      const startOpacity = 0.08;
      const visibleOpacity = Math.max(0, (fadeProgress - 0.15) / 0.55) * 0.9;
      gsap.to(container, {
        opacity: startOpacity + visibleOpacity,
        duration: 0.4,
        overwrite: "auto",
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden opacity-0"
    >
      {/* ── Central Sky Aperture — the circular opening at the top ── */}
      <div
        ref={apertureRef}
        className="absolute left-1/2 -top-16 -translate-x-1/2 rounded-full"
        style={{
          width: 560,
          height: 560,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.88) 0%, rgba(180,240,255,0.65) 30%, rgba(80,200,250,0.25) 60%, transparent 80%)",
          boxShadow:
            "0 0 180px 80px rgba(120, 220, 255, 0.3), 0 0 60px 30px rgba(255,255,255,0.2)",
          willChange: "transform, opacity",
        }}
      />

      {/* ── God-Ray Sunbeams streaming down from aperture ────────── */}
      {/* Centre beam — widest, brightest */}
      <div
        className="absolute left-1/2 top-0 origin-top blur-[55px]"
        style={{
          width: 280,
          height: "85vh",
          marginLeft: -140,
          background:
            "linear-gradient(180deg, rgba(200,245,255,0.55) 0%, rgba(100,210,250,0.18) 45%, transparent 85%)",
        }}
      />

      {/* Left beam */}
      <div
        className="absolute origin-top blur-[75px]"
        style={{
          width: 180,
          height: "75vh",
          top: 0,
          left: "calc(50% - 160px)",
          transform: "rotate(-6deg)",
          background:
            "linear-gradient(180deg, rgba(180,240,255,0.35) 0%, rgba(80,190,240,0.10) 50%, transparent 85%)",
        }}
      />

      {/* Right beam */}
      <div
        className="absolute origin-top blur-[75px]"
        style={{
          width: 180,
          height: "72vh",
          top: 0,
          left: "calc(50% + 100px)",
          transform: "rotate(7deg)",
          background:
            "linear-gradient(180deg, rgba(180,240,255,0.32) 0%, rgba(80,190,240,0.09) 50%, transparent 85%)",
        }}
      />

      {/* Far-left beam */}
      <div
        className="absolute origin-top blur-[90px]"
        style={{
          width: 140,
          height: "65vh",
          top: 0,
          left: "calc(50% - 290px)",
          transform: "rotate(-14deg)",
          background:
            "linear-gradient(180deg, rgba(160,230,255,0.22) 0%, transparent 75%)",
        }}
      />

      {/* Far-right beam */}
      <div
        className="absolute origin-top blur-[90px]"
        style={{
          width: 140,
          height: "65vh",
          top: 0,
          left: "calc(50% + 230px)",
          transform: "rotate(15deg)",
          background:
            "linear-gradient(180deg, rgba(160,230,255,0.20) 0%, transparent 75%)",
        }}
      />

      {/* ── Cavern ambient teal glow reflected from walls ─────────── */}
      <div
        className="absolute inset-0 blur-[120px] opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(0,180,220,0.28) 0%, rgba(0,80,140,0.12) 55%, transparent 80%)",
        }}
      />
    </div>
  );
}
