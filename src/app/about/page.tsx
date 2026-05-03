"use client";

// components - reused homepage
import AboutSection from "@/components/homepage/AboutSection";
import HowItWorksSection from "@/components/homepage/HowItWorksSection";
import MapSection from "@/components/homepage/MapSection";

export default function About() {
  return (
    <main className="font-['DM Sans'] bg-[var(--color-bg-card)] text-[var(--color-text)]">

      {/* HEADER */}
      <section className="relative bg-[var(--color-primary)] px-6 lg:px-[6vw] pt-[140px] pb-[100px] overflow-hidden">
        
        {/* grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "35px 35px" }} />
        
        {/* glow */}
        <div className="absolute -top-[200px] -right-[100px] w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(141,197,64,0.18) 0%,transparent 50%)" }} />

          {/* blue glow */}
      <div className="absolute -top-[100px] -left-[150px] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(0,173,241,0.10) 0%,transparent 70%)" }} />

        <div className="relative z-10 max-w-[1200px] mx-auto">
          <h1 className=" text-[clamp(40px,5vw,64px)] text-white leading-[1.1] tracking-tight mb-5 max-w-[600px]">
            About <em className="text-[var(--color-accent)]">TRACER</em>
          </h1>
          <p className="text-[16px] text-[var(--color-text-faintest)] font-light max-w-[500px] leading-[1.7]">
            Learn how AANR-TRACER supports technology readiness assessment and commercialization across the AANR sector.
          </p>
        </div>
      </section>

      {/* Wave dvider */}
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block w-full bg-[#0f2e1a]">
        <path fill="var(--color-bg-card)" d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
      </svg>

      {/* About section same as the one from the homepage */}
      <AboutSection />

      {/* How it works section same as the one from the homepage */}
      <HowItWorksSection />

      {/* location section same as the one from the homepage */}
      <MapSection />


    </main>
  );
}