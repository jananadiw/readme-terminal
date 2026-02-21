import { RefObject } from "react";
import { DragControls } from "framer-motion";
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
  scrollRef: RefObject<HTMLDivElement | null>;
  onMinimize: () => void;
  dragControls: DragControls;
  streaming?: boolean;
}

export default function TerminalWindow({
  history,
  input,
  onInputChange,
  onSubmit,
  onSuggestionClick,
  inputRef,
  scrollRef,
  onMinimize,
  dragControls,
  streaming,
}: TerminalWindowProps) {
  return (
    <div
      className={`${TERMINAL_CONFIG.maxWidth} ${TERMINAL_CONFIG.width} ${TERMINAL_CONFIG.height} bg-[#ECEDF4]/90 backdrop-blur-md rounded-xl shadow-2xl flex flex-col overflow-hidden border border-[#D4D6E5] relative`}
      onClick={() => inputRef.current?.focus()}
    >
      <TerminalTitleBar
        title={TERMINAL_CONFIG.title}
        onMinimize={onMinimize}
        dragControls={dragControls}
      />
      <TerminalOutput history={history} scrollRef={scrollRef} />
      <TerminalInput
        value={input}
        onChange={onInputChange}
        onSubmit={onSubmit}
        inputRef={inputRef}
        disabled={streaming}
      />
      <SuggestionBar
        suggestions={SUGGESTIONS}
        onSuggestionClick={onSuggestionClick}
      />
    </div>
  );
}
