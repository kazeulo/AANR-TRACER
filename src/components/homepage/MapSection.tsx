// components/homepage/MapSection.tsx
export default function MapSection() {
  return (
    <section className="py-[100px] px-6 lg:px-[6vw] bg-[var(--color-bg)]">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-10">
          <div>
            <span className="inline-block text-[10px] font-bold tracking-[3px] uppercase text-[var(--color-accent)] mb-4 pb-4 border-b-2 border-[var(--color-accent)]">
              Find Us
            </span>
            <h2 className="text-[clamp(28px,2.5vw,38px)] text-[var(--color-primary)] tracking-tight">
              Visit DOST PCAARRD
            </h2>
          </div>
          <div className="text-[13px] text-[var(--color-text-gray)] md:text-right leading-[1.6] font-light">
            DOST-PCAARRD, Los Baños<br />Laguna, Philippines 4030
          </div>
        </div>
        <div className="rounded-[20px] overflow-hidden shadow-[0_20px_60px_rgba(15,46,26,0.12)] border border-[#0f2e1a]/[0.08]">
          <iframe
            src="https://www.google.com/maps?q=DOST+PCAARRD,+Los+Baños,+Laguna&output=embed"
            width="100%"
            height="480"
            loading="lazy"
            style={{ border: 0, display: "block" }}
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}