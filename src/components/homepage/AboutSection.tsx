import { SECTORS } from "@/constants/homepage";

export default function AboutSection (){
  return(
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
            {SECTORS.map(({ Icon, label }) => (
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
  );
}