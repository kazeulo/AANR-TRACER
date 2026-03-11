"use client";


function StepIcon({ name }: { name: string }) {
  const s = { width: 17, height: 17, fill: "none", stroke: "#4aa35a", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "clipboard")  return <svg viewBox="0 0 24 24" style={s}><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 12h6M9 16h4"/></svg>;
  if (name === "calc")       return <svg viewBox="0 0 24 24" style={s}><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h2M12 10h2M16 10h0M8 14h2M12 14h2M16 14h2M8 18h2M12 18h2M16 18h2"/></svg>;
  if (name === "lightbulb")  return <svg viewBox="0 0 24 24" style={s}><path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 4 12.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26A7 7 0 0 1 12 2z"/></svg>;
  if (name === "file")       return <svg viewBox="0 0 24 24" style={s}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>;
  return null;
}

export default function About() {
  return (
    <main className="font-['DM Sans'] bg-[var(--color-bg)] text-[var(--color-text)]">

      {/* ═══ HEADER ═══ */}
      <section className="relative bg-[#0f2e1a] px-6 lg:px-[6vw] pt-[140px] pb-[100px] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute -top-[150px] -right-[80px] w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(74,163,90,0.15) 0%,transparent 70%)" }} />

        <div className="relative z-10 max-w-[1200px] mx-auto">
          <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[3px] uppercase text-[var(--color-accent)] mb-5 px-3.5 py-1.5 border border-[#4aa35a]/30 rounded-full bg-[var(--color-accent)]/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
            PCAARRD · AANR-TRacer
          </div>
          <h1 className="font-['DM_Serif_Display'] text-[clamp(40px,5vw,64px)] text-white leading-[1.1] tracking-tight mb-5 max-w-[600px]">
            About <em className="text-[var(--color-accent)]">TRACER</em>
          </h1>
          <p className="text-[16px] text-[var(--color-text-faintest)] font-light max-w-[500px] leading-[1.7]">
            Learn how AANR-TRACER supports technology readiness assessment and commercialization across the AANR sector.
          </p>
        </div>
      </section>

      {/* Wave */}
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block w-full bg-[#0f2e1a]">
        <path fill="#f5f2ec" d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
      </svg>

      {/* ═══ OVERVIEW ═══ */}
      <section className="py-[100px] px-6 lg:px-[6vw] bg-[var(--color-bg)]">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[80px] items-center">
          <div>
            <span className="inline-block text-[10px] font-bold tracking-[3px] uppercase text-[var(--color-accent)] mb-4 pb-3 border-b-2 border-[#4aa35a]">
              Overview
            </span>

            <h2 className="font-['DM_Serif_Display'] text-[clamp(30px,3vw,42px)] text-[var(--color-primary)] leading-[1.15] tracking-tight mb-7">
              A structured framework for technology maturation and commercialization
            </h2>

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
            <div className="absolute -top-4 -left-4 right-4 bottom-4 border-2 border-[#4aa35a] rounded-[20px] z-0" />
            <img
              src="/img/pcaarrd-building.jpg"
              alt="DOST PCAARRD Building"
              className="relative z-10 w-full rounded-2xl object-cover shadow-[0_24px_64px_rgba(15,46,26,0.18)]"
            />
            <div className="absolute -bottom-5 -right-5 z-20 bg-[#0f2e1a] text-white px-5 py-4 rounded-2xl text-center shadow-[0_12px_32px_rgba(15,46,26,0.3)]">
              <div className="font-['DM_Serif_Display'] text-[18px] text-[var(--color-accent)] leading-none">PCAARRD</div>
              <div className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-[1px] mt-1">Los Baños, Laguna</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="relative py-[100px] px-6 lg:px-[6vw] bg-[#0f2e1a] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="relative z-10 max-w-[1200px] mx-auto">
          <h2 className="font-['DM_Serif_Display'] text-[clamp(30px,3vw,42px)] text-white mb-4 tracking-tight">
            How <span className="text-[var(--color-accent)] italic">TRACER</span> works
          </h2>
          <p className="text-[15px] text-[var(--color-text-muted)] font-light max-w-[520px] leading-[1.7] mb-14">
            A four-step process that takes you from raw innovation to a documented, actionable TRACER assessment report.
          </p>

          <div className="flex flex-col gap-px bg-[var(--color-bg-card)]/[0.04] rounded-[20px] overflow-hidden">
            {[
              { icon: "clipboard", title: "Answer Targeted Questions",       body: "Complete a detailed questionnaire covering all critical aspects of technology readiness — development progress, intellectual property status, market potential, regulatory compliance, and industry adoption. Each question is designed to pinpoint the specific stage and maturity of your innovation." },
              { icon: "calc", title: "Automated TRACER Levels Calculation",  body: "Based on your responses, the tool automatically calculates your Technology readiness based on TRACER scale. The platform requires that all relevant readiness criteria at each level be fully satisfied before advancing — providing a precise, reliable measure of your technology's maturity." },
              { icon: "lightbulb", title: "Personalized Recommendations",    body: "After the assessment, you receive a clear, actionable report highlighting your current TRACER Level and the key steps to move forward. Recommendations are tailored to your technology type and target users, ensuring guidance is practical and relevant to your specific context." },
              { icon: "file", title: "Report Generation and Download",       body: "TRACER automatically generates a formal TRACER Assessment Report summarizing your technology details, assessment results, and required steps to reach the next level. Download it as a professionally formatted PDF for documentation, funding proposals, or project planning." },
            ].map(({ icon, title, body }, i) => (
              <div key={i} className="grid grid-cols-[80px_1fr] bg-[var(--color-bg-card)]/[0.02] hover:bg-[var(--color-bg-card)]/[0.05] transition-colors">
                {/* Left */}
                <div className="flex flex-col items-center pt-9 pb-9 border-r border-white/[0.05] gap-3">
                  <span className="text-[11px] font-bold text-[var(--color-accent)]">0{i + 1}</span>
                  <div className="w-9 h-9 rounded-[10px] bg-[var(--color-accent)]/12 flex items-center justify-center"><StepIcon name={icon} /></div>
                  {i < 3 && <div className="flex-1 w-px bg-[var(--color-accent)]/12 min-h-5" />}
                </div>
                {/* Right */}
                <div className="px-9 py-9">
                  <div className="text-[16px] font-semibold text-white mb-2.5">{title}</div>
                  <p className="text-[14px] leading-[1.75] text-[var(--color-text-muted)] font-light">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave */}
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block w-full bg-[#0f2e1a]">
        <path fill="#f5f2ec" d="M0,0 C360,60 1080,0 1440,40 L1440,60 L0,60 Z" />
      </svg>

      {/* ═══ LOCATION ═══ */}
      <section className="py-[100px] px-6 lg:px-[6vw] bg-[var(--color-bg)]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-10">
            <div>
              <span className="inline-block text-[10px] font-bold tracking-[3px] uppercase text-[var(--color-accent)] mb-4 pb-3 border-b-2 border-[#4aa35a]">
                Find Us
              </span>
              <h2 className="font-['DM_Serif_Display'] text-[clamp(28px,2.5vw,38px)] text-[var(--color-primary)] tracking-tight">
                Our Location
              </h2>
            </div>
            <div className="text-[13px] text-[var(--color-text-faint)] md:text-right leading-[1.7] font-light">
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