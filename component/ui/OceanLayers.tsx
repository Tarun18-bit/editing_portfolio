"use client";

import { useEffect, useRef } from "react";

/**
 * OceanLayers — Ambient Floor Depth Haze & Cavern Depth Lighting.
 *
 * Enhances the underlying reference background image with dynamic bottom depth glow
 * and atmospheric haze as the user descends into the cavern seabed.
 */
export default function OceanLayers() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight || 1;
      const progress = scrollY / maxScroll;

      const floorGlow = container.querySelector(".seabed-glow");
      if (floorGlow) {
        const opacity = Math.max(0, (progress - 0.55) / 0.40);
        (floorGlow as HTMLElement).style.opacity = String(opacity);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[2] overflow-hidden"
    >
      {/* Seabed Ambient Cyan Channel Glow (fades in near bottom) */}
      <div className="seabed-glow absolute bottom-0 left-0 right-0 h-[35vh] opacity-0 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(0, 220, 245, 0.15) 60%, rgba(0, 140, 180, 0.3) 100%)",
        }}
      />
    </div>
  );
}
