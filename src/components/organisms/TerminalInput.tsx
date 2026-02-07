import { KeyboardEvent, RefObject } from "react";
import Input from "../atoms/Input";
import TerminalPrompt from "../molecules/TerminalPrompt";

interface TerminalInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
}

export default function TerminalInput({
  value,
  onChange,
  onSubmit,
  inputRef,
}: TerminalInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  return (
    <div className="flex items-center px-5 py-3 border-t border-[#D4C5A9]">
      <TerminalPrompt />
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a command..."
        autoFocus
      />
    </div>
  );
}
