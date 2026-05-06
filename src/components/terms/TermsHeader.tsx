// components/terms/TermsHeader.tsx

export function TermsHeader() {
  return (
    <>
      <section className="relative bg-[#0f2e1a] px-6 lg:px-[6vw] pt-[140px] pb-[100px] overflow-hidden">
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
            backgroundSize: "35px 35px",
          }}
        />

        {/* Glow */}
        <div
          className="absolute -top-[200px] -right-[100px] w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(141,197,64,0.18) 0%,transparent 50%)" }}
        />

        <div className="relative z-10 max-w-[1200px] mx-auto">
          <h1 className="text-[clamp(38px,5vw,60px)] text-white leading-[1.1] tracking-tight mb-5 max-w-[600px]">
            Terms &amp; <em className="text-[var(--color-accent)]">Definitions</em>
          </h1>
          <p className="text-[16px] text-[var(--color-text-faintest)] font-light max-w-[500px] leading-[1.7]">
            Clear explanations of technology types, assessment categories, and key terms used throughout the TRL assessment process.
          </p>
        </div>
      </section>

      {/* Wave */}
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="block w-full bg-[#0f2e1a]">
        <path fill="#1a3d26" d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
      </svg>
    </>
  );
}