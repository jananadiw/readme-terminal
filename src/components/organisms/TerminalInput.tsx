import { KeyboardEvent, RefObject } from "react";
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
    <div className="flex items-center px-3 py-2 sm:px-5 sm:py-3 border-t border-[#DADCEA]">
      <TerminalPrompt />
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? "Thinking..." : "Type a command..."}
        disabled={disabled}
        autoFocus
      />
    </div>
  );
}
