"use client"

export default function Terms() {
  return (
    <div className="bg-[var(--bg-color-light)] text-gray-800">

      {/* ================= HERO ================= */}
      <section className="bg-[var(--secondary-color)] text-white py-24 px-6 lg:px-20">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Terms and Definitions
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-7">
            This page provides clear explanations of key terms used in the
            Technology Readiness Level (TRL) assessment.
          </p>
        </div>
      </section>

      {/* ================= INTRO ================= */}
      <section className="py-16 px-6 lg:px-20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="leading-8 text-gray-700">
            Reviewing these definitions before or during the assessment can
            improve accuracy and build confidence as you complete the
            evaluation.
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="pb-24 px-6 lg:px-20">
        <div className="max-w-6xl mx-auto space-y-20">

          {/* ================= CATEGORY 1 ================= */}
          <div className="bg-white rounded-2xl shadow-md p-10">
            <h2 className="text-3xl font-bold text-[var(--secondary-color)] mb-8">
              Food, Food Ingredients and Beverages
            </h2>

            <h3 className="text-xl font-semibold mb-4">
              Food Technology
            </h3>
            <p className="mb-6 leading-7 text-justify">
              Technologies related to processing, preservation, formulation,
              or enhancement of edible products derived from agricultural,
              aquatic, and natural resources.
            </p>

            <div className="bg-gray-50 p-6 rounded-xl mb-8">
              <p className="font-semibold mb-3">Examples:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Vacuum-fried jackfruit</li>
                <li>Malunggay chips</li>
                <li>Energy-efficient smoked fish processing</li>
                <li>Retort pouch ready-to-eat meals</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold mb-4">
              Food Ingredients
            </h3>
            <p className="leading-7 text-justify">
              Technologies focusing on production of functional,
              nutritional, or flavor-enhancing components such as powders,
              extracts, isolates, and natural sweeteners.
            </p>
          </div>

          {/* ================= CATEGORY 2 ================= */}
          <div className="bg-white rounded-2xl shadow-md p-10">
            <h2 className="text-3xl font-bold text-[var(--secondary-color)] mb-8">
              Animal Feed, Feed Ingredients and Animal Nutrition
            </h2>

            <p className="leading-7 mb-6 text-justify">
              Technologies supporting feed formulation, nutritional
              optimization, and animal health improvement across livestock,
              poultry, and aquatic species.
            </p>

            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="font-semibold mb-3">Examples:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Extruded feeds for tilapia and bangus</li>
                <li>Black soldier fly larvae meal</li>
                <li>Vitamin–mineral premixes</li>
                <li>Precision feeding strategies</li>
              </ul>
            </div>
          </div>

        </div>
      </section>

    </div>
  )
}