import ColoredText from "../atoms/ColoredText";
import { RETRO_THEME } from "@/lib/retroTheme";

interface TerminalPromptProps {
  show?: boolean;
}

export default function TerminalPrompt({ show = true }: TerminalPromptProps) {
  if (!show) return null;

  return (
    <ColoredText color={RETRO_THEME.colors.accentGreen}>
      ❯{" "}
    </ColoredText>
  );
}
