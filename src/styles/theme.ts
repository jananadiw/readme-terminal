import { COLORS } from "@/lib/constants";

export const theme = {
  colors: COLORS,
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
  typography: {
    fontFamily: "Inconsolata, monospace",
    sizes: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
    },
  },
  terminal: {
    titleBarHeight: "h-10",
    padding: "p-5",
    borderRadius: "rounded-xl",
  },
} as const;
