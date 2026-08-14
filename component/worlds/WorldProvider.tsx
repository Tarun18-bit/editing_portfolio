"use client";

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { WORLDS, WorldTheme, getCurrentWorld } from "./worldConfig";
import { Project } from "@/component/projects/projectData";

export interface MouseState {
  x: number;
  y: number;
  nx: number; // Normalized -1 to +1
  ny: number;
}

interface WorldContextType {
  scrollProgressRef: React.RefObject<number>;
  setScrollProgress: (progress: number) => void;
  currentWorld: WorldTheme;
  mouseRef: React.RefObject<MouseState>;
  selectedProject: Project | null;
  openProjectModal: (project: Project) => void;
  closeProjectModal: () => void;
  isDiving: boolean;
  setIsDiving: (diving: boolean) => void;
}

const WorldContext = createContext<WorldContextType | undefined>(undefined);

export function WorldProvider({ children }: { children: React.ReactNode }) {
  const scrollProgressRef = useRef<number>(0);
  const mouseRef = useRef<MouseState>({ x: 0, y: 0, nx: 0, ny: 0 });

  const [currentWorld, setCurrentWorld] = useState<WorldTheme>(WORLDS[0]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDiving, setIsDiving] = useState(false);

  const setScrollProgress = useCallback((progress: number) => {
    const clamped = Math.max(0, Math.min(1, progress));
    scrollProgressRef.current = clamped;

    const world = getCurrentWorld(clamped);
    setCurrentWorld((prevWorld) => {
      if (prevWorld.id === world.id) return prevWorld;
      return world;
    });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      const nx = Math.max(-1, Math.min(1, (e.clientX - halfW) / halfW));
      const ny = Math.max(-1, Math.min(1, (e.clientY - halfH) / halfH));

      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        nx,
        ny,
      };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const openProjectModal = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  const closeProjectModal = useCallback(() => {
    setSelectedProject(null);
  }, []);

  return (
    <WorldContext.Provider
      value={{
        scrollProgressRef,
        setScrollProgress,
        currentWorld,
        mouseRef,
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
