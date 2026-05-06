// ABH Regional Contacts

export const ABH_REGIONS = [
  { region: "CAR",                         university: "BSU",        email: "agribusinesshubraisecar@gmail.com"},
  { region: "Region 1: Ilocos",            university: "MMSU"       },
  { region: "Region 2: Cagayan Valley",    university: "ISU"        },
  { region: "Region 3: Central Luzon",     university: "PCC @ CLSU" },
  { region: "Region 4: Southern Tagalog",  university: "CvSU"       },
  { region: "Region 5: Bicol Region",      university: "BU"         },
  { region: "Region 6: Western Visayas",   university: "UPV",       email: "upvraise.agribusiness@gmail.com" },
  { region: "Region 7: Central Visayas",   university: "VSU"        },
  { region: "Region 8: Eastern Visayas",   university: "BISU"       },
  { region: "Region 9: Western Mindanao",  university: "WMSU"       },
  { region: "Region 10: Northern Mindanao",university: "CMU"        },
  { region: "Region 11: Southern Mindanao",university: "USeP"       },
  { region: "Region 12: SOCCSKSARGEN",     university: "USM"        },
  { region: "Region 13: Caraga",           university: "CSU"        },
];

// ATBI regions
export const ATBI_REGIONS = [
  { region: "CAR",                         university: "BSU"        },
  { region: "Region 1: Ilocos",            university: "MMSU",      },
  { region: "Region 2: Cagayan Valley",    university: "ISU"        },
  { region: "Region 3: Central Luzon",     university: "PCC @ CLSU" },
  { region: "Region 4: Southern Tagalog",  university: "CvSU"       },
  { region: "Region 5: Bicol Region",      university: "BU"         },
  { region: "Region 6: Western Visayas",   university: "UPV",       email: "upvraise.agribusiness@gmail.com" },
  { region: "Region 7: Central Visayas",   university: "VSU"        },
  { region: "Region 8: Eastern Visayas",   university: "BISU"       },
  { region: "Region 9: Western Mindanao",  university: "WMSU"       },
  { region: "Region 10: Northern Mindanao",university: "CMU"        },
  { region: "Region 11: Southern Mindanao",university: "USeP"       },
  { region: "Region 12: SOCCSKSARGEN",     university: "USM"        },
  { region: "Region 13: Caraga",           university: "CSU"        },
];

// IP contacts
export const IPTBM_CONTACTS = [
  { label: "Cordillera Administrative Region(CAR)", email: "car@email.com" },
  { label: "Region 1: Ilocos", email: "dsbucao@mmsu.edu.ph/uitso@mmsu.edu.ph"},
  { label: "Region 2: Cagayan Valley", email: "region2@email.com"},
  { label: "Region 3: Central Luzon", email: "region3@email.com"},
  { label: "Region 4: Southern Tagalog", email: "region4@gmail.com"},
  { label: "Region 5: Bicol Region", email: "region5@email.com"},
  { label: "Region 6: Western Visayas", email: "raise@capsu.edu.ph"},
  { label: "Region 8: Eastern Visayas", email: "region8@email.com"},
  { label: "Region 7: Central Visayas", email: "region7@email.com"},
  { label: "Region 9: Western Mindanao", email: "region9@email.com"},
  { label: "Region 10: Northern Mindanao", email: "region10@email.com"},
  { label: "Region 11: Southern Mindanao", email: "region11@email.com"},
  { label: "Region 12: SOCCSKSARGEN", email: "region12@email.com"},
  { label: "Region 13: Caraga", email: "region13@email.com"}
];

// ATBI Regulatory Contacts 
export const REGULATORY_BODIES: Record<string, { body: string; url: string }> = {
  "Food, Food Ingredients and Beverages": {
    body: "Food and Drug Administration (FDA)",
    url:  "https://www.fda.gov.ph",
  },
  "Animal Feed, Feed Ingredients and Animal Nutrition": {
    body: "Bureau of Animal Industry (BAI) or Food and Drug Administration (FDA)",
    url:  "https://www.bai.gov.ph",
  },
  "Fertilizer and Pesticide (including Organic and Bio-based Products)": {
    body: "Fertilizer and Pesticide Authority (FPA)",
    url:  "https://www.fpa.gov.ph",
  },
  "Agri-Aqua Machinery and Facility": {
    body: "Agricultural Machinery Testing and Evaluation Center (AMTEC)",
    url:  "https://amtec.uplb.edu.ph",
  },
  "Agri-Aqua Device and Diagnostic Kits": {
    body: "Bureau of Animal Industry (BAI) / Bureau of Fisheries and Aquatic Resources (BFAR) / Third-party Validation",
    url:  "https://www.bai.gov.ph",
  },
  "ICT (Apps and System involving IoT)": {
    body: "Department of Information and Communications Technology (DICT) / National Privacy Commission (NPC)",
    url:  "https://privacy.gov.ph",
  },
  "Natural Resource\u2013Derived Materials": {
    body: "Relevant Standards Body (e.g. DTI-BPS, DENR)",
    url:  "https://www.bps.dti.gov.ph",
  },
  "New Plant Variety (Conventional)": {
    body: "National Seed Industry Council (NSIC) / DA-Bureau of Plant Industry (DA-BPI)",
    url:  "https://www.bpi.da.gov.ph",
  },
  "New Plant Variety (Gene-Edited and GM)": {
    body: "National Seed Industry Council (NSIC) / DA-Bureau of Plant Industry (DA-BPI)",
    url:  "https://www.bpi.da.gov.ph",
  },
  "New Animal Breed or Genetic Resources (Aquatic and Terrestrial)": {
    body: "BAI (Livestock/Poultry) / NDA (Dairy Cattle) / PCC (Carabao) / BFAR (Aquatic Species)",
    url:  "https://www.bai.gov.ph",
  },
};