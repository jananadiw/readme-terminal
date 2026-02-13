import { ReactNode } from "react";

interface ColoredTextProps {
  children: ReactNode;
  color?: string;
}

export default function ColoredText({ children, color = "#35373a" }: ColoredTextProps) {
  return <span style={{ color }}>{children}</span>;
}
