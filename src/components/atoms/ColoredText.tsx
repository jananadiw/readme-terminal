import { ReactNode } from "react";
import { RETRO_THEME } from "@/lib/retroTheme";

interface ColoredTextProps {
  children: ReactNode;
  color?: string;
}

export default function ColoredText({
  children,
  color = RETRO_THEME.colors.textPrimary,
}: ColoredTextProps) {
  return <span style={{ color }}>{children}</span>;
}
