// import  Header  from "./components/Header";
// import '../styles/teaser.css';

// export default function Home() {
//   return (
//     // ===== TEASER =====
//     <div>
//       <main className="teaser">
//         <div className="bubbles">
//           <span></span>
//           <span></span>
//           <span></span>
//           <span></span>
//           <span></span>
//           <span></span>
//         </div>

//         <div className="teaser-content">
//           <h1>Coming Soon.</h1>
//           <p>We’re building something great.</p>

//           <p>
//             For now, visit:{" "}
//             <a href="https://kmanejo.wixstudio.com/trlars" target="_blank">
//               <u>TRACER</u>
//             </a>
//           </p>
//         </div>

//       </main>
//     </div>
//   );
// }

import Link from "next/link";
import Image from "next/image";
import { trlLevels } from "./utils/helperConstants";
import { 
  IconWheat, 
  IconFish, 
  IconLeaf,
  IconTree,
  IconFlask,
  IconCog,
  IconDna,
  IconChip,
  IconDroplets,
  IconSeedling,
  IconPackage,
  RiceStalk,
  WaveRipple,
  LeafSprig,
  FishDecor,
  aanrTypes,
  IconListCheck,
  IconBarChart
} from "./utils/decorativeIcons"

const steps = [
  {
    n: "01",
    Icon: IconSeedling,
    title: "Select Your Technology Type",
    desc: "Choose from 10 AANR technology categories — from new plant varieties and food products to ICT systems and agricultural machinery.",
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
    title: "Get Your TRL Report",
    desc: "Receive your Highest Completed TRL, Highest Achievable TRL, and a clear list of gaps — exportable as a professional PDF report.",
  },
];

// Main Component 

export default function HomePage() {
  return (
    <main className="font-['DM_Sans',sans-serif] bg-[#f5f2ec] text-[#1a1a1a]">

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center bg-[#0f2e1a] overflow-hidden px-6 lg:px-[6vw] pt-[60px] pb-[120px]">

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

        {/* Glows */}
        <div className="absolute -top-[200px] -right-[100px] w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(50, 181, 74, 0.18) 0%,transparent 70%)" }} />
        <div className="absolute -bottom-[100px] left-[30%] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(34,197,94,0.07) 0%,transparent 70%)" }} />

        {/* Decorative motifs */}
        <RiceStalk className="absolute left-[4%] bottom-[18%] w-[22px] text-[#4aa35a]/[0.08] pointer-events-none hidden lg:block" />
        <RiceStalk className="absolute left-[7%] bottom-[14%] w-[16px] text-[#4aa35a]/[0.06] pointer-events-none hidden lg:block" />
        <LeafSprig className="absolute left-[2%] top-[32%] w-[35px] text-[#4aa35a]/[0.10] pointer-events-none hidden lg:block" />
        <FishDecor className="absolute right-[4%] bottom-[28%] w-[70px] text-[#4aa35a]/[0.10] pointer-events-none hidden lg:block" />
        <WaveRipple className="absolute bottom-[80px] left-0 w-full text-[#4aa35a]/[0.06] pointer-events-none" />

        <div className="relative z-10 max-w-[1200px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-center">

          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[3px] uppercase text-[#4aa35a] mb-6 px-3.5 py-1.5 border border-[#4aa35a]/30 rounded-full bg-[#4aa35a]/[0.08]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4aa35a] animate-pulse" />
              PCAARRD · AANR Sector
            </div>

            <h1 className="font-['DM_Serif_Display',serif] text-[clamp(38px,4.2vw,52px)] leading-[1.1] text-white mb-5 tracking-tight">
              Technology Readiness<br />
              Assessment for{" "}
              <em className="text-[#4aa35a] italic">Commercialization</em>
              <br />Enhancement and Roadmapping
            </h1>

            <p className="text-[15px] leading-[1.75] text-[#8a9a94] font-light mb-8 max-w-[420px]">
              Your guide in assessing the technical and commercial readiness of AANR technologies — from farm to market.
            </p>

            {/* Partner Logos */}
            <div className="mb-10 bg-white/[0.5] border border-white rounded-xl px-4 py-3 w-full max-w-[480px]">
              <div className="text-[9px] font-bold tracking-[2px] uppercase text-[#4a6657] mb-2 text-center">In partnership with</div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Image src="/img/logos/dost-logo.png" alt="DOST" width={90} height={40} className="h-[28px] sm:h-[32px] w-auto object-contain opacity-100 hover:opacity-100 transition-opacity" />
                <Image src="/img/logos/dost-pcaarrd-logo.png" alt="DOST PCAARRD" width={90} height={40} className="h-[28px] sm:h-[32px] w-auto object-contain opacity-100 hover:opacity-100 transition-opacity" />
                <Image src="/img/logos/raise-logo.png" alt="RAISE" width={120} height={40} className="h-[34px] sm:h-[38px] w-auto object-contain opacity-100 hover:opacity-100 transition-opacity" />
                <Image src="/img/logos/agri-hub-logo.png" alt="Agri Hub" width={90} height={40} className="h-[34px] sm:h-[38px] w-auto object-contain opacity-100 hover:opacity-100 transition-opacity" />
                <Image src="/img/logos/upvisayas-logo.png" alt="UP Visayas" width={90} height={40} className="h-[38px] w-auto object-contain opacity-100 hover:opacity-100 transition-opacity" />
                <Image src="/img/logos/ttbdo-logo.png" alt="TTBDO" width={90} height={40} className="h-[38px] w-auto object-contain opacity-100 hover:opacity-100 transition-opacity" />
              </div>
            </div>

            <Link
              href="/assessment/disclaimer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#4aa35a] text-white text-[15px] font-semibold rounded-full shadow-[0_8px_32px_rgba(74,163,90,0.35)] hover:bg-[#3d8f4c] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(74,163,90,0.45)] transition-all duration-300"
            >
              Start Your Assessment
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5h6M5 2l3 3-3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </div>

          {/* Right — TRL scale */}
          <div className="hidden lg:flex flex-col gap-2.5">
            <div className="text-[11px] font-bold tracking-[2px] uppercase text-[#4a6657] mb-2">TRL Scale</div>
            {trlLevels.map(({ n, label, w, color }) => (
              <div key={n} className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-[#4a6657] w-[22px] text-right flex-shrink-0">{n}</span>
                <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${w} ${color}`} />
                </div>
                <span className="text-[12px] text-[#4a6657] w-[160px] flex-shrink-0">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Wave */}
        <svg className="absolute bottom-[-1px] left-0 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path fill="#1a3d26" d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </section>

      {/* STATS STRIP */}
      <div className="bg-[#1a3d26] px-6 lg:px-[6vw] py-8">
        <div className="max-w-[1200px] mx-auto flex flex-wrap justify-around gap-4">
          {[
            { n: "9",  label: "TRL Levels",         Icon: IconBarChart },
            { n: "10", label: "Technology Types",  Icon: IconFlask },
            { n: "4",  label: "AANR Sub-Sectors",  Icon: IconLeaf },
            { n: "1",  label: "Clear Roadmap",     Icon: IconListCheck },
          ].map(({ n, label, Icon }) => (
            <div key={label} className="text-center px-6 border-r border-white/[0.08] last:border-r-0 flex flex-col items-center gap-1">
              <Icon className="w-6 h-6 text-[#4aa35a]/60 mb-3" />
              <div className="font-['DM_Serif_Display',serif] text-[32px] text-[#4aa35a] leading-none">{n}</div>
              <div className="text-[11px] text-[#6b987e] uppercase tracking-[1.5px] font-medium mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* AANR SECTOR SHOWCASE */}
      <section className="py-[80px] px-6 lg:px-[6vw] bg-[#f5f2ec] relative overflow-hidden">

        {/* Subtle dot grid bg */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #4aa35a 0.5px, transparent 0.5px)", backgroundSize: "32px 32px", opacity: 0.03 }} />

        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-10">
            <div>
              <span className="inline-block text-[10px] font-bold tracking-[3px] uppercase text-[#4aa35a] mb-4 pb-4 border-b-2 border-[#4aa35a]">
                Covered Technologies
              </span>
              <h2 className="font-['DM_Serif_Display',serif] text-[clamp(28px,3vw,38px)] text-[#0f2e1a] tracking-tight leading-snug">
                Built for the <em className="text-[#4aa35a]">AANR Sector</em>
              </h2>
            </div>
            <p className="text-[13px] text-[#8a9a94] font-light max-w-[260px] leading-relaxed">
              TRACER covers the full breadth of Agriculture, Aquatic, and Natural Resources innovations.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {aanrTypes.map(({ Icon, label, sub }) => (
              <div
                key={label + sub}
                className="bg-white border border-[#ede9e0] rounded-2xl px-4 py-5 flex flex-col items-center text-center gap-2.5 hover:border-[#4aa35a]/30 hover:shadow-[0_6px_20px_rgba(15,46,26,0.07)] transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-[#f5f2ec] group-hover:bg-[#4aa35a]/[0.08] rounded-xl flex items-center justify-center transition-colors">
                  <Icon className="w-5 h-5 text-[#4aa35a]" />
                </div>
                <div className="text-[12px] font-semibold text-[#0f2e1a] leading-snug">{label}</div>
                <div className="text-[10px] text-[#94a3a0] font-light leading-tight">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-[100px] px-6 lg:px-[6vw] bg-white relative overflow-hidden">

        <WaveRipple className="absolute top-8 right-0 w-[400px] text-[#4aa35a]/[0.05] pointer-events-none" />
        <WaveRipple className="absolute bottom-8 left-0 w-[280px] text-[#4aa35a]/[0.04] pointer-events-none" />

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[80px] items-center relative z-10">
          <div>
            <span className="inline-block text-[10px] font-bold tracking-[3px] uppercase text-[#4aa35a] mb-4 pb-4 border-b-2 border-[#4aa35a]">
              About TRACER
            </span>

            <h2 className="font-['DM_Serif_Display',serif] text-[clamp(28px,3vw,40px)] text-[#0f2e1a] leading-[1.15] tracking-tight mb-6">
              A structured framework for technology maturation
            </h2>

            {/* Sector chips with icons */}
            <div className="flex flex-wrap gap-2 mb-7">
              {[
                { Icon: IconWheat, label: "Agriculture" },
                { Icon: IconFish,  label: "Aquatic" },
                { Icon: IconTree,  label: "Natural Resources" },
              ].map(({ Icon, label }) => (
                <div key={label} className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#4a5568] bg-[#f5f2ec] border border-[#ede9e0] px-3 py-1.5 rounded-full">
                  <Icon className="w-3.5 h-3.5 text-[#4aa35a]" />
                  {label}
                </div>
              ))}
            </div>

            <p className="text-justify text-[15px] leading-[1.85] text-[#4a5568] font-light mb-4">
              TRACER is an assessment and recommendation-support tool designed to systematically evaluate the Technology Readiness Level (TRL)
              of innovations in the Agriculture, Aquatic, and Natural Resources (AANR) sector. The platform applies a structured readiness
              assessment framework and generates evidence-based, indicative recommendations to support the progression of technologies from
              research and development toward adoption and utilization.
            </p>

            <p className="text-justify text-[15px] leading-[1.85] text-[#4a5568] font-light">
              Technologies are evaluated using defined criteria covering technology development status, intellectual property position, and
              technology transfer and commercialization-readiness initiatives, thereby supporting informed decision-making, standardized
              documentation, and strategic planning across stages of technology maturation.
            </p>

          </div>

          {/* Image */}
          <div className="relative">
            {/* Rice stalk cluster beside image */}
            <div className="absolute -left-20 bottom-[12%] flex gap-1 pointer-events-none z-20">
              <RiceStalk className="w-[16px] text-[#4aa35a]/25 -rotate-6" />
              <RiceStalk className="w-[20px] text-[#4aa35a]/35" />
              <RiceStalk className="w-[14px] text-[#4aa35a]/20 rotate-8" />
            </div>

            <div className="absolute -top-4 -left-4 right-4 bottom-4 border-2 border-[#4aa35a] rounded-[20px] z-0" />
            <img
              src="/img/pcaarrd-building.jpg"
              alt="PCAARRD Building"
              className="relative z-10 w-full rounded-2xl object-cover shadow-[0_24px_64px_rgba(15,46,26,0.2)]"
            />
            <div className="absolute -bottom-5 -right-5 z-20 bg-[#0f2e1a] text-white px-5 py-4 rounded-2xl text-center shadow-[0_12px_32px_rgba(15,46,26,0.3)]">
              <div className="font-['DM_Serif_Display',serif] text-[18px] text-[#4aa35a] leading-none">PCAARRD</div>
              <div className="text-[10px] text-[#6b8a78] uppercase tracking-[1px] mt-1">Los Baños, Laguna</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative py-[100px] px-6 lg:px-[6vw] bg-[#0f2e1a] overflow-hidden">

        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />

        {/* Decorative motifs */}
        <FishDecor className="absolute right-[4%] top-[12%] w-[80px] text-[#4aa35a]/[0.08] pointer-events-none hidden lg:block" />
        <FishDecor className="absolute right-[14%] top-[22%] w-[50px] text-[#4aa35a]/[0.06] pointer-events-none hidden lg:block" style={{ transform: "scaleX(-1)" }} />
        <LeafSprig className="absolute left-[2%] bottom-[14%] w-[55px] text-[#4aa35a]/[0.08] pointer-events-none hidden lg:block" />
        <RiceStalk className="absolute left-[7%] bottom-[10%] w-[20px] text-[#4aa35a]/[0.12] pointer-events-none hidden lg:block" />
        <WaveRipple className="absolute bottom-[80px] left-0 w-full text-[#4aa35a]/[0.06] pointer-events-none" />

        <div className="relative z-10 max-w-[1200px] mx-auto">
          <div className="mb-14">
            <span className="inline-block text-[10px] font-bold tracking-[3px] uppercase text-[#4aa35a] mb-4 pb-4 border-b-2 border-[#4aa35a]">
              Process
            </span>
            <h2 className="font-['DM_Serif_Display',serif] text-[clamp(30px,3vw,42px)] text-white tracking-tight">
              How <span className="text-[#4aa35a] italic">TRACER</span> works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {steps.map(({ n, Icon, title, desc }) => (
              <div key={n} className="bg-white/[0.05] border border-white/[0.05] hover:bg-white/[0.06] hover:border-[#4aa35a]/20 transition-all duration-300 rounded-2xl p-8">
                <div className="font-['DM_Serif_Display',serif] text-[54px] text-[#4aa35a] leading-none mb-5 tracking-[-2px]">
                  {n}
                </div>
                <div className="w-10 h-10 rounded-[10px] bg-[#4aa35a]/12 flex items-center justify-center mb-5">
                  <Icon className="w-[18px] h-[18px] text-[#4aa35a]" />
                </div>
                <div className="text-[15px] font-semibold text-white mb-3 leading-snug">{title}</div>
                <p className="text-[13px] leading-[1.75] text-[#6b8a78] font-light">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <svg className="absolute bottom-[-1px] left-0 w-full" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path fill="#f5f2ec" d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </section>

      {/* MAP */}
      <section className="py-[100px] px-6 lg:px-[6vw] bg-[#f5f2ec]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-10">
            <div>
              <span className="inline-block text-[10px] font-bold tracking-[3px] uppercase text-[#4aa35a] mb-4 pb-4 border-b-2 border-[#4aa35a]">
                Find Us
              </span>
              <h2 className="font-['DM_Serif_Display',serif] text-[clamp(28px,2.5vw,38px)] text-[#0f2e1a] tracking-tight">
                Visit DOST PCAARRD
              </h2>
            </div>
            <div className="text-[13px] text-[#8a9a94] md:text-right leading-[1.6] font-light">
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