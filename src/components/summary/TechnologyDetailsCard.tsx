import { TECH_TYPES } from "@/constants/technologyTypes";

interface Props {
  technologyName: string;
  technologyType: string;
  fundingSource: string;
  onNameChange: (val: string) => void;
  onTypeChange: (val: string) => void;
  onFundingChange: (val: string) => void;
}

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function TechnologyDetailsCard({ technologyName, technologyType, fundingSource, onNameChange, onTypeChange, onFundingChange }: Props) {
  return (
    <div className="bg-white border border-[#d8d3cc] rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(15,46,26,0.07)] mb-6">
      <div className="flex items-center gap-2.5 px-7 py-5 border-b border-[#e8e4db] bg-[#f5f2ec]">
        <span className="w-2 h-2 rounded-full bg-[#2d7a3a] flex-shrink-0" />
        <span className="text-[12px] font-bold tracking-[2px] uppercase text-[#2d7a3a]">Technology Details</span>
      </div>
      <div className="px-7 py-6 space-y-5">
        <div>
          <label className="block text-[12px] font-bold tracking-[1.5px] uppercase text-[#6b7a75] mb-2">Technology Name</label>
          <input
            type="text"
            value={technologyName}
            onChange={e => onNameChange(e.target.value)}
            className="w-full bg-[#f8f5f0] border border-[#d0ccc4] rounded-xl px-4 py-3 text-[15px] text-[#1a2e1e] focus:outline-none focus:ring-2 focus:ring-[#2d7a3a]/30 focus:border-[#2d7a3a] transition-all"
          />
        </div>
        <div>
          <label className="block text-[12px] font-bold tracking-[1.5px] uppercase text-[#6b7a75] mb-2">Technology Type</label>
          <div className="relative">
            <select
              value={technologyType}
              onChange={e => onTypeChange(e.target.value)}
              className="w-full appearance-none bg-[#f8f5f0] border border-[#d0ccc4] rounded-xl px-4 py-3 text-[15px] text-[#1a2e1e] focus:outline-none focus:ring-2 focus:ring-[#2d7a3a]/30 focus:border-[#2d7a3a] transition-all cursor-pointer pr-10"
            >
              <option value="">Select Technology Type</option>
              {TECH_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7a75]"><ChevronDown /></div>
          </div>
        </div>
        <div>
          <label className="block text-[12px] font-bold tracking-[1.5px] uppercase text-[#6b7a75] mb-2">Funding Source</label>
          <div className="relative">
            <select
              value={fundingSource}
              onChange={e => onFundingChange(e.target.value)}
              className="w-full appearance-none bg-[#f8f5f0] border border-[#d0ccc4] rounded-xl px-4 py-3 text-[15px] text-[#1a2e1e] focus:outline-none focus:ring-2 focus:ring-[#2d7a3a]/30 focus:border-[#2d7a3a] transition-all cursor-pointer pr-10"
            >
              <option value="">Select Funding Source</option>
              <option value="Government">Government</option>
              <option value="Private">Private</option>
              <option value="Not Funded Yet">Not Funded Yet</option>
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7a75]"><ChevronDown /></div>
          </div>
        </div>
      </div>
    </div>
  );
}