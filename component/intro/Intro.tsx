"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

/**
 * Intro — the gateway before the experience begins.
 *
 * Sequence:
 *  1. Void — pure darkness. The visitor waits.
 *  2. Hairline appears — a thread of light cuts horizontally.
 *  3. Text materialises from nothing — blur dissolve, not a slide.
 *  4. Silence holds.
 *  5. Everything implodes back into the void.
 *  6. Hairline collapses.
 *  7. Overlay dissolves — hero is revealed.
 *
 * The whole sequence takes ≈ 5.5 seconds.
 * Nothing moves fast. Everything has weight.
 */
export default function Intro() {
  const introRef   = useRef<HTMLElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const lines = gsap.utils.toArray<HTMLElement>(".intro-line");

      const tl = gsap.timeline();

      // 1. Hairline cuts across from centre
      tl.from(lineRef.current, {
        scaleX: 0,
        duration: 0.9,
        ease: "power3.out",
        transformOrigin: "center center",
      });

      // 2. Text materialises — blur dissolve, not a slide
      tl.from(lines, {
        opacity: 0,
        y: 32,
        filter: "blur(18px)",
        duration: 1.3,
        stagger: 0.48,
        ease: "power4.out",
      }, "-=0.15");

      // 3. Hold in the darkness
      tl.to({}, { duration: 1.1 });

      // 4. Text implodes back into the void (reverse stagger)
      tl.to(lines, {
        opacity: 0,
        scale: 0.95,
        filter: "blur(14px)",
        duration: 0.85,
        stagger: { each: 0.09, from: "end" },
        ease: "power3.in",
      });

      // 5. Hairline collapses
      tl.to(lineRef.current, {
        scaleX: 0,
        opacity: 0,
        duration: 0.55,
        ease: "power3.in",
      }, "-=0.35");

      // 6. Dissolve the overlay — hero is revealed beneath
      tl.to(introRef.current, {
        opacity: 0,
        duration: 0.75,
        ease: "power2.inOut",
        onComplete: () => {
          if (introRef.current) {
            introRef.current.style.display = "none";
          }
        },
      });
    },
    { scope: introRef }
  );

  return (
    <section
      ref={introRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ backgroundColor: "#030508" }}
    >
      {/* ── Hairline ─────────────────────────────────────────── */}
      <div
        ref={lineRef}
        style={{
          width: 180,
          height: 1,
          marginBottom: "4rem",
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.28), transparent)",
          transformOrigin: "center center",
        }}
      />

      {/* ── Text ─────────────────────────────────────────────── */}
      <div style={{ textAlign: "center" }}>
        <p
          className="intro-line"
          style={{
            fontSize: "clamp(1.1rem, 3vw, 2.2rem)",
            fontWeight: 200,
            letterSpacing: "0.52em",
            color: "rgba(255,255,255,0.65)",
            textTransform: "uppercase",
          }}
        >
          A Single Frame
        </p>

        <p
          className="intro-line"
          style={{
            marginTop: "1.5rem",
            fontSize: "clamp(1.1rem, 3vw, 2.2rem)",
            fontWeight: 200,
            letterSpacing: "0.52em",
            color: "rgba(255,255,255,0.65)",
            textTransform: "uppercase",
          }}
        >
          Can Change
        </p>

        <p
          className="intro-line"
          style={{
            marginTop: "1.5rem",
            fontSize: "clamp(1.1rem, 3vw, 2.2rem)",
            fontWeight: 300,
            letterSpacing: "0.52em",
            color: "rgba(255,255,255,0.88)",
            textTransform: "uppercase",
          }}
        >
          Everything
        </p>
      </div>
    </section>
  );
}