import { useState, useRef, useEffect, useCallback } from "react";
import { HistoryItem } from "@/lib/types";
import { processCommand } from "@/lib/commands";
import WelcomeMessage from "@/components/organisms/WelcomeMessage";

export function useTerminal(whoamiContent: string) {
  const [history, setHistory] = useState<HistoryItem[]>([
    { type: "output", content: <WelcomeMessage /> },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [history]);

  const streamLLM = useCallback(async (question: string) => {
    setStreaming(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!res.body) throw new Error("No stream");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      let pending = false;

      const flush = () => {
        pending = false;
        const current = text;
        setHistory((h) => {
          const updated = [...h];
          updated[updated.length - 1] = {
            type: "output",
            content: `<span class="text-[#35373a]">${current}</span>`,
          };
          return updated;
        });
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        text += decoder.decode(value, { stream: true });
        // Batch DOM updates to animation frames to avoid layout thrashing
        if (!pending) {
          pending = true;
          rafRef.current = requestAnimationFrame(flush);
        }
      }
      // Final flush to ensure last chunk is rendered
      cancelAnimationFrame(rafRef.current);
      flush();
    } catch {
      setHistory((h) => {
        const updated = [...h];
        updated[updated.length - 1] = {
          type: "output",
          content: `<span class="text-[#35373a]">Something went wrong. Try again!</span>`,
        };
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  }, []);

  const handleSubmit = useCallback(
    (value: string = input) => {
      if (!value.trim() || streaming) return;

      const output = processCommand(
        value,
        whoamiContent,
        <WelcomeMessage hasOutput />,
        setHistory
      );

      if (output === "__LLM__") {
        setHistory((h) => [
          { type: "output", content: <WelcomeMessage hasOutput /> },
          ...h.slice(1),
          { type: "input", content: value },
          { type: "output", content: `<span class="text-[#35373a]">...</span>` },
        ]);
        setInput("");
        streamLLM(value);
      } else {
        setHistory((h) => [
          { type: "output", content: <WelcomeMessage hasOutput /> },
          ...h.slice(1),
          { type: "input", content: value },
          ...(output ? [{ type: "output" as const, content: output }] : []),
        ]);
        setInput("");
      }
    },
    [input, streaming, whoamiContent, streamLLM]
  );

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return {
    history,
    input,
    setInput,
    handleSubmit,
    scrollRef,
    inputRef,
    streaming,
  };
}
