"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { PROJECTS, Project } from "./projectData";
import ProjectItem from "./ProjectItem";

/**
 * Projects Section — Floating Inline Video Showcase.
 *
 * Videos float directly inside the underwater 3D environment.
 * No modals, no popups — everything lives in the scroll flow.
 */
export default function Projects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useGSAP(
    () => {
      const heading = containerRef.current?.querySelector(".projects-heading");
      if (heading) {
        gsap.fromTo(
          heading,
          { opacity: 0, y: 60, filter: "blur(14px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 80%",
            },
          }
        );
      }

      // Animate each video player into view
      const players = containerRef.current?.querySelectorAll(".video-float");
      if (players) {
        players.forEach((player) => {
          gsap.fromTo(
            player,
            { opacity: 0, y: 60, scale: 0.95, filter: "blur(10px)" },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: player,
                start: "top 80%",
              },
            }
          );
        });
      }
    },
    { scope: containerRef }
  );

  const handleHover = (project: Project | null) => {
    setActiveProject(project);
  };

  return (
    <section
      ref={containerRef}
      className="relative z-10 min-h-screen px-6 py-36 md:px-24"
    >
      {/* Section Header — Floating text */}
      <div className="projects-heading mb-16 max-w-6xl mx-auto">
        <span className="font-mono text-xs font-medium tracking-[0.5em] text-cyan-300/80 uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
          02 // SELECTED WORKS
        </span>
        <h2 className="mt-4 text-3xl font-extralight tracking-[0.2em] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] md:text-5xl lg:text-6xl">
          FEATURED CUTS
        </h2>
      </div>

      {/* Projects List — Floating rows with inline video */}
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        {PROJECTS.map((project, idx) => (
          <div key={project.id}>
            <ProjectItem
              project={project}
              index={idx}
              isActive={activeProject?.id === project.id}
              onHover={handleHover}
              onSelect={() => {}}
            />

            {/* Inline floating video player — directly in the scroll flow */}
            {project.videoUrl && (
              <div className="video-float my-8 mx-auto max-w-4xl">
                {/* Floating label */}
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-[1px] w-8 bg-cyan-400/60" />
                  <span className="font-mono text-[10px] font-medium tracking-[0.5em] text-cyan-300/70 uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                    PREVIEW CUT
                  </span>
                </div>

                {/* Video container — floating with subtle border */}
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/15 shadow-[0_12px_50px_rgba(0,0,0,0.7)]">
                  <video
                    src={project.videoUrl}
                    controls
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-contain bg-black/40"
                  />
                </div>

                {/* Floating specs below video */}
                <div className="mt-3 flex items-center gap-6 font-mono text-[10px] tracking-[0.35em] text-white/40 uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                  <span>{project.format}</span>
                  <span className="h-1 w-1 rounded-full bg-white/20" />
                  <span>{project.role}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
