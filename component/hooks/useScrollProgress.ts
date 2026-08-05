"use client";

import { useEffect, useRef } from "react";

/**
 * Returns a ref containing current scroll progress from 0 (top) to 1 (bottom).
 * Uses a ref — not state — so scroll events never trigger re-renders.
 * Read `.current` inside animation loops / RAF callbacks.
 */
export function useScrollProgress() {
  const progress = useRef<number>(0);

  useEffect(() => {
    const update = () => {
      const scrollY = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      progress.current = maxScroll > 0 ? scrollY / maxScroll : 0;
    };

    window.addEventListener("scroll", update, { passive: true });
    update(); // seed on mount

    return () => window.removeEventListener("scroll", update);
  }, []);

  return progress;
}
