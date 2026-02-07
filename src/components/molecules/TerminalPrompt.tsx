import ColoredText from "../atoms/ColoredText";

interface TerminalPromptProps {
  show?: boolean;
}

export default function TerminalPrompt({ show = true }: TerminalPromptProps) {
  if (!show) return null;

  return (
    <ColoredText color="#2E6F40">
      ❯{" "}
    </ColoredText>
  );
}
