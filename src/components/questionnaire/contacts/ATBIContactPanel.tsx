"use client";

import { useState } from "react";
import { ATBI_REGIONS, REGULATORY_BODIES } from "@/constants/contacts";
import { LearnMoreModal } from "./LearnMoreModal";
import { ContactRegionRow } from "./ContactRegionRow";

const ATBI_LEARN_MORE_TITLE = "Agri-Aqua Technology Business Incubator (ATBI)";
const ATBI_LEARN_MORE_BODY  = `Agri-Aqua Technology Business Incubator (ATBI) refers to a program funded by the Department 
      of Science and Technology – Philippine Council for Agriculture, Aquatic and Natural Resources Research and Development 
      (DOST-PCAARRD). It is designed to support, mentor, and accelerate the development of spinoffs, startups, and entrepreneurs 
      in the agriculture, aquatic, and natural resources (AANR) sectors. The program assists incubatees in commercializing 
      research-based technologies, improving products and processes, and scaling their ventures into sustainable and competitive 
      businesses.`;

const PREVIEW_COUNT = 3;

export function ATBIContactPanel({ technologyType }: { technologyType: string }) {
  const [expanded, setExpanded]   = useState(false);
  const [showModal, setShowModal] = useState(false);

  const reg     = REGULATORY_BODIES[technologyType];
  const visible = expanded ? ATBI_REGIONS : ATBI_REGIONS.slice(0, PREVIEW_COUNT);
  const remaining = ATBI_REGIONS.length - PREVIEW_COUNT;

  return (
    <>
      {showModal && (
        <LearnMoreModal
          title={ATBI_LEARN_MORE_TITLE}
          body={ATBI_LEARN_MORE_BODY}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="mt-3 rounded-2xl border border-blue-200 bg-white overflow-hidden shadow-[0_2px_12px_rgba(0,100,200,0.07)]">

        {/* Header */}
        <div className="px-5 py-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100/40">
          <div className="flex items-start gap-2 mb-1">
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none" className="text-blue-500 flex-shrink-0 mt-[1px]">
              <rect x="2" y="4" width="10" height="8" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M5 4V3a2 2 0 0 1 4 0v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              <circle cx="7" cy="8" r="1" fill="currentColor"/>
            </svg>
            <p className="text-[12px] font-bold tracking-[1.5px] uppercase text-blue-800">
              Agri-Aqua Technology Business Incubator (ATBI) Contacts
            </p>
          </div>

          <p className="text-[12px] text-blue-700 font-light leading-relaxed mb-2.5">
            For regulatory compliance support, please contact your nearest Agri-Aqua Technology Business Incubator (ATBI).
            ATBI is a DOST-PCAARRD-funded program that supports and mentors the spinoffs, startups and entrepreneurs in the AANR sectors, helping them commercialize technologies, enhance products, and grow sustainable businesses.
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-blue-600 hover:text-blue-900 transition-colors"
          >
            Learn More
            <span className="text-[14px] leading-none">🡪</span>
          </button>
        </div>

        {/* Region rows */}
        <div className="divide-y divide-blue-50">
          {visible.map((r) => (
            <ContactRegionRow
              key={r.region}
              region={r.region}
              universities={r.universities}
              accentColor="blue"
            />
          ))}
        </div>

        {/* Regulatory body */}
        {reg && (
          <div className="px-5 py-4 border-t border-blue-100 bg-blue-50/40 space-y-1.5">
            <p className="text-[11px] font-bold tracking-[1.5px] uppercase text-blue-500">
              Relevant Regulatory Body
            </p>
            <p className="text-[13px] font-semibold text-blue-900">{reg.body}</p>
            
            <a  href={reg.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[12px] text-blue-500 hover:text-blue-800 underline underline-offset-2 transition-colors break-all"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
              {reg.url}
            </a>
          </div>
        )}

        {/* Show more / less */}
        <button
          onClick={() => setExpanded(prev => !prev)}
          className="w-full flex items-center justify-center gap-1.5 px-5 py-2.5 border-t border-blue-100 bg-blue-50/50 hover:bg-blue-100/60 transition-colors text-[12px] font-semibold text-blue-600 hover:text-blue-900"
        >
          {expanded ? "Show less" : `Show ${remaining} more regions`}
          <svg
            width="12" height="12" viewBox="0 0 12 12" fill="none"
            className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </>
  );
}