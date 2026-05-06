# Changelog

All notable changes to this project will be documented in this file.

---

## [Unreleased]

---

## v1.3.2 - Revisions from May 05 meeting
MAy 2026

## Changes
- revised disclaimer page
- revised contact panels

## Added
- added definition for some terms

## v1.3.1 - Refactoring, Follow best practices and conventions, clean-up
May 2026

## Changes
- refactored chatbot component
- refactored fontSizeZoom component
- refactored homepage, followed srp
- improve project structure

## Added
- implement context window for chatbot
- add tracer scale on sm and md screen sizes

## v1.3.0 - Refactoring, Follow best practices and conventions, clean-up organization

### Changes
- refactored questionnaire page, followed SRP
- reorganize files for results page

## v1.2.1 - Clean Up, Refactoring, and Minor improvements
April 2026

### Changes
- Removed unused files and imports
- Update docs
- Refactor codes for optimization

## v1.2.0 – Questionnaire & Content Update
March 2026

### Added
- Pre-commercialization Documents question (`precom_docs`) now renders on its own dedicated page
- Questions after `precom_docs` backfill into the before-batch if space is available, preventing single-question orphan pages
- ABH (Agribusiness Hub) regional contact panel — structured table of 14 regions with corresponding universities and email addresses, shown when user selects "No" on pre-commercialization documents
- ATBI (Agri-based Technology Business Incubator) contact panel — shows relevant regulatory body, website link, and full ABH/RAISE regional contacts, shown when user selects "Not Yet Initiated" on certification questions
- Add assistant chatbot

### Fixed
- Home page now clears session data on mount via `sessionStorage.removeItem` — resolves persisting assessment data when navigating home through any route
- Removed `useAssessment` from `HomePage` to fix "must be used inside AssessmentProvider" error
- Fix bug for ip questions (remains at lowest level even if user surpasses more than the level)
- Added levels for the choices in precom docs
- Incorporated the individual levels of choices in precom docs'
- Review extempted
- revised tool tip

### Changed
- Refactore questionnaire page. Separated contacts and ip section into different components

---

## v1.2.0 – Results & Export Enhancement
March 2026

### Added
- Email delivery of PDF report via Nodemailer + Gmail OAuth2 (`/api/send-report`)
- Export modal mode toggle — Download PDF, Send via Email, or Both
- Success confirmation screen in export modal after download or email sent
- Error banner in export modal when export fails
- `not-found.tsx` — custom 404 page matching design system
- `error.tsx` — runtime error boundary page with "Try Again" and "Back to Home" actions, shows error digest in production and full message in development

### Changed
- PDF export migrated from `html2canvas + jsPDF` to `@react-pdf/renderer` for reliable server-independent generation
- PDF now includes: Funding Source field, logo left-aligned beside agency name, only Completed Requirements and Roadmap sections (removed Lacking sections)
- Roadmap header shows "Remaining Requirements for Full Commercialization" when technology is at TRACER Level 9
- `generatePDFAsBase64()` exported for email attachment use
- `onExport` prop updated to return `Promise<void>` so modal can await result

### Fixed
- All roadmap group/step fields now use safe null fallbacks

---

## v1.1.0 – Assessment Flow & AI Improvements
March 2026

### Added
- `sessionStorage` persistence for assessment data — survives page refresh, clears on tab close
- `clearData()` method on `AssessmentContext` for explicit reset
- Category Analysis insight paragraph now lists all fully completed categories by name
- Category Analysis focus logic skips fully completed categories when identifying weakest area
- `generate-tooltips.mjs` script — bulk-generates practical example tooltips for all questions using GPT-4o mini
- `update-contacts.py` script — patches ABH and ATBI `contactLabel` fields across all tech types in `questions.json`
- Progress bar in questionnaire accurately reflects `precom_docs` solo-page grouping

### Changed
- AI recommendation prompt now has three branches: TRL 9 no gaps (sustain/scale), TRL 9 with gaps (Level 9 consolidation only), and standard full roadmap
- Cache key updated to prevent stale roadmap reuse across different technology names
- `FetchRecommendation` feeds `officialDescription` as a factual grounding block in the prompt
- CategoryAnalysis `buildInsight()` uses highest TRACER level (not % score) for strength/focus determination

### Fixed
- Results page recalculates correctly after browser refresh
- `HomePage` "Start Assessment" button converted from `<Link>` to `<button>` with router push

---

## v1.0.0 – Platform Migration Release
February 2026

### Added
- Migrated system from Wix platform to Next.js 14 (App Router) framework
- Full multi-step assessment flow: Disclaimer → Data Privacy → Technology Name → Technology Type → Description → Funding Source → Questionnaire → Summary → Results
- TRL scoring engine (`trlCalculator.ts`) covering 10 AANR technology types, 383 questions across 5 categories
- Five assessment categories: Technology Development Status, Market and Pre-commercialization Preparedness, Intellectual Property Protection Status, Industry Validation and Adoption Status, Regulatory Compliance Status
- Nine TRACER levels with official PCAARRD labels per technology type (`tracerDescriptions.ts`)
- IP section with trade secret support, IP type selection, and status tracking
- Summary page with inline answer editing and confirmation modals (amber for changes, green for submit)
- Results page with hero badge, ScoreCards, CategoryAnalysis radar chart, AI recommendation card, and detailed question breakdown
- AI-generated commercialization roadmap via OpenAI `gpt-4o-mini` (`/api/recommend`)
- In-memory AI result cache keyed by TRL level, technology name, and type
- Accessibility features: font size control (4 scales), high contrast mode, back-to-top button
- Responsive design with DM Serif Display + DM Sans typography

### Technical
- TypeScript throughout
- React Context API for assessment state (`AssessmentContext`)
- Tailwind CSS v3 with CSS variable design tokens
- `questions.json` structured question bank replacing CSV + PapaParse
- Rate limiting on `/api/recommend` route (10 requests/minute per IP)
- Server-side only `OPENAI_API_KEY` environment variable