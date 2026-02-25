export const RETRO_THEME = {
  colors: {
    desktop: "var(--retro-desktop)",
    window: "var(--retro-window)",
    windowAlt: "var(--retro-window-alt)",
    surface: "var(--retro-surface)",
    inset: "var(--retro-inset)",
    insetAlt: "var(--retro-inset-alt)",
    titlebar: "var(--retro-titlebar)",
    border: "var(--retro-border)",
    borderSoft: "var(--retro-border-soft)",
    chromeText: "var(--retro-text-chrome)",
    textPrimary: "var(--retro-text-primary)",
    textMuted: "var(--retro-text-muted)",
    textSubtle: "var(--retro-text-subtle)",
    accentBlue: "var(--retro-accent-blue)",
    accentBlueText: "var(--retro-accent-blue-text)",
    accentBlueFill: "var(--retro-accent-blue-fill)",
    accentBlueFillStrong: "var(--retro-accent-blue-fill-strong)",
    accentGreen: "var(--retro-accent-green)",
    accentRed: "var(--retro-accent-red)",
    accentYellow: "var(--retro-accent-yellow)",
    tooltipBg: "var(--retro-tooltip-bg)",
  },
  svg: {
    dockStroke: "#2E46FF",
    dockFillActive: "#D8E2FF",
    dockFillActiveStrong: "#C9D4FF",
    dockTerminalFill: "#D4DEFF",
  },
  trafficLights: {
    red: "#FF5F57",
    yellow: "#FEBC2E",
    green: "#28C840",
    redHover: "#E5453F",
    yellowHover: "#E5A828",
    greenHover: "#20B038",
  },
} as const;

export type RetroTrafficLightColor = keyof Pick<
  typeof RETRO_THEME.trafficLights,
  "red" | "yellow" | "green"
>;

