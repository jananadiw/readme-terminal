interface TerminalDotProps {
  color: "red" | "yellow" | "green";
}

const DOT_COLORS = {
  red: "#FF5F57",
  yellow: "#FEBC2E",
  green: "#28C840",
} as const;

export default function TerminalDot({ color }: TerminalDotProps) {
  return (
    <div
      className="w-3 h-3 rounded-full"
      style={{ backgroundColor: DOT_COLORS[color] }}
    />
  );
}
