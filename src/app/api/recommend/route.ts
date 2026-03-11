import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL          = "gpt-4o-mini";

// ─── Hard limits ──────────────────────────────────────────────────────────────
const MAX_TOKENS_ALLOWED  = 2500;   // never let a caller request more than this
const MAX_MESSAGES        = 3;      // system + user
const MAX_MESSAGE_LENGTH  = 8000;   // chars per message — ~2000 tokens worst case
const MAX_BODY_BYTES      = 32_000; // ~32KB total request body cap

// ─── Simple in-memory rate limiter (per IP) ───────────────────────────────────
// Allows 10 requests per minute per IP. Resets on server restart.
// For production at scale, replace with Upstash Redis rate limiter.
const ipRequestLog = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now   = Date.now();
  const entry = ipRequestLog.get(ip);

  if (!entry || now > entry.resetAt) {
    // First request or window expired — reset
    ipRequestLog.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }

  if (entry.count >= 10) return true;

  entry.count++;
  return false;
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {

  // 1. API key check
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Service is not configured." },
      { status: 500 }
    );
  }

  // 2. Rate limit by IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? req.headers.get("x-real-ip")
    ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment before trying again." },
      { status: 429 }
    );
  }

  // 3. Body size check — reject oversized payloads before parsing
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "Request payload too large." },
      { status: 413 }
    );
  }

  // 4. Parse body safely
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { messages, max_tokens } = body as Record<string, unknown>;

  // 5. Validate messages array
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: "messages must be a non-empty array." },
      { status: 400 }
    );
  }

  if (messages.length > MAX_MESSAGES) {
    return NextResponse.json(
      { error: `Too many messages. Maximum is ${MAX_MESSAGES}.` },
      { status: 400 }
    );
  }

  for (const msg of messages) {
    if (
      typeof msg !== "object" || msg === null ||
      typeof (msg as Record<string, unknown>).role !== "string" ||
      typeof (msg as Record<string, unknown>).content !== "string"
    ) {
      return NextResponse.json(
        { error: "Each message must have a string role and string content." },
        { status: 400 }
      );
    }

    const role    = (msg as Record<string, unknown>).role as string;
    const content = (msg as Record<string, unknown>).content as string;

    if (!["system", "user", "assistant"].includes(role)) {
      return NextResponse.json(
        { error: `Invalid message role: "${role}".` },
        { status: 400 }
      );
    }

    if (content.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: "Message content exceeds maximum allowed length." },
        { status: 400 }
      );
    }
  }

  // 6. Cap max_tokens — caller cannot exceed the hard limit
  const requestedTokens = typeof max_tokens === "number" ? max_tokens : 1600;
  const cappedTokens    = Math.min(Math.max(requestedTokens, 100), MAX_TOKENS_ALLOWED);

  // 7. Call OpenAI
  let response: Response;
  try {
    response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({
        model:      MODEL,
        max_tokens: cappedTokens,
        messages,
      }),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to reach AI service. Please try again." },
      { status: 502 }
    );
  }

  if (!response.ok) {
    // Don't leak raw OpenAI error details to the client
    const status = response.status;
    const msg =
      status === 429 ? "AI service is busy. Please try again shortly." :
      status === 401 ? "AI service authentication failed." :
                       "AI service returned an error. Please try again.";
    return NextResponse.json({ error: msg }, { status });
  }

  const data       = await response.json();
  const completion = (data.choices?.[0]?.message?.content ?? "") as string;

  return NextResponse.json({ completion });
}