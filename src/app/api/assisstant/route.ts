import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import knowledge from "../../utils/knowledge.json";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface KnowledgeEntry {
  id: string;
  topic: string;
  question: string;
  keywords: string[];
  answer: string;
}

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

export async function POST(req: NextRequest) {
  try {
    const { message, context } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const relevant = retrieveRelevant(message);
    const knowledgeContext = relevant.length > 0
      ? `\n\nRelevant reference material:\n${relevant.map(e => `Q: ${e.question}\nA: ${e.answer}`).join("\n\n")}`
      : "";

    const hasContext = context?.technologyType && context?.currentCategory;

    const contextLine = hasContext
      ? `The user is currently assessing a "${context.technologyType}" technology under the "${context.currentCategory}" category at TRACER Level ${context.currentTRLLevel ?? 0}.${context.questionText ? ` They are currently answering: "${context.questionText}"` : ""}`
      : "The user is browsing the AANR-TRACER platform and may have general questions about the tool, TRACER levels, or technology commercialization.";

    const systemPrompt = `You are TRACER Assistant, a concise and helpful guide for researchers and technology developers using the AANR-TRACER platform in the Philippines.

${contextLine}

Your role:
- Explain technical jargon, acronyms, and requirements in plain language
- Answer general questions about TRACER levels, technology types, and the assessment process
- Keep answers short and practical — 2 to 4 sentences unless more detail is genuinely needed
- Reference Philippine regulatory bodies (FDA, BAI, BFAR, FPA, BAFS, NSIC, AMTEC, DICT, NPC) when relevant
- Explain documents like FTO reports, IP valuation, BMC, GMP manuals, DUS testing when asked
- Do not use markdown formatting in your responses. No bold (**), italics (*), headers (#), or bullet symbols. Write in plain prose only.
- Do not give legal or regulatory advice — refer users to DOST-PCAARRD ATBI for specific guidance
- If the question is unrelated to AANR technologies or TRACER, politely redirect the user

If you don't know something, say so clearly rather than guessing.${knowledgeContext}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: message },
      ],
      max_tokens: 350,
      temperature: 0.4,
    });

    const reply = completion.choices[0]?.message?.content?.trim()
      ?? "I couldn't generate a response. Please try again.";

    return NextResponse.json({ reply });

  } catch (err) {
    console.error("Assistant API error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}