import { tracerLevels } from "@/app/utils/helperConstants";
import { PARTNER_LOGOS } from "@/constants/homepage";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HeroSection(){

  const router = useRouter();

  return(
    <section className="relative min-h-screen flex items-center bg-[var(--color-primary)] overflow-hidden px-6 lg:px-[6vw] pt-[60px] pb-[120px]">
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

      {/* Glows */}
      <div className="absolute -top-[200px] -right-[100px] w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(141,197,64,0.18) 0%,transparent 75%)" }} />
      <div className="absolute -bottom-[100px] left-[30%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(141,197,64,0.07) 0%,transparent 75%)" }} />

      <div className="absolute -top-[100px] -left-[150px] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle,rgba(0,173,241,0.10) 0%,transparent 70%)" }} />

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
              {PARTNER_LOGOS.map(({ src, alt, w, h }) => (
                <Image key={src} src={src} alt={alt} width={w} height={h} className="h-[28px] sm:h-[32px] w-auto object-contain opacity-80 hover:opacity-100 transition-opacity" />
              ))}
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
  );
}