"use client";

import { useRef, useCallback, useEffect, useMemo, useState } from "react";
import {
  LazyMotion,
  domMax,
  m,
  useMotionValue,
  useMotionValueEvent,
  AnimatePresence,
  useDragControls,
  useReducedMotion,
} from "framer-motion";
import { useTerminal } from "@/hooks/useTerminal";
import { useStampPositions, CANVAS_CENTER } from "@/hooks/useStampPositions";
import {
  ABOUT_PANEL_CONTENT,
  DESKTOP_DOCK_ITEMS,
  STAMP_TOOLTIPS,
} from "@/lib/constants";
import { cn } from "@/lib/classNames";
import type { DesktopDockItemId } from "@/lib/types";
import DraggableStamp from "@/components/organisms/DraggableStamp";
import TerminalWindow from "@/components/organisms/TerminalWindow";
import MacTopBar from "@/components/organisms/MacTopBar";
import MacFileDock from "@/components/organisms/MacFileDock";
import AboutDesktopPanel from "@/components/organisms/AboutDesktopPanel";
import ResumeWindow from "@/components/organisms/ResumeWindow";

const STAMP_CULL_MARGIN = 260;
const CANVAS_GRID_SIZE = 28;
const CANVAS_GRID_LINE_COLOR = "#d9dcef";

interface HomeTemplateProps {
  initialWhoamiContent: string;
}

type DesktopWindowId = "terminal" | "about" | "resume";

export default function HomeTemplate({
  initialWhoamiContent,
}: HomeTemplateProps) {
  const { stampPositions } = useStampPositions();
  const {
    history,
    input,
    setInput,
    handleSubmit,
    scrollRef,
    inputRef,
    streaming,
    cancelAutoType,
  } = useTerminal(initialWhoamiContent);
  const prefersReducedMotion = useReducedMotion();

  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const gridRef = useRef<HTMLDivElement>(null);
  const panSyncRafRef = useRef<number | null>(null);
  const latestCanvasOffsetRef = useRef({ x: 0, y: 0 });

  const [isTerminalOpen, setIsTerminalOpen] = useState(true);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [activeWindow, setActiveWindow] = useState<DesktopWindowId | null>("terminal");
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const dragControls = useDragControls();
  const aboutDragControls = useDragControls();
  const resumeDragControls = useDragControls();
  const terminalBoundsRef = useRef<HTMLDivElement>(null);

  const updateGridPosition = useCallback((x: number, y: number) => {
    if (gridRef.current) {
      gridRef.current.style.backgroundPosition = `${((x % CANVAS_GRID_SIZE) + CANVAS_GRID_SIZE) % CANVAS_GRID_SIZE}px ${((y % CANVAS_GRID_SIZE) + CANVAS_GRID_SIZE) % CANVAS_GRID_SIZE}px`;
    }
  }, []);

  const scheduleCanvasOffsetSync = useCallback(() => {
    if (panSyncRafRef.current !== null) return;

    panSyncRafRef.current = requestAnimationFrame(() => {
      panSyncRafRef.current = null;
      setCanvasOffset({ ...latestCanvasOffsetRef.current });
    });
  }, []);

  const syncCanvasState = useCallback(
    (x: number, y: number) => {
      latestCanvasOffsetRef.current = { x, y };
      updateGridPosition(x, y);
      scheduleCanvasOffsetSync();
    },
    [scheduleCanvasOffsetSync, updateGridPosition],
  );

  useEffect(() => {
    const updateViewport = () =>
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });

    const initialX = window.innerWidth / 2 - CANVAS_CENTER.x;
    const initialY = window.innerHeight / 2 - CANVAS_CENTER.y;

    updateViewport();
    offsetX.set(initialX);
    offsetY.set(initialY);
    syncCanvasState(initialX, initialY);

    window.addEventListener("resize", updateViewport);

    return () => {
      if (panSyncRafRef.current !== null) {
        cancelAnimationFrame(panSyncRafRef.current);
      }
      window.removeEventListener("resize", updateViewport);
    };
  }, [offsetX, offsetY, syncCanvasState]);

  useMotionValueEvent(offsetX, "change", (x) => {
    syncCanvasState(x, offsetY.get());
  });

  useMotionValueEvent(offsetY, "change", (y) => {
    syncCanvasState(offsetX.get(), y);
  });

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
      offsetX.set(offsetX.get() + dx);
      offsetY.set(offsetY.get() + dy);
    };
    const onUp = () => {
      dragging.current = false;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [offsetX, offsetY]);

  const focusTerminalInput = useCallback(() => {
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [inputRef]);

  const getFallbackActiveWindow = useCallback(
    (closedWindow: DesktopWindowId) => {
      if (closedWindow !== "terminal" && isTerminalOpen) return "terminal";
      if (closedWindow !== "resume" && isResumeOpen) return "resume";
      if (closedWindow !== "about" && isAboutOpen) return "about";
      return null;
    },
    [isAboutOpen, isResumeOpen, isTerminalOpen],
  );

  const closeTerminalWindow = useCallback(() => {
    setIsTerminalOpen(false);
    setActiveWindow((current) =>
      current === "terminal" ? getFallbackActiveWindow("terminal") : current,
    );
  }, [getFallbackActiveWindow]);

  const closeAboutWindow = useCallback(() => {
    setIsAboutOpen(false);
    setActiveWindow((current) =>
      current === "about" ? getFallbackActiveWindow("about") : current,
    );
  }, [getFallbackActiveWindow]);

  const closeResumeWindow = useCallback(() => {
    setIsResumeOpen(false);
    setActiveWindow((current) =>
      current === "resume" ? getFallbackActiveWindow("resume") : current,
    );
  }, [getFallbackActiveWindow]);

  const openTerminalWindow = useCallback(() => {
    setIsTerminalOpen(true);
    setActiveWindow("terminal");
    focusTerminalInput();
  }, [focusTerminalInput]);

  const openAboutWindow = useCallback(() => {
    setIsAboutOpen(true);
    setActiveWindow("about");
  }, []);

  const openResumeWindow = useCallback(() => {
    setIsResumeOpen(true);
    setActiveWindow("resume");
  }, []);

  const handleDockItemClick = useCallback(
    (id: DesktopDockItemId) => {
      if (id === "about") {
        if (isAboutOpen) {
          closeAboutWindow();
          return;
        }

        openAboutWindow();
        return;
      }

      if (id === "terminal") {
        if (isTerminalOpen) {
          closeTerminalWindow();
          return;
        }

        openTerminalWindow();
        return;
      }

      if (isResumeOpen) {
        closeResumeWindow();
        return;
      }

      openResumeWindow();
    },
    [
      closeAboutWindow,
      closeResumeWindow,
      closeTerminalWindow,
      isAboutOpen,
      isResumeOpen,
      isTerminalOpen,
      openAboutWindow,
      openResumeWindow,
      openTerminalWindow,
    ],
  );

  const handleAboutLinkAction = useCallback(() => {
    openResumeWindow();
  }, [openResumeWindow]);

  useEffect(() => {
    if (activeWindow !== "about" && activeWindow !== "resume") return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (activeWindow === "about") {
          closeAboutWindow();
          return;
        }

        closeResumeWindow();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeWindow, closeAboutWindow, closeResumeWindow]);

  const activeDockIds = useMemo(() => {
    const activeIds: DesktopDockItemId[] = [];
    if (isAboutOpen) {
      activeIds.push("about");
    }
    if (isResumeOpen) {
      activeIds.push("resume");
    }
    if (isTerminalOpen) {
      activeIds.push("terminal");
    }
    return activeIds;
  }, [isAboutOpen, isResumeOpen, isTerminalOpen]);

  const noMotion = prefersReducedMotion ?? false;
  const visibleStamps = useMemo(() => {
    if (!stampPositions) return [];

    if (!viewportSize.width || !viewportSize.height) {
      return [];
    }

    const left = -canvasOffset.x - STAMP_CULL_MARGIN;
    const top = -canvasOffset.y - STAMP_CULL_MARGIN;
    const right = -canvasOffset.x + viewportSize.width + STAMP_CULL_MARGIN;
    const bottom = -canvasOffset.y + viewportSize.height + STAMP_CULL_MARGIN;

    return stampPositions.stamps
      .map((stamp, index) => ({ stamp, index }))
      .filter(({ stamp }) => {
        const x1 = stamp.position.x;
        const y1 = stamp.position.y;
        const x2 = x1 + stamp.size;
        const y2 = y1 + stamp.size;

        return x2 >= left && x1 <= right && y2 >= top && y1 <= bottom;
      });
  }, [
    stampPositions,
    viewportSize.width,
    viewportSize.height,
    canvasOffset.x,
    canvasOffset.y,
  ]);

  return (
    <LazyMotion features={domMax}>
      <div className="h-screen w-screen overflow-hidden relative">
        <MacTopBar />

        <div
          ref={gridRef}
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, ${CANVAS_GRID_LINE_COLOR} 1px, transparent 1px), linear-gradient(to bottom, ${CANVAS_GRID_LINE_COLOR} 1px, transparent 1px)`,
            backgroundSize: `${CANVAS_GRID_SIZE}px ${CANVAS_GRID_SIZE}px`,
          }}
        />

        <div
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          style={{ touchAction: "none" }}
          onPointerDown={onPointerDown}
          aria-hidden="true"
        />

        <m.div
          className="absolute inset-0 pointer-events-none"
          style={{
            x: offsetX,
            y: offsetY,
            willChange: "transform",
          }}
        >
          {visibleStamps.map(({ stamp, index }) => (
            <DraggableStamp
              key={stamp.src}
              src={stamp.src}
              alt={stamp.src.replace("/", "").replace(".png", "")}
              x={stamp.position.x}
              y={stamp.position.y}
              rotation={stamp.rotation}
              size={stamp.size}
              zIndex={10 + index}
              index={index}
              tooltip={STAMP_TOOLTIPS[stamp.src]}
              noMotion={noMotion}
            />
          ))}
        </m.div>

        <div
          ref={terminalBoundsRef}
          className="pointer-events-none absolute inset-x-2 top-8 bottom-24 sm:inset-x-4 sm:top-9 sm:bottom-24"
          aria-hidden="true"
        />

        <div
          className={cn(
            "absolute inset-x-0 top-6 bottom-16 sm:bottom-20 pointer-events-none flex items-center justify-center px-3 sm:px-5",
            activeWindow === "about" ? "z-[62]" : "z-[46]",
          )}
        >
          <AnimatePresence>
            {isAboutOpen && (
              <m.div
                key="about-panel"
                drag
                dragControls={aboutDragControls}
                dragListener={false}
                dragMomentum={false}
                dragElastic={0}
                dragConstraints={terminalBoundsRef}
                initial={noMotion ? false : { opacity: 0, y: 12, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.99 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="pointer-events-auto"
                style={{ willChange: "transform, opacity" }}
              >
                <AboutDesktopPanel
                  content={ABOUT_PANEL_CONTENT}
                  active={activeWindow === "about"}
                  onActivate={() => setActiveWindow("about")}
                  onTitleBarPointerDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    aboutDragControls.start(event);
                  }}
                  onClose={closeAboutWindow}
                  onLinkAction={handleAboutLinkAction}
                />
              </m.div>
            )}
          </AnimatePresence>
        </div>

        <div
          className={cn(
            "absolute inset-x-0 top-6 bottom-16 sm:bottom-20 pointer-events-none flex items-center justify-center px-3 sm:px-5",
            activeWindow === "resume" ? "z-[62]" : "z-[46]",
          )}
        >
          <AnimatePresence>
            {isResumeOpen && (
              <m.div
                key="resume-panel"
                drag
                dragControls={resumeDragControls}
                dragListener={false}
                dragMomentum={false}
                dragElastic={0}
                dragConstraints={terminalBoundsRef}
                initial={noMotion ? false : { opacity: 0, y: 12, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.99 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="pointer-events-auto"
                style={{ willChange: "transform, opacity" }}
              >
                <ResumeWindow
                  active={activeWindow === "resume"}
                  onActivate={() => setActiveWindow("resume")}
                  onTitleBarPointerDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    resumeDragControls.start(event);
                  }}
                  onClose={closeResumeWindow}
                />
              </m.div>
            )}
          </AnimatePresence>
        </div>

        <div
          className={cn(
            "absolute inset-x-0 top-6 bottom-16 sm:bottom-20 pointer-events-none flex items-center justify-center px-2 sm:px-4",
            activeWindow === "terminal" ? "z-[62]" : "z-[46]",
          )}
        >
          <AnimatePresence mode="wait">
            {isTerminalOpen ? (
              <m.div
                key="terminal"
                drag
                dragControls={dragControls}
                dragListener={false}
                dragMomentum={false}
                dragElastic={0}
                dragConstraints={terminalBoundsRef}
                initial={noMotion ? false : { opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 28,
                  mass: 0.8,
                }}
                className="pointer-events-auto"
                style={{ willChange: "transform, opacity" }}
                data-terminal
              >
                <TerminalWindow
                  history={history}
                  input={input}
                  onInputChange={(v) => {
                    cancelAutoType();
                    setInput(v);
                  }}
                  onSubmit={() => {
                    cancelAutoType();
                    handleSubmit();
                  }}
                  onSuggestionClick={(s) => {
                    cancelAutoType();
                    handleSubmit(s);
                  }}
                  inputRef={inputRef}
                  scrollRef={scrollRef}
                  onClose={closeTerminalWindow}
                  dragControls={dragControls}
                  streaming={streaming}
                  active={activeWindow === "terminal"}
                  onActivate={() => setActiveWindow("terminal")}
                />
              </m.div>
            ) : null}
          </AnimatePresence>
        </div>

        <MacFileDock
          items={DESKTOP_DOCK_ITEMS}
          activeIds={activeDockIds}
          onItemClick={handleDockItemClick}
        />
      </div>
    </LazyMotion>
  );
}
