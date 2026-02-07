import { RefObject } from "react";
import { HistoryItem } from "@/lib/types";
import { TERMINAL_CONFIG, SUGGESTIONS } from "@/lib/constants";
import TerminalTitleBar from "../molecules/TerminalTitleBar";
import TerminalOutput from "./TerminalOutput";
import TerminalInput from "./TerminalInput";
import SuggestionBar from "./SuggestionBar";

interface TerminalWindowProps {
  history: HistoryItem[];
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onSuggestionClick: (suggestion: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
  bottomRef: RefObject<HTMLDivElement | null>;
}

export default function TerminalWindow({
  history,
  input,
  onInputChange,
  onSubmit,
  onSuggestionClick,
  inputRef,
  bottomRef,
}: TerminalWindowProps) {
  return (
    <div
      className={`w-full ${TERMINAL_CONFIG.maxWidth} ${TERMINAL_CONFIG.height} bg-[#F5F1E8]/90 rounded-xl shadow-2xl flex flex-col overflow-hidden border border-[#D4C5A9] relative`}
      onClick={() => inputRef.current?.focus()}
    >
      <TerminalTitleBar title={TERMINAL_CONFIG.title} />
      <TerminalOutput history={history} bottomRef={bottomRef} />
      <TerminalInput
        value={input}
        onChange={onInputChange}
        onSubmit={onSubmit}
        inputRef={inputRef}
      />
      <SuggestionBar
        suggestions={SUGGESTIONS}
        onSuggestionClick={onSuggestionClick}
      />
    </div>
  );
}
