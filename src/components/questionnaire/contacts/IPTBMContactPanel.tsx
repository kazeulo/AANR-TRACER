"use client";

import { useState } from "react";
import { LearnMoreModal } from "./LearnMoreModal";
import { ContactRegionRow } from "./ContactRegionRow";
import { IPTBM_REGIONS } from "@/constants/contacts";

// Constants 

const IPTBM_LEARN_MORE_TITLE = "Intellectual Property and Technology Business Management (IP-TBM)";
const IPTBM_LEARN_MORE_BODY  = `Intellectual Property and Technology Business Management (IP-TBM) refers to a network of 
      offices established through funding support from the Department of Science and Technology – Philippine Council for 
      Agriculture, Aquatic and Natural Resources Research and Development (DOST-PCAARRD). These offices are tasked with 
      protecting, managing, and commercializing intellectual property (IP) generated from research and development activities. 
      Established in 2017, IP-TBM offices serve as one-stop hubs within state universities, colleges, and research institutions, 
      particularly in the agriculture, aquatic, and natural resources (AANR) sectors, to facilitate IP management, technology 
      transfer, and business development.`;

const PREVIEW_COUNT = 3;

// Main Component
export function IPTBMContactPanel() {
  const [expanded, setExpanded]   = useState(false);
  const [showModal, setShowModal] = useState(false);

  const visible   = expanded ? IPTBM_REGIONS : IPTBM_REGIONS.slice(0, PREVIEW_COUNT);
  const remaining = IPTBM_REGIONS.length - PREVIEW_COUNT;

  return (
    <>
      {showModal && (
        <LearnMoreModal
          title={IPTBM_LEARN_MORE_TITLE}
          body={IPTBM_LEARN_MORE_BODY}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="mt-3 rounded-2xl border border-violet-200 bg-white overflow-hidden shadow-[0_2px_12px_rgba(120,80,200,0.07)]">

        {/* Header */}
        <div className="px-5 py-4 border-b border-violet-100 bg-gradient-to-r from-violet-50 to-violet-100/40">
          <div className="flex items-start gap-2 mb-1">
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none" className="text-violet-500 flex-shrink-0 mt-[1px]">
              <path d="M7 1.5a3 3 0 0 1 3 3c0 1.5-.8 2.6-2 3.2V9.5H6V7.7C4.8 7.1 4 6 4 4.5a3 3 0 0 1 3-3Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
              <path d="M5.5 11h3M6 12.5h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <p className="text-[12px] font-bold tracking-[1.5px] uppercase text-violet-800">
              IP-TBM Contacts
            </p>
          </div>

          <p className="text-[12px] text-violet-700 font-light leading-relaxed mb-2.5">
            For IP Protection support, please contact your nearest Intellectual Property and Technology Business Management (IP-TBM).
            IP-TBM is a DOST-PCAARRD-funded network of offices established in 2017 to manage, protect, and commercialize intellectual property generated from research and development, particularly in the AANR sectors, within universities and research institutions.
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-violet-600 hover:text-violet-900 transition-colors"
          >
            Learn More
            <span className="text-[14px] leading-none">🡪</span>
          </button>
        </div>

        {/* Region rows */}
        <div className="divide-y divide-violet-50">
          {visible.map((r) => (
            <ContactRegionRow
              key={r.region}
              region={r.region}
              universities={r.universities}
            //   accentColor="violet"
            />
          ))}
        </div>

        {/* Show more / less */}
        <button
          onClick={() => setExpanded(prev => !prev)}
          className="w-full flex items-center justify-center gap-1.5 px-5 py-2.5 border-t border-violet-100 bg-violet-50/50 hover:bg-violet-100/60 transition-colors text-[12px] font-semibold text-violet-600 hover:text-violet-900"
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