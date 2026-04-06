"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { tracerLevels } from "./utils/helperConstants";
import { 
  IconWheat, 
  IconFish, 
  IconLeaf,
  IconTree,
  IconFlask,
  IconSeedling,
  RiceStalk,
  WaveRipple,
  LeafSprig,
  FishDecor,
  aanrTypes,
  IconListCheck,
  IconBarChart
} from "./utils/decorativeIcons";

const steps = [
  {
    n: "01",
    Icon: IconSeedling,
    title: "Select Your Technology Type",
    desc: "Choose from 9 AANR technology categories — from new plant varieties and food products to ICT systems and agricultural machinery.",
  },
  {
    n: "02",
    Icon: IconListCheck,
    title: "Answer the Assessment",
    desc: "Go through structured questions across Technology Status, Market Readiness, IP Protection, Industry Adoption, and Regulatory Compliance.",
  },
  {
    n: "03",
    Icon: IconBarChart,
    title: "Get Your TRACER Report",
    desc: "Receive your highest completed TRACER level, identified strengths and gaps, and a roadmap toward successful commercialization.",
  },
];

// Interactive Tech Type Grid
// showcase of supported technology types
function TechTypeGrid() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-start ">
      {aanrTypes.map(({ Icon, label, sub, definition }) => {
        const isOpen = expanded === label;
        return (
          <button
            aria-expanded={isOpen}
            key={label}
            onClick={() => setExpanded(prev => prev === label ? null : label)}
            className={`bg-[var(--color-bg-card)] border rounded-2xl px-5 py-5 flex flex-col items-start text-left gap-2.5 transition-all duration-200 group w-full h-fit
              ${isOpen
                ? "border-[var(--color-accent)]/40 shadow-[0_6px_24px_rgba(15,46,26,0.10)]"
                : "border-[var(--color-border)] hover:border-[var(--color-accent-hover)] hover:shadow-[0_6px_20px_rgba(15,46,26,0.07)]"
              }`}
          >
            {/* Top row */}
            <div className="flex items-center gap-3 w-full">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200
                ${isOpen
                  ? "bg-[var(--color-accent)]/[0.15]"
                  : "bg-[var(--color-bg)] group-hover:bg-[var(--color-accent)]/[0.12]"
                }`}
              >
                <Icon className={`w-5 h-5 transition-colors duration-200 ${isOpen ? "text-[#2d8a3e]" : "text-[var(--color-accent)] group-hover:text-[#2d8a3e]"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold text-[var(--color-primary)] leading-snug">{label}</div>
                <div className="text-[12px] text-[var(--color-text-gray)] font-light leading-tight mt-1.5">{sub}</div>
              </div>

              {/* +/− toggle icon */}
              <div className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-200 ${
                isOpen
                  ? "border-[var(--color-accent)]/50 bg-[var(--color-accent)]/10"
                  : "border-[var(--color-border)] bg-transparent group-hover:border-[var(--color-accent-hover)]/40 group-hover:bg-[#var(--color-accent)-hover]/[0.06]"
              }`}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                  stroke={isOpen ? "#4aa35a" : "#94a3a0"} strokeWidth="1.8"
                  strokeLinecap="round"
                  className="transition-colors duration-200 group-hover:stroke-[var(--color-accent-hover)]"
                >
                  {isOpen ? (
                    <path d="M2 5h6" />
                  ) : (
                    <>
                      <path d="M5 2v6" />
                      <path d="M2 5h6" />
                    </>
                  )}
                </svg>
              </div>
            </div>

            {/* "Tap to learn more" hint — only shown when collapsed */}
            {!isOpen && (
              <p className="text-[10.5px] text-[var(--color-text-light-gray)] font-light italic pl-[52px] -mt-1 group-hover:text-[#4aa35a]/60 transition-colors duration-200">
                View details →
              </p>
            )}

            {/* Expanded definition */}
            {isOpen && (
              <p className="text-[12px] text-[var(--color-text)] font-light leading-relaxed border-t border-[#f0ece3] pt-3 w-full">
                {definition}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}

// Main Component 

export default function HomePage() {
  const router = useRouter();
 
  // Clear any previous assessment data when landing on home page
  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("aanr_tracer_assessment");
    }
  }, []);

  return (
    <main className="font-[var(--font-body)] bg-[var(--color-bg)] text-[var(--color-text)]">

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center bg-[var(--color-primary)] overflow-hidden px-6 lg:px-[6vw] pt-[60px] pb-[120px]">

        {/* Glows */}
        <div className="absolute -top-[200px] -right-[100px] w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(76, 177, 95, 0.18) 0%,transparent 75%)" }} />
        <div className="absolute -bottom-[100px] left-[30%] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(42, 228, 110, 0.07) 0%,transparent 75%)" }} />

        {/* Decorative motifs */}
        <WaveRipple className="absolute bottom-[90px] left-0 w-full text-[var(--color-accent-15)] pointer-events-none" />

        <div className="relative z-10 max-w-[1200px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Left */}
          <div>
            <h1 className=" text-[clamp(40px,4.2vw,52px)] leading-[1.1] text-white mb-5 tracking-tight">
              Technology Readiness<br />
              Assessment for{" "}
              <em className="text-[var(--color-accent)] italic">Commercialization</em>
              <br />Enhancement and Roadmapping
            </h1>

            <p className="text-[15px] leading-[1.75] text-[var(--color-text-faintest)] font-light mb-6 max-w-[420px]">
              Your guide in evaluating the technical and commercial readiness of AANR technologies.
            </p>

            <button
              onClick={() => router.push("/assessment/disclaimer")}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[var(--color-accent)] text-white text-[15px] font-semibold rounded-full shadow-[0_8px_32px_rgba(74,163,90,0.35)] hover:bg-[#3d8f4c] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(74,163,90,0.45)] transition-all duration-300"
            >
              Start Your Assessment
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5h6M5 2l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>

            {/* Partner Logos */}
            <div className="my-7 bg-[var(--white-35)] border border-white rounded-xl px-4 py-3 w-full max-w-[480px]">
              <div className="text-[9px] font-bold tracking-[2px] uppercase text-[var(--color-text-heading)] mb-2 text-center">A Collaborative Project by</div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Image src="/img/logos/dost-logo.png" alt="DOST" width={80} height={30} className="h-[28px] sm:h-[32px] w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
                <Image src="/img/logos/dost-pcaarrd-logo.png" alt="DOST PCAARRD" width={80} height={30} className="h-[28px] sm:h-[32px] w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
                <Image src="/img/logos/raise-logo.png" alt="RAISE" width={110} height={30} className="h-[34px] sm:h-[38px] w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
                <Image src="/img/logos/agri-hub-logo.png" alt="Agri Hub" width={80} height={30} className="h-[34px] sm:h-[38px] w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
                <Image src="/img/logos/upvisayas-logo.png" alt="UP Visayas" width={80} height={30} className="h-[38px] w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
                <Image src="/img/logos/ttbdo-logo.png" alt="TTBDO" width={80} height={30} className="h-[38px] w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
              </div>
            </div>

          </div>

          {/* Right — TRL scale */}
          <div className="hidden lg:flex flex-col gap-2.5">
            <div className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--color-text-faint)] mb-2">TRACER Scale</div>
            {tracerLevels.map(({ n, label, w, color }) => (
              <div key={n} className="flex items-center gap-5">
                <span className="text-[12px] font-bold text-[#4a6657] w-[22px] text-right flex-shrink-0">{n}</span>
                <div className="flex-1 h-2 bg-[var(--white-15)] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${w} ${color}`} />
                </div>
                <span className="text-[12px] text-[var(--color-text-faint)] w-[160px] flex-shrink-0">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Wave */}
        <svg className="absolute bottom-[-1px] left-0 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path fill="var(--color-primary-mid)" d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </section>

      {/* ═══ STATS STRIP ═══ */}
      <div className="bg-[var(--color-primary-mid)] px-6 lg:px-[6vw] py-8">
        <div className="max-w-[1200px] mx-auto flex flex-wrap justify-around gap-4 ">
          {[
            { n: "9",  label: "TRACER Levels",     Icon: IconBarChart },
            { n: "9",  label: "Technology Types",  Icon: IconFlask },
            { n: "3",  label: "AANR Sub-Sectors",  Icon: IconLeaf },
            { n: "1",  label: "Clear Roadmap",     Icon: IconListCheck },
          ].map(({ n, label, Icon }) => (
            <div key={label} className="text-center px-6 border-r border-white/[0.08] last:border-r-0 flex flex-col items-center gap-1">
              <Icon className="w-5 h-5 text-white mb-3" />
              <div className=" text-[32px] text-white leading-none">{n}</div>
              <div className="text-[11px] text-white uppercase tracking-[1.5px] font-medium mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ AANR SECTOR SHOWCASE ═══ */}
      <section className="py-[80px] px-6 lg:px-[6vw] bg-[var(--color-bg)] relative overflow-hidden">

        {/* Subtle dot grid bg */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #4aa35a 0.5px, transparent 0.5px)", backgroundSize: "32px 32px", opacity: 0.03 }} />

        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-10">
            <div>
              <span className="inline-block text-[10px] font-bold tracking-[3px] uppercase text-[var(--color-accent)] mb-4 pb-4 border-b-2 border-[var(--color-accent)]">
                Covered Technologies
              </span>
              <h2 className=" text-[clamp(28px,3vw,38px)] text-[var(--color-primary)] tracking-tight leading-snug">
                Built for the <em className="text-[var(--color-accent)]">AANR Sector</em>
              </h2>
            </div>
            <p className="text-[13.5px] text-[var(--color-text-gray)] font-light max-w-[300px] leading-relaxed">
              TRACER covers the full breadth of Agriculture, Aquatic, and Natural Resources innovations.
            </p>
          </div>

          <TechTypeGrid />
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section className="py-[100px] px-6 lg:px-[6vw] bg-[var(--color-bg-card)] relative overflow-hidden">

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[80px] items-center relative z-10">
          <div>
            <span className="inline-block text-[11px] font-bold tracking-[3px] uppercase text-[var(--color-accent)] mb-4 pb-4 border-b-2 border-[var(--color-accent)]">
              About TRACER
            </span>

            <h2 className=" text-[clamp(28px,3vw,40px)] text-[var(--color-primary)] leading-[1.15] tracking-tight mb-6">
              A structured framework for technology maturation and commercialization
            </h2>

            {/* Sector chips with icons */}
            <div className="flex flex-wrap gap-2 mb-7">
              {[
                { Icon: IconWheat, label: "Agriculture" },
                { Icon: IconFish,  label: "Aquatic" },
                { Icon: IconTree,  label: "Natural Resources" },
              ].map(({ Icon, label }) => (
                <div key={label} className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--color-text-gray)] bg-[var(--color-bg)] border border-[var(--color-border)] px-3 py-1.5 rounded-full">
                  <Icon className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                  {label}
                </div>
              ))}
            </div>

            <p className="text-justify text-[14px] leading-[1.85] text-[var(--color-text-gray)] font-light mb-4">
              TRACER is a web-based assessment and recommendation-support tool designed to systematically evaluate the current development 
              status and commercialization preparedness of Agriculture, Aquatic, and Natural Resources (AANR) technologies. The platform applies 
              a structured readiness assessment framework adapted from established tools such as the NASA Technology Readiness Level (TRL), 
              European Commission TRL, DOST VI and TAPI TRL Assessment Form, and the DOST–PCAARRD assessment framework for research, tailored 
              for applicability to AANR technologies and incorporating commercialization requirements for technologies generated using government 
              funds. 
            </p>

            <p className="text-justify text-[14px] leading-[1.85] text-[var(--color-text-gray)] font-light mb-4">
              The tool has been reviewed and enhanced by experts, technology generators, and technology transfer officers from Consortium 
              Member Institutions (CMIs) under the RAISE Program and technical experts of different divisions of DOST-PCAARRD. Using this structured 
              framework, TRACER generates evidence-based and AI-driven indicative recommendations to support the progression of technologies from 
              research and development toward adoption and utilization.
            </p>

            <p className="text-justify text-[14px] leading-[1.85] text-[var(--color-text-gray)] font-light">
              The tool evaluates technologies by category using a defined set of criteria across key areas, including technology development status, 
              intellectual property position, market and pre-commercialization readiness initiatives, industry validation and adoption, and regulatory 
              compliance. In doing so, it supports informed decision-making, standardized documentation, and strategic planning across the various 
              stages of technology maturation and commercialization.
            </p>
          </div>

          {/* Image */}
          <div className="relative">

            <div className="absolute -top-4 -left-4 right-4 bottom-4 border-2 border-[var(--color-accent)] rounded-[20px] z-0" />
            <img
              src="/img/pcaarrd-building.jpg"
              alt="PCAARRD Building"
              className="relative z-10 w-full rounded-2xl object-cover shadow-[0_24px_64px_rgba(15,46,26,0.2)]"
            />
            <div className="absolute -bottom-5 -right-5 z-20 bg-[#0f2e1a] text-white px-5 py-4 rounded-2xl text-center shadow-[0_12px_32px_rgba(15,46,26,0.3)]">
              <div className=" text-[18px] text-[var(--color-accent)] leading-none">PCAARRD</div>
              <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-[1px] mt-1">Los Baños, Laguna</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="relative py-[100px] px-6 lg:px-[6vw] bg-[#0f2e1a] overflow-hidden">
        
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

        {/* Decorative motifs */}
        <FishDecor className="absolute right-[4%] top-[12%] w-[80px] text-[var(--color-accent-15)] pointer-events-none hidden lg:block" />
        <FishDecor className="absolute right-[14%] top-[22%] w-[50px] text-[var(--color-accent-15)] pointer-events-none hidden lg:block" />
        <LeafSprig className="absolute left-[2%] bottom-[14%] w-[55px] text-[var(--color-accent-15)] pointer-events-none hidden lg:block" />
        <RiceStalk className="absolute left-[7%] bottom-[10%] w-[20px] text-[var(--color-accent-15)] pointer-events-none hidden lg:block" />
        <WaveRipple className="absolute bottom-[80px] left-0 w-full text-[var(--color-accent-15)] pointer-events-none" />

        <div className="relative z-10 max-w-[1200px] mx-auto">
          <div className="mb-14">
            <span className="inline-block text-[10px] font-bold tracking-[3px] uppercase text-[var(--color-accent)] mb-4 pb-4 border-b-2 border-[var(--color-accent)]">
              Process
            </span>
            <h2 className=" text-[clamp(30px,3vw,42px)] text-white tracking-tight">
              How <span className="text-[var(--color-accent)] italic">TRACER</span> works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {steps.map(({ n, Icon, title, desc }) => (
              <div key={n} className="bg-[var(--white-10)] border border-[var(--white-35)] hover:bg-[var(--white-15)] hover:border-[var(--color-accent)]/20 transition-all duration-300 rounded-2xl p-8">
                <div className=" text-[54px] text-[var(--color-accent)] leading-none mb-5 tracking-[-2px]">
                  {n}
                </div>
                <div className="w-10 h-10 rounded-[10px] bg-[var(--color-accent)]/12 flex items-center justify-center mb-5">
                  <Icon className="w-[18px] h-[18px] text-[var(--color-accent)]" />
                </div>
                <div className="text-[15px] font-semibold text-white mb-3 leading-snug">{title}</div>
                <p className="text-[13px] leading-[1.75] text-white font-light">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <svg className="absolute bottom-[-1px] left-0 w-full" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path fill="#f5f2ec" d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </section>

      {/* ═══ MAP ═══ */}
      <section className="py-[100px] px-6 lg:px-[6vw] bg-[var(--color-bg)]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-10">
            <div>
              <span className="inline-block text-[10px] font-bold tracking-[3px] uppercase text-[var(--color-accent)] mb-4 pb-4 border-b-2 border-[var(--color-accent)]">
                Find Us
              </span>
              <h2 className=" text-[clamp(28px,2.5vw,38px)] text-[var(--color-primary)] tracking-tight">
                Visit DOST PCAARRD
              </h2>
            </div>
            <div className="text-[13px] text-[var(--color-text-gray)] md:text-right leading-[1.6] font-light">
              DOST-PCAARRD, Los Baños<br />Laguna, Philippines 4030
            </div>
          </div>

          <div className="rounded-[20px] overflow-hidden shadow-[0_20px_60px_rgba(15,46,26,0.12)] border border-[#0f2e1a]/[0.08]">
            <iframe
              src="https://www.google.com/maps?q=DOST+PCAARRD,+Los+Baños,+Laguna&output=embed"
              width="100%"
              height="480"
              loading="lazy"
              style={{ border: 0, display: "block" }}
              allowFullScreen
            />
          </div>
        </div>
      </section>

    </main>
  );
}