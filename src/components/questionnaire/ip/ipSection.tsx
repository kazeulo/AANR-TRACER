import { 
    PLANT_VARIETY_TYPES, 
    ANIMAL_BREED_TYPES, 
    ANIMAL_BREED_IP_TYPES, 
    IP_TYPES, 
    DUS_PVP_OPTIONS,
    ANIMAL_BREED_IP_STATUS_OPTIONS,
    IP_STATUS_OPTIONS,
} from "@/constants/ip";
import type { IPSectionProps } from "@/types/questions";
import { IPTBMContactPanel } from "../contacts/IPTBMContactPanel";

// IP Section
export function IPSection({ label, ipData, onChange, technologyType }: IPSectionProps) {
  const key = label;
  const current = ipData[key] ?? { initiated: "", selectedTypes: {}, typeStatuses: {}, dusPvpStatus: "" };

  const isPlantVariety = PLANT_VARIETY_TYPES.includes(technologyType);
  const isAnimalBreed  = ANIMAL_BREED_TYPES.includes(technologyType);

  const setField = (field: string, value: unknown) => {
    onChange({ ...ipData, [key]: { ...current, [field]: value } });
  };

  const handleTypeToggle = (ipType: string) => {
    const isChecked = current.selectedTypes[ipType] ?? false;
    const updatedTypes = { ...current.selectedTypes, [ipType]: !isChecked };
    const updatedStatuses = { ...current.typeStatuses };
    if (isChecked) delete updatedStatuses[ipType];
    onChange({ ...ipData, [key]: { ...current, selectedTypes: updatedTypes, typeStatuses: updatedStatuses } });
  };

  const ipTypesToShow = isAnimalBreed ? ANIMAL_BREED_IP_TYPES : IP_TYPES;

  return (
    <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(15,46,26,0.05)]">

      {/* Card header */}
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-[#f5f2ec] bg-[var(--color-bg-subtle)]">
        <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
        <span className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--color-accent)]">{label}</span>
      </div>

      <div className="px-6 py-6">

        {/* Main initiated select */}
        <div className="relative mb-5">
          <select
            value={current.initiated}
            onChange={e => {
              const newVal = e.target.value as "yes" | "no" | "trade_secret" | "";
              if (newVal !== "yes") {
                onChange({ ...ipData, [key]: { initiated: newVal, selectedTypes: {}, typeStatuses: {}, dusPvpStatus: "" } });
              } else {
                setField("initiated", newVal);
              }
            }}
            className="w-full appearance-none bg-[var(--color-bg-subtle)] border border-[var(--color-border-input)] rounded-xl px-4 py-3 text-[14px] text-[var(--color-text)] font-light focus:outline-none focus:ring-2 focus:ring-[#4aa35a]/30 focus:border-[#4aa35a] transition-all cursor-pointer pr-10"
          >
            <option value="">Select an option…</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="trade_secret">IP is a Trade Secret</option>
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-faintest)]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* YES — Plant Variety: DUS/PVP single dropdown */}
        {current.initiated === "yes" && isPlantVariety && (
          <div className="space-y-3">
            <p className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--color-text-faintest)] mb-3">
              Plant Variety Protection Status
            </p>
            <div className="relative">
              <select
                value={current.dusPvpStatus ?? ""}
                onChange={e => setField("dusPvpStatus", e.target.value)}
                className="w-full appearance-none bg-[var(--color-bg-subtle)] border border-[var(--color-border-input)] rounded-xl px-4 py-3 text-[14px] text-[var(--color-text)] font-light focus:outline-none focus:ring-2 focus:ring-[#4aa35a]/30 focus:border-[#4aa35a] transition-all cursor-pointer pr-10"
              >
                <option value="">Select current status…</option>
                {DUS_PVP_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-faintest)]">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* YES — Animal Breed: Copyright + Trademark checkboxes with status */}
        {current.initiated === "yes" && isAnimalBreed && (
          <div className="space-y-3">
            <p className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--color-text-faintest)] mb-3">
              Select IP Protection Type(s)
            </p>
            {ipTypesToShow.map(ipType => {
              const isChecked = current.selectedTypes[ipType] ?? false;
              return (
                <div key={ipType} className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex-shrink-0">
                      <input type="checkbox" checked={isChecked} onChange={() => handleTypeToggle(ipType)} className="peer sr-only" />
                      <div className={`w-5 h-5 rounded-[5px] border-2 flex items-center justify-center transition-all duration-200 ${
                        isChecked ? "bg-[var(--color-accent)] border-[#4aa35a]" : "bg-[var(--color-bg-card)] border-[#c8c3b8] group-hover:border-[#4aa35a]/60"
                      }`}>
                        {isChecked && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className={`text-[14px] font-light leading-snug transition-colors ${isChecked ? "text-[var(--color-primary)] font-medium" : "text-[var(--color-text-gray)]"}`}>
                      {ipType}
                    </span>
                  </label>
                  {isChecked && (
                    <div className="ml-8 relative">
                      <select
                        value={current.typeStatuses[ipType] ?? ""}
                        onChange={e => setField("typeStatuses", { ...current.typeStatuses, [ipType]: e.target.value })}
                        className="w-full max-w-xs appearance-none bg-[var(--color-bg-subtle)] border border-[var(--color-border-input)] rounded-xl px-4 py-2.5 text-[13px] text-[var(--color-text-gray)] font-light focus:outline-none focus:ring-2 focus:ring-[#4aa35a]/30 focus:border-[#4aa35a] transition-all cursor-pointer pr-8"
                      >
                        <option value="">IP Protection Status…</option>
                        {ANIMAL_BREED_IP_STATUS_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-faintest)]">
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                          <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* YES — Generic flow: all IP types */}
        {current.initiated === "yes" && !isPlantVariety && !isAnimalBreed && (
          <div className="space-y-3">
            <p className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--color-text-faintest)] mb-3">
              Select IP Protection Type(s)
            </p>
            {IP_TYPES.map(ipType => {
              const isChecked = current.selectedTypes[ipType] ?? false;
              return (
                <div key={ipType} className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex-shrink-0">
                      <input type="checkbox" checked={isChecked} onChange={() => handleTypeToggle(ipType)} className="peer sr-only" />
                      <div className={`w-5 h-5 rounded-[5px] border-2 flex items-center justify-center transition-all duration-200 ${
                        isChecked ? "bg-[var(--color-accent)] border-[#4aa35a]" : "bg-[var(--color-bg-card)] border-[#c8c3b8] group-hover:border-[#4aa35a]/60"
                      }`}>
                        {isChecked && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className={`text-[14px] font-light leading-snug transition-colors ${isChecked ? "text-[var(--color-primary)] font-medium" : "text-[var(--color-text-gray)]"}`}>
                      {ipType}
                    </span>
                  </label>
                  {isChecked && (
                    <div className="ml-8 relative">
                      <select
                        value={current.typeStatuses[ipType] ?? ""}
                        onChange={e => setField("typeStatuses", { ...current.typeStatuses, [ipType]: e.target.value })}
                        className="w-full max-w-xs appearance-none bg-[var(--color-bg-subtle)] border border-[var(--color-border-input)] rounded-xl px-4 py-2.5 text-[13px] text-[var(--color-text-gray)] font-light focus:outline-none focus:ring-2 focus:ring-[#4aa35a]/30 focus:border-[#4aa35a] transition-all cursor-pointer pr-8"
                      >
                        <option value="">IP Protection Status…</option>
                        {IP_STATUS_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-faintest)]">
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                          <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* NO — Regional IP-TBM contacts */}
        {current.initiated === "no" && (
          <IPTBMContactPanel />
        )}

        {/* TRADE SECRET */}
        {current.initiated === "trade_secret" && (
          <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl text-[14px] text-blue-800 leading-relaxed font-light">
            Your technology is protected as a <strong className="font-semibold">Trade Secret</strong>. Ensure that appropriate
            confidentiality measures and non-disclosure agreements are in place to maintain its protection.
          </div>
        )}
      </div>
    </div>
  );
}
