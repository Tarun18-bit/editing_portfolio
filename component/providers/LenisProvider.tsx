"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface LenisProviderProps {
  children: React.ReactNode;
}

/**
 * LenisProvider — wraps the application with buttery smooth scroll.
 *
 * Integrates Lenis with GSAP's ticker so ScrollTrigger is perfectly
 * synchronised with every Lenis frame, giving the "descending" feeling
 * where nothing snaps and everything flows.
 */
export default function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Keep ScrollTrigger in sync with every Lenis scroll event
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    // Drive Lenis via GSAP's ticker rather than its own RAF,
    // so all GSAP animations and Lenis share the same clock.
    const rafCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(rafCallback);

    // Prevent GSAP from skipping frames during heavy computation
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(rafCallback);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
