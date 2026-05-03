// ABH Contact Panel
import { ABH_REGIONS } from "@/constants/contacts"

export function ABHContactPanel() {
  return (
    <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 overflow-hidden">
      <div className="px-4 py-3 border-b border-amber-200 bg-amber-100/60">
        <p className="text-[11px] font-bold tracking-[1.5px] uppercase text-amber-800 mb-0.5">
          Agribusiness Hub (ABH) Contacts
        </p>
        <p className="text-[11.5px] text-amber-700 font-light leading-relaxed">
          For pre-commercialization packaging, coordinate with the ABH Project under the RAISE Program in your region.
        </p>
      </div>
      <div className="divide-y divide-amber-100">
        {ABH_REGIONS.map(({ region, university, email }) => (
          <div key={region} className="flex items-center justify-between gap-3 px-4 py-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-[12px] text-amber-900 font-light truncate">{region}</span>
            </div>
            <div className="flex-shrink-0 flex flex-col items-end gap-0.5">
              <span className="text-[12px] font-semibold text-amber-800">{university}</span>
              {email && (
                <a href={`mailto:${email}`} className="text-[10px] text-amber-600 hover:text-amber-800 underline underline-offset-2 transition-colors">
                  {email}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}