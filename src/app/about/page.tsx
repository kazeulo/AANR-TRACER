"use client"

export default function About() {
  return (
    <div className="bg-[var(--bg-color-light)] text-gray-800">

      {/* ================= PAGE HEADER ================= */}
      <section className="bg-[var(--secondary-color)] text-white py-24 px-6 lg:px-20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
            Learn more about AANR TRACER and how it supports technology readiness assessment.
          </p>
        </div>
      </section>

      {/* ================= OVERVIEW SECTION ================= */}
      <section className="py-20 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          <div className="">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--secondary-color)] mb-8">
              Overview
            </h2>

            <p className="mb-6 leading-7 text-gray-700 text-justify">
              TRACER is an assessment and recommendation-support tool 
              designed to systematically evaluate the Technology Readiness 
              Level (TRL) of innovations in the Agriculture, Aquatic, and 
              Natural Resources(AANR) sector. The platform applies a structured 
              readiness assessment framework and generates evidence-based, indicative 
              recommendations to support the progression of technologies from research
              and development toward adoption and utilization.
            </p>

            <p className="leading-7 text-gray-700 text-justify">
              Technologies are evaluated using defined criteria covering technology
              development status, intellectual property position, and technology
              transfer and commercialization-readiness initiatives, thereby supporting 
              informed decision-making, standardized documentation, and strategic 
              planning across stages of technology maturation.
            </p>
          </div>

          <div className="">
            <img
              src="/img/pcaarrd-building.jpg"
              alt="DOST PCAARRD Building"
              className="rounded-2xl shadow-xl w-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* ================= HOW TRACER WORKS ================= */}
      <section className="py-20 px-6 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--secondary-color)] mb-8">
            How TRACER works
          </h2>

          <div className="mb-10">
            <h3 className="font-bold text-lg md:text-xl mb-5">1. Answer targeted questions</h3>
            <p className="ml-10">
              You’ll complete a detailed questionnaire covering all 
              critical aspects of technology readiness, including development progress, 
              intellectual property status, market potential, regulatory compliance, and 
              industry adoption. Each question is designed to pinpoint the specific stage 
              and maturity of your innovation.
            </p>
          </div>

          <div className="mb-10">
            <h3 className="font-bold text-lg md:text-xl mb-5">2. Automated TRL Calculation:</h3>
            <p className="ml-10">
              Based on your responses, the tool automatically calculates your Technology 
              Readiness Level (TRL). To ensure accuracy and reliability, the platform requires 
              that all relevant readiness criteria at each level be fully satisfied before you 
              can advance to the next, providing a precise measure of your technology’s maturity.
            </p>
          </div>

          <div className="mb-10">
            <h3 className="font-bold text-lg md:text-xl mb-5">3. Personalized Recommendations:</h3>
            <p className="ml-10">
              ​​After the assessment, you receive a clear, actionable report that highlights your 
              current TRL and outlines the key steps to move forward. This report is assisted by 
              AI technology to provide personalized recommendations based on your technology type 
              and target users, ensuring the guidance is practical and relevant to your specific 
              needs.
            </p>
          </div>

          <div className="mb-10">
            <h3 className="font-bold text-lg md:text-xl mb-5">4. Report Generation and Download:</h3>
            <p className="ml-10">
              ​TRACER also automatically generates a formal TRL Assessment Report summarizing your 
              technology details, assessment results, and required steps to reach the next level 
              You can download this as a PDF for documentation or project planning.
            </p>
          </div>
        </div>
      </section>

      {/* ================= Location ================= */}
      <section className="py-20 px-6 lg:px-20 bg-white">
        <div className="max-w-7xl mx-auto">

          <h2 className="text-3xl md:text-4xl font-bold text-[var(--secondary-color)] mb-8">
            Our Location
          </h2>

          <div className="overflow-hidden">
            <iframe
              src="https://www.google.com/maps?q=DOST+PCAARRD,+Los+Baños,+Laguna&output=embed"
              width="100%"
              height="550"
              loading="lazy"
              className="border-0"
              allowFullScreen
            ></iframe>
          </div>

        </div>
      </section>

    </div>
  )
}