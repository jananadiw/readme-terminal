"use client";

import { m } from "framer-motion";
import { RETRO_THEME } from "@/lib/retroTheme";

interface TerminalDotProps {
  color: "red" | "yellow" | "green";
}

const DOT_COLORS = {
  red: RETRO_THEME.trafficLights.red,
  yellow: RETRO_THEME.trafficLights.yellow,
  green: RETRO_THEME.trafficLights.green,
} as const;

const DOT_HOVER = {
  red: RETRO_THEME.trafficLights.redHover,
  yellow: RETRO_THEME.trafficLights.yellowHover,
  green: RETRO_THEME.trafficLights.greenHover,
} as const;

export default function TerminalDot({ color }: TerminalDotProps) {
  return (
    <m.span
      aria-hidden="true"
      className="block h-3 w-3 rounded-full ring-1 ring-black/10"
      style={{ backgroundColor: DOT_COLORS[color] }}
      whileHover={{ scale: 1.12, backgroundColor: DOT_HOVER[color] }}
      transition={{ type: "spring", stiffness: 500, damping: 25 }}
    />
  );
}
