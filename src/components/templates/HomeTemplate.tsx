"use client";

import { useRef, useCallback, useEffect, useMemo, useState } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  useMotionValue,
  useMotionValueEvent,
  AnimatePresence,
  useDragControls,
  useReducedMotion,
} from "framer-motion";
import { useTerminal } from "@/hooks/useTerminal";
import { useWhoami } from "@/hooks/useWhoami";
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

const STAMP_CULL_MARGIN = 260;

export default function HomeTemplate() {
  const { content: whoamiContent } = useWhoami();
  const { stampPositions } = useStampPositions();
  const {
    history,
    input,
    setInput,
    handleSubmit,
    scrollRef,
    inputRef,
    streaming,
  } = useTerminal(whoamiContent);
  const prefersReducedMotion = useReducedMotion();

  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const gridRef = useRef<HTMLDivElement>(null);
  const panSyncRafRef = useRef<number | null>(null);
  const latestCanvasOffsetRef = useRef({ x: 0, y: 0 });

  const [minimized, setMinimized] = useState(false);
  const [activeDockPanelId, setActiveDockPanelId] =
    useState<DesktopDockItemId | null>(null);
  const [activeWindow, setActiveWindow] = useState<"terminal" | "about" | null>(
    "terminal"
  );
  const [mounted, setMounted] = useState(false);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const dragControls = useDragControls();
  const terminalBoundsRef = useRef<HTMLDivElement>(null);

  const updateGridPosition = useCallback((x: number, y: number) => {
    if (gridRef.current) {
      gridRef.current.style.backgroundPosition = `${((x % 24) + 24) % 24}px ${((y % 24) + 24) % 24}px`;
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
    [scheduleCanvasOffsetSync, updateGridPosition]
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

    const mountRaf = requestAnimationFrame(() => setMounted(true));
    window.addEventListener("resize", updateViewport);

    return () => {
      cancelAnimationFrame(mountRaf);
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

  const hideTerminalWindow = useCallback(() => {
    setMinimized(true);
    setActiveWindow(activeDockPanelId === "about" ? "about" : null);
  }, [activeDockPanelId]);

  const handleDockItemClick = useCallback(
    (id: DesktopDockItemId) => {
      if (id === "about") {
        setActiveDockPanelId((current) => {
          const next = current === "about" ? null : "about";
          setActiveWindow(next ? "about" : minimized ? null : "terminal");
          return next;
        });
        return;
      }

      if (id === "terminal") {
        setMinimized(false);
        setActiveWindow("terminal");
        focusTerminalInput();
        return;
      }

      // Resume shortcut is visual-only for now (icon placeholder per current scope).
    },
    [focusTerminalInput, minimized]
  );

  const handleAboutLinkAction = useCallback(
    (action: "terminal" | "resume") => {
      if (action === "terminal") {
        setMinimized(false);
        setActiveWindow("terminal");
        focusTerminalInput();
      }
      // Resume action intentionally left as a placeholder for a future file/link.
    },
    [focusTerminalInput]
  );

  useEffect(() => {
    if (activeDockPanelId !== "about") return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveDockPanelId(null);
        setActiveWindow(minimized ? null : "terminal");
      }
    };

    const onPointerDownOutside = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      if (
        target.closest("[data-about-panel]") ||
        target.closest("[data-file-dock]") ||
        target.closest("[data-terminal]")
      ) {
        return;
      }

      setActiveDockPanelId(null);
      setActiveWindow(minimized ? null : "terminal");
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDownOutside);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDownOutside);
    };
  }, [activeDockPanelId, minimized]);

  const activeDockIds = useMemo(() => {
    const activeIds: DesktopDockItemId[] = [];
    if (activeDockPanelId === "about" && activeWindow === "about") {
      activeIds.push("about");
    }
    if (!minimized && activeWindow === "terminal") {
      activeIds.push("terminal");
    }
    return activeIds;
  }, [activeDockPanelId, minimized, activeWindow]);

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
    <LazyMotion features={domAnimation}>
      <div
        className="h-screen w-screen overflow-hidden relative cursor-grab active:cursor-grabbing"
        style={{
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.35s ease-out",
        }}
      >
        <MacTopBar />

        <div
          ref={gridRef}
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div
          className="absolute inset-0"
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

        <AnimatePresence>
          {activeDockPanelId === "about" && (
            <m.div
              key="about-panel"
              initial={noMotion ? false : { opacity: 0, y: 12, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.99 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className={activeWindow === "about" ? "relative z-[62]" : "relative z-[46]"}
            >
              <AboutDesktopPanel
                content={ABOUT_PANEL_CONTENT}
                active={activeWindow === "about"}
                onActivate={() => setActiveWindow("about")}
                onClose={() => {
                  setActiveDockPanelId(null);
                  setActiveWindow(minimized ? null : "terminal");
                }}
                onLinkAction={handleAboutLinkAction}
              />
            </m.div>
          )}
        </AnimatePresence>

        <div
          className={cn(
            "absolute inset-x-0 top-6 bottom-16 sm:bottom-20 pointer-events-none flex items-center justify-center px-2 sm:px-4",
            activeWindow === "terminal" ? "z-[62]" : "z-[46]"
          )}
        >
          <AnimatePresence mode="wait">
            {!minimized ? (
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
                  onInputChange={setInput}
                  onSubmit={() => handleSubmit()}
                  onSuggestionClick={handleSubmit}
                  inputRef={inputRef}
                  scrollRef={scrollRef}
                  onClose={hideTerminalWindow}
                  onMinimize={hideTerminalWindow}
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
