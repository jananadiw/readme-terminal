"use client";

import { cn } from "@/lib/classNames";
import { RETRO_CLASSES } from "@/lib/retroClasses";
import { RETRO_THEME } from "@/lib/retroTheme";
import type { DesktopDockItem, DesktopDockItemId } from "@/lib/types";

interface MacFileDockProps {
  items: DesktopDockItem[];
  activeIds: DesktopDockItemId[];
  onItemClick: (id: DesktopDockItemId) => void;
}

function FolderIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 34 26"
      className="h-6 w-8 sm:h-7 sm:w-9"
      aria-hidden="true"
    >
      <path
        d="M2.5 8.5h11l2.6-2.8h15.4v17H2.5z"
        fill={active ? RETRO_THEME.svg.dockFillActiveStrong : "transparent"}
        stroke={RETRO_THEME.svg.dockStroke}
        strokeWidth="1.4"
        strokeLinejoin="miter"
      />
      <path
        d="M2 10h30v13.5H2z"
        fill={active ? RETRO_THEME.svg.dockFillActive : "transparent"}
        stroke={RETRO_THEME.svg.dockStroke}
        strokeWidth="1.4"
      />
    </svg>
  );
}

function TerminalIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 34 26"
      className="h-6 w-8 sm:h-7 sm:w-9"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="4"
        width="28"
        height="18"
        fill={active ? RETRO_THEME.svg.dockTerminalFill : "transparent"}
        stroke={RETRO_THEME.svg.dockStroke}
        strokeWidth="1.4"
      />
      <path
        d="M9 10l4 2.5-4 2.5"
        fill="none"
        stroke={RETRO_THEME.svg.dockStroke}
        strokeWidth="1.4"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path
        d="M16.5 16h7"
        stroke={RETRO_THEME.svg.dockStroke}
        strokeWidth="1.4"
        strokeLinecap="square"
      />
    </svg>
  );
}

function ResumeIcon() {
  return (
    <svg
      viewBox="0 0 28 34"
      className="h-7 w-6 sm:h-8 sm:w-7"
      aria-hidden="true"
    >
      <path
        d="M4 2h14l6 6v24H4z"
        fill="transparent"
        stroke={RETRO_THEME.svg.dockStroke}
        strokeWidth="1.4"
      />
      <path
        d="M18 2v7h6"
        fill="transparent"
        stroke={RETRO_THEME.svg.dockStroke}
        strokeWidth="1.4"
      />
      <path
        d="M8 21h12M8 25h12M8 29h9"
        stroke={RETRO_THEME.svg.dockStroke}
        strokeWidth="1.1"
        strokeLinecap="square"
      />
    </svg>
  );
}

function DockItemIcon({
  kind,
  active,
}: {
  kind: DesktopDockItem["kind"];
  active: boolean;
}) {
  if (kind === "resume") return <ResumeIcon />;
  if (kind === "terminal") return <TerminalIcon active={active} />;
  return <FolderIcon active={active} />;
}

export default function MacFileDock({
  items,
  activeIds,
  onItemClick,
}: MacFileDockProps) {
  const activeSet = new Set(activeIds);

  return (
    <div
      data-file-dock
      className="fixed bottom-[max(10px,env(safe-area-inset-bottom))] left-1/2 z-[90] -translate-x-1/2 pointer-events-auto"
    >
      <div
        className={cn(
          "px-2 py-2 sm:px-3",
          RETRO_CLASSES.surface
        )}
      >
        <div className="flex items-end gap-1.5 sm:gap-3">
          {items.map((item) => {
            const active = activeSet.has(item.id);

            return (
              <button
                key={item.id}
                type="button"
                aria-label={item.label}
                aria-pressed={active}
                className={cn(
                  RETRO_CLASSES.dockItemBase,
                  RETRO_CLASSES.focusRing,
                  active ? RETRO_CLASSES.dockItemActive : RETRO_CLASSES.dockItemIdle
                )}
                onClick={() => onItemClick(item.id)}
              >
                <DockItemIcon kind={item.kind} active={active} />
                <span className="mt-1 font-[Inconsolata] text-[10px] sm:text-[11px] leading-none tracking-[0.03em]">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
