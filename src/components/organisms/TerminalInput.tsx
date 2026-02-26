import { KeyboardEvent, RefObject, useState } from "react";
import { RETRO_CLASSES } from "@/lib/retroClasses";
import Input from "../atoms/Input";
import TerminalPrompt from "../molecules/TerminalPrompt";

interface TerminalInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
  disabled?: boolean;
}

export default function TerminalInput({
  value,
  onChange,
  onSubmit,
  inputRef,
  disabled,
}: TerminalInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !disabled) {
      onSubmit();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const showRetroCursor = isFocused && !disabled && value.length === 0;

  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-2 sm:px-4 sm:py-2.5 font-[Inconsolata] text-[15px] text-[var(--retro-accent-blue-text)] ${RETRO_CLASSES.toolbarRow}`}
    >
      <TerminalPrompt />
      <div
        className={`relative flex h-7 flex-1 items-center px-1.5 ${RETRO_CLASSES.inset}`}
      >
        {showRetroCursor ? (
          <span
            aria-hidden="true"
            className="retro-terminal-block-cursor pointer-events-none absolute left-[10px] top-1/2 h-[15px] w-[7px] -translate-y-1/2 rounded-[1px] bg-[var(--retro-accent-blue)]/85"
          />
        ) : null}
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Thinking…" : "Type a command…"}
          disabled={disabled}
          aria-label="Type a question or command"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          autoFocus
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`h-6 border-0 px-1 py-0 text-[15px] text-[var(--retro-accent-blue-text)] placeholder-[var(--retro-text-muted)] caret-[var(--retro-accent-blue)] focus:placeholder-transparent ${
            showRetroCursor ? "caret-transparent" : ""
          }`}
        />
      </div>
    </div>
  );
}
