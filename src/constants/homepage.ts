// Sector SVG Icons for the tech type grid
import { 
  Wheat,        
  Fish, 
  Leaf,
  Cog,
  Dna,
  Cpu,
  Package,
  Trees,
  FlaskConical,
  Sprout,
  ListChecks,
  BarChart2
} from "lucide-react";

// AANR Technology Types 
export const AANR_TYPES = [
  {
    Icon: Package,
    label: "Food, Food Ingredients and Beverages",
    sub: "Processed & Value-added",
    definition: "Processed foods, functional ingredients, and beverages to improve safety, nutrition, quality, and value for human consumption.",
  },
  {
    Icon: Leaf,
    label: "Animal Feed, Feed Ingredients and Animal Nutrition",
    sub: "Livestock, Poultry & Aquaculture",
    definition: "Feeds, feed ingredients, and nutritional products that improve the health, growth, and performance of livestock, poultry, and aquaculture species.",
  },
  {
    Icon: FlaskConical,
    label: "Fertilizer and Pesticide",
    sub: "Inorganic, Organic & Bio-based Products",
    definition: "Nutrient and crop-protection products to improve soil fertility, plant health, and protection against pests, diseases, and weeds.",
  },
  {
    Icon: Cog,
    label: "Agri-Aqua Machinery and Facility",
    sub: "Equipment & Infrastructure",
    definition: "Mechanical equipment and physical facilities that support production, environmental control, processing, and storage in agriculture and aquaculture systems.",
  },
  {
    Icon: Dna,
    label: "Agri-Aqua Device and Diagnostic Kits",
    sub: "Tools & Rapid Testing",
    definition: "Portable tools and rapid testing kits technologies used for measurement, monitoring, manual operations, and disease or contaminant detection in agriculture, livestock, and aquaculture systems.",
  },
  {
    Icon: Cpu,
    label: "ICT (Apps and System involving IoT)",
    sub: "Digital & Automation Solutions",
    definition: "Digital applications, software systems, and IoT solutions that enhance monitoring, decision-making, automation, and data management in agriculture, aquaculture, and natural resource sectors.",
  },
  {
    Icon: Wheat,
    label: "New Plant Variety",
    sub: "Trait & Genetic Improvement",
    definition: "Development, breeding, or genetic improvement of plant varieties with improved traits such as higher yield, stress tolerance, disease resistance, or enhanced nutritional and aesthetic qualities.",
  },
  {
    Icon: Fish,
    label: "New Animal Breed (Aquatic and Terrestrial)",
    sub: "Breeding and Genetic Improvement",
    definition: "Development, breeding, or genetic improvement of terrestrial and aquatic animals with improved traits such as growth rate, disease resistance, environmental adaptability, or enhanced product quality.",
  },
  {
    Icon: Trees,
    label: "Natural Resource–Derived Materials",
    sub: "Industrial & Functional Applications",
    definition: "Converted agricultural, aquatic, forestry, mineral, and other natural resources into functional materials for industrial, construction, packaging, and related applications.",
  },
] as const;

// steps for how it works section
export const STEPS = [
  {
    n: "01",
    Icon: Sprout,
    title: "Select Your Technology Type",
    desc: "Choose from 9 AANR technology categories — from new plant varieties and food products to ICT systems and agricultural machinery.",
  },
  {
    n: "02",
    Icon: ListChecks,
    title: "Answer the Assessment",
    desc: "Go through structured questions across Technology Status, Market Readiness, IP Protection, Industry Adoption, and Regulatory Compliance.",
  },
  {
    n: "03",
    Icon: BarChart2,
    title: "Get Your TRACER Report",
    desc: "Receive your highest completed TRACER level, identified strengths and gaps, and a roadmap toward successful commercialization.",
  },
] as const;

// stats for the stats section
export const STATS = [
  { n: "9", label: "TRACER Levels",    Icon: BarChart2    },
  { n: "9", label: "Technology Types", Icon: FlaskConical },
  { n: "3", label: "AANR Sub-Sectors", Icon: Leaf         },
  { n: "1", label: "Clear Roadmap",    Icon: ListChecks   },
] as const;


// sectors on about section
export const SECTORS = [
  { Icon: Wheat, label: "Agriculture"       },
  { Icon: Fish,  label: "Aquatic"           },
  { Icon: Trees, label: "Natural Resources" },
] as const;

// logo images
export const PARTNER_LOGOS = [
  { src: "/img/logos/dost-logo.png",         alt: "DOST",        w: 80,  h: 28 },
  { src: "/img/logos/dost-pcaarrd-logo.png", alt: "DOST PCAARRD",w: 80,  h: 28 },
  { src: "/img/logos/raise-logo.png",        alt: "RAISE",       w: 110, h: 34 },
  { src: "/img/logos/agri-hub-logo.png",     alt: "Agri Hub",    w: 80,  h: 34 },
  { src: "/img/logos/upvisayas-logo.png",    alt: "UP Visayas",  w: 80,  h: 38 },
  { src: "/img/logos/ttbdo-logo.png",        alt: "TTBDO",       w: 80,  h: 38 },
] as const;