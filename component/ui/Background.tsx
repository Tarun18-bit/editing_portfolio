"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Background — 16:9 Ultra HD Underwater Cavern Atmosphere.
 *
 * Employs uncompressed, razor-sharp 16:9 widescreen 4K photography.
 * Scroll parallax scaling and dynamic light attenuation create a deep 3D atmosphere.
 */
export default function Background() {
  const containerRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const darkOverlayRef = useRef<HTMLDivElement>(null);

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
          opacity: 0,
          scale: 1.08,
          y: "7%",
          filter: "blur(10px) brightness(0.52)",
          ease: "none",
        })
        .to(
          imageRef.current,
          {
            opacity: 1,
            scale: 1.14,
            y: "3%",
            filter: "brightness(0.88) contrast(1.18) saturate(1.3)",
            ease: "none",
          },
          0
        )
        .to(
          darkOverlayRef.current,
          {
            opacity: 0.82,
            ease: "none",
          },
          0
        );

      gsap.fromTo(
        surfaceRef.current,
        {
          scale: 1,
          y: 0,
          filter: "blur(0px) brightness(1)",
          opacity: 1,
        },
        {
          y: "-5%",
          filter: "blur(0.8px) brightness(1.1)",
          opacity: 1,
          duration: 14,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        }
      );

      gsap.fromTo(
        imageRef.current,
        {
          scale: 1.04,
          y: "-1%",
          filter: "brightness(1) contrast(1.1)",
        },
        {
          scale: 1.14,
          y: "4%",
          filter: "brightness(1.12) contrast(1.3)",
          duration: 16,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        }
      );

      gsap.to(surfaceRef.current, {
        rotateX: 0.3,
        rotateY: 0.25,
        duration: 12,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden bg-[#010814]"
    >
      <div
        ref={surfaceRef}
        className="absolute inset-0 overflow-hidden"
        style={{
          opacity: 1,
          willChange: "opacity, transform, filter",
        }}
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

        <div
          className="absolute inset-x-0 top-0 h-[30vh] opacity-50"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(150,220,255,0.08) 42%, transparent 100%)",
            filter: "blur(10px)",
          }}
        />

        <div
          className="absolute left-[14%] top-[18%] h-20 w-52 rounded-full opacity-80 blur-[2px]"
          style={{
            background: "rgba(255,255,255,0.28)",
            boxShadow: "40px 16px 0 10px rgba(255,255,255,0.22), 110px 8px 0 12px rgba(255,255,255,0.16)",
            transform: "scale(1.2)",
          }}
        />

        <div
          className="absolute right-[14%] top-[20%] h-24 w-60 rounded-full opacity-75 blur-[2px]"
          style={{
            background: "rgba(255,255,255,0.24)",
            boxShadow: "-46px 12px 0 10px rgba(255,255,255,0.18), -120px 18px 0 15px rgba(255,255,255,0.14)",
            transform: "scale(1.15)",
          }}
        />

        <div
          className="absolute inset-x-0 top-[42%] h-[14%]"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(160,220,255,0.6) 16%, rgba(51,151,206,0.28) 40%, rgba(11,86,144,0.12) 100%)",
            borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
            filter: "blur(3px)",
            boxShadow: "0 18px 36px rgba(120, 214, 255, 0.2)",
          }}
        />

        <div
          className="absolute inset-x-[-6%] top-[44%] h-[12%] opacity-90"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, rgba(146,214,255,0.18) 20%, transparent 60%), repeating-radial-gradient(circle at 50% 50%, rgba(255,255,255,0.18) 0 2px, transparent 2px 16px)",
            filter: "blur(8px)",
          }}
        />

        <div
          className="absolute inset-x-0 top-[48%] h-[52vh]"
          style={{
            background:
              "linear-gradient(180deg, rgba(15,123,185,0.76) 0%, rgba(17,122,179,0.9) 12%, rgba(9,86,139,0.96) 30%, rgba(4,45,76,0.98) 52%, rgba(2,10,23,1) 100%)",
          }}
        />

        <div
          className="absolute inset-x-0 top-[48%] h-[52vh] opacity-55"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.09) 12%, transparent 28%), repeating-linear-gradient(180deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 2px, transparent 18px), repeating-linear-gradient(90deg, rgba(120,200,255,0.06) 0px, rgba(120,200,255,0.06) 2px, transparent 2px, transparent 24px), radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 18%, transparent 52%)",
            filter: "blur(2px)",
          }}
        />

        <div
          className="absolute inset-x-0 top-[48%] h-[52vh] opacity-75"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.08) 12%, rgba(255,255,255,0.03) 28%, transparent 100%)",
            transform: "scaleY(1.12)",
          }}
        />

        <div
          className="absolute inset-x-[8%] top-[51%] h-[0.75vh] opacity-90"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 12%, rgba(255,255,255,0.75) 50%, rgba(255,255,255,0.5) 88%, transparent 100%)",
            filter: "blur(1px)",
            borderRadius: "9999px",
          }}
        />
      </div>

      <div
        ref={imageRef}
        className="absolute inset-0 opacity-0 pointer-events-none will-change-transform"
      >
        <img
          src="/underwater_cavern_hd.jpg"
          alt="Ultra HD Underwater Cavern Widescreen"
          className="h-full w-full object-cover object-center filter brightness-[0.95] contrast-[1.08] saturate-[1.05]"
          style={{ imageRendering: "crisp-edges" }}
        />
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 12%, rgba(180, 245, 255, 0.38) 0%, rgba(0, 160, 220, 0.15) 45%, transparent 75%)",
        }}
      />

      <div
        ref={darkOverlayRef}
        className="absolute inset-0 pointer-events-none opacity-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(1, 8, 20, 0.2) 0%, rgba(1, 8, 20, 0.35) 25%, rgba(1, 4, 10, 0.82) 100%)",
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(1, 6, 14, 0.5) 80%, rgba(1, 6, 14, 0.9) 100%)",
        }}
      />
    </div>
  );
}