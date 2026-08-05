"use client";

import { useCallback, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { startDive } from "@/component/animations/heroAnimations";

const TITLE_LETTERS = ["T", "A", "R", "U", "N"] as const;

/**
 * MainHero — Ultra-Sleek Floating Editorial Hero.
 *
 * Floating extralight typography directly inside the 3D underwater space.
 */
export default function MainHero() {
  const sectionRef    = useRef<HTMLElement>(null);
  const containerRef  = useRef<HTMLDivElement>(null);
  const titleRef      = useRef<HTMLHeadingElement>(null);
  const subtitleRef   = useRef<HTMLParagraphElement>(null);
  const descRef       = useRef<HTMLParagraphElement>(null);
  const buttonRef     = useRef<HTMLButtonElement>(null);
  const hintRef       = useRef<HTMLDivElement>(null);
  const isDiving      = useRef(false);

  useGSAP(() => {
    const letters = titleRef.current?.querySelectorAll<HTMLSpanElement>(".hero-letter");
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    if (letters) {
      tl.from(Array.from(letters), {
        opacity: 0,
        y: 90,
        filter: "blur(22px)",
        duration: 1.7,
        stagger: 0.09,
      });
    }

    tl.from(subtitleRef.current, {
      opacity: 0,
      y: 22,
      filter: "blur(10px)",
      duration: 1.3,
    }, "-=0.85");

    tl.from(descRef.current, {
      opacity: 0,
      y: 18,
      filter: "blur(8px)",
      duration: 1.3,
    }, "-=0.95");

    tl.from(buttonRef.current, {
      opacity: 0,
      y: 16,
      filter: "blur(6px)",
      duration: 1.1,
    }, "-=0.90");

    tl.from(hintRef.current, {
      opacity: 0,
      duration: 1.0,
    }, "-=0.65");

    gsap.to(titleRef.current, {
      y: -9,
      duration: 6.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 2.2,
    });

    gsap.to(subtitleRef.current, {
      y: -6,
      duration: 7.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 2.6,
    });

    gsap.to(descRef.current, {
      y: -3.5,
      duration: 8.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 3.0,
    });
  }, { scope: containerRef });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDiving.current) return;

      const halfW = window.innerWidth  / 2;
      const halfH = window.innerHeight / 2;
      const nx    = (e.clientX - halfW) / halfW;
      const ny    = (e.clientY - halfH) / halfH;

      gsap.to(titleRef.current, {
        x: nx * 24,
        duration: 1.4,
        ease: "power2.out",
        overwrite: "auto",
      });

      gsap.to(subtitleRef.current, {
        x: nx * 15,
        y: ny * 8,
        duration: 1.6,
        ease: "power2.out",
        overwrite: "auto",
      });

      gsap.to(descRef.current, {
        x: nx * 8,
        y: ny * 4,
        duration: 1.8,
        ease: "power2.out",
        overwrite: "auto",
      });

      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const bx   = e.clientX - (rect.left + rect.width  / 2);
      const by   = e.clientY - (rect.top  + rect.height / 2);
      const dist = Math.sqrt(bx * bx + by * by);

      if (dist < 165) {
        gsap.to(buttonRef.current, {
          x: bx * 0.24,
          y: by * 0.24,
          duration: 0.45,
          ease: "power2.out",
        });
      } else {
        gsap.to(buttonRef.current, {
          x: 0,
          y: 0,
          duration: 0.65,
          ease: "power2.out",
        });
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  const handleDive = useCallback(() => {
    if (isDiving.current || !containerRef.current) return;
    isDiving.current = true;

    startDive(containerRef.current, {
      onComplete: () => {
        isDiving.current = false;
      },
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4"
    >
      <div ref={containerRef} className="relative z-10 text-center max-w-5xl mx-auto">

        {/* ── Subtitle / Role Badge ──────────────────────────── */}
        <p
          ref={subtitleRef}
          className="mb-4 font-mono text-xs font-medium tracking-[0.6em] text-cyan-300/90 uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]"
        >
          VIDEO EDITOR / CONTENT CREATOR
        </p>

        {/* ── Main Title — Sleek Extralight Editorial Font ──── */}
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
            <span
              key={i}
              className="hero-letter inline-block"
              style={{ willChange: "transform, filter, opacity" }}
            >
              {letter}
            </span>
          ))}
        </h1>

        {/* ── Description ───────────────────────────────────── */}
        <p
          ref={descRef}
          className="mt-8 max-w-xl mx-auto text-base md:text-xl font-light leading-relaxed text-slate-200/90 drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]"
          style={{ willChange: "transform" }}
        >
          Cutting content that feels polished, clear, and built to keep attention.
        </p>

        {/* ── Sleek Minimalist Pill Button ────────────────────── */}
        <div className="mt-12">
          <button
            ref={buttonRef}
            onClick={handleDive}
            className="group relative inline-flex items-center gap-4 rounded-full border border-white/25 px-9 py-3.5 font-mono text-xs font-medium tracking-[0.4em] text-white/90 uppercase backdrop-blur-sm transition-all duration-500 hover:border-cyan-300 hover:text-white hover:shadow-[0_0_30px_rgba(0,220,255,0.35)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-cyan-400 opacity-75 animate-ping" />
              <span className="relative h-2 w-2 rounded-full bg-cyan-300" />
            </span>
            VIEW MY WORK
          </button>
        </div>

        {/* ── Scroll hint ────────────────────────────────────── */}
        <div
          ref={hintRef}
          className="mt-16 flex flex-col items-center gap-3 animate-[scroll-hint-float_3.2s_ease-in-out_infinite]"
        >
          <div className="h-12 w-[1px] bg-gradient-to-b from-transparent via-cyan-400/60 to-transparent" />
          <span className="font-mono text-[9px] font-medium tracking-[0.6em] text-cyan-200/70 uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            SCROLL TO SEE MORE
          </span>
        </div>

      </div>
    </section>
  );
}