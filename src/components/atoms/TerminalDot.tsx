"use client";

import { m } from "framer-motion";

interface TerminalDotProps {
  color: "red" | "yellow" | "green";
}

const DOT_COLORS = {
  red: "#FF5F57",
  yellow: "#FEBC2E",
  green: "#28C840",
} as const;

const DOT_HOVER = {
  red: "#E5453F",
  yellow: "#E5A828",
  green: "#20B038",
} as const;

export default function TerminalDot({ color }: TerminalDotProps) {
  return (
    <m.span
      aria-hidden="true"
      className="block w-3 h-3 rounded-full"
      style={{ backgroundColor: DOT_COLORS[color] }}
      whileHover={{ scale: 1.2, backgroundColor: DOT_HOVER[color] }}
      transition={{ type: "spring", stiffness: 500, damping: 25 }}
    />
  );
}
