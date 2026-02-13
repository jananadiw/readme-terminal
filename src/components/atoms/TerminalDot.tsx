"use client";

import { motion } from "framer-motion";

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
    <motion.div
      className="w-3 h-3 rounded-full cursor-pointer"
      style={{ backgroundColor: DOT_COLORS[color] }}
      whileHover={{ scale: 1.2, backgroundColor: DOT_HOVER[color] }}
      transition={{ duration: 0.15 }}
    />
  );
}
