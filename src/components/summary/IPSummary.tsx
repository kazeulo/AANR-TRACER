import type { IPData } from "@/app/utils/trlCalculator/trlCalculator";

export function IPSummary({ ipData }: { ipData: IPData }) {
  const entry = ipData?.["Intellectual Property (IP) Initiated"];
  if (!entry) return null;

  const { initiated, selectedTypes: rawTypes, typeStatuses } = entry;
  const selectedTypes = Object.entries(rawTypes ?? {}).filter(([, v]) => v).map(([k]) => k);

  const initiatedLabel =
    initiated === "yes"          ? "Yes — IP Protection Initiated" :
    initiated === "no"           ? "No — Not Yet Initiated" :
    initiated === "trade_secret" ? "Protected as Trade Secret" :
                                   "Not answered";
  const isPositive = initiated === "yes" || initiated === "trade_secret";

  return (
    <div className="bg-white border border-[#d8d3cc] rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(15,46,26,0.06)]">
      <div className="flex items-center gap-2.5 px-7 py-4 border-b border-[#e8e4db] bg-[#f5f2ec]">
        <span className="w-2 h-2 rounded-full bg-[#2d7a3a] flex-shrink-0" />
        <span className="text-[12px] font-bold tracking-[2px] uppercase text-[#2d7a3a]">
          Intellectual Property Protection Status
        </span>
      </div>
      <ul className="px-7 py-3 divide-y divide-[#ede9e0]">
        <li className="flex items-start gap-3 py-3">
          <div className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-[5px] border-2 flex items-center justify-center ${
            isPositive ? "bg-[#2d7a3a] border-[#2d7a3a]" : "bg-amber-100 border-amber-400"
          }`}>
            {isPositive ? (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1.5 1.5l5 5M6.5 1.5l-5 5" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] text-[#1a2e1e] leading-relaxed">Intellectual Property (IP) Initiated</p>
            <span className={`inline-block mt-1.5 text-[12px] font-semibold px-2.5 py-0.5 rounded-full border ${
              isPositive
                ? "text-[#1a5c2a] bg-[#2d7a3a]/[0.08] border-[#2d7a3a]/25"
                : "text-amber-800 bg-amber-50 border-amber-300"
            }`}>
              {initiatedLabel}
            </span>
            {selectedTypes.length > 0 && (
              <ul className="mt-2.5 space-y-1.5 pl-0.5">
                {selectedTypes.map(type => {
                  const status = typeStatuses?.[type];
                  const isDone = status === "Filed" || status === "Registered";
                  return (
                    <li key={type} className="flex items-center gap-2.5">
                      <div className={`flex-shrink-0 w-4 h-4 rounded-[4px] border-2 flex items-center justify-center ${
                        isDone ? "bg-[#2d7a3a] border-[#2d7a3a]" : "bg-white border-[#b0a99e]"
                      }`}>
                        {isDone && (
                          <svg width="8" height="6" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className="text-[13px] text-[#3d3d3d]">{type}</span>
                      {status && (
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          isDone ? "bg-[#2d7a3a]/10 text-[#1a5c2a]" : "bg-[#f5f2ec] text-[#6b7a75]"
                        }`}>
                          {status}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </li>
      </ul>
    </div>
  );
}