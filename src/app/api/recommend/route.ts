import { NextRequest, NextResponse } from "next/server";

const HF_API_KEY = process.env.HF_API_KEY ?? "";
const HF_MODEL   = "meta-llama/Llama-3.1-8B-Instruct:cerebras";
const HF_API_URL = "https://router.huggingface.co/v1/chat/completions";

export async function POST(req: NextRequest) {
  if (!HF_API_KEY) {
    return NextResponse.json(
      { error: "HF_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  const body = await req.json();

  const payload = {
    model: HF_MODEL,
    messages: body.messages,
  };

  const hfResponse = await fetch(HF_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${HF_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!hfResponse.ok) {
    const errText = await hfResponse.text();
    return NextResponse.json(
      { error: `HuggingFace error ${hfResponse.status}: ${errText}` },
      { status: hfResponse.status }
    );
  }

  const data = await hfResponse.json();
  const completion: string = data.choices?.[0]?.message?.content ?? "";

  return NextResponse.json({ completion });
}