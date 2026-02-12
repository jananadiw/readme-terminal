export const COLORS = {
  primary: "#FA5053",
  secondary: "#2E6F40",
  accent1: "#68BA7F",
  accent2: "#FA766E",
  accent3: "#4682B4",
  accent4: "#366899",
  yellow: "#FFCC00",
  background: "#F9F9F7",
  terminalBg: "#FCFCFA",
  border: "#D4C5A9",
  textPrimary: "#3E3326",
  textSecondary: "#9B8B75",
  textMuted: "#8B7E6A",
  placeholder: "#B5A68F",
  chipBg: "#E8E0D0",
  chipHover: "#DDD3BF",
  chipText: "#6B5D4F",
} as const;

export const HELP_TEXT = `Available commands:
  <span class="text-[#2E6F40]">help</span>     - Show this message
  <span class="text-[#2E6F40]">clear</span>    - Clear terminal
  <span class="text-[#2E6F40]">/whoami</span>  - Quick intro about Jananadi

Or just type a question!`;

export const SUGGESTIONS = [
  "What do you do?",
  "Tell me about your projects",
  "Where are you based?",
] as const;

export const TERMINAL_CONFIG = {
  maxWidth: "max-w-4xl",
  height: "h-[600px]",
  title: "jw — bash",
} as const;

