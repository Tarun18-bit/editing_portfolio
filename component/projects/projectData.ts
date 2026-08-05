export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  duration: string;
  description: string;
  gradient: string;
  accentColor: string;
  videoUrl?: string;
  role?: string;
  format?: string;
}

export const PROJECTS: Project[] = [
  {
    id: "edit-1-assignment",
    title: "VIDEO EDITING MASTERCLASS",
    category: "Edutainment & Promo Cut",
    year: "2026",
    duration: "00:25",
    description: "High-retention video edit featuring green-screen chroma keying, paper texture kinetic typography, timeline motion graphics, and fast-paced sound sync.",
    gradient: "radial-gradient(circle, rgba(0,200,240,0.4) 0%, rgba(5,7,13,0.95) 80%)",
    accentColor: "rgba(0,225,255,0.9)",
    videoUrl: "/videos/edit-1.mp4",
    role: "LEAD EDITOR & MOTION DESIGNER",
    format: "1080P // KINETIC TYPOGRAPHY & CHROMA KEY",
  },
  {
    id: "assignment-1-motion-study",
    title: "TALKING HEAD // MOTION STUDY",
    category: "Talking Head Edit",
    year: "2026",
    duration: "00:17",
    description: "A concise talking-head social edit focused on rhythm, clean cutaways, and natural pacing for attention retention.",
    gradient: "radial-gradient(circle, rgba(0,160,180,0.38) 0%, rgba(5,7,13,0.95) 80%)",
    accentColor: "rgba(90,220,255,0.9)",
    videoUrl: "/videos/assignment-1_4_1.mp4",
    role: "EDITOR / SOCIAL VIDEO CUTTER",
    format: "4K // TALKING HEAD EDIT",
  },
  {
    id: "echoes-of-silence",
    title: "ECHOES OF SILENCE",
    category: "Narrative Short",
    year: "2025",
    duration: "14:20",
    description: "An exploration of isolation in a hyper-connected world. Pacing calibrated frame by frame.",
    gradient: "radial-gradient(circle, rgba(40,55,90,0.4) 0%, rgba(5,7,13,0.95) 80%)",
    accentColor: "rgba(140,175,240,0.85)",
    role: "CINEMATIC EDITOR",
    format: "4K DCI // PRORES 4444 XQ",
  },
  {
    id: "the-monolith",
    title: "THE MONOLITH",
    category: "Documentary",
    year: "2024",
    duration: "42:00",
    description: "Architectural soundscapes and brutalist aesthetics woven into a silent visual symphony.",
    gradient: "radial-gradient(circle, rgba(60,60,75,0.4) 0%, rgba(5,7,13,0.95) 80%)",
    accentColor: "rgba(200,210,230,0.85)",
    role: "EDITOR & SOUND DESIGNER",
    format: "4K // LOG COLOR GRADED",
  },
];
