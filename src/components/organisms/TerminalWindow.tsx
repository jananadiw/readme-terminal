import { RefObject } from "react";
import { DragControls } from "framer-motion";
import { HistoryItem } from "@/lib/types";
import { TERMINAL_CONFIG, SUGGESTIONS } from "@/lib/constants";
import { cn } from "@/lib/classNames";
import { RETRO_CLASSES } from "@/lib/retroClasses";
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
  onClose: () => void;
  onMinimize: () => void;
  dragControls: DragControls;
  streaming?: boolean;
  active?: boolean;
  onActivate?: () => void;
}

export default function TerminalWindow({
  history,
  input,
  onInputChange,
  onSubmit,
  onSuggestionClick,
  inputRef,
  scrollRef,
  onClose,
  onMinimize,
  dragControls,
  streaming,
  active = true,
  onActivate,
}: TerminalWindowProps) {
  return (
    <div
      aria-label="Portfolio terminal window"
      data-window-container
      data-window-active={active ? "true" : "false"}
      className={cn(
        TERMINAL_CONFIG.maxWidth,
        TERMINAL_CONFIG.width,
        TERMINAL_CONFIG.height,
        "flex flex-col relative text-[var(--retro-text-primary)]",
        RETRO_CLASSES.windowFrame,
        active ? RETRO_CLASSES.windowFrameActive : RETRO_CLASSES.windowFrameInactive
      )}
      onPointerDownCapture={() => onActivate?.()}
      onClick={(event) => {
        onActivate?.();
        const target = event.target as HTMLElement;
        if (target.closest("[data-window-titlebar]")) return;
        inputRef.current?.focus();
      }}
    >
      <TerminalTitleBar
        title={TERMINAL_CONFIG.title}
        onClose={onClose}
        onMinimize={onMinimize}
        dragControls={dragControls}
        active={active}
      />
      <TerminalOutput history={history} scrollRef={scrollRef} active={active} />
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
