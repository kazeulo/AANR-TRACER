// import  Header  from "./components/Header";
import '../styles/teaser.css';

export default function Home() {
  return (
    // ===== TEASER =====
    <div>
      <main className="teaser">
        <div className="bubbles">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="teaser-content">
          <h1>Coming Soon.</h1>
          <p>We’re building something great.</p>

          <p>
            For now, visit:{" "}
            <a href="https://kmanejo.wixstudio.com/trlars" target="_blank">
              TRACER
            </a>
          </p>
        </div>

      </main>
    </div>
  );
}

// import Link from "next/link";
// import { ArrowRight } from "lucide-react";

// export default function HomePage() {
//   return (
//     <main className="flex flex-col">

//     {/* ================= HERO SECTION ================= */}
//     <section
//       className="relative min-h-screen flex items-center pt-20 pb-32 text-white px-6 lg:px-20 overflow-hidden"
//       style={{ background: "var(--bg-gradient)" }}
//     >
//       <div className="max-w-7xl mx-auto w-full">
//         <div className="max-w-2xl">

//           <h1 className="text-4xl md:text-5xl font-bold leading-9 md:leading-12 mb-6 text-[var(--tertiary-color)]">
//             Technology Readiness Assessment for Commercialization Enhancement and Roadmapping
//           </h1>

//           <p className="textsm md:text-md text-gray-200 mb-8">
//             Your guide in assessing the technical and commercial readiness of AANR technologies.
//           </p>

//           <Link
//             href="/assessment"
//             className="inline-block px-8 py-3 
//             bg-[var(--secondary-color)] 
//             rounded-3xl font-semibold 
//             shadow-xl 
//             hover:scale-105 hover:shadow-2xl 
//             hover:-translate-y-1 
//             transition-all duration-300"
//           >
//             Start Assessment
//           </Link>

//         </div>
//       </div>

//       {/* ===== Wave Design ===== */}
//       <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
//         <svg
//           viewBox="0 0 1440 320"
//           className="w-full h-[160px]"
//           preserveAspectRatio="none"
//         >
//           <path
//             fill="#ffffff"
//             fillOpacity="1"
//             d="M0,224L80,202.7C160,181,320,139,480,144C640,149,800,203,960,213.3C1120,224,1280,192,1360,176L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
//           />
//         </svg>
//       </div>
//     </section>

//       {/* ================= ABOUT SECTION ================= */}
//       <section className="py-10 px-6 lg:px-20 bg-white text-gray-800 ">
//         <div className="max-w-7xl mx-auto grid md:grid-cols-6 gap-12 items-center">

//           <div className="md:col-span-3">
//             <h2 className="text-4xl font-bold mb-10 text-[var(--secondary-color)]">
//               About AANR TRACER
//             </h2>

//             <p className="mb-6 text-justify">
//               TRACER is an assessment and recommendation-support tool 
//               designed to systematically evaluate the Technology Readiness 
//               Level (TRL) of innovations in the Agriculture, Aquatic, and 
//               Natural Resources(AANR) sector. The platform applies a structured 
//               readiness assessment framework and generates evidence-based, indicative 
//               recommendations to support the progression of technologies from research
//               and development toward adoption and utilization.
//             </p>

//             <p className="text-justify">
//               Technologies are evaluated using defined criteria covering technology
//               development status, intellectual property position, and technology
//               transfer and commercialization-readiness initiatives, thereby supporting 
//               informed decision-making, standardized documentation, and strategic 
//               planning across stages of technology maturation.
//             </p>
//           </div>

//           <div className="md:col-span-3">
//             <img src="/img/pcaarrd-building.jpg" className="rounded-2xl "></img>
//           </div>

//         </div>
//       </section>

//       {/* ================= MAP SECTION ================= */}
//       <section className="py-20 px-6 lg:px-20 bg-white">
//         <div className="max-w-8xl mx-auto">

//           <h2 className="text-3xl font-bold mb-10">
//             Visit Us
//           </h2>

//           <div className="overflow-hidden">
//             <iframe
//               src="https://www.google.com/maps?q=DOST+PCAARRD,+Los+Baños,+Laguna&output=embed"
//               width="100%"
//               height="550"
//               loading="lazy"
//               className="border-0"
//               allowFullScreen
//             ></iframe>
//           </div>

//         </div>
//       </section>

//     </main>
//   );
// }