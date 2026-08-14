"use client";

import React from "react";
import { PROJECTS } from "./projectData";
import WorldProjectPortal from "./WorldProjectPortal";

export default function Projects() {
  const presentationStyles: Array<"coral_portal" | "floating_widescreen" | "dark_shadow" | "abyssal_monolith"> = [
    "coral_portal",
    "floating_widescreen",
    "dark_shadow",
    "abyssal_monolith",
  ];

  return (
    <section className="relative z-20 flex flex-col items-center">
      {PROJECTS.map((project, idx) => (
        <WorldProjectPortal
          key={project.id}
          project={project}
          presentationStyle={presentationStyles[idx % presentationStyles.length]}
        />
      ))}
    </section>
  );
}
