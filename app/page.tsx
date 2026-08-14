"use client";

import React from "react";
import { WorldProvider } from "@/component/worlds/WorldProvider";
import { useCameraControls } from "@/component/camera/useCameraControls";
import Background from "@/component/ui/Background";
import ThreeCanvas from "@/component/webgl/ThreeCanvas";
import DepthHUD from "@/component/ui/DepthHUD";
import MainHero from "@/component/hero/MainHero";
import Story from "@/component/sections/Story";
import Projects from "@/component/projects/Projects";
import Contact from "@/component/sections/Contact";
import VideoTheaterModal from "@/component/projects/VideoTheaterModal";

function OceanExperience() {
  // Initialize Lenis smooth scroll and camera depth tracking
  useCameraControls();

  return (
    <main className="relative min-h-screen selection:bg-cyan-400 selection:text-black">
      {/* Dynamic World Background Color & Image Attenuation */}
      <Background />

      {/* High-End Continuous 3D WebGL Ocean Universe */}
      <ThreeCanvas />

      {/* Real-time Navigation Telemetry HUD */}
      <DepthHUD />

      {/* World 01: Surface & Shallow Ocean (Hero Intro) */}
      <MainHero />

      {/* Story & Motion Philosophy */}
      <Story />

      {/* World 02 -> 05: Multi-World Integrated Video Portals */}
      <Projects />

      {/* World 06: Ocean Floor Expedition End (Contact Form) */}
      <Contact />

      {/* Interactive Cinematic Fullscreen Video Theater Modal */}
      <VideoTheaterModal />
    </main>
  );
}

export default function Home() {
  return (
    <WorldProvider>
      <OceanExperience />
    </WorldProvider>
  );
}