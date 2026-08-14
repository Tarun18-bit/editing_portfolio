"use client";

import React, { useRef, useState, useEffect } from "react";
import { Project } from "./projectData";
import { useWorld } from "@/component/worlds/WorldProvider";
import gsap from "gsap";

interface Props {
  project: Project;
  presentationStyle: "coral_portal" | "floating_widescreen" | "dark_shadow" | "abyssal_monolith";
}

export default function WorldProjectPortal({ project, presentationStyle }: Props) {
  const { mouse, openProjectModal } = useWorld();
  const portalRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Magnetic 3D tilt reaction on mouse move
  useEffect(() => {
    if (!portalRef.current) return;
    const el = portalRef.current;

    const tiltX = mouse.ny * 14;
    const tiltY = -mouse.nx * 14;

    gsap.to(el, {
      rotateX: tiltX,
      rotateY: tiltY,
      duration: 0.6,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, [mouse]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const renderStyleWrapper = () => {
    switch (presentationStyle) {
      case "coral_portal":
        return "border-2 border-cyan-400/40 shadow-[0_0_50px_rgba(0,229,255,0.25)] rounded-3xl bg-gradient-to-b from-cyan-950/40 to-slate-950/80 backdrop-blur-md";
      case "floating_widescreen":
        return "border border-blue-400/30 shadow-[0_0_80px_rgba(3,100,220,0.35)] rounded-2xl bg-slate-950/90 backdrop-blur-lg transform perspective-1000 rotateX-2";
      case "dark_shadow":
        return "border border-cyan-500/20 shadow-[0_0_60px_rgba(0,180,240,0.2)] rounded-3xl bg-black/85 backdrop-blur-md";
      case "abyssal_monolith":
        return "border-2 border-slate-700/60 shadow-[0_0_100px_rgba(0,0,0,0.95)] rounded-xl bg-black/95 backdrop-blur-xl";
      default:
        return "border border-white/20 rounded-2xl bg-black/80";
    }
  };

  return (
    <div className="relative my-20 flex min-h-[85vh] w-full items-center justify-center px-4 md:px-8">
      <div
        ref={portalRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => openProjectModal(project)}
        className={`group relative cursor-pointer overflow-hidden transition-all duration-700 max-w-4xl w-full p-6 md:p-10 ${renderStyleWrapper()}`}
        style={{
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {/* Environmental Glow Halo */}
        <div
          className="pointer-events-none absolute -inset-20 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-40"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${project.accentColor} 0%, transparent 70%)`,
          }}
        />

        {/* Portal Header Metadata */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 font-mono text-xs tracking-[0.35em]">
          <div className="flex items-center gap-3 text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>DEPTH {project.depthLabel}</span>
            <span className="text-white/30">//</span>
            <span className="text-white/70">{project.worldName}</span>
          </div>
          <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[10px] text-white/80 backdrop-blur-sm">
            {project.year} // {project.duration}
          </span>
        </div>

        {/* Video Surface Container */}
        <div className="relative z-10 mt-6 aspect-video w-full overflow-hidden rounded-xl bg-slate-950/80 shadow-2xl border border-white/10">
          {/* Silent Hover Video Preview */}
          <video
            ref={videoRef}
            src={project.videoUrl}
            muted
            loop
            playsInline
            onLoadedData={() => setIsVideoLoaded(true)}
            className={`h-full w-full object-cover transition-all duration-700 ${
              isHovered ? "scale-105 filter brightness-105" : "scale-100 filter brightness-90 saturate-90"
            }`}
          />

          {/* Ambient Video Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30 pointer-events-none" />

          {/* Center Play Focus Indicator */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
              isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-cyan-300/60 bg-cyan-950/60 backdrop-blur-md shadow-[0_0_30px_#00e5ff]">
              <svg className="h-6 w-6 translate-x-0.5 text-cyan-300 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Project Description & Action Callout */}
        <div className="relative z-20 mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="font-mono text-xs font-semibold tracking-widest text-cyan-400 uppercase">
              {project.category}
            </p>
            <h2 className="mt-2 text-2xl md:text-4xl font-light tracking-tight text-white group-hover:text-cyan-200 transition-colors">
              {project.title}
            </h2>
            <p className="mt-3 text-sm md:text-base font-light leading-relaxed text-slate-300/80">
              {project.description}
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs tracking-widest text-white">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inset-0 rounded-full bg-cyan-400 opacity-75 animate-ping" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-cyan-300" />
            </span>
            <span className="underline underline-offset-8 decoration-cyan-400/50 group-hover:decoration-cyan-300">
              ENTER CINEMATIC THEATER
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
