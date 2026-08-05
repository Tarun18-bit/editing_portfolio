"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Project } from "./projectData";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

/**
 * ProjectModal — Interactive Fullscreen Cinema Focus Experience.
 *
 * Plays real embedded video files with custom controls, video metrics,
 * and atmospheric glowing backdrop illumination.
 */
export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      if (project && modalRef.current) {
        gsap.fromTo(
          modalRef.current,
          { opacity: 0, scale: 0.96, filter: "blur(20px)" },
          { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.8, ease: "power4.out" }
        );

        gsap.fromTo(
          contentRef.current?.children ? Array.from(contentRef.current.children) : [],
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, delay: 0.2, ease: "power3.out" }
        );
      }
    },
    { dependencies: [project] }
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#01040a]/95 p-6 backdrop-blur-2xl md:p-12 overflow-y-auto"
    >
      {/* Background glow tailored to project */}
      <div
        className="absolute inset-0 -z-10 opacity-35 blur-[120px]"
        style={{ background: project.gradient }}
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-8 top-8 font-mono text-xs font-semibold tracking-[0.4em] text-cyan-300 transition-colors duration-300 hover:text-white uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
      >
        [ ESC / CLOSE ]
      </button>

      {/* Main content container */}
      <div ref={contentRef} className="flex max-w-5xl w-full flex-col gap-8 text-left my-auto">
        {/* Category & Year */}
        <div className="flex items-center gap-4 font-mono text-xs font-medium tracking-[0.4em] text-cyan-200/80 uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          <span>{project.category}</span>
          <span>//</span>
          <span>{project.year}</span>
          <span>//</span>
          <span>RUNTIME {project.duration}</span>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-extralight tracking-[0.1em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] sm:text-5xl md:text-6xl lg:text-7xl">
          {project.title}
        </h2>

        {/* Cinema Video Player / Preview Frame */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/20 bg-black shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
          {project.videoUrl ? (
            <video
              ref={videoRef}
              src={project.videoUrl}
              controls
              autoPlay
              playsInline
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md">
                  <div className="ml-1 h-0 w-0 border-y-[8px] border-l-[14px] border-y-transparent border-l-white" />
                </div>
                <span className="font-mono text-xs tracking-[0.4em] text-cyan-200/80 uppercase">
                  PREVIEW CUT READY
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Description & Technical Specs */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <p className="text-base font-light leading-relaxed text-slate-200/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] md:text-lg">
              {project.description}
            </p>
          </div>

          <div className="flex flex-col gap-2 font-mono text-xs text-slate-300/80 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            <p><span className="text-cyan-300/90">FORMAT:</span> {project.format || "1080P // HIGH RETAIN"}</p>
            <p><span className="text-cyan-300/90">ROLE:</span> {project.role || "LEAD EDITOR & MOTION DESIGNER"}</p>
            <p><span className="text-cyan-300/90">AUDIO:</span> STEREO SFX &amp; BEAT SYNC</p>
          </div>
        </div>
      </div>
    </div>
  );
}
