import { readFileSync } from "fs";
import { join } from "path";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function readQuestion(req: Request) {
  const rawBody = await req.text();

  if (!rawBody.trim()) {
    return { error: "Request body is required." } as const;
  }

  try {
    const parsed = JSON.parse(rawBody) as { question?: unknown };
    const question =
      typeof parsed.question === "string" ? parsed.question.trim() : "";

    if (!question) {
      return { error: "Question is required." } as const;
    }

    return { question } as const;
  } catch {
    return { error: "Request body must be valid JSON." } as const;
  }
}

export async function POST(req: Request) {
  const payload = await readQuestion(req);

  if ("error" in payload) {
    return new Response(payload.error, {
      status: 400,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }

  const { question } = payload;
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
              content: `You are Jananadi's portfolio terminal. Answer questions based on this document about Jananadi. Be friendly, casual, and add personality. Keep answers concise (2-3 sentences max).\n\n${context}`,
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
