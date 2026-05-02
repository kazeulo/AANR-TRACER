import { TechTypeGrid } from "./TechTypeGrid";

export default function AanrSectorSection(){
  return (
    <section className="py-[80px] px-6 lg:px-[6vw] bg-[var(--color-bg)] relative overflow-hidden">

      {/* Subtle dot grid bg */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #4aa35a 0.5px, transparent 0.5px)", backgroundSize: "32px 32px", opacity: 0.03 }} />

      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-10">
          <div>
            <span className="inline-block text-[10px] font-bold tracking-[3px] uppercase text-[var(--color-accent)] mb-4 pb-4 border-b-2 border-[var(--color-accent)]">
              Covered Technologies
            </span>
            <h2 className=" text-[clamp(28px,3vw,38px)] text-[var(--color-primary)] tracking-tight leading-snug">
              Built for the <em className="text-[var(--color-accent)]">AANR Sector</em>
            </h2>
          </div>
          <p className="text-[13.5px] text-[var(--color-text-gray)] font-light max-w-[300px] leading-relaxed">
            TRACER covers the full breadth of Agriculture, Aquatic, and Natural Resources innovations.
          </p>
        </div>

        <TechTypeGrid />
      </div>
    </section>
  );
}