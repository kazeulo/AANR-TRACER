"use client"

import { useState } from "react"

const categories = [
  {
    title: "Food, Food Ingredients and Beverages",
    sections: [
      {
        title: "Food Technology",
        definition:
          "Technologies that are related to processing, preservation, formulation, or enhancement of edible products derived from agricultural, aquatic, and natural resources. Included in the scope of this category are novel or value-added food products, primary and secondary food processing, food preservation and packaging solutions, and process optimization technologies.",
        examples: [
          "Vacuum-dried jackfruit",
          "Saba banana, or malunggay chips",
          "Smoked fish using improved or energy-efficient smoking kilns",
          "Fermented cacao tablea or enhanced bagoong processing",
          "Retort pouch ready-to-eat meals using local crops or fish",
          "Root crop–based bakery products (e.g., ube bread, camote flour bread)",
        ],
      },
      {
        title: "Food Ingredients",
        definition:
          "Technologies that focuses on producing functional, nutritional, or flavor-enhancing components and its resulting products such as powders, extracts, isolates, and natural sweeteners derived from AANR resources. Included in this category are production, extraction, concentration, or modification of natural ingredients; powders, concentrates, isolates, or hydrolysates; functional ingredient development such as antioxidants, fibers, protein extracts; and enhancers of nutritional value, texture, stability, or sensory quality.",
        examples: [
          "Malunggay powder, turmeric powder, ube powder as natural colorants or fortifiers",
          "Collagen or protein isolate from tilapia, shrimp, or other aquatic by-products",
          "Cassava, taro, or sweet potato starch as binders and stabilizers",
          "Coconut sugar, coco sap syrup, or natural sweeteners",
          "Prebiotic fibers extracted from coconut husk or banana peel",
        ],
      },
      {
        title: "Beverages",
        definition:
          "Technology category covering the formulation, processing, and preservation of drinkable products for human consumption such as fruit-based beverages, functional drinks, fermented products, plant-based alternatives, and ready-to-drink products designed to ensure high quality, safety, and shelf stability.",
        examples: [
          "Calamansi, mango, or bignay juice concentrates",
          "Moringa, turmeric-ginger, or coco-based functional drinks",
          "Fermented fruit wines (duhat, bignay, tamarind)",
          "Kombucha produced from locally sourced tea or botanicals",
          "Coconut milk beverages and rice-based drink alternatives",
        ],
      },
    ],
  },

  {
    title: "Animal Feed, Feed Ingredients and Animal Nutrition",
    sections: [
      {
        title: "Animal Feed",
        definition:
          "Technologies related to development, formulation, and processing of complete feeds that support the growth, health, and productivity of livestock, poultry, and aquatic species. It includes innovations in feed formulation, and processing methods to ensure quality and safety.",
        examples: [
          "Formulated extruded feeds for tilapia and bangus",
          "Pelletized complete feeds for poultry or swine",
          "Fermented complete feeds for ruminant",
        ],
      },
      {
        title: "Feed Ingredients",
        definition:
          "Technologies related to raw materials or functional components used in feed manufacturing, such as meal, pellets, concentrates, or additives and its corresponding process. These feed ingredients are sourced from crops, by-products, or aquatic resources used to enhance feed nutrition, digestibility, stability, or cost-efficiency.",
        examples: [
          "Black soldier fly larvae meal",
          "Plant-based protein meals such as moringa leaf meal, and copra meal",
          "Fish hydrolysates from processing by-products",
          "Natural feed additives such as enzymes, probiotics, or phytogenic extracts",
        ],
      },
      {
        title: "Animal Nutrition",
        definition:
          "Technologies center on strategies and formulations that optimize nutrient delivery, improve animal health, and enhance performance across terrestrial and aquatic species. It includes nutritional supplements, probiotics for animals, and precision feeding approaches.",
        examples: [
          "Vitamin–mineral premixes tailored for specific species and growth stages",
          "Probiotic and prebiotic supplements",
          "Precision feeding strategies",
          "Functional nutrition technologies",
        ],
      },
    ],
  },

  {
    title: "Agri-Aqua Machinery and Facility",
    sections: [
      {
        title: "Agri-Aqua Machinery",
        definition:
          "Technologies related to the design, development, fabrication, and improvement of mechanical or electro-mechanical equipment used in agricultural and aquaculture operations. It includes machinery that enhances production efficiency, reduces labor requirements, supports postharvest activities, and improves overall productivity across crop, livestock, and aquatic systems.",
        examples: [
          "Crop machinery such as rice transplanters, corn shellers, mini-tillers, and mechanical dryers",
          "Aquaculture machinery such as automatic fish feeders, aerators, water pumps, and seaweed dryers",
          "Livestock equipment such as mechanical forage choppers and manure handling systems",
          "Postharvest machinery such as seed cleaners, fruit graders, vacuum dryers, and feed pelletizers",
          "Renewable-energy-based machines such as solar-powered irrigation pumps and solar dryers",
        ],
      },
      {
        title: "Agri-aqua Facility",
        definition:
          "Technologies related to the development, design, and improvement of physical structures, production systems, and controlled environments that support agricultural and aquaculture operations. These facilities enable efficient cultivation, rearing, processing, storage, and resource management.",
        examples: [
          "Controlled environment agriculture such as greenhouses, screen houses, hydroponics and aquaponics systems",
          "Aquaculture structures such as floating cages, fish ponds, raceways, hatchery systems, and nursery tanks",
          "Postharvest and processing facilities such as cold storage units, packing houses, slaughter facilities, and fish processing rooms",
          "Waste management facilities such as composting structures and effluent treatment systems",
          "Storage and handling such as grain silos, feed storage rooms, and climate-controlled warehouses",
        ],
      },
    ],
  },

  {
    title: "Agri-Aqua Device and Diagnostic Kits",
    sections: [
      {
        title: "Agri-Aqua Device",
        definition:
          "Technologies related to the small-scale, portable, or non-motorized tools and instruments inculding its production process, used to support agricultural and aquaculture operations. These devices assist in measurement, monitoring, manual operations, environmental management, and process efficiency across crop, livestock, and aquatic systems.",
        examples: [
          "Hand-operated transplanting tools, seed meters, or soil moisture meters",
          "Water quality monitoring devices such as DO meters and salinity testers",
          "Simple sorting, grading, or measuring tools for crops or fish",
          "Low-cost feeders, traps, flotation devices, and net systems for aquaculture",
          "Portable sensors for temperature, humidity, or soil pH monitoring",
        ],
      },
      {
        title: "Diagnostic Kit",
        definition:
          "Technologies related to the development of rapid, accurate, and user-friendly tools for detecting diseases, contaminants, pathogens, or physiological conditions in animals, plants, and aquatic species. These kits support early detection, management decisions, and biosecurity efforts across AANR sectors.",
        examples: [
          "Rapid test kits for fish pathogens",
          "Field test kits for livestock diseases",
          "Plant disease diagnostic kits",
          "Water quality test strips for ammonia, nitrate, or nitrite in aquaculture",
          "Mycotoxin or pesticide residue testing kits for grains and produce",
        ],
      },
    ],
  },

  {
    title: "ICT (Apps and System involving IoT)",
    sections: [
      {
        title: "ICT",
        definition:
          "ICT (Information and Communication Technology) technologies refer to the development and application of digital tools, software, systems, and IoT solutions that improve data management, decision-making, monitoring, and operational efficiency in agriculture, aquaculture, and natural resource management. This includes mobile and web applications, embedded systems, sensors, and connected networks for real-time monitoring and automation.",
        examples: [
          "Farm management systems and mobile apps for crop, livestock, or aquaculture operations",
          "IoT-enabled sensors for soil moisture, temperature, water quality, or environmental monitoring",
          "Automated feeding, aeration, or irrigation systems connected to cloud-based platforms",
          "Decision-support systems for precision agriculture or aquaculture production",
          "Market information, traceability, and inventory management platforms",
        ],
      },
    ],
  },

  {
    title: "New Plant Variety",
    sections: [
      {
        title: "New Plant Variety",
        definition:
          "Technology related to the development, breeding, or genetic improvement of plants to produce varieties with enhanced traits such as higher yield, improved resistance to pests and diseases, better nutritional value, or adaptability to specific environments. This includes conventional breeding, mutation breeding, and modern biotechnology approaches applied to crops, fruits, ornamentals, and other plants.",
        examples: [
          "High-yielding rice or corn varieties adapted to local conditions",
          "Disease-resistant banana, cacao, or tomato cultivars",
          "Drought-tolerant or salt-tolerant vegetable varieties",
          "Biofortified crops such as vitamin A-rich sweet potato or iron-rich rice",
          "Ornamentals with improved color, fragrance, or shelf life",
        ],
      },
    ],
  },

  {
    title: "New Animal Breed (Aquatic and Terrestrial)",
    sections: [
      {
        title: "New Animal Breed",
        definition:
          "Technologies related to the development, breeding, or genetic improvement of terrestrial and aquatic animals to produce breeds with enhanced traits such as higher productivity, disease resistance, environmental adaptability, or improved product quality. This includes selective breeding, hybridization, and modern biotechnological methods applied to livestock, poultry, and aquaculture species.",
        examples: [
          "High-yielding or fast-growing poultry breeds (e.g., native chicken improvement programs)",
          "Disease-resistant or climate-adapted swine and cattle breeds",
          "Enhanced milk, meat, or egg-producing livestock breeds",
          "Improved tilapia, bangus, or shrimp strains for aquaculture",
          "Ornamental fish or shellfish with better growth, coloration, or stress tolerance",
        ],
      },
    ],
  },

  {
    title: "Natural Resource–Derived Materials",
    sections: [
      {
        title: "Natural Resource–Derived Materials",
        definition:
          "Technologies related to extraction, processing, modification, and application of materials derived from agricultural, aquatic, forest, mineral, and other natural resources. These technologies focus on transforming AANR-based raw materials into functional, sustainable, and value-added materials for industrial, construction, packaging, energy, and allied applications.",
        examples: [
          "Bio-based construction materials such as compressed earth blocks, rice husk ash–blended cement, bamboo panels",
          "Natural fibers and composites such as abaca fiber composites, coconut coir boards, pineapple leaf fiber textiles",
          "Biodegradable and bio-based materials such starch-based bioplastics from cassava and seaweed-based packaging films",
          "Forest- and plant-derived materials such as engineered bamboo lumber, wood-plastic composites, and nipa shingles",
          "Aquatic and marine resource materials such as chitosan from crustacean shells and calcium carbonate from seashell waste",
          "Value-added by-product utilization such as biochar from agricultural waste and silica from rice husk",
        ],
      },
    ],
  },

  {
    title: "Other TRL-Related Terms",
    sections: [
      {
        title: "Alpha Testing",
        definition:
          "Alpha testing refers to the initial phase of system or product testing conducted internally by the development team or a limited group of users in a controlled environment. It aims to identify bugs, functional issues, and usability problems before releasing the product to external users.",
        examples: [
          "Internal testing of a farm management app by developers and staff before pilot release",
          "Laboratory testing of a diagnostic kit prototype prior to field trials",
        ],
      },
      {
        title: "Beta Testing",
        definition:
          "Beta testing is the evaluation of a product or system by a limited group of external users under real-world conditions before full commercial launch. It focuses on gathering user feedback, identifying remaining issues, and validating performance in actual operating environments.",
        examples: [
          "Pilot deployment of an IoT irrigation system to selected farmers",
          "Field trials of a new aquaculture feed formulation with partner farms",
        ],
      },
      {
        title: "Business Model Canvas",
        definition:
          "The Business Model Canvas is a strategic management tool used to describe, design, and analyze how an organization creates, delivers, and captures value. It consists of key components such as value propositions, customer segments, revenue streams, cost structure, key activities, key resources, key partners, and customer relationships.",
        examples: [
          "Mapping revenue streams for a technology licensing model",
          "Identifying customer segments for a new diagnostic kit",
        ],
      },
      {
        title: "Freedom to Operate",
        definition:
          "Freedom to Operate (FTO) refers to the ability to commercialize a product, process, or technology without infringing on existing intellectual property rights such as patents. It involves conducting patent searches and legal assessments to determine whether a technology can be legally used, manufactured, or sold in a specific jurisdiction.",
        examples: [
          "Patent landscape analysis before commercializing a new bio-based material",
          "Legal review prior to licensing an improved plant variety",
        ],
      },
    ],
  }
]

export default function Terms() {
  const [search, setSearch] = useState("")

  const filteredCategories = categories
    .map((category) => {
      const filteredSections = category.sections.filter((section) => {
        const searchText = search.toLowerCase()

        return (
          category.title.toLowerCase().includes(searchText) ||
          section.title.toLowerCase().includes(searchText) ||
          section.definition.toLowerCase().includes(searchText) ||
          section.examples.some((example) =>
            example.toLowerCase().includes(searchText)
          )
        )
      })

      if (
        category.title.toLowerCase().includes(search.toLowerCase()) ||
        filteredSections.length > 0
      ) {
        return {
          ...category,
          sections: filteredSections,
        }
      }

      return null
    })
    .filter(
      (category): category is {
        title: string
        sections: {
          title: string
          definition: string
          examples: string[]
        }[]
      } => category !== null
    )

  return (
    <div className="bg-[var(--bg-color-light)] text-gray-800">

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

      {/* search bar */}
      <section className="py-10 px-6 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <input
            type="text"
            placeholder="Search terms, definitions, or examples..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)]"
          />
        </div>
      </section>

      {/* content */}
      <section className="pb-24 px-6 lg:px-20">
        <div className="max-w-6xl mx-auto space-y-20">

          {filteredCategories.length === 0 && (
            <div className="text-center text-gray-600">
              No matching terms found.
            </div>
          )}

          {filteredCategories.map((category, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-md p-10">
              <h2 className="text-3xl font-bold text-[var(--secondary-color)] mb-8">
                {category.title}
              </h2>

              {category.sections.map((section, idx) => (
                <div key={idx} className="mb-10">
                  <h3 className="text-xl font-semibold mb-4">
                    {section.title}
                  </h3>
                  <p className="mb-6 leading-8 text-left">
                    {section.definition}
                  </p>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <p className="font-semibold mb-3">Examples:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      {section.examples.map((example, exIndex) => (
                        <li key={exIndex}>{example}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ))}

        </div>
      </section>
    </div>
  )
}