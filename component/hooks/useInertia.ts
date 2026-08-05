"use client";

import { useCallback, useEffect, useRef } from "react";
import { lerp } from "@/component/utils/math";

interface Vec2 {
  x: number;
  y: number;
}

/**
 * Generic 2D inertia hook.
 * Smoothly interpolates `current` toward a `target` on every frame.
 * Useful for camera rigs, parallax layers, and any value that needs to lag behind.
 *
 * @param factor  Lerp factor per frame — lower = heavier inertia (default 0.06)
 */
export function useInertia(factor = 0.06) {
  const current = useRef<Vec2>({ x: 0, y: 0 });
  const target = useRef<Vec2>({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const setTarget = useCallback((x: number, y: number) => {
    target.current.x = x;
    target.current.y = y;
  }, []);

  useEffect(() => {
    const tick = () => {
      current.current.x = lerp(current.current.x, target.current.x, factor);
      current.current.y = lerp(current.current.y, target.current.y, factor);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [factor]);

  return { current, setTarget };
}
