import { ReactNode } from "react";
import { HELP_TEXT } from "./constants";
import { CommandResult } from "./types";

export function processCommand(
  cmd: string,
  whoamiContent: string,
  WelcomeMessageComponent: ReactNode,
  setHistory: (fn: (prev: any[]) => any[]) => void
): CommandResult {
  const trimmed = cmd.trim().toLowerCase();

  if (trimmed === "clear") {
    setHistory([{ type: "output", content: WelcomeMessageComponent }]);
    return;
  }

  if (trimmed === "help") {
    return HELP_TEXT;
  }

  if (trimmed === "/whoami") {
    return `<span class="text-[#FA766E]">${whoamiContent || "Loading..."}</span>`;
  }

  return `<span class="text-[#FFCC00]">Coming soon:</span> LLM responses for "${cmd}"`;
}
