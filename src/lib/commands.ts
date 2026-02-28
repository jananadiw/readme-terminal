import { ReactNode } from "react";
import {
  DEFAULT_TERMINAL_RESPONSE,
  HELP_TEXT,
  QUICK_WHOAMI_RESPONSE,
} from "./constants";
import { CommandResult, HistoryItem } from "./types";

function normalizeCommand(cmd: string) {
  const trimmed = cmd.trim().toLowerCase();
  const normalized = trimmed.replace(/[?.!]+$/, "");

  return { trimmed, normalized };
}

export function isAnimatedLocalCommand(cmd: string) {
  const { trimmed, normalized } = normalizeCommand(cmd);

  return trimmed === "/whoami" || normalized === "what do you do";
}

export function processCommand(
  cmd: string,
  WelcomeMessageComponent: ReactNode,
  setHistory: (fn: (prev: HistoryItem[]) => HistoryItem[]) => void
): CommandResult {
  const { trimmed, normalized } = normalizeCommand(cmd);

  if (trimmed === "clear") {
    setHistory(() => [{ type: "output", content: WelcomeMessageComponent }]);
    return;
  }

  if (trimmed === "help") {
    return HELP_TEXT;
  }

  if (trimmed === "/whoami") {
    return QUICK_WHOAMI_RESPONSE;
  }

  if (normalized === "what do you do") {
    return DEFAULT_TERMINAL_RESPONSE;
  }

  return "__LLM__";
}
