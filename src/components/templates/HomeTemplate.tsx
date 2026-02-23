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
import { STAMP_TOOLTIPS } from "@/lib/constants";
import DraggableStamp from "@/components/organisms/DraggableStamp";
import TerminalWindow from "@/components/organisms/TerminalWindow";

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
  const [mounted, setMounted] = useState(false);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const dragControls = useDragControls();
  const constraintsRef = useRef<HTMLDivElement>(null);

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
        ref={constraintsRef}
        className="h-screen w-screen overflow-hidden relative cursor-grab active:cursor-grabbing"
        style={{
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.35s ease-out",
        }}
      >
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

        <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {!minimized ? (
              <m.div
                key="terminal"
                drag
                dragControls={dragControls}
                dragListener={false}
                dragMomentum={false}
                dragElastic={0}
                dragConstraints={constraintsRef}
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
                  onMinimize={() => setMinimized(true)}
                  dragControls={dragControls}
                  streaming={streaming}
                />
              </m.div>
            ) : (
              <m.button
                key="minimized-bar"
                type="button"
                aria-label="Restore terminal window"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="pointer-events-auto fixed bottom-6 left-1/2 -translate-x-1/2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D26CC]/35"
                onClick={() => setMinimized(false)}
              >
                <div className="flex items-center gap-3 px-5 py-2.5 bg-[#E8EDF8]/98 backdrop-blur-sm rounded-xl border border-[#C8CFDD] shadow-lg hover:shadow-xl transition-shadow duration-200">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FA5053]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                  </div>
                  <span className="text-[#535A6A] text-xs tracking-[0.12em] font-semibold">
                    lucky — bash
                  </span>
                </div>
              </m.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </LazyMotion>
  );
}
