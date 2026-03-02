"use client"; 

import Disclaimer from "../assessment/disclaimer";

export default function AssessmentPage() {
  return (
    <div className="bg-[var(--bg-color-light)]">
      <section className="max-w-7xl mx-auto w-full py-10">
        <Disclaimer />
      </section>
    </div>
  );
}