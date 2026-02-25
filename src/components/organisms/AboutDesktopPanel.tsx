"use client";

import Image from "next/image";
import { useRef } from "react";
import { cn } from "@/lib/classNames";
import { RETRO_CLASSES } from "@/lib/retroClasses";
import type { AboutPanelContent } from "@/lib/types";
import ClassicWindowTitleBar from "../molecules/ClassicWindowTitleBar";
import WindowContentArea from "../molecules/WindowContentArea";

interface AboutDesktopPanelProps {
  content: AboutPanelContent;
  onClose: () => void;
  onLinkAction?: (action: "terminal" | "resume") => void;
  active?: boolean;
  onActivate?: () => void;
}

export default function AboutDesktopPanel({
  content,
  onClose,
  onLinkAction,
  active = true,
  onActivate,
}: AboutDesktopPanelProps) {
  const aboutScrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        "fixed inset-x-0 top-10 bottom-20 px-3 sm:px-5 pointer-events-none",
        active ? "z-[62]" : "z-[46]"
      )}
    >
      <div
        data-about-panel
        className="pointer-events-auto mx-auto h-full w-full max-w-[1080px]"
        onPointerDownCapture={() => onActivate?.()}
      >
        <div
          data-window-container
          data-window-active={active ? "true" : "false"}
          className={cn(
            "relative h-full",
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
          />

          <div className="grid h-[calc(100%-1.5rem)] grid-rows-[minmax(220px,38%)_1fr] md:grid-cols-[1.05fr_1fr] md:grid-rows-1">
            <div className="relative border-b border-[var(--retro-border-soft)] bg-[#E07A31] md:order-2 md:border-b-0 md:border-l">
              <Image
                src={content.imageSrc}
                alt={content.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>

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
                    <p key={paragraph}>{paragraph}</p>
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
                        return (
                          <button
                            key={link.id}
                            type="button"
                            onClick={() => onLinkAction?.(link.action as "terminal" | "resume")}
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
    </div>
  );
}
