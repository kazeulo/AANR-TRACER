export const categoryOrder = [
  "Technology Status",
  "Market and Commercialization Status",
  "Intellectual Property Protection Status",
  "Industry Adoption Status",
  "Regulatory Compliance Status",
];

export const categoryDescriptions: Record<string, string> = {
  "Technology Status":
    "Assess where your technology stands in terms of development, functionality, and readiness for real-world use.",
  "Market and Commercialization Status":
    "Evaluate how prepared your technology is to enter the market and meet customer needs.",
  "Intellectual Property Protection Status":
    "Review the protections in place for your innovation, such as patents and trademarks.",
  "Industry Adoption Status":
    "Check how your technology is being accepted and used within your target industry or sector.",
  "Regulatory Compliance Status":
    "Ensure your technology meets all necessary legal and industry standards for safety and quality.",
};

export const trlLevels = [
  { n: 1, label: "Concept & Market Definition",                     w: "w-[11%]",  color: "bg-slate-400" },
  { n: 2, label: "Design / Formulation / Prototype Planning",       w: "w-[22%]",  color: "bg-slate-500" },
  { n: 3, label: "Prototype Development & Laboratory Testing",      w: "w-[33%]",  color: "bg-amber-400" },
  { n: 4, label: "Controlled Validation & IP Filing",               w: "w-[44%]",  color: "bg-orange-400" },
  { n: 5, label: "Pilot Testing & Industry Engagement",             w: "w-[55%]",  color: "bg-emerald-400" },
  { n: 6, label: "Multi-location Testing & Scale-up Preparation",   w: "w-[66%]",  color: "bg-cyan-400" },
  { n: 7, label: "Industry Validation & Regulatory Submission",     w: "w-[77%]",  color: "bg-blue-400" },
  { n: 8, label: "Commercial Production Readiness",                 w: "w-[88%]",  color: "bg-violet-400" },
  { n: 9, label: "Full Commercialization",                          w: "w-full",   color: "bg-green-400" },
];