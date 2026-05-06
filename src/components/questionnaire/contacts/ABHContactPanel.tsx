"use client";

import { ABH_REGIONS } from "@/constants/contacts";
import { useState } from "react";
import { LearnMoreModal } from "./LearnMoreModal";
import { ContactRegionRow } from "./ContactRegionRow";

const ABH_LEARN_MORE_TITLE = "Agribusiness Hub (ABH)";
const ABH_LEARN_MORE_BODY  = `Agribusiness Hub (ABH) is a project component of the RAISE Program of the Department of Science 
    and Technology – Philippine Council for Agriculture, Aquatic and Natural Resources Research and Development (DOST-PCAARRD). 
    It serves as a regional one-stop hub dedicated to transforming research outputs into market-ready agri-aqua enterprises through 
    pre-commercialization support. The ABH facilitates technology commercialization by providing assistance and enabling linkages 
    among inventors, investors, and other key stakeholders. It aims to promote innovation-driven agribusiness development and 
    support wealth creation across regions.`;

// Main Component 

export function ABHContactPanel() {
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const PREVIEW_COUNT = 3;
  const visible = expanded ? ABH_REGIONS : ABH_REGIONS.slice(0, PREVIEW_COUNT);
  const remaining = ABH_REGIONS.length - PREVIEW_COUNT;

  return (
    <>
      {showModal && (
        <LearnMoreModal
          title={ABH_LEARN_MORE_TITLE}
          body={ABH_LEARN_MORE_BODY}
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="mt-3 rounded-2xl border border-amber-200 bg-white overflow-hidden shadow-[0_2px_12px_rgba(180,130,0,0.07)]">

        {/* Header */}
        <div className="px-5 py-4 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-amber-100/40">
          <div className="flex items-start gap-2 mb-1">
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none" className="text-amber-600 flex-shrink-0 mt-[1px]">
              <path d="M7 1.5C4.515 1.5 2.5 3.515 2.5 6c0 3.5 4.5 7 4.5 7s4.5-3.5 4.5-7c0-2.485-2.015-4.5-4.5-4.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
              <circle cx="7" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
            </svg>
            <p className="text-[12px] font-bold tracking-[1.5px] uppercase text-amber-800">
              Agribusiness Hub (ABH) Contacts
            </p>
          </div>

          <p className="text-[12px] text-amber-700 font-light leading-relaxed mb-2.5">
            For pre-commercialization support, please contact your nearest Agribusiness Hub (ABH).
            ABH is a component of the DOST-PCAARRD RAISE Program that serves as a regional hub providing pre-commercialization support and facilitating linkages to help transform research into market-ready agri-aqua enterprises.
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-amber-700 hover:text-amber-900 transition-colors"
          >
            Learn More
            <span className="text-[14px] leading-none">🡪</span>
          </button>
        </div>

        {/* Region rows */}
        <div className="divide-y divide-amber-50">
          {visible.map((r) => (
            <ContactRegionRow
              key={r.region}
              region={r.region}
              universities={r.university ? [{ name: r.university, email: r.email }] : []}
              accentColor="amber"
            />
          ))}
        </div>

        {/* Show more / less toggle */}
        <button
          onClick={() => setExpanded(prev => !prev)}
          className="w-full flex items-center justify-center gap-1.5 px-5 py-2.5 border-t border-amber-100 bg-amber-50/50 hover:bg-amber-100/60 transition-colors text-[12px] font-semibold text-amber-700 hover:text-amber-900"
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