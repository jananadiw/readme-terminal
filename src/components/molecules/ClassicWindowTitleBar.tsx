import { PointerEvent } from "react";
import { cn } from "@/lib/classNames";
import { RETRO_CLASSES } from "@/lib/retroClasses";

interface ClassicWindowTitleBarProps {
  title: string;
  active?: boolean;
  onPrimaryAction?: () => void;
  primaryActionLabel?: string;
  primaryActionIcon?: "close" | "minimize" | "none";
  onSecondaryAction?: () => void;
  secondaryActionLabel?: string;
  secondaryActionIcon?: "close" | "minimize" | "none";
  onBarPointerDown?: (event: PointerEvent<HTMLDivElement>) => void;
  className?: string;
}

function ControlGlyph({ icon }: { icon: "close" | "minimize" | "none" }) {
  if (icon === "minimize") {
    return <span className="block h-[1px] w-2 bg-[var(--retro-text-chrome)]" />;
  }

  if (icon === "close") {
    return (
      <span className="relative block h-2 w-2">
        <span className="absolute left-1/2 top-0 h-2 w-[1px] -translate-x-1/2 rotate-45 bg-[var(--retro-text-chrome)]" />
        <span className="absolute left-1/2 top-0 h-2 w-[1px] -translate-x-1/2 -rotate-45 bg-[var(--retro-text-chrome)]" />
      </span>
    );
  }

  return null;
}

function DecorativeControl() {
  return (
    <span
      aria-hidden="true"
      className="retro-window-control-box grid h-4 w-4 place-items-center"
      data-window-control
    >
      <span className="h-[6px] w-[6px] border border-[var(--retro-border-soft)]" />
    </span>
  );
}

export default function ClassicWindowTitleBar({
  title,
  active = true,
  onPrimaryAction,
  primaryActionLabel = "Window action",
  primaryActionIcon = "none",
  onSecondaryAction,
  secondaryActionLabel = "Window action",
  secondaryActionIcon = "none",
  onBarPointerDown,
  className,
}: ClassicWindowTitleBarProps) {
  return (
    <div
      data-window-titlebar
      className={cn(
        "flex h-6 items-center gap-1 px-1.5",
        RETRO_CLASSES.titleBar,
        active ? RETRO_CLASSES.titleBarActive : RETRO_CLASSES.titleBarInactive,
        className
      )}
      onPointerDown={(event) => {
        if ((event.target as HTMLElement).closest("[data-window-control]")) return;
        onBarPointerDown?.(event);
      }}
    >
      {onPrimaryAction ? (
        <button
          type="button"
          data-window-control
          aria-label={primaryActionLabel}
          className="retro-window-control-box grid h-4 w-4 place-items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--retro-focus)]"
          onClick={(event) => {
            event.stopPropagation();
            onPrimaryAction();
          }}
        >
          <ControlGlyph icon={primaryActionIcon} />
        </button>
      ) : (
        <DecorativeControl />
      )}

      {onSecondaryAction ? (
        <button
          type="button"
          data-window-control
          aria-label={secondaryActionLabel}
          className="retro-window-control-box grid h-4 w-4 place-items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--retro-focus)]"
          onClick={(event) => {
            event.stopPropagation();
            onSecondaryAction();
          }}
        >
          <ControlGlyph icon={secondaryActionIcon} />
        </button>
      ) : (
        <DecorativeControl />
      )}

      <div className="mx-1 flex min-w-0 flex-1 items-center gap-1">
        <div className="retro-title-stripes h-3 flex-1 border-y border-[rgba(76,83,103,0.14)]" />
        <span className="shrink-0 font-[Inconsolata] text-[11px] tracking-[0.12em] text-[var(--retro-text-chrome)]">
          {title}
        </span>
        <div className="retro-title-stripes h-3 flex-1 border-y border-[rgba(76,83,103,0.14)]" />
      </div>

      <DecorativeControl />
      <DecorativeControl />
    </div>
  );
}
