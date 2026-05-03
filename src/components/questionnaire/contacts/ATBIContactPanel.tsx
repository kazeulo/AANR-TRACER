// ATBI Contact Panel
import { REGULATORY_BODIES, ATBI_REGIONS } from "@/constants/contacts";

export function ATBIContactPanel({ technologyType }: { technologyType: string }) {
  const reg = REGULATORY_BODIES[technologyType];
  return (
    <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 overflow-hidden">
      <div className="px-4 py-3 border-b border-blue-200">
        <p className="text-[11px] font-bold tracking-[1.5px] uppercase text-blue-700 mb-1.5">
          Regional ATBI Contact Information
        </p>
        <p className="text-[11.5px] text-blue-600 font-light leading-relaxed mb-3">
          For assistance with regulatory requirements, you may reach out to ATBI at the email address below or visit the official regulatory body website for detailed application guidelines.
        </p>
        <div className="divide-y divide-blue-100 rounded-lg border border-blue-100 overflow-hidden">
          {ATBI_REGIONS.map(({ region, university, email }) => (
            <div key={region} className="flex items-center justify-between gap-3 px-3 py-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-300" />
                <span className="text-[11.5px] text-blue-800 font-light truncate">{region}</span>
              </div>
              <div className="flex-shrink-0 flex flex-col items-end gap-0.5">
                <span className="text-[11.5px] font-semibold text-blue-900">{university}</span>
                {email && (
                  <a href={`mailto:${email}`} className="text-[10px] text-blue-500 hover:text-blue-700 underline underline-offset-2 transition-colors">
                    {email}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {reg && (
        <div className="px-4 py-3 space-y-3">
          <p className="text-[11.5px] text-blue-700 font-light leading-relaxed">
            You may also visit the official website of the relevant regulatory body to review requirements and begin your application.
          </p>
          <div className="flex items-start gap-2.5">
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
            <div>
              <p className="text-[11px] font-bold tracking-[1px] uppercase text-blue-600 mb-0.5">
                Relevant Regulatory Body
              </p>
              <p className="text-[12.5px] text-blue-900 font-medium leading-relaxed mb-1">
                {reg.body}
              </p>
              
              <a
                href={reg.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[12px] text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors break-all"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                {reg.url}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}