"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollProgress } from "@/component/hooks/useScrollProgress";

/**
 * DepthHUD — High-Contrast Abyssal Navigation Gauge.
 *
 * Fixed right telemetry gauge with high-contrast text and dark dropshadow backing.
 */
export default function DepthHUD() {
  const scrollProgress = useScrollProgress();
  const [depth, setDepth] = useState(0);
  const [sector, setSector] = useState("SURFACE");
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const updateHUD = () => {
      const p = scrollProgress.current;
      const currentMeters = Math.round(p * 1200);
      setDepth(currentMeters);

      if (p < 0.25) {
        setSector("SURFACE // 01");
      } else if (p < 0.60) {
        setSector("DESCENT // 02");
      } else if (p < 0.85) {
        setSector("MESOPELAGIC // 03");
      } else {
        setSector("ABYSS // 04");
      }

      rafRef.current = requestAnimationFrame(updateHUD);
    };

    rafRef.current = requestAnimationFrame(updateHUD);

    return () => cancelAnimationFrame(rafRef.current);
  }, [scrollProgress]);

  return (
    <aside
      className="pointer-events-none fixed right-8 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-6 font-mono text-[11px] tracking-[0.35em] drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] md:flex"
      aria-label="Navigation Telemetry"
    >
      {/* Sector Badge */}
      <span className="text-[10px] font-semibold uppercase text-cyan-200/90">{sector}</span>

      {/* Depth Meter */}
      <div className="flex items-baseline gap-2">
        <span className="text-base font-bold text-white">{depth}</span>
        <span className="text-[10px] font-semibold text-cyan-300/80">M</span>
      </div>

      {/* Hairline Gauge */}
      <div className="relative h-32 w-[2px] bg-white/30 rounded-full overflow-hidden shadow-[0_0_8px_rgba(0,0,0,0.8)]">
        <div
          className="absolute top-0 w-full bg-cyan-400 shadow-[0_0_12px_#00e5ff] transition-all duration-150"
          style={{ height: `${Math.min(100, scrollProgress.current * 100)}%` }}
        />
      </div>

      {/* Coordinates readout */}
      <span className="text-[9px] font-medium text-white/70">
        LAT 34.0522° N
      </span>
    </aside>
  );
}
