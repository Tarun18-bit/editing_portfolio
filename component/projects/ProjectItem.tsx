"use client";

import { Project } from "./projectData";

interface ProjectItemProps {
  project: Project;
  index: number;
  isActive: boolean;
  onHover: (project: Project | null) => void;
  onSelect: (project: Project) => void;
}

/**
 * ProjectItem — Sleek Floating Editorial Row.
 *
 * Floating list item with hairline divider and elegant extralight typography.
 */
export default function ProjectItem({
  project,
  index,
  isActive,
  onHover,
  onSelect,
}: ProjectItemProps) {
  const indexFormatted = String(index + 1).padStart(2, "0");

  return (
    <div
      onMouseEnter={() => onHover(project)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(project)}
      className="group relative cursor-pointer border-b border-white/15 py-10 transition-all duration-700 hover:border-white/40"
    >
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        {/* Number & Title */}
        <div className="flex items-baseline gap-8">
          <span className="font-mono text-xs font-light tracking-[0.35em] text-white/40 transition-colors duration-500 group-hover:text-cyan-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            {indexFormatted}
          </span>
          <h3
            className="text-3xl font-extralight tracking-[0.14em] text-white/90 drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)] transition-all duration-500 group-hover:translate-x-4 group-hover:text-white sm:text-5xl md:text-6xl lg:text-7xl"
            style={{
              textShadow: isActive
                ? `0 0 30px ${project.accentColor}`
                : "0 4px 16px rgba(0,0,0,0.95)",
            }}
          >
            {project.title}
          </h3>
        </div>

        {/* Category & Duration */}
        <div className="flex items-center gap-6 text-xs font-light tracking-[0.3em] text-white/50 uppercase transition-all duration-500 group-hover:text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          <span>{project.category}</span>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span>{project.duration}</span>
          <span className="h-1 w-1 rounded-full bg-white/30" />
          <span>{project.year}</span>
        </div>
      </div>

      {/* Expandable brief description on active hover */}
      <div
        className={`overflow-hidden transition-all duration-700 ${
          isActive ? "max-h-24 opacity-100 pt-6" : "max-h-0 opacity-0"
        }`}
      >
        <p className="max-w-2xl text-base font-light leading-relaxed text-white/70 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
          {project.description}
        </p>
      </div>
    </div>
  );
}
