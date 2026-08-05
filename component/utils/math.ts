/**
 * Deep Dive — Math Utilities
 * Reusable primitives for animations, interpolation, and easing.
 * Never duplicate these — import from here.
 */

/** Linear interpolation between two values. */
export const lerp = (start: number, end: number, factor: number): number =>
  start + (end - start) * factor;

/** Clamp a value between min and max. */
export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/** Cubic Hermite smooth step — smooth easing between 0 and 1. */
export const smoothstep = (edge0: number, edge1: number, x: number): number => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

/** Quintic Hermite — extra smooth, ideal for camera transitions. */
export const smootherstep = (edge0: number, edge1: number, x: number): number => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
};

/** Map a value from one range to another. */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;

/** Ease in-out cubic. */
export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Ease out expo — ideal for cinematic element entrances. */
export const easeOutExpo = (t: number): number =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

/** Ease in expo — ideal for exits and the dive. */
export const easeInExpo = (t: number): number =>
  t === 0 ? 0 : Math.pow(2, 10 * t - 10);

/** Ease out quart — heavy deceleration. */
export const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

/** Convert degrees to radians. */
export const radians = (degrees: number): number => (degrees * Math.PI) / 180;

/** Random float in range [min, max]. */
export const randomBetween = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

/** Round to N decimal places. */
export const round = (value: number, decimals = 2): number =>
  Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
