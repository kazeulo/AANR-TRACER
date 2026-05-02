// app/api/assistant/route.ts
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { buildSystemPrompt } from "@/lib/assistant/buildPrompt";
import { retrieveRelevant }  from "@/lib/assistant/knowledge";
import type { Message } from "@/types/assistant";

// constants
const RETRIEVAL_TOP_K    = 4;
const MAX_TOKENS         = 350;
const TEMPERATURE        = 0.4;
const MAX_MESSAGE_LENGTH = 600;
const MODEL              = "gpt-4o-mini" as const;
const MAX_HISTORY        = 5;

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body    = await req.json();
    const message = body.message?.trim();
    const context = body.context ?? {};
    const history = body.history ?? []; 

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: "Message is too long." }, { status: 400 });
    }

    // 👇 now lives inside the handler where history is available
    const conversationHistory = history
      .slice(-MAX_HISTORY)
      .map((m: Message) => ({
        role: m.role,
        content: m.text,
      }));

    const relevant     = retrieveRelevant(message, RETRIEVAL_TOP_K);
    const systemPrompt = buildSystemPrompt(context, relevant);

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationHistory,
        { role: "user",   content: message },
      ],
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
    });

    const reply = completion.choices[0]?.message?.content?.trim()
      ?? "I couldn't generate a response. Please try again.";

    return NextResponse.json({ reply });

  } catch (err) {
    console.error("[Assistant API] error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}