"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

/**
 * Contact — Floating Abyssal Sea Floor Layer.
 *
 * Ultra-sleek, extralight floating contact typography with zero container boxes.
 */
export default function Contact() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const elements = containerRef.current?.querySelectorAll(".contact-anim");
      if (elements && elements.length > 0) {
        gsap.fromTo(
          Array.from(elements),
          { opacity: 0, y: 45, filter: "blur(12px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.2,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 70%",
            },
          }
        );
      }
    },
    { scope: containerRef }
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      ref={containerRef}
      className="relative z-10 flex min-h-screen flex-col justify-between px-6 py-24 md:px-24"
    >
      {/* Top Header */}
      <div className="contact-anim">
        <span className="font-mono text-xs font-medium tracking-[0.5em] text-cyan-300/80 uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
          03 // CONTACT &amp; INQUIRIES
        </span>
      </div>

      {/* Main Call to Action */}
      <div className="my-auto py-16">
        <p className="contact-anim text-xs font-mono font-medium tracking-[0.4em] text-white/50 uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
          READY TO CREATE SOMETHING UNFORGETTABLE?
        </p>

        <a
          href="https://www.linkedin.com/in/tarun-maurya-680191382?utm_source=share_via&utm_content=profile&utm_medium=member_android"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-anim group mt-8 block w-fit"
        >
          <h2 className="text-4xl font-extralight tracking-[0.08em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] transition-all duration-700 group-hover:tracking-[0.14em] group-hover:text-cyan-200 sm:text-6xl md:text-8xl lg:text-9xl">
            LET&apos;S TALK.
          </h2>
          <div className="h-[1px] w-full scale-x-0 bg-white/40 transition-transform duration-700 origin-left group-hover:scale-x-100" />
        </a>
      </div>

      {/* Footer Meta Details */}
      <div className="contact-anim flex flex-col justify-between gap-8 border-t border-white/15 pt-12 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-mono font-medium tracking-[0.3em] text-white/40 uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            LOCATION
          </p>
          <p className="mt-2 text-sm font-light tracking-[0.2em] text-white/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            AVAILABLE WORLDWIDE
          </p>
        </div>

        <div className="flex gap-12 text-xs font-mono font-medium tracking-[0.3em] text-white/50 uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
          <a
            href="https://www.linkedin.com/in/tarun-maurya-680191382?utm_source=share_via&utm_content=profile&utm_medium=member_android"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-300 hover:text-white"
          >
            LINKEDIN
          </a>
          <a
            href="https://www.instagram.com/tarungotcaught?igsh=MXExaGhxOGFqOXFlMg=="
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-300 hover:text-white"
          >
            INSTAGRAM
          </a>
        </div>

        {/* Ascent Button */}
        <button
          onClick={scrollToTop}
          className="group flex items-center gap-3 text-xs font-mono font-medium tracking-[0.4em] text-white/50 uppercase transition-colors duration-300 hover:text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]"
        >
          <span>ASCENT</span>
          <span className="transition-transform duration-300 group-hover:-translate-y-1">
            ↑
          </span>
        </button>
      </div>
    </footer>
  );
}
