export interface WorldTheme {
  id: string;
  name: string;
  depthMeters: number;
  scrollRange: [number, number]; // Normalized scroll position range [start, end]
  mood: string;
  environment: {
    bgGradientTop: string;
    bgGradientBottom: string;
    waterColor: string;
    fogDensity: number;
    lightType: "sunlight" | "caustics" | "cool_blue" | "twilight" | "abyssal" | "seabed";
    lightIntensity: number;
  };
  particles: {
    type: "bubbles" | "plankton" | "bioluminescent" | "snow" | "hydrothermal";
    count: number;
    speed: number;
    color: string;
    glow: boolean;
  };
  creatures: Array<{
    type: "reef_fish" | "manta_ray" | "jellyfish" | "whale" | "seabed_glow";
    count: number;
    scale: number;
    speed: number;
    depthOffset: number;
  }>;
  camera: {
    floatAmplitude: number;
    floatSpeed: number;
    tiltFactor: number;
    zoomLevel: number;
  };
  projectId?: string;
  presentationStyle?: "coral_portal" | "floating_widescreen" | "dark_shadow" | "abyssal_monolith";
}

export const WORLDS: WorldTheme[] = [
  {
    id: "world-01",
    name: "SURFACE & SHALLOWS",
    depthMeters: 0,
    scrollRange: [0, 0.15],
    mood: "Calm, Bright, Elegant, Peaceful",
    environment: {
      bgGradientTop: "rgba(184, 232, 255, 0.95)",
      bgGradientBottom: "rgba(11, 86, 144, 0.95)",
      waterColor: "#00b4d8",
      fogDensity: 0.1,
      lightType: "sunlight",
      lightIntensity: 1.0,
    },
    particles: {
      type: "bubbles",
      count: 65,
      speed: 0.8,
      color: "rgba(255, 255, 255, 0.75)",
      glow: true,
    },
    creatures: [
      { type: "reef_fish", count: 18, scale: 0.8, speed: 1.2, depthOffset: 0.05 },
    ],
    camera: {
      floatAmplitude: 12,
      floatSpeed: 0.8,
      tiltFactor: 0.04,
      zoomLevel: 1.0,
    },
  },
  {
    id: "world-02",
    name: "CORAL REEF HAVEN",
    depthMeters: 120,
    scrollRange: [0.15, 0.35],
    mood: "Alive, Colorful, Organic, Energetic",
    environment: {
      bgGradientTop: "rgba(10, 75, 120, 0.95)",
      bgGradientBottom: "rgba(3, 30, 60, 0.98)",
      waterColor: "#0077b6",
      fogDensity: 0.25,
      lightType: "caustics",
      lightIntensity: 0.85,
    },
    particles: {
      type: "plankton",
      count: 110,
      speed: 0.6,
      color: "rgba(120, 240, 255, 0.85)",
      glow: true,
    },
    creatures: [
      { type: "reef_fish", count: 35, scale: 1.0, speed: 1.5, depthOffset: 0.2 },
    ],
    camera: {
      floatAmplitude: 15,
      floatSpeed: 1.0,
      tiltFactor: 0.06,
      zoomLevel: 1.1,
    },
    projectId: "edit-1-assignment",
    presentationStyle: "coral_portal",
  },
  {
    id: "world-03",
    name: "THE OPEN OCEAN",
    depthMeters: 550,
    scrollRange: [0.35, 0.55],
    mood: "Huge, Majestic, Vast, Cinematic",
    environment: {
      bgGradientTop: "rgba(4, 45, 85, 0.98)",
      bgGradientBottom: "rgba(1, 15, 35, 0.99)",
      waterColor: "#03045e",
      fogDensity: 0.4,
      lightType: "cool_blue",
      lightIntensity: 0.6,
    },
    particles: {
      type: "plankton",
      count: 80,
      speed: 0.4,
      color: "rgba(90, 200, 255, 0.6)",
      glow: false,
    },
    creatures: [
      { type: "manta_ray", count: 2, scale: 2.2, speed: 0.6, depthOffset: 0.45 },
    ],
    camera: {
      floatAmplitude: 18,
      floatSpeed: 0.6,
      tiltFactor: 0.08,
      zoomLevel: 0.9,
    },
    projectId: "assignment-1-motion-study",
    presentationStyle: "floating_widescreen",
  },
  {
    id: "world-04",
    name: "TWILIGHT ZONE",
    depthMeters: 1800,
    scrollRange: [0.55, 0.75],
    mood: "Mysterious, Dark, Elegant, Suspenseful",
    environment: {
      bgGradientTop: "rgba(2, 20, 45, 0.99)",
      bgGradientBottom: "rgba(1, 8, 20, 1.0)",
      waterColor: "#020c1b",
      fogDensity: 0.6,
      lightType: "twilight",
      lightIntensity: 0.35,
    },
    particles: {
      type: "bioluminescent",
      count: 140,
      speed: 0.5,
      color: "rgba(0, 229, 255, 0.9)",
      glow: true,
    },
    creatures: [
      { type: "jellyfish", count: 8, scale: 1.4, speed: 0.4, depthOffset: 0.65 },
    ],
    camera: {
      floatAmplitude: 20,
      floatSpeed: 0.5,
      tiltFactor: 0.07,
      zoomLevel: 1.0,
    },
    projectId: "echoes-of-silence",
    presentationStyle: "dark_shadow",
  },
  {
    id: "world-05",
    name: "THE ABYSSAL TRENCH",
    depthMeters: 5200,
    scrollRange: [0.75, 0.90],
    mood: "Dark, Massive, Quiet, Cinematic",
    environment: {
      bgGradientTop: "rgba(1, 10, 25, 1.0)",
      bgGradientBottom: "rgba(0, 3, 10, 1.0)",
      waterColor: "#01040a",
      fogDensity: 0.8,
      lightType: "abyssal",
      lightIntensity: 0.2,
    },
    particles: {
      type: "snow",
      count: 160,
      speed: 0.3,
      color: "rgba(140, 210, 255, 0.7)",
      glow: true,
    },
    creatures: [
      { type: "whale", count: 1, scale: 3.5, speed: 0.25, depthOffset: 0.82 },
    ],
    camera: {
      floatAmplitude: 14,
      floatSpeed: 0.4,
      tiltFactor: 0.05,
      zoomLevel: 0.85,
    },
    projectId: "the-monolith",
    presentationStyle: "abyssal_monolith",
  },
  {
    id: "world-06",
    name: "OCEAN FLOOR",
    depthMeters: 11000,
    scrollRange: [0.90, 1.0],
    mood: "Peaceful, Emotional, Final, Reflective",
    environment: {
      bgGradientTop: "rgba(0, 5, 15, 1.0)",
      bgGradientBottom: "rgba(0, 2, 5, 1.0)",
      waterColor: "#000205",
      fogDensity: 0.5,
      lightType: "seabed",
      lightIntensity: 0.4,
    },
    particles: {
      type: "hydrothermal",
      count: 90,
      speed: 0.7,
      color: "rgba(0, 240, 255, 0.85)",
      glow: true,
    },
    creatures: [
      { type: "seabed_glow", count: 12, scale: 0.9, speed: 0.3, depthOffset: 0.95 },
    ],
    camera: {
      floatAmplitude: 10,
      floatSpeed: 0.3,
      tiltFactor: 0.03,
      zoomLevel: 1.0,
    },
  },
];

export function getCurrentWorld(scrollProgress: number): WorldTheme {
  const p = Math.max(0, Math.min(1, scrollProgress));
  const found = WORLDS.find((w) => p >= w.scrollRange[0] && p <= w.scrollRange[1]);
  return found || WORLDS[WORLDS.length - 1];
}
