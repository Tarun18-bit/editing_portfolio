import gsap from "gsap";

export interface DiveOptions {
  onStart?: () => void;
  onComplete?: () => void;
}

export function executeSurfaceDive(
  heroElement: HTMLElement,
  canvasOverlay: HTMLElement | null,
  options: DiveOptions = {}
) {
  const { onStart, onComplete } = options;

  onStart?.();

  const tl = gsap.timeline({
    onComplete: () => {
      onComplete?.();
    },
  });

  // 1. Physical Pressure Compression
  tl.to(heroElement, {
    scale: 0.94,
    filter: "brightness(1.3) contrast(1.1)",
    duration: 0.45,
    ease: "power2.in",
  });

  // Optional: Canvas flash ripple overlay
  if (canvasOverlay) {
    tl.to(
      canvasOverlay,
      {
        opacity: 0.8,
        scale: 1.1,
        duration: 0.45,
        ease: "power2.in",
      },
      0
    );
  }

  // 2. Camera Plunge through Surface Layer
  tl.to(heroElement, {
    scale: 18,
    opacity: 0,
    filter: "blur(28px) brightness(4.0)",
    duration: 1.8,
    ease: "power4.inOut",
    transformOrigin: "center center",
    onStart: () => {
      // Smoothly plunge scroll position into World 02 (Coral Reef ~18% depth)
      const targetScroll = (document.documentElement.scrollHeight - window.innerHeight) * 0.18;
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    },
  });

  if (canvasOverlay) {
    tl.to(
      canvasOverlay,
      {
        opacity: 0,
        scale: 2.5,
        duration: 1.8,
        ease: "power4.inOut",
      },
      "-=1.8"
    );
  }

  return tl;
}
