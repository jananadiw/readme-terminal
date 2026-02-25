import { KeyboardEvent, RefObject } from "react";
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
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !disabled) {
      onSubmit();
    }
  };

  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-2 sm:px-4 sm:py-2.5 ${RETRO_CLASSES.toolbarRow}`}>
      <TerminalPrompt />
      <div className={`flex h-7 flex-1 items-center px-1.5 ${RETRO_CLASSES.inset}`}>
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
          className="h-6 border-0 px-1 py-0"
        />
      </div>
    </div>
  );
}
