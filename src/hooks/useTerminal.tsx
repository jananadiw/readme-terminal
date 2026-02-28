import { useState, useRef, useEffect, useCallback } from "react";
import { HistoryItem } from "@/lib/types";
import { isAnimatedLocalCommand, processCommand } from "@/lib/commands";
import { DEFAULT_TERMINAL_QUESTION } from "@/lib/constants";
import WelcomeMessage from "@/components/organisms/WelcomeMessage";

const AUTO_TYPE_DELAY_MS = 1200; // delay before typing starts
const AUTO_TYPE_CHAR_MS = 70; // ms per character
const LOCAL_RESPONSE_CHAR_MS = 18;

export function useTerminal() {
  const [history, setHistory] = useState<HistoryItem[]>([
    { type: "output", content: <WelcomeMessage /> },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const rafRef = useRef<number>(0);
  const focusRafRef = useRef<number>(0);
  const autoTypeCancelled = useRef(false);
  const autoTypeTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const localResponseTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const handleSubmitRef = useRef<(value: string) => void>(() => {});

  const resetInputCursor = useCallback(() => {
    cancelAnimationFrame(focusRafRef.current);
    focusRafRef.current = requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      try {
        el.setSelectionRange(0, 0);
      } catch {
        // Some browsers can throw if the input is temporarily disabled.
      }
    });
  }, []);

  // Cancel auto-type when user interacts
  const cancelAutoType = useCallback(() => {
    if (!autoTypeCancelled.current) {
      autoTypeCancelled.current = true;
      autoTypeTimers.current.forEach(clearTimeout);
      autoTypeTimers.current = [];
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [history]);

  const clearLocalResponseTimers = useCallback(() => {
    localResponseTimers.current.forEach(clearTimeout);
    localResponseTimers.current = [];
  }, []);

  const animateLocalResponse = useCallback(
    (response: string) => {
      clearLocalResponseTimers();

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setHistory((h) => {
          const updated = [...h];
          updated[updated.length - 1] = {
            type: "output",
            content: response,
          };
          return updated;
        });
        resetInputCursor();
        return;
      }

      setStreaming(true);

      for (let i = 0; i < response.length; i++) {
        const timer = setTimeout(() => {
          const current = response.slice(0, i + 1);

          setHistory((h) => {
            const updated = [...h];
            updated[updated.length - 1] = {
              type: "output",
              content: current,
            };
            return updated;
          });

          if (i === response.length - 1) {
            clearLocalResponseTimers();
            setStreaming(false);
            resetInputCursor();
          }
        }, i * LOCAL_RESPONSE_CHAR_MS);

        localResponseTimers.current.push(timer);
      }
    },
    [clearLocalResponseTimers, resetInputCursor]
  );

  const streamLLM = useCallback(async (question: string) => {
    setStreaming(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) {
        const message = (await res.text()).trim();
        throw new Error(message || "Request failed.");
      }
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
            content: current,
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
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Something went wrong. Try again!";

      setHistory((h) => {
        const updated = [...h];
        updated[updated.length - 1] = {
          type: "output",
          content: message,
        };
        return updated;
      });
    } finally {
      setStreaming(false);
      resetInputCursor();
    }
  }, [resetInputCursor]);

  const handleSubmit = useCallback(
    (value: string = input) => {
      if (!value.trim() || streaming) return;

      const output = processCommand(
        value,
        <WelcomeMessage hasOutput />,
        setHistory
      );

      if (output === "__LLM__") {
        setHistory((h) => [
          { type: "output", content: <WelcomeMessage hasOutput /> },
          ...h.slice(1),
          { type: "input", content: value },
          { type: "output", content: "..." },
        ]);
        setInput("");
        resetInputCursor();
        streamLLM(value);
      } else if (typeof output === "string" && isAnimatedLocalCommand(value)) {
        setHistory((h) => [
          { type: "output", content: <WelcomeMessage hasOutput /> },
          ...h.slice(1),
          { type: "input", content: value },
          { type: "output", content: "..." },
        ]);
        setInput("");
        resetInputCursor();
        animateLocalResponse(output);
      } else {
        setHistory((h) => [
          { type: "output", content: <WelcomeMessage hasOutput /> },
          ...h.slice(1),
          { type: "input", content: value },
          ...(output ? [{ type: "output" as const, content: output }] : []),
        ]);
        setInput("");
        resetInputCursor();
      }
    },
    [animateLocalResponse, input, streaming, streamLLM, resetInputCursor]
  );

  // Keep ref in sync so the auto-type timer can call the latest handleSubmit
  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  }, [handleSubmit]);

  // Auto-type effect on first load
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      autoTypeCancelled.current = true;
      return;
    }

    const startTimer = setTimeout(() => {
      if (autoTypeCancelled.current) return;

      for (let i = 0; i < DEFAULT_TERMINAL_QUESTION.length; i++) {
        const charTimer = setTimeout(() => {
          if (autoTypeCancelled.current) return;
          setInput(DEFAULT_TERMINAL_QUESTION.slice(0, i + 1));
        }, i * AUTO_TYPE_CHAR_MS);
        autoTypeTimers.current.push(charTimer);
      }

      // Auto-submit after typing finishes
      const submitTimer = setTimeout(() => {
        if (autoTypeCancelled.current) return;
        autoTypeCancelled.current = true;
        handleSubmitRef.current(DEFAULT_TERMINAL_QUESTION);
      }, DEFAULT_TERMINAL_QUESTION.length * AUTO_TYPE_CHAR_MS + 400);
      autoTypeTimers.current.push(submitTimer);
    }, AUTO_TYPE_DELAY_MS);

    autoTypeTimers.current.push(startTimer);

    return () => {
      autoTypeTimers.current.forEach(clearTimeout);
      autoTypeTimers.current = [];
    };
  }, []);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      clearLocalResponseTimers();
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(focusRafRef.current);
    };
  }, [clearLocalResponseTimers]);

  return {
    history,
    input,
    setInput,
    handleSubmit,
    scrollRef,
    inputRef,
    streaming,
    cancelAutoType,
  };
}
