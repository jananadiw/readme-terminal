"use client";

import { useEffect, useState } from "react";
import { RETRO_CLASSES } from "@/lib/retroClasses";

function formatPtTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Los_Angeles",
  }).format(date);
}

export default function MacTopBar() {
  const [now, setNow] = useState<Date | null>(null);
  const ptTime = now ? formatPtTime(now) : "--:-- --";

  useEffect(() => {
    const update = () => setNow(new Date());

    update();
    const intervalId = window.setInterval(update, 30_000);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <header
      role="banner"
      className={`fixed inset-x-0 top-0 z-[90] ${RETRO_CLASSES.topBar}`}
      style={{ backgroundColor: "#B7BFF5" }}
    >
      <div
        className="mx-auto flex h-full w-full items-center justify-between px-2 sm:px-3 font-[Inconsolata] text-[11px] sm:text-xs text-[var(--retro-text-chrome)] tracking-[0.04em]"
        style={{ color: "#112DE8" }}
      >
        <div className="truncate font-medium">JananadiW</div>
        <div className="ml-3 flex items-center gap-2 sm:gap-2.5 whitespace-nowrap">
          <time
            dateTime={now ? now.toISOString() : undefined}
            className="inline-block min-w-[58px] text-right"
          >
            {ptTime}
          </time>
          <span aria-hidden="true">•</span>
          <span>San Francisco</span>
        </div>
      </div>
    </header>
  );
}
