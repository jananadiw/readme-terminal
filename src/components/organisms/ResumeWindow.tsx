"use client";

import Image from "next/image";
import {
  PointerEvent as ReactPointerEvent,
  useEffect,
  useState,
} from "react";
import { cn } from "@/lib/classNames";
import { RETRO_CLASSES } from "@/lib/retroClasses";
import ClassicWindowTitleBar from "../molecules/ClassicWindowTitleBar";
import WindowContentArea from "../molecules/WindowContentArea";

interface ResumeWindowProps {
  active?: boolean;
  onClose: () => void;
  onActivate?: () => void;
  onTitleBarPointerDown?: (event: ReactPointerEvent<HTMLDivElement>) => void;
}

interface ResumePreviewPage {
  height: number;
  pageNumber: number;
  src: string;
  width: number;
}

const RESUME_PDF_PATH = "/resume.pdf";
const RESUME_PDF_WORKER_PATH = "/pdf.worker.min.mjs";
const RESUME_RENDER_WIDTH = 760;

function ResumePreview({ active }: { active: boolean }) {
  const [pages, setPages] = useState<ResumePreviewPage[]>([]);
  const [previewState, setPreviewState] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    let disposed = false;
    const pageUrls: string[] = [];

    const renderPdfPreview = async () => {
      try {
        setPreviewState("loading");

        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        pdfjs.GlobalWorkerOptions.workerSrc = RESUME_PDF_WORKER_PATH;

        const loadingTask = pdfjs.getDocument(RESUME_PDF_PATH);
        const pdf = await loadingTask.promise;
        const nextPages: ResumePreviewPage[] = [];
        const pixelRatio = window.devicePixelRatio || 1;

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          if (disposed) {
            await pdf.destroy();
            return;
          }

          const page = await pdf.getPage(pageNumber);
          const baseViewport = page.getViewport({ scale: 1 });
          const scale = RESUME_RENDER_WIDTH / baseViewport.width;
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          if (!context) {
            throw new Error("Unable to create canvas context.");
          }

          canvas.width = Math.floor(viewport.width * pixelRatio);
          canvas.height = Math.floor(viewport.height * pixelRatio);
          context.scale(pixelRatio, pixelRatio);

          await page.render({
            canvas,
            canvasContext: context,
            viewport,
          }).promise;

          const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((value) => {
              if (value) {
                resolve(value);
                return;
              }

              reject(new Error("Unable to create preview image."));
            }, "image/png");
          });

          page.cleanup();

          if (disposed) {
            await pdf.destroy();
            return;
          }

          const src = URL.createObjectURL(blob);
          pageUrls.push(src);
          nextPages.push({
            height: viewport.height,
            pageNumber,
            src,
            width: viewport.width,
          });
        }

        await pdf.destroy();

        if (disposed) {
          return;
        }

        setPages(nextPages);
        setPreviewState("ready");
      } catch {
        if (disposed) {
          return;
        }

        pageUrls.forEach((url) => URL.revokeObjectURL(url));
        setPages([]);
        setPreviewState("error");
      }
    };

    void renderPdfPreview();

    return () => {
      disposed = true;
      pageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <WindowContentArea
      active={active}
      aria-label="Resume preview"
      horizontalScrollbar
      className={cn("h-full min-h-0 w-full", RETRO_CLASSES.inset)}
      viewportClassName="bg-[var(--retro-window)] terminal-scroll"
    >
      {previewState === "loading" ? (
        <div className="flex min-h-full items-center justify-center px-5 py-8">
          <div className="text-center font-[Inconsolata] text-[13px] tracking-[0.05em] text-[var(--retro-text-muted)]">
            Rendering resume preview...
          </div>
        </div>
      ) : null}

      {previewState === "error" ? (
        <div className="flex min-h-full items-center justify-center px-5 py-8">
          <div className="max-w-sm text-center font-[Inconsolata] text-[13px] leading-6 text-[var(--retro-text-muted)]">
            Preview is unavailable in this browser. Use the download button to get
            the original PDF.
          </div>
        </div>
      ) : null}

      {previewState === "ready" ? (
        <div className="flex min-w-full w-max flex-col gap-5 px-4 py-4 sm:px-6 sm:py-6">
          {pages.map((page) => (
            <figure
              key={page.pageNumber}
              className="mx-auto"
              style={{ width: `${page.width}px` }}
            >
              <div className="overflow-hidden rounded-sm border border-[var(--retro-border-soft)] bg-white shadow-[0_10px_22px_rgba(28,33,50,0.08)]">
                <Image
                  unoptimized
                  src={page.src}
                  alt={`Resume page ${page.pageNumber}`}
                  width={Math.round(page.width)}
                  height={Math.round(page.height)}
                  className="block h-auto w-full"
                />
              </div>
              {pages.length > 1 ? (
                <figcaption className="pt-2 text-center font-[Inconsolata] text-[11px] tracking-[0.08em] text-[var(--retro-text-muted)]">
                  Page {page.pageNumber}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      ) : null}
    </WindowContentArea>
  );
}

export default function ResumeWindow({
  active = true,
  onClose,
  onActivate,
  onTitleBarPointerDown,
}: ResumeWindowProps) {
  return (
    <div
      data-resume-window
      className="pointer-events-auto h-[min(82dvh,760px)] max-h-[calc(100dvh-6.5rem)] min-h-[360px] w-[min(95vw,940px)]"
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
          title="Resume"
          active={active}
          primaryActionLabel="Close resume window"
          primaryActionIcon="close"
          onPrimaryAction={onClose}
          className="cursor-grab select-none active:cursor-grabbing"
          onBarPointerDown={onTitleBarPointerDown}
        />

        <div
          className={cn(
            "flex items-center justify-between gap-3 px-3 py-2 sm:px-4",
            RETRO_CLASSES.toolbarRow,
          )}
        >
          <div className="min-w-0">
            <p className="truncate font-[Inconsolata] text-[11px] tracking-[0.08em] text-[var(--retro-text-chrome)]">
              resume.pdf
            </p>
            <p className="truncate text-[11px] text-[var(--retro-text-muted)]">
              View it here or download the original PDF.
            </p>
          </div>

          <a
            href={RESUME_PDF_PATH}
            download
            aria-label="Download resume PDF"
            className={cn(
              RETRO_CLASSES.buttonBase,
              RETRO_CLASSES.primaryButton,
              RETRO_CLASSES.focusRing,
              "shrink-0",
            )}
          >
            Download
          </a>
        </div>

        <div className="min-h-0 flex-1 p-2 sm:p-3">
          <ResumePreview active={active} />
        </div>
      </div>
    </div>
  );
}
