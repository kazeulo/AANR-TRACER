# TRACER Assistant — Technical Documentation

> AANR-TRACER · DOST-PCAARRD · Confidential

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture](#2-architecture)
3. [Component Breakdown](#3-component-breakdown)
4. [Conversation Flow](#4-conversation-flow)
5. [Context System](#5-context-system)
6. [Knowledge Base (RAG)](#6-knowledge-base-rag)
7. [API Route](#7-api-route)
8. [Safeguards](#8-safeguards)
9. [Cost and Performance](#9-cost-and-performance)
10. [Environment Variables](#10-environment-variables)
11. [File Structure](#11-file-structure)
12. [Turnover Notes for DOST](#12-turnover-notes-for-dost)

---

## 1. Overview

The TRACER Assistant is a floating AI-powered chat widget embedded throughout the AANR-TRACER platform. Its primary purpose is to help researchers and technology developers understand jargon, requirements, and concepts they encounter while going through the TRACER assessment — without leaving the page.

**What it does:**
- Explains technical terms (e.g., proximate analysis, DUS testing, GMP, FTO report)
- Answers questions about TRACER levels and assessment criteria
- Provides information about Philippine regulatory bodies (FDA, BAI, BFAR, FPA, BAFS, NSIC, AMTEC, DICT, NPC)
- Explains pre-commercialization documents (BMC, IP valuation, commercialization plan)
- Provides regional contact information for the RAISE Program

**What it does not do:**
- Give legal or regulatory advice
- Access real-time data or external websites
- Remember conversations across sessions
- Modify assessment answers or results

---

## 2. Architecture

```
User (Browser)
     │
     ▼
AssistantWidget.tsx          ← Floating chat UI (React component)
     │
     │  POST /api/assistant
     │  { message, context }
     ▼
app/api/assistant/route.ts   ← Next.js API route (server-side)
     │
     ├── retrieveRelevant()  ← Keyword matching against knowledge.json
     │        │
     │        ▼
     │   utils/knowledge.json  ← Static RAG knowledge base (84 entries)
     │
     ├── Builds system prompt with context + retrieved entries
     │
     │  POST https://api.openai.com/v1/chat/completions
     ▼
OpenAI GPT-4o-mini           ← LLM inference
     │
     ▼
{ reply: string }            ← Response returned to widget
```

**No external database. No vector store. All knowledge is bundled in the project.**

---

## 3. Component Breakdown

### 3.1 `AssistantWidget.tsx`

Located at: `components/AssistantWidget.tsx`

**Responsibilities:**
- Renders the floating chat button (bottom-right of every page)
- Manages chat panel open/close state
- Displays message history for the current session
- Sends user messages to `/api/assistant`
- Shows typing indicator while waiting for response
- Closes on outside click
- Displays suggested starter questions on first open

**Props:**

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `context` | `AssistantContext` | No | Current assessment context passed from the parent page |

**AssistantContext shape:**

| Field | Type | Description |
|-------|------|-------------|
| `technologyType` | `string` | e.g., "Food, Food Ingredients and Beverages" |
| `currentCategory` | `string` | e.g., "Technology Development Status" |
| `currentTRLLevel` | `number` | Current TRACER level (1–9) |
| `questionText` | `string` | Text of the current question being answered |

**State:**

| State | Type | Description |
|-------|------|-------------|
| `open` | `boolean` | Whether the chat panel is visible |
| `messages` | `Message[]` | Array of user and assistant messages for this session |
| `input` | `string` | Current text in the input field |
| `loading` | `boolean` | Whether a request is in-flight |

**Notes:**
- Messages are stored in component state only — they are lost on page navigation or refresh (by design, for privacy)
- The widget is mounted globally via `AssistantWidgetWithContext` in the root layout
- On the questionnaire page, richer context (category, question text) is passed in

---

### 3.2 `AssistantWidgetWithContext.tsx`

Located at: `components/AssistantWidgetWithContext.tsx`

A thin wrapper that reads from `AssessmentContext` and passes the current technology type to `AssistantWidget`. Used in the root layout so the assistant always knows which technology type the user is assessing, even outside the questionnaire.

```tsx
"use client";
import { useAssessment } from "../assessment/AssessmentContext";
import AssistantWidget from "./AssistantWidget";

export default function AssistantWidgetWithContext() {
  const { data } = useAssessment();
  return (
    <AssistantWidget
      context={{
        technologyType: data?.technologyType ?? "",
        currentCategory: "",
        currentTRLLevel: 0,
      }}
    />
  );
}
```

---

### 3.3 `app/api/assistant/route.ts`

The server-side API route that handles all assistant requests.

**Request body:**

```json
{
  "message": "What is proximate analysis?",
  "context": {
    "technologyType": "Food, Food Ingredients and Beverages",
    "currentCategory": "Technology Development Status",
    "currentTRLLevel": 3,
    "questionText": "Proximate Analysis Initiated to Assess Chemical Properties"
  }
}
```

**Response body:**

```json
{
  "reply": "Proximate analysis is a set of laboratory tests..."
}
```

**Error response:**

```json
{
  "error": "Something went wrong. Please try again."
}
```

---

### 3.4 `utils/knowledge.json`

The static knowledge base used for retrieval-augmented generation. Contains 84 entries across 7 topics.

**Topics covered:**

| Topic | Entry Count | Contents |
|-------|-------------|----------|
| `glossary` | 24 | Technical jargon: proximate analysis, pilot-scale, GMP, HACCP, DUS testing, FTO, BMC, etc. |
| `intellectual_property` | 7 | Patent, trademark, copyright, utility model, industrial design, trade secret, IPOPHL |
| `regulatory` | 11 | FDA, BAI, BFAR, FPA, BAFS, NSIC, DA-BPI, DICT, NPC, ATBI, PCC, NDA |
| `program` | 2 | RAISE Program, DOST-PCAARRD |
| `contacts` | 14 | Regional ABH contacts per region (CAR, R1–R13) |
| `tracer_levels` | 11 | TRACER Level 1–9 descriptions + overview + categories + tech types |
| `documents` | 3 | Market viability assessment, technology profile, commercialization documents |
| `commercialization` | 3 | Spin-off vs licensing, privately funded, royalties |

**Entry schema:**

```json
{
  "id": "glossary_proximate_analysis",
  "topic": "glossary",
  "question": "What is proximate analysis?",
  "keywords": ["proximate", "analysis", "proximate analysis", "chemical properties"],
  "answer": "Proximate analysis is a set of laboratory tests..."
}
```

---

## 4. Conversation Flow

```
User opens widget
       │
       ▼
Welcome message shown
Suggested questions displayed:
  • What is AANR-TRACER?
  • What does pilot-scale mean?
  • What is an FTO report?
  • What is a Business Model Canvas?
       │
       ▼
User types message or clicks suggestion
       │
       ▼
Input trimmed and validated (empty = blocked)
Message added to local state (user bubble)
Loading indicator shown (animated dots)
       │
       ▼
POST /api/assistant
  body: { message, context }
       │
       ├── [Server] Validate message field present
       │
       ├── [Server] retrieveRelevant(message, topK=4)
       │      │
       │      ├── Lowercase the query
       │      ├── Score each knowledge entry by keyword overlap
       │      ├── Filter entries with score > 0
       │      └── Return top 4 by score
       │
       ├── [Server] Build system prompt
       │      │
       │      ├── Role definition
       │      ├── Context line (tech type, category, TRL level, question)
       │      ├── Behavioral rules
       │      └── Retrieved knowledge entries (if any)
       │
       ├── [Server] Call OpenAI GPT-4o-mini
       │      model: gpt-4o-mini
       │      max_tokens: 350
       │      temperature: 0.4
       │
       └── [Server] Return { reply }
       │
       ▼
Assistant bubble added to local state
Loading indicator hidden
Auto-scroll to bottom
```

---

## 5. Context System

The assistant receives context from the current page to make responses more relevant. Context changes as the user navigates through the assessment.

### 5.1 Context levels

| Page | Context Available | Richness |
|------|-------------------|----------|
| Home, About, FAQ | None (empty object) | Low — general TRACER guidance |
| Assessment start pages (name, type selection) | `technologyType` only | Medium — tech-specific guidance |
| Questionnaire pages | `technologyType`, `currentCategory`, `currentTRLLevel`, `questionText` | High — fully contextual |
| Results page | `technologyType` | Medium — result interpretation guidance |

### 5.2 How context is injected into the prompt

```
// With full context:
"The user is currently assessing a 'Food, Food Ingredients and Beverages'
technology under the 'Technology Development Status' category at TRACER
Level 3. They are currently answering: 'Proximate Analysis Initiated to
Assess Chemical Properties'"

// Without context (general browsing):
"The user is browsing the AANR-TRACER platform and may have general
questions about the tool, TRACER levels, or technology commercialization."
```

### 5.3 Context is never stored

Context is passed per-request only. It is not logged, stored in a database, or retained between sessions.

---

## 6. Knowledge Base (RAG)

### 6.1 Retrieval mechanism

The assistant uses keyword-based retrieval — no vector embeddings, no external database.

```typescript
function retrieveRelevant(query: string, topK = 4): KnowledgeEntry[] {
  const q = query.toLowerCase();
  return (knowledge.entries as KnowledgeEntry[])
    .map(entry => ({
      ...entry,
      score: entry.keywords.filter(k => q.includes(k.toLowerCase())).length,
    }))
    .filter(entry => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
```

**How scoring works:**
- Each knowledge entry has a `keywords` array (2–8 keywords)
- The user's query is checked for each keyword using `includes()`
- Score = number of matching keywords
- Top 4 entries by score are injected into the system prompt
- If no entries match (score = 0 for all), no knowledge context is injected — the LLM answers from its training data and the system prompt rules only

### 6.2 Updating the knowledge base

The knowledge base is a static JSON file at `utils/knowledge.json`. To add or update entries:

1. Open `utils/knowledge.json`
2. Add a new entry following the schema (see Section 3.4)
3. Ensure the `id` is unique
4. Add relevant `keywords` — include common misspellings, abbreviations, and alternate phrasings
5. Keep `answer` to 2–4 sentences — the LLM will expand and adapt it
6. Redeploy the application (no database migration needed)

### 6.3 Adding a new topic area

If the knowledge base needs to cover a new area (e.g., new regulatory body, new document type):

1. Add entries to `knowledge.json` with a new `topic` value
2. No code changes required — the retrieval function works on all entries regardless of topic
3. Consider adding a new suggested question in `AssistantWidget.tsx` if the topic is commonly asked about

---

## 7. API Route

### 7.1 Route location

```
app/api/assistant/route.ts
```

### 7.2 Full system prompt structure

```
You are TRACER Assistant, a concise and helpful guide for researchers
and technology developers using the AANR-TRACER platform in the Philippines.

[CONTEXT LINE — dynamic, based on current page]

Your role:
- Explain technical jargon, acronyms, and requirements in plain language
- Answer general questions about TRACER levels, technology types, and the
  assessment process
- Keep answers short and practical — 2 to 4 sentences unless more detail
  is genuinely needed
- Reference Philippine regulatory bodies (FDA, BAI, BFAR, FPA, BAFS,
  NSIC, AMTEC, DICT, NPC) when relevant
- Explain documents like FTO reports, IP valuation, BMC, GMP manuals,
  DUS testing when asked
- Do not give legal or regulatory advice — refer users to DOST-PCAARRD
  ATBI for specific guidance
- If the question is unrelated to AANR technologies or TRACER, politely
  redirect the user

If you don't know something, say so clearly rather than guessing.

[RETRIEVED KNOWLEDGE — injected if relevant entries found]
Relevant reference material:
Q: What is proximate analysis?
A: Proximate analysis is a set of laboratory tests...

Q: What does pilot-scale mean?
A: Pilot-scale production is the intermediate stage...
```

### 7.3 Model parameters

| Parameter | Value | Reason |
|-----------|-------|--------|
| `model` | `gpt-4o-mini` | Cost-efficient, fast, sufficient for Q&A |
| `max_tokens` | `350` | Keeps responses concise, controls cost |
| `temperature` | `0.4` | Low randomness for factual, consistent answers |

### 7.4 Error handling

| Error scenario | Response |
|----------------|----------|
| Missing `message` field | 400 Bad Request: `{ error: "Message is required." }` |
| OpenAI API failure | 500 Internal Server Error: `{ error: "Something went wrong. Please try again." }` |
| Empty OpenAI response | Returns: `"I couldn't generate a response. Please try again."` |
| Network timeout (client) | Widget catches the error and shows: `"Something went wrong. Please try again."` |

---

## 8. Safeguards

### 8.1 Input safeguards

| Safeguard | Implementation | Location |
|-----------|----------------|----------|
| Empty input blocked | `if (!text \|\| loading) return` | `AssistantWidget.tsx` → `send()` |
| Duplicate send blocked | `loading` state prevents re-submission | `AssistantWidget.tsx` |
| Input field disabled while loading | `disabled={!input.trim() \|\| loading}` | Send button |
| Enter key handling | Only fires on `Enter` without `Shift` — `Shift+Enter` reserved for future multiline | `AssistantWidget.tsx` |

### 8.2 Output safeguards (system prompt rules)

| Rule | Prompt instruction |
|------|--------------------|
| No legal advice | "Do not give legal or regulatory advice — refer users to DOST-PCAARRD ATBI" |
| No hallucination | "If you don't know something, say so clearly rather than guessing" |
| Stay on topic | "If the question is unrelated to AANR technologies or TRACER, politely redirect the user" |
| Concise responses | "Keep answers short and practical — 2 to 4 sentences unless more detail is genuinely needed" |
| Factual grounding | Retrieved knowledge entries injected into prompt to anchor responses |

### 8.3 Privacy safeguards

| Concern | Mitigation |
|---------|------------|
| Assessment data in context | Only non-sensitive fields passed: technology type, category name, TRL level, question text — no personal data, no answers |
| Message history | Stored in React component state only — cleared on page navigation or refresh, never sent to any server other than OpenAI |
| No logging | The API route does not log messages or context to any database or file |
| OpenAI data policy | Messages are sent to OpenAI's API. Under the default API usage policy, OpenAI does not use API inputs/outputs to train models. Verify current policy at platform.openai.com/docs/guides/privacy |

### 8.4 UI safeguards

| Safeguard | Implementation |
|-----------|----------------|
| Disclaimer shown | "AI-generated guidance only. It's best to consult and verify with your technology transfer specialist." — displayed persistently below messages |
| Outside click closes panel | `mousedown` event listener on document, checks if click is outside `widgetRef` |
| Mobile panel width | `w-[calc(100vw-3rem)] max-w-[340px]` — prevents panel from overflowing viewport on small screens |
| Z-index management | Widget at `z-50`, panel at `z-20` within the wrapper — sits above all page content |

### 8.5 API safeguards

| Safeguard | Implementation |
|-----------|----------------|
| Server-side API key | `OPENAI_API_KEY` is an environment variable — never exposed to the client |
| Input validation | `message` field checked for presence and string type before API call |
| Try/catch on OpenAI call | All OpenAI errors caught and returned as 500 with generic message |
| `max_tokens: 350` | Hard cap on response length prevents runaway token usage |
| Temperature `0.4` | Reduces creative/hallucinated responses |

### 8.6 Rate limiting (recommended for production)

The current implementation has no rate limiting. For production deployment, it is recommended to add:

```typescript
// Example using Upstash Rate Limit or a simple in-memory approach
// Limit: 20 requests per IP per hour
import { Ratelimit } from "@upstash/ratelimit";
```

Alternatively, Next.js middleware can be used to rate-limit the `/api/assistant` route before it reaches the handler.

---

## 9. Cost and Performance

### 9.1 Token breakdown per request

| Component | Approximate tokens |
|-----------|--------------------|
| System prompt (base) | ~200 tokens |
| Context line | ~50 tokens |
| Retrieved knowledge (4 entries) | ~300–400 tokens |
| User message | ~20–50 tokens |
| **Total input** | **~570–700 tokens** |
| Assistant response | ~150–300 tokens |
| **Total per request** | **~720–1000 tokens** |

### 9.2 Cost estimate (GPT-4o-mini pricing)

| Volume | Input tokens | Output tokens | Estimated cost |
|--------|-------------|---------------|----------------|
| 100 requests/week | ~70,000 | ~25,000 | ~$0.03/week |
| 500 requests/week | ~350,000 | ~125,000 | ~$0.13/week |
| 2,000 requests/week | ~1,400,000 | ~500,000 | ~$0.51/week |

*Based on GPT-4o-mini pricing: $0.15/1M input tokens, $0.60/1M output tokens as of 2025.*

### 9.3 Performance characteristics

| Metric | Typical value |
|--------|---------------|
| Retrieval time (keyword matching) | < 5ms (in-memory, no network) |
| OpenAI API latency | 800ms – 2,500ms |
| Total response time | ~1–3 seconds |
| Knowledge base size | ~49KB (knowledge.json) |
| Memory footprint | Negligible (loaded once at startup) |

---

## 10. Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | OpenAI API key. Obtainable from platform.openai.com. Must have access to `gpt-4o-mini`. |

**Setup:**

Create a `.env.local` file in the project root:

```
OPENAI_API_KEY=sk-proj-...
```

**Never commit `.env.local` to version control.** The `.gitignore` should already exclude it. Verify with:

```bash
grep ".env.local" .gitignore
```

---

## 11. File Structure

```
project/
├── app/
│   ├── api/
│   │   └── assistant/
│   │       └── route.ts              ← API handler
│   └── layout.tsx                    ← Widget mounted here (global)
│
├── components/
│   ├── AssistantWidget.tsx           ← Chat UI component
│   └── AssistantWidgetWithContext.tsx ← Context wrapper for layout
│
└── utils/
    └── knowledge.json                ← Static knowledge base (84 entries)
```

---

## 12. Turnover Notes for DOST

### What needs to be maintained

| Item | Frequency | Responsible party |
|------|-----------|-------------------|
| `OPENAI_API_KEY` rotation | Every 90 days (recommended) or if compromised | DOST IT team |
| `knowledge.json` updates | When new regulatory requirements, programs, or terminology are introduced | DOST-PCAARRD technical team or contracted developer |
| OpenAI billing monitoring | Monthly | DOST IT team |
| Model version updates | When OpenAI deprecates `gpt-4o-mini` | Contracted developer |

### How to update the knowledge base

1. Open `utils/knowledge.json`
2. Add a new entry at the end of the `entries` array following this structure:

```json
{
  "id": "unique_snake_case_id",
  "topic": "glossary",
  "question": "What is [term]?",
  "keywords": ["term", "alternate spelling", "abbreviation"],
  "answer": "2-4 sentence explanation of the term in plain language."
}
```

3. Save the file and redeploy the application
4. No database migration, no environment variable changes needed

### How to change the AI model

If OpenAI deprecates `gpt-4o-mini`, update a single line in `app/api/assistant/route.ts`:

```typescript
// Find this line:
model: "gpt-4o-mini",

// Replace with the new model name, e.g.:
model: "gpt-4o-mini-2025",
```

### How to disable the assistant

If the chatbot needs to be temporarily disabled, comment out the widget in `app/layout.tsx`:

```tsx
// Comment out or remove this line:
{/* <AssistantWidgetWithContext /> */}
```

Redeploy. No other changes needed.

### How to monitor usage

Log in to platform.openai.com with the account that owns the API key. Navigate to **Usage** to view token consumption, request counts, and cost by day. Set up usage alerts under **Billing → Usage limits** to receive email notifications when spending thresholds are reached.

---

*Document version 1.0 — AANR-TRACER Project*  