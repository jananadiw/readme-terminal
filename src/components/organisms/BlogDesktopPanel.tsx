"use client";

import {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  useRef,
} from "react";
import type { BlogPreviewArticle } from "@/lib/types";
import { cn } from "@/lib/classNames";
import { RETRO_CLASSES } from "@/lib/retroClasses";
import ClassicWindowTitleBar from "../molecules/ClassicWindowTitleBar";
import WindowContentArea from "../molecules/WindowContentArea";

interface BlogDesktopPanelProps {
  articles: BlogPreviewArticle[];
  onClose: () => void;
  onOpenArticle?: (article: BlogPreviewArticle) => void;
  active?: boolean;
  onActivate?: () => void;
  onTitleBarPointerDown?: (event: ReactPointerEvent<HTMLDivElement>) => void;
}

const BLOG_VIEWPORT_BACKGROUND: CSSProperties = {
  backgroundImage:
    "linear-gradient(180deg, rgba(243, 247, 255, 0.69) 0%, rgba(243, 247, 255, 0.61) 45%, rgba(243, 247, 255, 0.73) 100%), url('/IntoTheUnknown.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

function formatPublishedDate(date: string) {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(parsedDate);
}

export default function BlogDesktopPanel({
  articles,
  onClose,
  onOpenArticle,
  active = true,
  onActivate,
  onTitleBarPointerDown,
}: BlogDesktopPanelProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      data-blog-panel
      className="pointer-events-auto w-[min(96vw,1020px)] h-[min(76dvh,700px)] max-h-[calc(100dvh-7.5rem)] sm:max-h-[calc(100dvh-6.5rem)] min-h-[320px] sm:min-h-[360px]"
      onPointerDownCapture={() => onActivate?.()}
    >
      <div
        data-window-container
        data-window-active={active ? "true" : "false"}
        className={cn(
          "relative flex h-full cursor-default flex-col",
          RETRO_CLASSES.windowFrame,
          active ? RETRO_CLASSES.windowFrameActive : RETRO_CLASSES.windowFrameInactive,
        )}
      >
        {active && (
          <div className="absolute left-[18%] top-0 h-2 w-10 bg-[var(--retro-accent-blue)]" />
        )}

        <ClassicWindowTitleBar
          title="Blog"
          active={active}
          primaryActionLabel="Close blog window"
          primaryActionIcon="close"
          onPrimaryAction={onClose}
          className="cursor-grab active:cursor-grabbing select-none"
          onBarPointerDown={onTitleBarPointerDown}
        />

        <WindowContentArea
          ref={contentRef}
          active={active}
          aria-label="Blog articles"
          className={cn("h-full min-h-0 w-full", RETRO_CLASSES.inset)}
          viewportClassName="terminal-scroll"
          style={BLOG_VIEWPORT_BACKGROUND}
        >
          <div className="px-4 py-4 sm:px-7 sm:py-6 text-[var(--retro-accent-blue-text)] font-[Inconsolata]">
            <section className="rounded-sm border border-[var(--retro-border-soft)] bg-[rgba(245,248,255,0.9)] p-4 sm:p-5 backdrop-blur-[1.5px]">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--retro-text-muted)]">
                Blog Articles
              </p>
              <h2 className="mt-2 text-xl sm:text-2xl leading-tight">
                Notes on engineering, product, and interface craft
              </h2>
              <p className="mt-3 text-sm sm:text-[15px] leading-6 text-[var(--retro-text-muted)]">
                Writing about product engineering, tooling, and web performance.
              </p>
            </section>

            <section className="mt-5 space-y-3">
              {articles.length === 0 ? (
                <article className="rounded-sm border border-[var(--retro-border-soft)] bg-[rgba(245,248,255,0.9)] p-4 sm:p-5 backdrop-blur-[1.5px]">
                  <p className="text-sm sm:text-[15px] leading-6 text-[var(--retro-text-muted)]">
                    No blog entries were found in `/content/blog`.
                  </p>
                </article>
              ) : (
                articles.map((article) => {
                  const isInternalArticle = Boolean(article.mdxContent);
                  const hasExternalUrl = Boolean(article.externalUrl);

                  return (
                    <article
                      key={article.id}
                      className="rounded-sm border border-[var(--retro-border-soft)] bg-[rgba(245,248,255,0.9)] p-4 sm:p-5 backdrop-blur-[1.5px]"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="text-base sm:text-lg leading-tight text-[var(--retro-accent-blue-text)]">
                          {article.title}
                        </h3>
                        <span className="shrink-0 text-[11px] tracking-[0.08em] uppercase text-[var(--retro-text-muted)]">
                          {article.source}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.08em] text-[var(--retro-text-muted)]">
                        {formatPublishedDate(article.publishedAt)}
                      </p>
                      <p className="mt-2 text-sm sm:text-[15px] leading-6 text-[var(--retro-text-muted)]">
                        {article.description}
                      </p>
                      {isInternalArticle ? (
                        <button
                          type="button"
                          onClick={() => onOpenArticle?.(article)}
                          className="mt-3 inline-flex items-center justify-center rounded-sm border border-[var(--retro-border)] bg-[var(--retro-surface)] px-3 py-1.5 text-xs uppercase tracking-[0.08em] text-[var(--retro-accent-blue-text)] transition-colors hover:bg-white/60"
                        >
                          Read article
                        </button>
                      ) : hasExternalUrl ? (
                        <a
                          href={article.externalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex items-center justify-center rounded-sm border border-[var(--retro-border)] bg-[var(--retro-surface)] px-3 py-1.5 text-xs uppercase tracking-[0.08em] text-[var(--retro-accent-blue-text)] transition-colors hover:bg-white/60"
                        >
                          Read article
                        </a>
                      ) : null}
                    </article>
                  );
                })
              )}
            </section>
          </div>
        </WindowContentArea>
      </div>
    </div>
  );
}
