import Background from "@/component/ui/Background";
import WaterCaustics from "@/component/ui/WaterCaustics";
import OceanLayers from "@/component/ui/OceanLayers";
import BubbleCanvas from "@/component/ui/BubbleCanvas";
import FishSchoolCanvas from "@/component/ui/FishSchoolCanvas";
import OceanCreatures from "@/component/ui/OceanCreatures";
import MouseGlow from "@/component/ui/MouseGlow";
import DepthHUD from "@/component/ui/DepthHUD";
import Intro from "@/component/intro/Intro";
import MainHero from "@/component/hero/MainHero";
import Story from "@/component/sections/Story";
import Projects from "@/component/projects/Projects";
import Contact from "@/component/sections/Contact";

/**
 * The Deep Dive — Spatially Distributed Ocean Ecosystem.
 *
 * All marine life (130 fish & 6 large species) are evenly distributed across
 * the full viewport width and height lanes (0% to 100% Y), eliminating clustering.
 */
export default function Home() {
  return (
    // No bg here — Background.tsx owns the base color entirely
    <main className="relative">
      {/* Z -20: Base environment colour (Background) */}
      <Background />

      {/* Z -10: Caustic beams & god rays above environment */}
      <WaterCaustics />

      {/* Z -10: Cavern rock walls & coral floor */}
      <OceanLayers />

      {/* Z 1: Canvas dynamics — bubbles, fish, creatures */}
      <BubbleCanvas />
      <FishSchoolCanvas />
      <OceanCreatures />

      {/* Z 1: Submarine searchlight */}
      <MouseGlow />

      {/* Z 40: Depth telemetry HUD */}
      <DepthHUD />

      {/* Z 100: Entrance overlay */}
      <Intro />

      {/* Narrative sections — transparent backgrounds */}
      <MainHero />
      <Story />
      <Projects />
      <Contact />
    </main>
  );
}