# TRACER Assistant — Chatbot Implementation Documentation

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [File Structure](#file-structure)
4. [Types](#types)
5. [Constants](#constants)
6. [Service Layer](#service-layer)
7. [Custom Hook](#custom-hook)
8. [API Route](#api-route)
9. [Components](#components)
10. [Data Flow](#data-flow)
11. [Environment Variables](#environment-variables)
12. [Conversation History](#conversation-history)
13. [Knowledge Retrieval](#knowledge-retrieval)

---

## Overview

The TRACER Assistant is a floating AI-powered chat widget embedded in the AANR-TRACER platform. It provides contextual guidance to researchers and technology developers as they navigate the technology assessment process.

It uses:
- **OpenAI `gpt-4o-mini`** as the language model
- **Keyword-based RAG (Retrieval-Augmented Generation)** using a local `knowledge.json` file
- **Conversation history** to maintain context across messages within a session
- **Assessment context injection** to tailor responses to the user's current position in the form

---

## Architecture

```
User types message
      │
      ▼
AssistantWidget (UI shell)
      │
      ▼
useAssistant (hook — manages state)
      │
      ▼
fetchAssistantReply (service — sends request)
      │
      ▼
POST /api/assistant (route handler)
      │
      ├── retrieveRelevant()     → keyword search on knowledge.json
      ├── buildSystemPrompt()    → constructs system prompt with context
      └── openai.chat.completions.create()
            │
            ▼
         AI reply returned to UI
```

---

## File Structure

```
src/
├── app/
│   └── api/
│       └── assistant/
│           └── route.ts                  # API route handler
│
├── components/
│   └── assistant/
│       ├── AssistantWidget.tsx           # Root shell — composes all sub-components
│       ├── AssistantHeader.tsx           # Dark green header bar
│       ├── AssistantContextPill.tsx      # "Currently: X" context strip
│       ├── AssistantMessages.tsx         # Scrollable message list
│       ├── AssistantInput.tsx            # Text input + send button
│       ├── BotAvatar.tsx                 # Reusable bot icon
│       ├── TypingIndicator.tsx           # Bouncing dots loading state
│       ├── WelcomeState.tsx              # Empty state + suggested questions
│       └── SuggestedQuestions.tsx        # Suggested question constants
│
├── hooks/
│   └── useAssistant.ts                   # All chat state and side effects
│
├── lib/
│   ├── assistantService.ts               # fetch() call to the API
│   └── assistant/
│       ├── buildPrompt.ts                # System prompt construction
│       └── knowledge.ts                  # Keyword retrieval logic
│
├── types/
│   └── assistant.ts                      # Shared TypeScript interfaces
│
└── data/
    └── knowledge.json                    # Local knowledge base (RAG source)
```

---

## Types

**File:** `types/assistant.ts`

```typescript
/** A single message in the conversation */
export interface Message {
  role: "user" | "assistant";
  text: string;
}

/**
 * Context passed from the parent assessment page.
 * Used to tailor the AI response to the user's current position in the form.
 */
export interface AssistantContext {
  /** The type of technology being assessed (e.g. "Biotech", "Software") */
  technologyType?: string;

  /** The current section/category of the assessment form */
  currentCategory?: string;

  /** The current Technology Readiness Level score (1–9) */
  currentTRLLevel?: number;

  /** The exact text of the question the user is currently answering */
  questionText?: string;
}

/** Props accepted by the root AssistantWidget component */
export interface AssistantProps {
  context?: AssistantContext;
}
```

---

## Constants

**File:** `components/assistant/SuggestedQuestions.ts`

Predefined questions shown to the user on the welcome screen before any messages are sent.

```typescript
export const SUGGESTED_QUESTIONS = [
  "What is AANR-TRACER?",
  "What does pilot-scale mean?",
  "What is an FTO report?",
  "What is a Business Model Canvas?",
] as const;
```

**File:** `app/api/assistant/route.ts` (module-level constants)

```typescript
const RETRIEVAL_TOP_K    = 4;    // max knowledge entries retrieved per query
const MAX_TOKENS         = 350;  // max tokens in AI response
const TEMPERATURE        = 0.4;  // lower = more factual, less creative
const MAX_MESSAGE_LENGTH = 600;  // max characters allowed per user message
const MODEL              = "gpt-4o-mini" as const;
const MAX_HISTORY        = 5;    // max past messages sent with each request
```

---

## Service Layer

**File:** `lib/assistantService.ts`

Responsible for sending the user message, context, and conversation history to the API and returning the AI reply. This is the only file that communicates with the backend.

```typescript
import type { AssistantContext, Message } from "@/types/assistant";

/**
 * Sends a message to the assistant API and returns the AI reply.
 *
 * @param message - The user's current message
 * @param context - The assessment context from the parent page
 * @param history - The full conversation history for this session
 * @returns The assistant's reply as a plain string
 * @throws Error if the network request fails or returns a non-OK status
 */
export async function fetchAssistantReply(
  message: string,
  context: AssistantContext,
  history: Message[]
): Promise<string> {
  const res = await fetch("/api/assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, context, history }),
  });

  if (!res.ok) throw new Error(`Request failed: ${res.status}`);

  const data = await res.json();
  return data.reply ?? "Sorry, I couldn't generate a response.";
}
```

---

## Custom Hook

**File:** `hooks/useAssistant.ts`

Manages all state and side effects for the chat widget. Keeps the UI components free of logic.

### State

| State | Type | Description |
|---|---|---|
| `open` | `boolean` | Whether the chat panel is visible |
| `messages` | `Message[]` | Full conversation history for the session |
| `input` | `string` | Current value of the text input |
| `loading` | `boolean` | Whether a reply is being fetched |

### Refs

| Ref | Type | Purpose |
|---|---|---|
| `widgetRef` | `HTMLDivElement` | Detects outside clicks to close the panel |
| `inputRef` | `HTMLInputElement` | Programmatically focuses the input on open |
| `bottomRef` | `HTMLDivElement` | Auto-scrolls to the latest message |

### Side Effects

```
1. Outside click listener  → closes panel when user clicks outside widgetRef
2. Focus on open           → focuses inputRef 100ms after panel opens
3. Scroll to bottom        → scrolls bottomRef into view on new messages or loading state
```

### `send()` function

```
1. Trims input, guards against empty or loading state
2. Appends user message to messages[]
3. Calls fetchAssistantReply(text, context, messages)
4. Appends assistant reply to messages[]
5. On error: appends a fallback error message
6. Always: sets loading to false in finally block
```

---

## API Route

**File:** `app/api/assistant/route.ts`

The Next.js route handler that processes each chat request.

### Request body

```typescript
{
  message: string;           // the user's current message
  context: AssistantContext; // assessment context from the frontend
  history: Message[];        // past messages in this session
}
```

### Response body

```typescript
// success
{ reply: string }

// error
{ error: string }
```

### Request lifecycle

```
1. Parse body — extract message, context, history
2. Validate message — must be a non-empty string under MAX_MESSAGE_LENGTH
3. Slice history — keep only the last MAX_HISTORY messages
4. retrieveRelevant(message) — find matching knowledge entries
5. buildSystemPrompt(context, relevant) — construct the full system prompt
6. openai.chat.completions.create() — send to OpenAI
7. Return { reply } or { error }
```

### Validation rules

| Field | Rule | Status code |
|---|---|---|
| `message` | Required, must be a string | 400 |
| `message` | Max 600 characters | 400 |
| Server error | Any uncaught exception | 500 |

---

## Components

### `AssistantWidget.tsx`
The root shell. Composes all sub-components and consumes the `useAssistant` hook. Contains the floating button and the panel wrapper. Does not contain any business logic.

### `AssistantHeader.tsx`
Displays the assistant name, technology type subtitle, and online indicator. Accepts `context?: AssistantContext`.

### `AssistantContextPill.tsx`
A slim strip below the header showing the user's current assessment category. Shows "General TRACER guidance" when no category is active. Accepts `context?: AssistantContext`.

### `AssistantMessages.tsx`
The scrollable message area. Renders the welcome state when empty, the message list when messages exist, and the typing indicator when loading.

**Props:**

| Prop | Type | Description |
|---|---|---|
| `messages` | `Message[]` | Full conversation history |
| `loading` | `boolean` | Shows typing indicator when true |
| `input` | `string` | Current input value |
| `setInput` | `Dispatch<SetStateAction<string>>` | Updates input state |
| `inputRef` | `RefObject<HTMLInputElement \| null>` | Passed to WelcomeState for focus |
| `bottomRef` | `RefObject<HTMLDivElement \| null>` | Scroll anchor |

### `AssistantInput.tsx`
The text input and send button at the bottom of the panel. Handles Enter key submission. Send button is disabled when input is empty or loading.

**Props:**

| Prop | Type | Description |
|---|---|---|
| `input` | `string` | Current input value |
| `loading` | `boolean` | Disables input while fetching |
| `inputRef` | `RefObject<HTMLInputElement \| null>` | Ref for programmatic focus |
| `setInput` | `Dispatch<SetStateAction<string>>` | Updates input state |
| `send` | `() => void` | Triggers the send action |

### `BotAvatar.tsx`
A small circular avatar with a bot icon. Used in `AssistantMessages`, `WelcomeState`, and `TypingIndicator`. Extracted to avoid repeating the same markup in three places.

### `TypingIndicator.tsx`
Three animated bouncing dots shown while the AI reply is loading. Uses a CSS `@keyframes bounce` animation.

### `WelcomeState.tsx`
Shown when `messages.length === 0`. Displays a welcome message and the list of suggested questions. Clicking a suggested question populates the input and focuses it.

---

## Data Flow

```
AssistantWidget
│
├── reads:  useAssistant(context)
│           → { open, setOpen, messages, input, setInput, loading, send, refs }
│
├── passes to AssistantHeader:
│           context
│
├── passes to AssistantContextPill:
│           context
│
├── passes to AssistantMessages:
│           messages, loading, input, setInput, inputRef, bottomRef
│           └── passes to WelcomeState:
│                   onSelectQuestion → calls setInput + inputRef.focus()
│
└── passes to AssistantInput:
            input, loading, inputRef, setInput, send
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | Yes | Your OpenAI API key. The server throws at startup if this is missing. |

Add to your `.env.local`:

```bash
OPENAI_API_KEY=sk-...
```

The server guard:

```typescript
if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}
```

---

## Conversation History

Each session maintains an in-memory message history inside `useAssistant`. On every `send()`, the full `messages` array is passed to `fetchAssistantReply` and forwarded to the API.

The API slices the history to the last `MAX_HISTORY` (5) messages before sending to OpenAI to control token usage.

```
Session messages:  [m1, m2, m3, m4, m5, m6, m7, m8]
Sent to OpenAI:                        [m4, m5, m6, m7, m8]  ← last 5 only
```

History is not persisted. Refreshing the page starts a new session.

### Token budget per request (approximate)

| Part | Tokens |
|---|---|
| System prompt | ~300 |
| Knowledge context (up to 4 entries) | ~200 |
| Conversation history (last 5 messages) | ~250 |
| Current user message | ~50 |
| **Total input** | **~800** |
| Max output (`max_tokens: 350`) | 350 |
| **Total per request** | **~1,150** |

---

## Knowledge Retrieval

**File:** `lib/assistant/knowledge.ts`

Uses a simple keyword-matching algorithm against `data/knowledge.json`. No embeddings or vector database are used.

### Algorithm

```
1. Lowercase the user query
2. For each knowledge entry, count how many of its keywords appear in the query
3. Filter out entries with score = 0
4. Sort by score descending
5. Return top RETRIEVAL_TOP_K entries (default: 4)
```

### knowledge.json structure

```json
{
  "entries": [
    {
      "id": "unique-id",
      "topic": "FTO Report",
      "question": "What is an FTO report?",
      "keywords": ["fto", "freedom to operate", "patent"],
      "answer": "An FTO (Freedom to Operate) report..."
    }
  ]
}
```

### Limitations

Keyword matching is fast and zero-cost but has no semantic understanding. "What is freedom to operate?" will match, but "Can I use this technology commercially?" may not — even though both questions are about FTO. Consider upgrading to embedding-based retrieval if the knowledge base grows significantly.