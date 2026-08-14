"use client";

import React, { useEffect, useRef } from "react";
import { OceanWorldEngine } from "./OceanWorldEngine";
import { useWorld } from "@/component/worlds/WorldProvider";

let engineInstance: OceanWorldEngine | null = null;

export function triggerEngineDive(onComplete?: () => void) {
  if (engineInstance) {
    engineInstance.executeDive(onComplete);
  }
}

export default function ThreeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { scrollProgressRef, mouseRef } = useWorld();

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new OceanWorldEngine(canvasRef.current);
    engineInstance = engine;
    engine.start();

    // High performance sync loop for scroll progress and mouse coordinates
    let rafId: number;

    const syncLoop = () => {
      if (scrollProgressRef.current !== undefined) {
        engine.targetScrollProgress = scrollProgressRef.current;
      }
      if (mouseRef.current) {
        engine.mouse = mouseRef.current;
      }
      rafId = requestAnimationFrame(syncLoop);
    };

    rafId = requestAnimationFrame(syncLoop);

    return () => {
      cancelAnimationFrame(rafId);
      engine.destroy();
      engineInstance = null;
    };
  }, [scrollProgressRef, mouseRef]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 h-full w-full pointer-events-none"
    />
  );
}
