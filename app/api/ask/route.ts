import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { question } = await req.json();

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a tarot interpreter." },
      { role: "user", content: question },
    ],
  });
  const answer = completion.choices[0].message.content;

  return NextResponse.json({ answer });
}
