import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { HistoryItem } from "@/lib/types";
import { processCommand } from "@/lib/commands";
import WelcomeMessage from "@/components/organisms/WelcomeMessage";

export function useTerminal(whoamiContent: string) {
  const [history, setHistory] = useState<HistoryItem[]>([
    { type: "output", content: <WelcomeMessage /> },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleSubmit = (value: string = input) => {
    if (!value.trim()) return;

    const output = processCommand(
      value,
      whoamiContent,
      <WelcomeMessage />,
      setHistory
    );

    setHistory((h) => [
      ...h,
      { type: "input", content: value },
      ...(output ? [{ type: "output" as const, content: output }] : []),
    ]);
    setInput("");
  };

  return {
    history,
    input,
    setInput,
    handleSubmit,
    bottomRef,
    inputRef,
  };
}
