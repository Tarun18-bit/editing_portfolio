"use client";

import React, { useEffect, useRef, useState } from "react";
import { useWorld } from "@/component/worlds/WorldProvider";
import { WORLDS } from "@/component/worlds/worldConfig";
import { useCameraControls } from "@/component/camera/useCameraControls";

export default function DepthHUD() {
  const { scrollProgressRef, currentWorld } = useWorld();
  const { scrollToDepth } = useCameraControls();

  const depthTextRef = useRef<HTMLSpanElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  // RAF loop for smooth 60 FPS HUD telemetry updates without React re-renders
  useEffect(() => {
    let animId: number;

    const updateHUD = () => {
      const p = scrollProgressRef.current || 0;
      const meters = Math.round(p * 11000);

      if (depthTextRef.current) {
        depthTextRef.current.textContent = meters.toLocaleString();
      }

      if (barRef.current) {
        barRef.current.style.height = `${p * 100}%`;
      }

      animId = requestAnimationFrame(updateHUD);
    };

    animId = requestAnimationFrame(updateHUD);
    return () => cancelAnimationFrame(animId);
  }, [scrollProgressRef]);

  return (
    <aside
      className="pointer-events-auto fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-6 font-mono text-[11px] tracking-[0.35em] drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] md:flex"
      aria-label="Ocean Depth Navigation Telemetry"
    >
      {/* Sector Badge */}
      <div className="flex flex-col items-end">
        <span className="text-[9px] font-semibold text-cyan-400 uppercase tracking-[0.4em]">
          SECTOR
        </span>
        <span className="text-xs font-bold text-white uppercase tracking-[0.2em]">
          {currentWorld.name}
        </span>
      </div>

      {/* Depth Readout */}
      <div className="flex items-baseline gap-1.5 rounded-full border border-white/15 bg-black/60 px-4 py-2 backdrop-blur-md">
        <span ref={depthTextRef} className="text-lg font-extrabold text-cyan-300">
          0
        </span>
        <span className="text-[10px] font-bold text-cyan-100/80">M</span>
      </div>

      {/* Interactive Depth Sector Gauge */}
      <div className="relative flex h-44 w-12 flex-col items-center justify-between py-1">
        {/* Background Gauge Line */}
        <div className="absolute top-0 bottom-0 w-[2px] bg-white/20 rounded-full" />
        
        {/* Active Depth Progress Bar */}
        <div
          ref={barRef}
          className="absolute top-0 w-[2px] bg-cyan-400 shadow-[0_0_12px_#00e5ff]"
          style={{ height: "0%" }}
        />

        {/* World Quick Nav Dots */}
        {WORLDS.map((w, idx) => {
          const targetMid = (w.scrollRange[0] + w.scrollRange[1]) / 2;
          const isActive = currentWorld.id === w.id;

          return (
            <button
              key={w.id}
              onClick={() => scrollToDepth(targetMid)}
              title={`${w.name} (${w.depthMeters}m)`}
              className="group relative z-10 flex h-4 w-4 items-center justify-center transition-transform hover:scale-125"
            >
              <span
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-cyan-300 shadow-[0_0_10px_#00e5ff] scale-125"
                    : "bg-white/40 hover:bg-cyan-400"
                }`}
              />
              <span className="absolute right-6 hidden whitespace-nowrap rounded-md border border-white/20 bg-slate-950/90 px-2 py-1 text-[9px] text-white opacity-0 transition-opacity group-hover:flex group-hover:opacity-100">
                0{idx + 1} // {w.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Lat / Long Coordinates Readout */}
      <span className="text-[9px] font-medium text-slate-300">
        LAT 24.8607° N // LON 67.0011° E
      </span>
    </aside>
  );
}
