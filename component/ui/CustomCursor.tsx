"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * CustomCursor — Awwwards-style Dynamic Lens Ring.
 *
 * Replaces system cursor with a minimal precision dot and trailing lens ring.
 * Interacts with clickable elements by expanding, and displays a "VIEW" badge
 * when hovering over project entries.
 */
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string>("");
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    // Hide cursor on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    const xDot = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power2.out" });
    const yDot = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power2.out" });

    const xRing = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const yRing = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    const onMouseMove = (e: MouseEvent) => {
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);

      const target = e.target as HTMLElement | null;
      const projectItem = target?.closest(".group");
      const buttonItem = target?.closest("button, a");

      if (projectItem) {
        setIsHovered(true);
        setLabel("VIEW");
      } else if (buttonItem) {
        setIsHovered(true);
        setLabel("");
      } else {
        setIsHovered(false);
        setLabel("");
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <>
      {/* Center Precision Dot */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-50 -ml-1 -mt-1 h-2 w-2 rounded-full bg-white/90 transition-opacity duration-300"
        style={{ willChange: "transform" }}
      />

      {/* Dynamic Follower Ring */}
      <div
        ref={ringRef}
        className={`pointer-events-none fixed left-0 top-0 z-50 flex items-center justify-center rounded-full border border-white/30 backdrop-blur-[2px] transition-all duration-500 -ml-5 -mt-5 ${
          isHovered ? "h-16 w-16 -ml-8 -mt-8 border-white/60 bg-white/10" : "h-10 w-10"
        }`}
        style={{ willChange: "transform" }}
      >
        {label && (
          <span className="font-mono text-[9px] tracking-[0.2em] text-white">
            {label}
          </span>
        )}
      </div>
    </>
  );
}
