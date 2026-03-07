# AANR TRACER

**Technology Readiness Assessment for Commercialization Enhancement and Roadmapping**

---

## Overview

**TRACER** is an assessment and recommendation-support tool designed by the DOST-PCAARRD, RAISE Western Visayas, and UPV TTBDO to systematically evaluate the **Technology Readiness Level (TRL)** of innovations in the **Agriculture, Aquatic, and Natural Resources (AANR)** sector.

The platform applies a structured readiness assessment framework and generates **evidence-based, indicative recommendations** to support the progression of technologies from research and development toward adoption and utilization.

Technologies are evaluated using defined criteria covering:

- Technology Status
- Market and Commercialization Status
- Intellectual Property Protection Status
- Industry Adoption Status
- Regulatory Compliance Status

This supports:

- Informed decision-making
- Standardized documentation
- Strategic planning across stages of technology maturation

---

## Tech Stack

- **Next.js** – Frontend and server rendering
- **Express.js** – Backend API
- **Hugging Face** - AI-powered recommendations
  - meta-llama/Llama-3.1-8B-Instruct

---

## Documentation

Detailed documentation is available in: `docs/`

---

## Project Structure
```
AANR-TRACER/
├── docs/
├── public/
├── src/
│   ├── app/
│   │   ├── about/
│   │   ├── assessment/
│   │   │   ├── data-privacy/
│   │   │   ├── description/
│   │   │   ├── disclaimer/
│   │   │   ├── funding-source/
│   │   │   ├── name/
│   │   │   ├── questionnaire/
│   │   │   ├── results/
│   │   │   ├── summary/
│   │   │   ├── type/
│   │   │   ├── AssessmentContext.tsx
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   ├── faq/
│   │   ├── terms/
│   │   └── utils/
│   │       ├── layout.tsx
│   │       └── page.tsx
├── styles/
├── CHANGELOG.md
├── README.md
├── package.json
└── next.config.ts
```
---

## Changelog

Version history is available in: `CHANGELOG.md`