"use client";

import Image from "next/image";
import { PointerEvent as ReactPointerEvent, ReactNode, useRef, useState } from "react";
import { cn } from "@/lib/classNames";
import { RETRO_CLASSES } from "@/lib/retroClasses";
import type { AboutPanelContent } from "@/lib/types";
import ClassicWindowTitleBar from "../molecules/ClassicWindowTitleBar";
import WindowContentArea from "../molecules/WindowContentArea";

interface AboutDesktopPanelProps {
  content: AboutPanelContent;
  onClose: () => void;
  onLinkAction?: (action: "resume") => void;
  active?: boolean;
  onActivate?: () => void;
  onTitleBarPointerDown?: (event: ReactPointerEvent<HTMLDivElement>) => void;
}

const ABOUT_CONTENT_LINK_URLS: Record<string, string> = {
  LinkMap: "https://linkmap.app/",
  "Daxe AI": "https://daxe.ai/",
  "Taula Capital": "https://www.taulacapital.com/",
  Rocketfin: "https://www.rocketfin.io/",
  "Tokamak Network": "https://www.tokamak.network/",
  ONDA: "https://www.onda.me/",
  Corners: "https://www.corners.co.kr/",
  sketch: "https://canvasconfetti.art/",
};

const ABOUT_CONTENT_LINK_PATTERN =
  /(LinkMap|Daxe AI|Taula Capital|Rocketfin|Tokamak Network|ONDA|Corners|\bsketch\b)/g;

function renderParagraphWithLinks(paragraph: string): ReactNode[] {
  return paragraph.split(ABOUT_CONTENT_LINK_PATTERN).map((segment, index) => {
    const href = ABOUT_CONTENT_LINK_URLS[segment];

    if (!href) {
      return segment;
    }

    return (
      <a
        key={`${segment}-${index}`}
        href={href}
        target="_blank"
        rel="noreferrer"
        className={cn(
          "underline underline-offset-2 decoration-[var(--retro-accent-blue)] hover:text-[var(--retro-accent-blue)] rounded-[2px]",
          RETRO_CLASSES.focusRing
        )}
      >
        {segment}
      </a>
    );
  });
}

export default function AboutDesktopPanel({
  content,
  onClose,
  onLinkAction,
  active = true,
  onActivate,
  onTitleBarPointerDown,
}: AboutDesktopPanelProps) {
  const aboutScrollRef = useRef<HTMLDivElement>(null);
  const [artTooltip, setArtTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const handleArtTooltipPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType && event.pointerType !== "mouse") return;

    const rect = event.currentTarget.getBoundingClientRect();
    setArtTooltip({
      visible: true,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const hideArtTooltip = () => {
    setArtTooltip((current) =>
      current.visible ? { ...current, visible: false } : current
    );
  };

  return (
    <div
      data-about-panel
      className="pointer-events-auto w-[min(96vw,1080px)] h-[min(80dvh,760px)] max-h-[calc(100dvh-6.5rem)] min-h-[360px]"
      onPointerDownCapture={() => onActivate?.()}
    >
      <div
        data-window-container
        data-window-active={active ? "true" : "false"}
        className={cn(
          "relative h-full cursor-default",
          RETRO_CLASSES.windowFrame,
          active ? RETRO_CLASSES.windowFrameActive : RETRO_CLASSES.windowFrameInactive
        )}
      >
        {active && (
          <div className="absolute left-[18%] top-0 h-2 w-10 bg-[var(--retro-accent-blue)]" />
        )}

        <ClassicWindowTitleBar
          title="About"
          active={active}
          primaryActionLabel="Close About panel"
          primaryActionIcon="close"
          onPrimaryAction={onClose}
          className="cursor-grab active:cursor-grabbing select-none"
          onBarPointerDown={onTitleBarPointerDown}
        />

        <div className="grid h-[calc(100%-1.5rem)] grid-rows-[minmax(220px,38%)_1fr] md:grid-cols-[1.05fr_1fr] md:grid-rows-1">
          <a
            href="https://canvasconfetti.art/"
            target="_blank"
            rel="noreferrer"
            aria-label="See more art on Canvas Confetti"
            className={cn(
              "relative block border-b border-[var(--retro-border-soft)] bg-[#E07A31] md:order-2 md:border-b-0 md:border-l",
              RETRO_CLASSES.focusRing
            )}
            onPointerEnter={handleArtTooltipPointerMove}
            onPointerMove={handleArtTooltipPointerMove}
            onPointerLeave={hideArtTooltip}
          >
            <Image
              src={content.imageSrc}
              alt={content.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
            />
            {artTooltip.visible ? (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute z-10 rounded-sm px-2 py-1 text-xs font-[Inconsolata] tracking-[0.02em] shadow-[0_4px_12px_rgba(17,45,232,0.28)]"
                style={{
                  left: `min(calc(100% - 7.5rem), ${artTooltip.x + 12}px)`,
                  top: `min(calc(100% - 2.25rem), ${artTooltip.y + 12}px)`,
                  backgroundColor: "#112DE8",
                  color: "#D9D9D9",
                }}
              >
                see more art
              </span>
            ) : null}
          </a>

          <WindowContentArea
            ref={aboutScrollRef}
            active={active}
            aria-label="About content"
            className={cn("md:order-1", RETRO_CLASSES.inset)}
            viewportClassName="bg-[var(--retro-window)] terminal-scroll"
          >
            <div className="px-4 py-4 sm:px-7 sm:py-6 text-[var(--retro-accent-blue-text)] font-[Inconsolata]">
              <div className="mb-4 border-b border-[var(--retro-border-soft)] pb-4">
                <p className="text-xl sm:text-2xl leading-none tracking-[0.02em] text-[var(--retro-accent-blue-text)]">
                  {content.title}
                </p>
                <p className="mt-2 text-sm sm:text-base text-[var(--retro-text-muted)]">
                  {content.subtitle}
                </p>
              </div>

              <div className="space-y-4 text-sm sm:text-[15px] leading-6 text-[var(--retro-accent-blue-text)]">
                {content.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{renderParagraphWithLinks(paragraph)}</p>
                ))}
              </div>

              <div className="mt-8">
                <p className="text-sm sm:text-[15px] text-[var(--retro-text-muted)]">
                  Say hi, follow or connect with me on:
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {content.links.map((link) => {
                    const baseClass = cn(
                      "inline-flex items-center justify-center font-[Inconsolata]",
                      RETRO_CLASSES.buttonBase,
                      RETRO_CLASSES.panelLink
                    );

                    if (link.href) {
                      return (
                        <a
                          key={link.id}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className={cn(baseClass, RETRO_CLASSES.focusRing)}
                        >
                          {link.label}
                        </a>
                      );
                    }

                    if (link.action) {
                      const action = link.action;
                      return (
                        <button
                          key={link.id}
                          type="button"
                          onClick={() => onLinkAction?.(action)}
                          className={cn(baseClass, RETRO_CLASSES.focusRing)}
                        >
                          {link.label}
                        </button>
                      );
                    }

                    return (
                      <span key={link.id} className={baseClass}>
                        {link.label}
                      </span>
                    );
                  })}
                </div>
              </div>

              <p className="mt-8 border-t border-[var(--retro-border-soft)] pt-4 text-sm sm:text-[15px] leading-6 text-[var(--retro-accent-blue-text)]">
                {content.footer}
              </p>
            </div>
          </WindowContentArea>
        </div>
      </div>
    </div>
  );
}
