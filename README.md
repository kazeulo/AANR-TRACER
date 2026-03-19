# AANR-TRACER

**AANR Technology Readiness Assessment for Commercialization and Evaluation Report**

> Developed by DOST-PCAARRD, RAISE Western Visayas, and UPV TTBDO

---

![AANR-TRACER Preview](public/img/website-preview.png)

---

## Overview

**AANR-TRACER** is a web-based assessment platform that evaluates the **Technology Readiness Level (TRL)** of innovations in the **Agriculture, Aquatic, and Natural Resources (AANR)** sector.

The platform applies a structured, multi-step questionnaire and generates **evidence-based, AI-powered recommendations** to support the progression of technologies from research and development toward adoption and commercialization.

Technologies are evaluated across five categories:

- Technology Status
- Market and Commercialization Status
- Intellectual Property Protection Status
- Industry Adoption Status
- Regulatory Compliance Status

This supports:

- Standardized TRL evaluation across the AANR sector
- Informed decision-making for researchers and technology managers
- Strategic planning across stages of technology maturation
- Formal PDF reporting for documentation and funding decisions

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| AI Recommendations | OpenAI API (`gpt-4o-mini`) |
| PDF Generation | `@react-pdf/renderer` |
| Email Delivery | Nodemailer + Gmail OAuth2 |
| State Management | React Context API + `sessionStorage` |
| Data | `questions.json` — structured question bank |
---

## Project Structure

```
AANR-TRACER/
├── docs/                          # Project documentation
├── public/
│   ├── questions.csv              # TRL question bank
│   └── img/logos/                 # Brand assets
├── src/
│   ├── app/
│   │   ├── about/
│   │   ├── faq/
│   │   ├── terms/
│   │   ├── api/
│   │   │   └── recommend/         # OpenAI proxy route
│   │   ├── assessment/
│   │   │   ├── disclaimer/
│   │   │   ├── data-privacy/
│   │   │   ├── name/
│   │   │   ├── type/
│   │   │   ├── description/
│   │   │   ├── funding-source/
│   │   │   ├── questionnaire/
│   │   │   ├── summary/
│   │   │   ├── results/           # Results + AI recommendations
│   │   │   ├── AssessmentContext.tsx
│   │   │   └── layout.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── utils/
│       ├── trlCalculator.ts
│       ├── helperConstants.ts
│       ├── ipHelpers.ts
│       ├── levelsDescription.ts
│       ├── faqUtils.ts
│       └── termsUtils.ts
├── CHANGELOG.md
├── README.md
├── package.json
└── next.config.ts
```

---

## Assessment Flow

```
Disclaimer → Data Privacy → Technology Name → Technology Type
→ Description → Funding Source → Questionnaire → Summary → Results
```

---

## Documentation

Full technical documentation is available in [`docs/`](docs/).

---

## Changelog

Version history is available in [`CHANGELOG.md`](CHANGELOG.md).