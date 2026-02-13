import { useState, useRef, useEffect } from "react";
import { HistoryItem } from "@/lib/types";
import { processCommand } from "@/lib/commands";
import WelcomeMessage from "@/components/organisms/WelcomeMessage";

export function useTerminal(whoamiContent: string) {
  const [history, setHistory] = useState<HistoryItem[]>([
    { type: "output", content: <WelcomeMessage /> },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll only the terminal output container, not the viewport
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = (value: string = input) => {
    if (!value.trim()) return;

    const output = processCommand(
      value,
      whoamiContent,
      <WelcomeMessage hasOutput />,
      setHistory
    );

    setHistory((h) => [
      { type: "output", content: <WelcomeMessage hasOutput /> },
      ...h.slice(1),
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
    scrollRef,
    inputRef,
  };
}
