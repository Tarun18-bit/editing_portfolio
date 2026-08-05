import gsap from "gsap";

/**
 * Camera Dive Transition Architecture.
 *
 * Sequence when clicking "Begin Experience":
 * 1. Compression phase (0.45s) — Scene contracts, pressure builds.
 * 2. Dive phase (1.6s) — Rushes through the hero text down into the ocean water.
 * 3. Smooth scroll plunge down to the next oceanic depth layer.
 */
export type DivePhase = "idle" | "preparing" | "diving" | "arrived";

export interface DiveConfig {
  onPhaseChange?: (phase: DivePhase) => void;
  onComplete?: () => void;
}

export function prepareDive(hero: HTMLElement): gsap.core.Timeline {
  const tl = gsap.timeline({ paused: true });

  tl.to(hero, {
    scale: 0.96,
    filter: "brightness(1.15)",
    duration: 0.45,
    ease: "power2.in",
  });

  return tl;
}

export function startDive(
  hero: HTMLElement,
  config: DiveConfig = {}
): gsap.core.Timeline {
  const { onPhaseChange, onComplete } = config;

  const tl = gsap.timeline({
    onComplete: () => {
      onPhaseChange?.("arrived");
      onComplete?.();
    },
  });

  onPhaseChange?.("preparing");

  // 1. Water Pressure Compression
  tl.to(hero, {
    scale: 0.95,
    filter: "brightness(1.25)",
    duration: 0.42,
    ease: "power2.in",
  });

  // 2. Underwater Plunge & Descent
  tl.to(
    hero,
    {
      scale: 22,
      opacity: 0,
      filter: "blur(24px) brightness(3.5)",
      duration: 1.65,
      ease: "power4.in",
      transformOrigin: "center center",
      onStart: () => {
        onPhaseChange?.("diving");
        // Smoothly plunge down into the ocean depth section
        window.scrollTo({
          top: window.innerHeight * 0.9,
          behavior: "smooth",
        });
      },
    },
    ">-0.05"
  );

  return tl;
}