"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useWorld } from "@/component/worlds/WorldProvider";

gsap.registerPlugin(ScrollTrigger);

export function useCameraControls() {
  const { setScrollProgress } = useWorld();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll for cinematic inertia
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    function onFrame(time: number) {
      lenis.raf(time * 1000);
    }

    gsap.ticker.add(onFrame);

    // Sync scroll progress with GSAP ScrollTrigger
    const st = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.8,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });

    return () => {
      gsap.ticker.remove(onFrame);
      st.kill();
      lenis.destroy();
    };
  }, [setScrollProgress]);

  const scrollToDepth = (progress: number) => {
    if (lenisRef.current) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      lenisRef.current.scrollTo(maxScroll * progress, { duration: 2.2 });
    }
  };

  return { scrollToDepth };
}
