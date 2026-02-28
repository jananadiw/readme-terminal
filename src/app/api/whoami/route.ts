import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  try {
    const content = readFileSync(join(process.cwd(), "whoami.md"), "utf-8");

    return new Response(content, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Failed to read whoami.md:", error);

    return new Response("Profile is temporarily unavailable.", {
      status: 500,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }
}
