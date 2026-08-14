"use client";

import React, { useRef, useCallback, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { executeSurfaceDive } from "@/component/animations/diveAnimation";
import { useWorld } from "@/component/worlds/WorldProvider";

const TITLE_LETTERS = ["T", "A", "R", "U", "N"] as const;

export default function MainHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { isDiving, setIsDiving } = useWorld();

  useGSAP(() => {
    const letters = titleRef.current?.querySelectorAll<HTMLSpanElement>(".hero-letter");
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    if (letters) {
      tl.from(Array.from(letters), {
        opacity: 0,
        y: 80,
        filter: "blur(20px)",
        duration: 1.6,
        stagger: 0.08,
      });
    }

    tl.from(
      subtitleRef.current,
      { opacity: 0, y: 20, filter: "blur(10px)", duration: 1.2 },
      "-=0.8"
    );

    tl.from(
      descRef.current,
      { opacity: 0, y: 16, filter: "blur(8px)", duration: 1.2 },
      "-=0.9"
    );

    tl.from(
      buttonRef.current,
      { opacity: 0, y: 16, filter: "blur(6px)", duration: 1.0 },
      "-=0.8"
    );

    // Continuous subtle floating animation
    gsap.to(titleRef.current, {
      y: -10,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, { scope: containerRef });

  // Native mousemove listener for typography parallax without React re-renders
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDiving) return;
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      const nx = (e.clientX - halfW) / halfW;
      const ny = (e.clientY - halfH) / halfH;

      gsap.to(titleRef.current, {
        x: nx * 18,
        y: ny * 8,
        duration: 1.4,
        ease: "power2.out",
        overwrite: "auto",
      });

      gsap.to(subtitleRef.current, {
        x: nx * 10,
        duration: 1.6,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isDiving]);

  const handleBeginExperience = useCallback(() => {
    if (isDiving || !containerRef.current) return;
    setIsDiving(true);

    executeSurfaceDive(containerRef.current, null, {
      onComplete: () => {
        setIsDiving(false);
      },
    });
  }, [isDiving, setIsDiving]);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div ref={containerRef} className="relative z-20 text-center max-w-5xl mx-auto">
        
        {/* Role Subtitle Badge */}
        <p
          ref={subtitleRef}
          className="mb-4 font-mono text-xs font-medium tracking-[0.6em] text-cyan-300 uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
        >
          VIDEO EDITOR & CINEMATIC MOTION CREATOR
        </p>

        {/* Main Title Typography */}
        <h1
          ref={titleRef}
          className="flex items-center justify-center gap-[0.04em] drop-shadow-[0_6px_30px_rgba(0,0,0,0.95)]"
          aria-label="TARUN"
          style={{
            fontSize: "clamp(4.8rem, 14vw, 13rem)",
            fontWeight: 200,
            letterSpacing: "0.22em",
            color: "#ffffff",
            willChange: "transform",
          }}
        >
          {TITLE_LETTERS.map((letter, i) => (
            <span key={i} className="hero-letter inline-block">
              {letter}
            </span>
          ))}
        </h1>

        {/* Description */}
        <p
          ref={descRef}
          className="mt-6 max-w-xl mx-auto text-base md:text-xl font-light leading-relaxed text-slate-200 drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]"
        >
          Crafting high-retention video edits and cinematic motion stories that command attention.
        </p>

        {/* "Begin Experience" Major Surface Plunge Trigger */}
        <div className="mt-10">
          <button
            ref={buttonRef}
            onClick={handleBeginExperience}
            className="group relative inline-flex items-center gap-4 rounded-full border border-cyan-400/40 bg-cyan-950/40 px-10 py-4 font-mono text-xs font-semibold tracking-[0.4em] text-white uppercase backdrop-blur-md transition-all duration-500 hover:border-cyan-300 hover:bg-cyan-900/60 hover:shadow-[0_0_40px_rgba(0,229,255,0.45)] hover:scale-105"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inset-0 rounded-full bg-cyan-400 opacity-75 animate-ping" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-cyan-300" />
            </span>
            BEGIN EXPERIENCE
          </button>
        </div>

        {/* Scroll Hint */}
        <div className="mt-14 flex flex-col items-center gap-3 animate-pulse">
          <div className="h-10 w-[1px] bg-gradient-to-b from-transparent via-cyan-400 to-transparent" />
          <span className="font-mono text-[9px] font-medium tracking-[0.6em] text-cyan-200/80 uppercase">
            DIVE DEEPER TO DISCOVER
          </span>
        </div>

      </div>
    </section>
  );
}