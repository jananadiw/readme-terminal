"use client";

import {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  useRef,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/classNames";
import { RETRO_CLASSES } from "@/lib/retroClasses";
import type { BlogPreviewArticle } from "@/lib/types";
import ClassicWindowTitleBar from "../molecules/ClassicWindowTitleBar";
import WindowContentArea from "../molecules/WindowContentArea";

interface BlogArticleWindowProps {
  article: BlogPreviewArticle;
  onClose: () => void;
  active?: boolean;
  onActivate?: () => void;
  onTitleBarPointerDown?: (event: ReactPointerEvent<HTMLDivElement>) => void;
}

const ARTICLE_VIEWPORT_BACKGROUND: CSSProperties = {
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

export default function BlogArticleWindow({
  article,
  onClose,
  active = true,
  onActivate,
  onTitleBarPointerDown,
}: BlogArticleWindowProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div
      data-blog-article-window
      className="pointer-events-auto h-[min(82dvh,760px)] max-h-[calc(100dvh-7.5rem)] sm:max-h-[calc(100dvh-6.5rem)] min-h-[320px] sm:min-h-[360px] w-[min(96vw,1020px)]"
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
        {active ? (
          <div className="absolute left-[18%] top-0 h-2 w-10 bg-[var(--retro-accent-blue)]" />
        ) : null}

        <ClassicWindowTitleBar
          title="Blog Article"
          active={active}
          primaryActionLabel="Close article window"
          primaryActionIcon="close"
          onPrimaryAction={onClose}
          className="cursor-grab active:cursor-grabbing select-none"
          onBarPointerDown={onTitleBarPointerDown}
        />

        <WindowContentArea
          ref={contentRef}
          active={active}
          aria-label={article.title}
          className={cn("h-full min-h-0 w-full", RETRO_CLASSES.inset)}
          viewportClassName="terminal-scroll"
          style={ARTICLE_VIEWPORT_BACKGROUND}
        >
          <article className="px-4 py-4 sm:px-7 sm:py-6 text-[var(--retro-accent-blue-text)] font-[Inconsolata]">
            <header className="rounded-sm border border-[var(--retro-border-soft)] bg-[rgba(245,248,255,0.9)] p-4 sm:p-5 backdrop-blur-[1.5px]">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--retro-text-muted)]">
                {article.source}
              </p>
              <h2 className="mt-2 text-xl sm:text-2xl leading-tight">
                {article.title}
              </h2>
              <p className="mt-2 text-[11px] uppercase tracking-[0.08em] text-[var(--retro-text-muted)]">
                {formatPublishedDate(article.publishedAt)}
              </p>
            </header>

            <div className="mt-4 rounded-sm border border-[var(--retro-border-soft)] bg-[rgba(245,248,255,0.9)] p-4 sm:p-5 backdrop-blur-[1.5px]">
              <div
                className={cn(
                  "text-sm sm:text-[15px] leading-6 text-[var(--retro-accent-blue-text)]",
                  "[&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:leading-tight",
                  "[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:leading-tight",
                  "[&_p]:my-3 [&_ul]:my-3 [&_ol]:my-3 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6",
                  "[&_li]:mb-1.5 [&_table]:w-full [&_table]:border-collapse [&_table]:text-left [&_th]:border [&_th]:border-[var(--retro-border-soft)] [&_th]:bg-[rgba(220,226,244,0.45)] [&_th]:px-2 [&_th]:py-1",
                  "[&_td]:border [&_td]:border-[var(--retro-border-soft)] [&_td]:px-2 [&_td]:py-1",
                  "[&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-sm [&_pre]:border [&_pre]:border-[var(--retro-border-soft)] [&_pre]:bg-[var(--retro-window)] [&_pre]:p-3",
                  "[&_code]:font-[Inconsolata] [&_code]:text-[13px]",
                  "[&_img]:my-4 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-sm [&_img]:border [&_img]:border-[var(--retro-border-soft)]"
                )}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="retro-inline-link"
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {article.mdxContent ?? ""}
                </ReactMarkdown>
              </div>
            </div>
          </article>
        </WindowContentArea>
      </div>
    </div>
  );
}
