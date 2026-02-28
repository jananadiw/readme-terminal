export const RETRO_CLASSES = {
  focusRing: "retro-focus-ring focus-visible:outline-none",
  windowFrame:
    "retro-window-frame rounded-sm bg-[var(--retro-window)] border border-[var(--retro-border)] overflow-hidden",
  windowFrameActive: "ring-1 ring-[var(--retro-border-soft)]",
  windowFrameInactive: "opacity-[0.96]",
  surface:
    "retro-surface-panel rounded-sm bg-[var(--retro-surface)] border border-[var(--retro-border)]",
  inset:
    "retro-inset-panel rounded-sm bg-[var(--retro-inset)] border border-[var(--retro-border-soft)]",
  titleBar:
    "retro-titlebar-surface border-b border-[var(--retro-border-soft)] bg-[var(--retro-titlebar)]",
  titleBarActive: "text-[var(--retro-text-chrome)]",
  titleBarInactive: "opacity-80 saturate-50",
  topBar:
    "retro-topbar h-6 border-b border-[var(--retro-border)] bg-[var(--retro-titlebar)]",
  toolbarRow:
    "retro-toolbar-surface border-t border-[var(--retro-border-soft)] bg-[var(--retro-window-alt)]",
  chromeText: "text-[var(--retro-text-chrome)]",
  bodyText: "text-[var(--retro-text-primary)]",
  mutedText: "text-[var(--retro-text-muted)]",
  subtleText: "text-[var(--retro-text-subtle)]",
  promptText: "text-[var(--retro-accent-green)]",
  accentBlueText: "text-[var(--retro-accent-blue-text)]",
  smallUiText: "font-[Inconsolata] text-[11px] tracking-[0.04em]",
  buttonBase:
    "retro-button inline-flex items-center justify-center font-[var(--font-ui)] font-medium tracking-[0.01em] select-none leading-none transition-[background-color,box-shadow,transform,color] duration-150 active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed",
  chipButton:
    "retro-button-solid rounded-[8px] px-2.5 py-1.5 text-xs sm:text-sm border",
  primaryButton: "retro-button-solid rounded-[8px] px-3 py-2 text-sm border",
  ghostButton:
    "rounded-[8px] px-3 py-2 text-sm border border-transparent bg-transparent text-[var(--retro-text-primary)] hover:bg-[var(--retro-surface)]",
  panelLink:
    "retro-button-solid rounded-[8px] px-2.5 py-1 text-xs sm:text-sm border",
  dockItemBase:
    "group flex min-w-[54px] sm:min-w-[64px] flex-col items-center justify-end rounded-sm px-1 py-1.5 text-[var(--retro-accent-blue-text)]",
  dockItemActive:
    "bg-[var(--retro-accent-blue-fill-strong)]/80 shadow-[inset_1px_1px_0_rgba(255,255,255,0.9),inset_-1px_-1px_0_rgba(97,118,214,0.4)]",
  dockItemIdle:
    "hover:bg-white/35 active:bg-[var(--retro-accent-blue-fill)]/65 active:shadow-[inset_1px_1px_0_rgba(160,166,190,0.45)]",
  tooltip:
    "retro-tooltip-panel rounded-sm border border-[var(--retro-border)] bg-[var(--retro-tooltip-bg)] text-[var(--retro-accent-blue-text)]",
  stampFocusOffset: "focus-visible:ring-offset-[var(--retro-desktop)]",
  terminalShellShadow: "shadow-[0_16px_36px_rgba(28,33,50,0.14)]",
  scrollContentArea: "min-h-0 overflow-auto terminal-scroll",
} as const;

export const RETRO_BUTTON_VARIANTS = {
  suggestion: RETRO_CLASSES.chipButton,
  primary: RETRO_CLASSES.primaryButton,
  ghost: RETRO_CLASSES.ghostButton,
  panelLink: RETRO_CLASSES.panelLink,
} as const;
