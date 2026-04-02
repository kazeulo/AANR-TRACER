export interface TracerLevelInfo {
  title: string;
  description: string;
}

export type TracerDescriptionMap = Record<number, TracerLevelInfo>;

export const TRACER_DESCRIPTIONS: Record<string, TracerDescriptionMap> = {

  "Food, Food Ingredients and Beverages": {
    1: {
      title: "Concept & Market Definition",
      description:
        "The food product concept is defined based on identified market needs. Prior art search or initial concept validation has been completed, and potential end-users, beneficiaries, and relevant industry sectors have been identified.",
    },
    2: {
      title: "Laboratory Formulation",
      description:
        "Bench-scale experiments are conducted to develop an initial formulation. A first prototype is produced for preliminary sensory evaluation, with internal screening and initial assessment of potential consumer acceptance.",
    },
    3: {
      title: "Optimization & Technical Characterization",
      description:
        "The formulation is optimized for highest sensory acceptability. Proximate analysis confirms basic nutritional and chemical properties and intellectual property (IP) protection is initiated.",
    },
    4: {
      title: "Controlled Validation & IP Filing",
      description:
        "The product undergoes sensory validation with target consumers. Positive proximate results are confirmed, and preliminary shelf-life testing under laboratory conditions is established. IP protection is filed, market viability is assessed using secondary data, and a potential industry partner is identified.",
    },
    5: {
      title: "Pilot Preparation",
      description:
        "A pilot-scale formulation and production manual are developed. Packaging compatibility is tested, and initial promotion activities (e.g., exhibits, pitching, trade fairs) are conducted. Engagement with potential industry partners begins, and an initial Business Model Canvas (BMC) is prepared.",
    },
    6: {
      title: "Pilot Production & Market Exposure",
      description:
        "The product is tested at pilot scale with industry collaboration secured. Allergen screening is conducted, and first industry-scale production trials begin. Initial market exposure is conducted through limited releases or trade shows.",
    },
    7: {
      title: "Industry Validation & Regulatory Preparation",
      description:
        "Industry-scale production is successfully validated with standardized GMP-compliant manuals. Initial sales data from market testing are recorded. Licensing intent is secured, FTO and IP valuation reports are prepared, and commercialization planning is underway. Regulatory processes (e.g., FDA approval) are initiated.",
    },
    8: {
      title: "Commercial Production Readiness",
      description:
        "The product is ready for full-scale commercial production with consistent and replicable processes. Necessary FDA approvals and relevant certifications (e.g., HACCP, Halal) are obtained. Licensing terms are finalized, and fairness opinion review is requested.",
    },
    9: {
      title: "Full Commercialization",
      description:
        "A formal technology licensing agreement is signed. The food product is fully commercialized and available to consumers in the market.",
    },
  },

  "Animal Feed, Feed Ingredients and Animal Nutrition": {
    1: {
      title: "Concept & Industry Relevance",
      description:
        "The feed or nutrition concept is clearly defined, with prior art search or initial concept validation completed. Target animals, end-users (e.g., farmers, integrators, feed manufacturers), and relevant industry sectors are identified.",
    },
    2: {
      title: "Laboratory Formulation",
      description:
        "Bench-scale laboratory experiments are conducted to develop an initial feed formulation. Preliminary assessments are carried out to evaluate potential application and suitability for the intended animal species.",
    },
    3: {
      title: "Feeding Trial & Optimization",
      description:
        "Controlled feeding trials with target animals are conducted to evaluate performance and safety. The formulation is optimized based on trial results (if applicable). Proximate analysis confirms nutritional profile, and IP protection is initiated.",
    },
    4: {
      title: "Nutritional & Safety Validation & IP Filing",
      description:
        "Nutritional adequacy is confirmed through proximate analysis. The product passes toxicity and safety evaluations, and storage stability is established. IP protection is filed, market viability is assessed using secondary data, and a potential industry partner is identified.",
    },
    5: {
      title: "Pilot Preparation",
      description:
        "A pilot-scale formulation and production manual are developed. Basic product promotion and packaging are initiated (e.g., trade fairs, pitching). Initial discussions with potential industry partners are conducted, and a Business Model Canvas (BMC) is prepared.",
    },
    6: {
      title: "Pilot Production & Industry Testing",
      description:
        "The product undergoes scaled-up pilot production testing. Agreements with industry partners for product testing are secured, and first industry-scale production trials begin. Initial market exposure or limited release testing is conducted.",
    },
    7: {
      title: "Industry Validation & Regulatory Preparation",
      description:
        "Industry-scale production is successfully validated with standardized production manuals. A Letter of Intent for licensing is secured, and FTO and IP valuation reports are prepared. Commercialization planning and licensing negotiations are underway. Regulatory processes with the Bureau of Animal Industry (BAI) or FDA are initiated.",
    },
    8: {
      title: "Commercial Production Readiness",
      description:
        "The product is ready for full-scale commercial production with consistent, replicable processes. Required BAI or FDA approvals are obtained. Licensing terms are finalized, and a fairness opinion review is requested.",
    },
    9: {
      title: "Full Commercialization",
      description:
        "A formal Technology Licensing Agreement is signed. The feed product is fully commercialized and commercially available to target users such as livestock producers, aquaculture operators, or feed manufacturers.",
    },
  },

  "Fertilizer and Pesticide": {
    1: {
      title: "Concept & Target Definition",
      description:
        "The fertilizer or pesticide concept is clearly defined, supported by prior art search or initial validation. Target crops, end-users (e.g., farmers, agri-enterprises), and relevant industry sectors are identified.",
    },
    2: {
      title: "Laboratory Formulation",
      description:
        "Bench-scale laboratory experiments are conducted to develop the initial formulation. Preliminary assessment evaluates feasibility, intended mode of action, and potential application on target crops or pests.",
    },
    3: {
      title: "Laboratory Efficacy & Safety Testing",
      description:
        "The formulated product is tested under laboratory conditions for efficacy, stability, and compatibility. The formulation is optimized based on experimental response. Toxicity testing is conducted, and IP protection is initiated.",
    },
    4: {
      title: "Controlled Validation & IP Filing",
      description:
        "Positive efficacy results are obtained under controlled conditions (e.g., greenhouse or contained trials). Toxicity and safety evaluations are passed, and shelf stability is established. IP protection is filed, market viability is assessed using secondary data, and a potential industry partner is identified.",
    },
    5: {
      title: "Pilot Preparation",
      description:
        "A pilot-scale formulation and production manual are developed. Product promotion and packaging using a basic technology profile are conducted (e.g., trade fairs, pitching). Initial meetings with potential industry partners are held, and a Business Model Canvas (BMC) is prepared.",
    },
    6: {
      title: "Pilot Production & Field Testing",
      description:
        "The product undergoes scaled-up pilot production testing. Agreements with industry partners are secured for product testing. First industry-scale production trials are initiated, and initial market tests (e.g., limited release or trade demonstrations) are conducted.",
    },
    7: {
      title: "Industry Validation & Regulatory Preparation",
      description:
        "Industry-scale production is successfully validated, and standardized production manuals are established. A Letter of Intent for licensing is secured. FTO and IP valuation reports are prepared, and commercialization planning is underway. Regulatory application processes with the Fertilizer and Pesticide Authority (FPA) or Bureau of Agriculture and Fisheries Standards (BAFS) are initiated.",
    },
    8: {
      title: "Commercial Production Readiness",
      description:
        "The product is ready for full-scale commercial production with consistent and replicable processes. FPA or BAFS registration is obtained. Licensing terms are finalized, and a fairness opinion review is requested.",
    },
    9: {
      title: "Full Commercialization",
      description:
        "A formal Technology Licensing Agreement is signed. The fertilizer or pesticide product is fully commercialized and commercially available to target users such as farmers, cooperatives, and agri-input distributors.",
    },
  },

  "Agri-Aqua Machinery and Facility": {
    1: {
      title: "Concept & User Identification",
      description:
        "The machinery or facility concept is clearly defined, with prior art search or initial validation completed. Target users (e.g., farmers, aquaculture operators, processors) and relevant industry applications are identified.",
    },
    2: {
      title: "Design & Prototype Development",
      description:
        "Detailed blueprints or engineering designs are completed. A first prototype is fabricated, and initial user assessment is conducted to evaluate functional suitability and practical application.",
    },
    3: {
      title: "Functional Testing",
      description:
        "A working prototype is developed and tested for basic operational capability. Performance parameters are observed, and intellectual property (IP) protection is initiated.",
    },
    4: {
      title: "Controlled Operational Validation & IP Filing",
      description:
        "The machine or facility operates successfully under laboratory-scale or controlled conditions. IP protection is filed, market viability is assessed using secondary data, and a potential industry partner for field testing is identified.",
    },
    5: {
      title: "Pilot Operation",
      description:
        "The machine or facility demonstrates stable performance during pilot-scale operation. An operations manual is established. Technology promotion (e.g., techno demos, exhibits) is conducted, initial meetings with potential industry partners are held, and a Business Model Canvas (BMC) is prepared.",
    },
    6: {
      title: "Field Testing & Certification Preparation",
      description:
        "Industry agreements for product testing are secured, and multi-location testing is conducted. Production/fabrication manuals and technical drawings are finalized. Application for Agricultural Machinery Testing and Evaluation Center (AMTEC) certification is initiated.",
    },
    7: {
      title: "Industry Validation & Replication",
      description:
        "Successful industry testing and validation are completed, and first replication of the machine/facility is achieved. A Letter of Intent for licensing is secured, licensing negotiations begin, and AMTEC certification is obtained. FTO and IP valuation reports are prepared, and a commercialization plan is established.",
    },
    8: {
      title: "Commercial Production Readiness",
      description:
        "The machine or facility is ready for commercial-scale production, demonstrating consistent and error-free replicability. Licensing terms are finalized, and a fairness opinion review is requested.",
    },
    9: {
      title: "Full Commercialization",
      description:
        "A formal Technology Licensing Agreement is signed. The machinery or facility is fully commercialized and commercially available to target users.",
    },
  },

  "Agri-Aqua Device and Diagnostic Kits": {
    1: {
      title: "Concept & Industry Definition",
      description:
        "The device or diagnostic kit concept is clearly defined, supported by prior art search or initial validation. Target users (e.g., farmers, veterinarians, aquaculture technicians, laboratories) and relevant industry applications are identified.",
    },
    2: {
      title: "Initial Prototype Development",
      description:
        "An initial prototype of the device or diagnostic kit is developed and tested for basic functionality. Preliminary assessment of user requirements, operational feasibility, and intended field application is conducted.",
    },
    3: {
      title: "Laboratory Refinement & Analytical Verification",
      description:
        "The working prototype is refined to improve usability, accuracy, portability, or detection capability. Laboratory testing confirms sensitivity, specificity, or measurement accuracy and intellectual property (IP) protection is initiated.",
    },
    4: {
      title: "Controlled Validation & IP Filing",
      description:
        "The device or kit demonstrates positive validation results under laboratory or controlled field conditions. Analytical performance metrics (e.g., detection limits, repeatability, reliability) are confirmed. IP protection is filed, market viability is assessed using secondary data, and a potential industry partner is identified.",
    },
    5: {
      title: "Pilot Testing & Industry Engagement",
      description:
        "The device or kit is tested under pilot-scale or semi-field conditions. A user manual is developed, and technology promotion activities (e.g., techno demos, exhibits) are conducted. Initial discussions with potential industry partners are held, and a Business Model Canvas (BMC) is prepared.",
    },
    6: {
      title: "Multi-location Testing & Manufacturing Preparation",
      description:
        "Formal agreements with industry partners for product testing are secured. Device performance is validated across multiple locations. Production, fabrication, or assembly manuals are finalized to enable scalable manufacturing.",
    },
    7: {
      title: "Industry Validation & Regulatory Preparation",
      description:
        "The device or kit is successfully validated and replicated at industry level. Standardized protocols for large-scale production or assembly are established. A Letter of Intent for licensing is secured. FTO and IP valuation reports are prepared, and commercialization planning is underway. Regulatory or third-party validation processes (e.g., BAI, BFAR) are initiated.",
    },
    8: {
      title: "Commercial Production Readiness",
      description:
        "The device or kit is ready for commercial-scale production with consistent and error-free replicability. Required BAI, BFAR, or third-party validation is obtained. Licensing terms are finalized, and a fairness opinion review is requested.",
    },
    9: {
      title: "Full Commercialization",
      description:
        "A formal Technology Licensing Agreement is signed. The device or diagnostic kit is fully commercialized and commercially available to target users.",
    },
  },

  "ICT (Apps and System involving IoT)": {
    1: {
      title: "Concept & Industry Definition",
      description:
        "The ICT system or IoT-enabled application concept is clearly defined and supported by prior art search or initial validation. Target users, beneficiaries, and relevant industry sectors are identified, including defined use cases and problem statements.",
    },
    2: {
      title: "System Design & Initial Development",
      description:
        "System architecture and technical design are formulated. Initial coding is completed, and core functionalities are partially implemented. Preliminary assessment of user requirements, usability, and technical feasibility is conducted.",
    },
    3: {
      title: "Integrated Prototype Development",
      description:
        "Source code is completed and an integrated working prototype of the system/application is developed. Core modules (including IoT hardware-software integration, if applicable) are functional and intellectual property protection is initiated.",
    },
    4: {
      title: "Alpha Testing & Market Positioning & IP Filing",
      description:
        "Alpha testing is successfully conducted to evaluate system functionality, stability, and internal performance. Identified bugs and system issues are documented and resolved. IP protection is filed. Market viability is assessed using secondary data, and a potential industry partner for pilot deployment is identified.",
    },
    5: {
      title: "Beta Testing & Industry Engagement",
      description:
        "Beta testing is conducted with select external users under controlled real-world conditions. User feedback is incorporated to improve usability, reliability, and performance. A user guide/manual is developed. Technology promotion (e.g., techno demos, pitching) is conducted, initial industry meetings are held, and a Business Model Canvas (BMC) is prepared.",
    },
    6: {
      title: "Initial Industry Deployment",
      description:
        "Formal agreements with industry partners are secured. The system/application is deployed for initial operational use in a real industry setting. Core system functionalities demonstrate stability under limited commercial or operational conditions.",
    },
    7: {
      title: "Industry Validation & Regulatory Preparation",
      description:
        "The system demonstrates stability in industry-scale operations (stable release version). Scalable architecture is validated under real-world usage conditions. A Letter of Intent for licensing is secured. FTO and IP valuation reports are prepared. A Technology Commercialization Plan is completed, and licensing negotiations are initiated. Compliance processes for data privacy, cybersecurity, and other applicable ICT regulations are initiated.",
    },
    8: {
      title: "Commercial Production Readiness",
      description:
        "The system/application is ready for full-scale commercial deployment with consistent, secure, and replicable performance. Required data privacy, cybersecurity, and applicable ICT regulatory approvals or certifications are secured. Licensing terms are finalized and a fairness opinion review is requested.",
    },
    9: {
      title: "Full Commercialization",
      description:
        "A Technology Licensing Agreement is signed. The system/application is fully commercialized and available to target users, with established operational support and market presence.",
    },
  },

  "Natural Resource–Derived Materials": {
    1: {
      title: "Concept & Material Definition",
      description:
        "The material concept derived from natural resources is clearly defined. Prior art search or baseline scientific validation is completed, and potential industrial applications and target sectors are identified.",
    },
    2: {
      title: "Formulation & Preliminary Assessment",
      description:
        "Initial extraction, processing, or synthesis is conducted at laboratory scale. Preliminary material samples are produced and assessed for basic physical, chemical, or functional properties.",
    },
    3: {
      title: "Laboratory Sample Production & Testing",
      description:
        "Processing parameters are optimized. Comprehensive material characterization (e.g., mechanical, thermal, chemical, functional properties) is conducted and IP protection is initiated.",
    },
    4: {
      title: "Controlled Validation & IP Filing",
      description:
        "The material demonstrates positive performance in controlled application testing. Stability, safety, and compatibility are confirmed. IP protection is filed, market viability is assessed, and a potential industry partner is identified.",
    },
    5: {
      title: "Pilot Production & Promotion",
      description:
        "Pilot-scale production methods and processing manuals are developed. Product samples are generated for industry evaluation. Initial promotion and partner engagement activities are conducted, and a Business Model Canvas (BMC) is prepared.",
    },
    6: {
      title: "Prototype Application & Feedback",
      description:
        "Scaled-up pilot production is validated. Industry agreements for product testing are secured, and application testing is conducted in operational environments. Manufacturing protocols for scale-up are established.",
    },
    7: {
      title: "Field Testing & Standardization",
      description:
        "Successful industry validation is achieved. Standardized production manuals are finalized. Licensing intent is secured, FTO and IP valuation reports are prepared, and commercialization planning is initiated.",
    },
    8: {
      title: "Commercial-Scale Validation",
      description:
        "The material is ready for commercial-scale production with consistent quality and replicability. Regulatory certifications (if required) are obtained. Licensing terms are finalized and fairness review requested.",
    },
    9: {
      title: "Full Commercialization",
      description:
        "Technology Licensing Agreement is signed. The material is fully commercialized and supplied to target industries.",
    },
  },

  "New Plant Variety": {
    1: {
      title: "Concept & Market Definition",
      description:
        "Breeding objectives and target traits are clearly defined. Germplasm sources are identified, and prior art or varietal landscape review is conducted.",
    },
    2: {
      title: "Germplasm Collection & Breeding Planning",
      description:
        "Parental lines are selected and initial crosses are performed. Early-generation populations are established and preliminarily evaluated.",
    },
    3: {
      title: "Initial Crosses & Screening",
      description:
        "Selection advances toward trait stabilization. Preliminary performance trials are conducted under controlled conditions. Industry relevance is reassessed, and IP/plant variety protection (PVP) preparation is initiated.",
    },
    4: {
      title: "Controlled Growth & Trait Confirmation",
      description:
        "Promising lines undergo replicated trials under controlled or research station conditions. Agronomic performance, yield, and resistance traits are confirmed. PVP application is filed, and potential adopters are identified.",
    },
    5: {
      title: "Line Selection & Preliminary Field Trials",
      description:
        "Advanced lines are tested across multiple locations. Distinctness, Uniformity, and Stability (DUS) testing is conducted. Industry promotion and stakeholder engagement begin, and a commercialization strategy is drafted.",
    },
    6: {
      title: "Multi-location Trials & Industry Engagement",
      description:
        "Consistent performance is validated across seasons and environments. Seed multiplication begins. Regulatory requirements for variety registration are initiated.",
    },
    7: {
      title: "Commercial Protocol & Regulatory Submission",
      description:
        "Variety registration is secured. Seed production protocols are standardized. Licensing negotiations and commercialization planning are underway.",
    },
    8: {
      title: "Industry-Scale Production & Registration",
      description:
        "Certified seed production is established at scale. Licensing agreements are finalized. The variety is ready for wide-scale distribution.",
    },
    9: {
      title: "Full Commercialization",
      description:
        "Licensing agreements are signed. The new plant variety is commercially available and adopted by farmers.",
    },
  },

  "New Plant Variety (Gene-Edited and GM)": {
    1: {
      title: "Concept & Target Definition",
      description:
        "Target trait and gene(s) of interest are identified. Regulatory landscape and biosafety considerations are assessed.",
    },
    2: {
      title: "Germplasm & Molecular Planning",
      description:
        "Gene editing or transformation is conducted. Modified lines are regenerated and screened for successful integration or edits.",
    },
    3: {
      title: "Laboratory Gene Editing & Design",
      description:
        "Molecular characterization confirms gene insertion/editing accuracy and stability. Controlled-environment performance evaluation is conducted. IP protection is initiated.",
    },
    4: {
      title: "Regeneration & Preliminary Phenotyping",
      description:
        "Confined field trials demonstrate trait performance and biosafety compliance. Regulatory documentation is prepared and filed.",
    },
    5: {
      title: "Contained Field Trials & Regulatory Preparation",
      description:
        "Expanded field trials validate performance across environments. Seed multiplication begins under regulatory compliance.",
    },
    6: {
      title: "Multi-location Trials & Industry Feedback",
      description:
        "Comprehensive biosafety, food/feed safety (if applicable), and environmental assessments are completed. Regulatory approval process progresses.",
    },
    7: {
      title: "Commercial Protocol & Regulatory Submission",
      description:
        "Regulatory approval is secured. Licensing negotiations begin. Commercial seed production systems are established.",
    },
    8: {
      title: "Industry-Scale Production & Registration",
      description:
        "Large-scale seed production and distribution systems are operational. Licensing terms are finalized.",
    },
    9: {
      title: "Full Commercialization",
      description:
        "Licensing agreement is signed. The gene-edited/GM variety is commercially released and adopted.",
    },
  },

  "New Animal Breed (Aquatic and Terrestrial)": {
    1: {
      title: "Concept & Market Definition",
      description:
        "Target traits (e.g., growth rate, disease resistance, feed efficiency) are defined. Genetic resources and breeding stock are identified.",
    },
    2: {
      title: "Parent Selection & Breeding Planning",
      description:
        "Parent stock with desirable traits are selected. Controlled breeding is initiated, and baseline performance data are collected.",
    },
    3: {
      title: "Initial Breeding & Screening",
      description:
        "Progeny are evaluated through performance trials. Selection improves trait expression and consistency. IP or breed registration processes are initiated.",
    },
    4: {
      title: "Controlled Growth & Trait Confirmation",
      description:
        "Improved lines demonstrate consistent performance under controlled or research farm conditions. Market relevance is assessed, and regulatory documentation is initiated.",
    },
    5: {
      title: "Line Selection & Preliminary Trials",
      description:
        "Performance is validated across multiple farms or aquatic systems. Breeding and multiplication protocols are standardized. Industry engagement begins.",
    },
    6: {
      title: "Multi-location Trials & Industry Feedback",
      description:
        "Scaled multiplication of improved stock is conducted. Industry testing agreements are secured. Regulatory recognition processes progress.",
    },
    7: {
      title: "Commercial Protocol & Regulatory Submission",
      description:
        "Breed registration or genetic recognition is secured. Licensing negotiations and commercialization planning are underway.",
    },
    8: {
      title: "Industry-Scale Breeding & Regulatory Compliance",
      description:
        "Large-scale propagation and distribution systems are established. Licensing terms are finalized.",
    },
    9: {
      title: "Full Commercialization",
      description:
        "Technology Licensing Agreement is signed. The new breed or genetic resource is commercially available and adopted by producers.",
    },
  },
};

/** Returns the TRACER level info for a given technology type and level, or null if not found. */
export function getTracerInfo(
  technologyType: string,
  trlLevel: number
): TracerLevelInfo | null {
  return TRACER_DESCRIPTIONS[technologyType]?.[trlLevel] ?? null;
}