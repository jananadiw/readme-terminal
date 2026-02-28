"use client";

import Image from "next/image";
import { cn } from "@/lib/classNames";
import { RETRO_CLASSES } from "@/lib/retroClasses";
import type { DesktopDockItem, DesktopDockItemId } from "@/lib/types";

interface MacFileDockProps {
  items: DesktopDockItem[];
  activeIds: DesktopDockItemId[];
  onItemClick: (id: DesktopDockItemId) => void;
}

const DOCK_ICON_ASSETS: Record<
  DesktopDockItemId,
  { closedSrc: string; openSrc: string }
> = {
  about: {
    closedSrc: "/icons/aboutClose.png",
    openSrc: "/icons/aboutOpen.png",
  },
  terminal: {
    closedSrc: "/icons/terminalClose.png",
    openSrc: "/icons/terminalOpen.png",
  },
  resume: {
    closedSrc: "/icons/resumeClose.png",
    openSrc: "/icons/resumeOpen.png",
  },
};

function DockItemIcon({
  id,
  active,
}: {
  id: DesktopDockItemId;
  active: boolean;
}) {
  const assets = DOCK_ICON_ASSETS[id];
  const src = active ? assets.openSrc : assets.closedSrc;

  return (
    <span
      aria-hidden="true"
      className="pointer-events-none relative block h-[34px] w-[34px] sm:h-10 sm:w-10"
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 640px) 34px, 40px"
        className="object-contain"
        draggable={false}
      />
    </span>
  );
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
      className="fixed bottom-[max(10px,env(safe-area-inset-bottom))] left-1/2 z-[90] -translate-x-1/2 pointer-events-auto opacity-95"
    >
      <div className={cn("px-2 py-2 sm:px-3", RETRO_CLASSES.surface)}>
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
                  "bg-transparent shadow-none hover:bg-transparent active:bg-transparent",
                  active ? "opacity-100" : "opacity-95 hover:opacity-100",
                )}
                onClick={() => onItemClick(item.id)}
              >
                <DockItemIcon id={item.id} active={active} />
                <span
                  className={cn(
                    "mt-1 font-[Inconsolata] text-[10px] sm:text-[11px] leading-none tracking-[0.03em]",
                    active
                      ? "text-[var(--retro-accent-blue-text)]"
                      : "text-[var(--retro-text-chrome)]",
                  )}
                >
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
