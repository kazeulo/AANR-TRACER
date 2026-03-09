import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL_LARGE    = "gpt-4o-mini"; 
const MODEL_SMALL    = "gpt-4o-mini";

export async function POST(req: NextRequest) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  const body = await req.json();

  const model     = body.model === "small" ? MODEL_SMALL : MODEL_LARGE;
  const maxTokens = typeof body.max_tokens === "number" ? body.max_tokens : 800;

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type":  "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages:   body.messages,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    return NextResponse.json(
      { error: `OpenAI error ${response.status}: ${errText}` },
      { status: response.status }
    );
  }

  const data = await response.json();
  const completion: string = data.choices?.[0]?.message?.content ?? "";

  return NextResponse.json({ completion });
}