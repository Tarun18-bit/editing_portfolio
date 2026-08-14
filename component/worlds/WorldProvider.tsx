"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { WORLDS, WorldTheme, getCurrentWorld } from "./worldConfig";
import { Project, PROJECTS } from "@/component/projects/projectData";

interface MouseState {
  x: number;
  y: number;
  nx: number; // Normalized -1 to +1
  ny: number;
}

interface WorldContextType {
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;
  currentWorld: WorldTheme;
  mouse: MouseState;
  selectedProject: Project | null;
  openProjectModal: (project: Project) => void;
  closeProjectModal: () => void;
  isDiving: boolean;
  setIsDiving: (diving: boolean) => void;
}

const WorldContext = createContext<WorldContextType | undefined>(undefined);

export function WorldProvider({ children }: { children: React.ReactNode }) {
  const [scrollProgress, setScrollProgressState] = useState(0);
  const [currentWorld, setCurrentWorld] = useState<WorldTheme>(WORLDS[0]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDiving, setIsDiving] = useState(false);
  const [mouse, setMouse] = useState<MouseState>({ x: 0, y: 0, nx: 0, ny: 0 });

  const setScrollProgress = (progress: number) => {
    const clamped = Math.max(0, Math.min(1, progress));
    setScrollProgressState((prev) => {
      if (Math.abs(prev - clamped) < 0.0001) return prev;
      return clamped;
    });

    const world = getCurrentWorld(clamped);
    setCurrentWorld((prevWorld) => {
      if (prevWorld.id === world.id) return prevWorld;
      return world;
    });
  };

  useEffect(() => {
    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        const halfW = window.innerWidth / 2;
        const halfH = window.innerHeight / 2;
        const nx = Math.max(-1, Math.min(1, (e.clientX - halfW) / halfW));
        const ny = Math.max(-1, Math.min(1, (e.clientY - halfH) / halfH));

        setMouse({
          x: e.clientX,
          y: e.clientY,
          nx,
          ny,
        });
        rafId = null;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const openProjectModal = (project: Project) => {
    setSelectedProject(project);
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
  };

  return (
    <WorldContext.Provider
      value={{
        scrollProgress,
        setScrollProgress,
        currentWorld,
        mouse,
        selectedProject,
        openProjectModal,
        closeProjectModal,
        isDiving,
        setIsDiving,
      }}
    >
      {children}
    </WorldContext.Provider>
  );
}

export function useWorld() {
  const context = useContext(WorldContext);
  if (!context) {
    throw new Error("useWorld must be used within a WorldProvider");
  }
  return context;
}
