"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface StoryLineProps {
  number: string;
  title: string;
  subtitle: string;
  depthText: string;
}

const STORY_ITEMS: StoryLineProps[] = [
  {
    number: "01 // TALKING HEAD",
    title: "CLEAR STORIES, CLEAN PACE",
    subtitle: "Talking-head edits designed to feel natural, direct, and easy to watch.",
    depthText: "FORMAT 15–30S",
  },
  {
    number: "02 // BRAND",
    title: "BRANDS WITH MOTION",
    subtitle: "Clean pacing, stronger hooks, and visuals designed to sell the story.",
    depthText: "FORMAT 30–60S",
  },
  {
    number: "03 // STORIES",
    title: "IDEAS INTO MOTION",
    subtitle: "From rough concepts to polished edits that feel intentional and premium.",
    depthText: "FORMAT 60S+",
  },
];

/**
 * Story — Floating Atmospheric Narrative.
 *
 * Ultra-sleek, lightweight editorial typography floating directly inside
 * the 3D underwater cavern space without any container boxes or blur blocks.
 */
export default function Story() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>(".story-block");

      items.forEach((item) => {
        const title = item.querySelector(".story-title");
        const sub = item.querySelector(".story-subtitle");
        const num = item.querySelector(".story-number");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });

        tl.fromTo(
          num,
          { opacity: 0, x: -30, filter: "blur(10px)" },
          { opacity: 0.8, x: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" }
        )
          .fromTo(
            title,
            { opacity: 0, y: 50, filter: "blur(16px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "power4.out" },
            "-=0.5"
          )
          .fromTo(
            sub,
            { opacity: 0, y: 25, filter: "blur(10px)" },
            { opacity: 0.75, y: 0, filter: "blur(0px)", duration: 1.0, ease: "power3.out" },
            "-=0.8"
          );
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="relative z-10 min-h-screen px-6 py-32 md:px-24">
      {/* Narrative blocks — floating directly in space */}
      <div className="mx-auto flex max-w-6xl flex-col gap-44">
        {STORY_ITEMS.map((item, idx) => (
          <div
            key={idx}
            className="story-block relative flex min-h-[55vh] flex-col justify-center border-l border-white/15 pl-8 md:pl-16"
          >
            {/* Number indicator */}
            <span className="story-number font-mono text-xs font-medium tracking-[0.5em] text-cyan-300/80 uppercase drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              {item.number}
            </span>

            {/* Main title — Sleek, elegant extralight editorial font */}
            <h2 className="story-title mt-6 text-4xl font-extralight tracking-[0.16em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] sm:text-6xl md:text-7xl lg:text-8xl">
              {item.title}
            </h2>

            {/* Subtitle — Clean light typography */}
            <p className="story-subtitle mt-6 max-w-2xl text-lg font-light leading-relaxed tracking-[0.04em] text-slate-200/80 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] md:text-2xl">
              {item.subtitle}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}