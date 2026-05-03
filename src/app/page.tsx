// app/page.tsx
"use client";

import { useEffect } from "react";
import HeroSection        from "@/components/homepage/HeroSection";
import StatsStrip         from "@/components/homepage/StatStrip";
import AanrSectorSection  from "@/components/homepage/AanrSectorSection";
import AboutSection       from "@/components/homepage/AboutSection";
import HowItWorksSection  from "@/components/homepage/HowItWorksSection";
import MapSection         from "@/components/homepage/MapSection";

export default function HomePage() {
  // clear previous assessment data on landing
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("aanr_tracer_assessment");
    }
  }, []);

  return (
    <main className="font-[var(--font-body)] bg-[var(--color-bg)] text-[var(--color-text)]">
      <HeroSection />
      <StatsStrip />
      <AanrSectorSection />
      <AboutSection />
      <HowItWorksSection />
      <MapSection />
    </main>
  );
}