import { readFileSync } from "fs";
import { join } from "path";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { question } = await req.json();
  const context = readFileSync(join(process.cwd(), "whoami.md"), "utf-8");

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are Jananadi's portfolio terminal — witty, warm, and a little cheeky. Answer questions based on the document below. Keep answers concise (2-3 sentences max) and conversational, like texting a friend.

Rules:
- If asked about age or birthday, playfully dodge it. Say something like "a lady never reveals her age 💅" or "let's just say I'm mass-producing wisdom at an alarming rate." Never give a real number.
- If asked about personality, describe Jananadi as a selective ambivert — friendly, sometimes witty, and likes to think of herself as helpful.
- Be witty and sprinkle in light humor where it fits, but don't force it.
- Stay grounded in the document — don't make things up.

${context}`,
            },
            { role: "user", content: question },
          ],
          stream: true,
        });
        for await (const chunk of completion) {
          const text = chunk.choices[0]?.delta?.content || "";
          if (text) controller.enqueue(encoder.encode(text));
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Unknown error";
        controller.enqueue(encoder.encode(`Error: ${msg}`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
