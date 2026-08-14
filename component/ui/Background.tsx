"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useWorld } from "@/component/worlds/WorldProvider";

gsap.registerPlugin(ScrollTrigger);

export default function Background() {
  const containerRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const darkOverlayRef = useRef<HTMLDivElement>(null);

  const { currentWorld } = useWorld();

  useGSAP(
    () => {
      if (!surfaceRef.current || !imageRef.current || !darkOverlayRef.current) return;

      gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      })
        .to(surfaceRef.current, {
          opacity: 0.15,
          scale: 1.25,
          y: "12%",
          filter: "blur(16px) brightness(0.35)",
          ease: "none",
        })
        .to(
          imageRef.current,
          {
            opacity: 0.85,
            scale: 1.25,
            y: "6%",
            filter: "brightness(0.75) contrast(1.3) saturate(1.2)",
            ease: "none",
          },
          0
        )
        .to(
          darkOverlayRef.current,
          {
            opacity: 0.95,
            ease: "none",
          },
          0
        );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden transition-colors duration-1000"
      style={{
        background: `linear-gradient(180deg, ${currentWorld.environment.bgGradientTop} 0%, ${currentWorld.environment.bgGradientBottom} 100%)`,
      }}
    >
      {/* Surface Sunlight Layer */}
      <div
        ref={surfaceRef}
        className="absolute inset-0 overflow-hidden transition-opacity duration-1000"
        style={{ opacity: currentWorld.environment.lightType === "sunlight" ? 1 : 0.2 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 24%, rgba(255,255,255,0.96) 0%, rgba(184,232,255,0.78) 12%, rgba(94,188,255,0.5) 24%, rgba(22,120,190,0.8) 42%, rgba(7,64,112,0.96) 62%, rgba(3,25,43,1) 100%)",
          }}
        />

        <div
          className="absolute left-1/2 top-[7%] h-[18vw] w-[18vw] min-h-[180px] min-w-[180px] -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 16%, rgba(255,255,255,0.28) 36%, rgba(125,220,255,0.18) 58%, transparent 72%)",
            filter: "blur(18px)",
            opacity: 0.96,
            boxShadow: "0 0 120px rgba(180, 240, 255, 0.38), 0 0 220px rgba(255,255,255,0.18)",
          }}
        />
      </div>

      {/* Cavern Photography Layer */}
      <div
        ref={imageRef}
        className="absolute inset-0 opacity-0 pointer-events-none will-change-transform"
      >
        <img
          src="/underwater_cavern_hd.jpg"
          alt="Ultra HD Underwater Cavern Widescreen"
          className="h-full w-full object-cover object-center filter brightness-[0.95] contrast-[1.08] saturate-[1.05]"
        />
      </div>

      {/* Ambient Vignette & Deep Water Overlay */}
      <div
        ref={darkOverlayRef}
        className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-1000"
        style={{
          background:
            "linear-gradient(180deg, rgba(1, 8, 20, 0.2) 0%, rgba(1, 8, 20, 0.4) 30%, rgba(0, 2, 8, 0.92) 100%)",
        }}
      />
    </div>
  );
}