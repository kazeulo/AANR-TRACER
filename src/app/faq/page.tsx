"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function FAQ() {
  const faqs = [
    {
      question: "What is AANR TRACER?",
      answer:
        "The AANR Technology Readiness Assessment for Commercialization Enhancement and Roadmapping (TRACER) Application is a web-based assessment and recommendation-support tool designed to evaluate the Technology Readiness Level (TRL) of innovations in the Agriculture, Aquatic, and Natural Resources (AANR) sector. It helps users understand the maturity of their technology and identify next steps toward commercialization, adoption, or utilization.",
    },
    {
      question: "Who can use this platform?",
      answer:
        "Researchers, project leaders, technology transfer offices, and institutions involved in AANR innovation development may use the platform to assess readiness levels.",
    },
    {
      question: "What is Technology Readiness Level (TRL)?",
      answer:
        "TRL is a systematic metric that measures the maturity of a technology from early research (concept stage) to deployment and commercialization.",
    },
    {
      question: "Does TRACER provide commercialization recommendations?",
      answer:
        "Yes. The platform generates indicative recommendations to support further development, intellectual property positioning, and commercialization planning.",
    },
  ]

  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="bg-[var(--bg-color-light)] text-gray-800">

      {/* ================= HERO ================= */}
      <section className="bg-[var(--secondary-color)] text-white py-24 px-6 lg:px-20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">
            Learn more about AANR TRACER and how it supports technology readiness assessment.
          </p>
        </div>
      </section>

      {/* ================= FAQ LIST ================= */}
      <section className="py-20 px-6 lg:px-20">
        <div className="max-w-4xl mx-auto space-y-6">

          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md border border-gray-100"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 text-left"
              >
                <span className="font-semibold text-lg">
                  {faq.question}
                </span>
                <ChevronDown
                  size={20}
                  className={`transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 pb-6 text-gray-600 leading-7">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}

        </div>
      </section>

    </div>
  )
}