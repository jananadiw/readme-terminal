"use client";

import { PointerEvent as ReactPointerEvent, useRef } from "react";
import { cn } from "@/lib/classNames";
import { RETRO_CLASSES } from "@/lib/retroClasses";
import ClassicWindowTitleBar from "../molecules/ClassicWindowTitleBar";
import WindowContentArea from "../molecules/WindowContentArea";

interface BlogDesktopPanelProps {
  onClose: () => void;
  active?: boolean;
  onActivate?: () => void;
  onTitleBarPointerDown?: (event: ReactPointerEvent<HTMLDivElement>) => void;
}

interface BlogPreviewArticle {
  id: string;
  title: string;
  publishedAt: string;
  description: string;
  href: string;
  source: string;
}

const BLOG_PREVIEW_ARTICLES: BlogPreviewArticle[] = [
  {
    id: "building-spinespy",
    title: "Building SpineSpy: An AI-Powered Posture Monitor for macOS",
    publishedAt: "2026-02-01",
    description:
      "How I built a lightweight menubar app that watches my posture without keeping the camera always on.",
    href: "https://www.jananadiw.com/blog/building-spinespy",
    source: "Blog",
  },
  {
    id: "optimizing-nextjs-performance",
    title: "Optimizing Next.js Performance: Achieving Perfect Lighthouse Scores",
    publishedAt: "2024-09-23",
    description:
      "How I optimized my Next.js website to achieve perfect Lighthouse scores.",
    href: "https://dev.to/jnanadiw/optimizing-nextjs-performance-achieving-perfect-lighthouse-scores-24id",
    source: "dev.to",
  },
  {
    id: "aws-cloudfront-invalidations",
    title: "How to Create AWS CloudFront Invalidations",
    publishedAt: "2022-01-05",
    description:
      "A guide to invalidating CloudFront cache for modified S3 objects.",
    href: "https://medium.com/@jananadiw/how-to-create-aws-cloudfront-invalidations-725e445b9816",
    source: "Medium",
  },
];

function formatPublishedDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export default function BlogDesktopPanel({
  onClose,
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
          "relative h-full cursor-default",
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
          className={RETRO_CLASSES.inset}
          viewportClassName="bg-[var(--retro-window)] terminal-scroll"
        >
          <div className="px-4 py-4 sm:px-7 sm:py-6 text-[var(--retro-accent-blue-text)] font-[Inconsolata]">
            <section className="rounded-sm border border-[var(--retro-border-soft)] bg-[var(--retro-window-alt)] p-4 sm:p-5">
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
              {BLOG_PREVIEW_ARTICLES.map((article) => (
                <article
                  key={article.id}
                  className="rounded-sm border border-[var(--retro-border-soft)] bg-[var(--retro-window-alt)] p-4 sm:p-5"
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
                  <a
                    href={article.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center justify-center rounded-sm border border-[var(--retro-border)] bg-[var(--retro-surface)] px-3 py-1.5 text-xs uppercase tracking-[0.08em] text-[var(--retro-accent-blue-text)] transition-colors hover:bg-white/60"
                  >
                    Read article
                  </a>
                </article>
              ))}
            </section>
          </div>
        </WindowContentArea>
      </div>
    </div>
  );
}
