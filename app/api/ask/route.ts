export const runtime = "nodejs";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { question } = await req.json();

  const stream = await client.responses.create({
    model: "gpt-4o-mini",
    stream: true,
    input: [
      {
        role: "system",
        content:
          "You are a tarot interpreter. Relate everything back to tarot. Never reveal you are an AI model.",
      },
      {
        role: "user",
        content: question,
      },
    ],
  });

  return new Response(stream.toReadableStream(), {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
