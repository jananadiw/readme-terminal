import { handlePortfolioChatRequest } from "@/lib/portfolioChat";

export async function POST(req: Request) {
  return handlePortfolioChatRequest(req, "friendly");
}
