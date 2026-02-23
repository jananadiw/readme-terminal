import { ReactNode } from "react";
import { HELP_TEXT } from "./constants";
import { CommandResult, HistoryItem } from "./types";

export function processCommand(
  cmd: string,
  whoamiContent: string,
  WelcomeMessageComponent: ReactNode,
  setHistory: (fn: (prev: HistoryItem[]) => HistoryItem[]) => void
): CommandResult {
  const trimmed = cmd.trim().toLowerCase();

  if (trimmed === "clear") {
    setHistory(() => [{ type: "output", content: WelcomeMessageComponent }]);
    return;
  }

  if (trimmed === "help") {
    return HELP_TEXT;
  }

  if (trimmed === "/whoami") {
    return whoamiContent || "Loading...";
  }

  return "__LLM__";
}
