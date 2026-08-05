"use client";

import { useEffect, useRef } from "react";
import { lerp } from "@/component/utils/math";

/**
 * Mouse state tracked with lerp-based inertia.
 * `raw` is the actual cursor position; `x/y` are the smoothed values.
 */
export interface MouseState {
  x: number;
  y: number;
  raw: { x: number; y: number };
}

/**
 * Tracks mouse position with configurable inertia.
 * Returns a ref (never state) to avoid re-renders on every frame.
 *
 * @param factor  Lerp factor per frame — lower = heavier inertia (default 0.08)
 */
export function useMouse(factor = 0.08) {
  const mouse = useRef<MouseState>({ x: 0, y: 0, raw: { x: 0, y: 0 } });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Initialise centered so nothing flashes from the corner on mount
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    mouse.current.x = cx;
    mouse.current.y = cy;
    mouse.current.raw.x = cx;
    mouse.current.raw.y = cy;

    const onMove = (e: MouseEvent) => {
      mouse.current.raw.x = e.clientX;
      mouse.current.raw.y = e.clientY;
    };

    const tick = () => {
      mouse.current.x = lerp(mouse.current.x, mouse.current.raw.x, factor);
      mouse.current.y = lerp(mouse.current.y, mouse.current.raw.y, factor);
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [factor]);

  return mouse;
}
