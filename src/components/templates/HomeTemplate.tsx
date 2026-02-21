"use client";

import { useRef, useCallback, useEffect, useState } from "react";
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

  const [minimized, setMinimized] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dragControls = useDragControls();
  const constraintsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    offsetX.set(window.innerWidth / 2 - CANVAS_CENTER.x);
    offsetY.set(window.innerHeight / 2 - CANVAS_CENTER.y);
    requestAnimationFrame(() => setMounted(true));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useMotionValueEvent(offsetX, "change", (x) => {
    if (gridRef.current) {
      const y = offsetY.get();
      gridRef.current.style.backgroundPosition = `${((x % 24) + 24) % 24}px ${((y % 24) + 24) % 24}px`;
    }
  });
  useMotionValueEvent(offsetY, "change", (y) => {
    if (gridRef.current) {
      const x = offsetX.get();
      gridRef.current.style.backgroundPosition = `${((x % 24) + 24) % 24}px ${((y % 24) + 24) % 24}px`;
    }
  });

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-terminal]")) return;
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

        <m.div
          className="absolute inset-0"
          style={{
            x: offsetX,
            y: offsetY,
            touchAction: "none",
            willChange: "transform",
          }}
          onPointerDown={onPointerDown}
        >
          {stampPositions?.stamps.map((stamp, i) => (
            <DraggableStamp
              key={stamp.src}
              src={stamp.src}
              alt={stamp.src.replace("/", "").replace(".png", "")}
              x={stamp.position.x}
              y={stamp.position.y}
              rotation={stamp.rotation}
              size={stamp.size}
              zIndex={10 + i}
              index={i}
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
              <m.div
                key="minimized-bar"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="pointer-events-auto fixed bottom-6 left-1/2 -translate-x-1/2 cursor-pointer"
                onClick={() => setMinimized(false)}
              >
                <div className="flex items-center gap-3 px-5 py-2.5 bg-[#DADCEA]/95 backdrop-blur-sm rounded-xl border border-[#DADCEA] shadow-lg hover:shadow-xl transition-shadow duration-200">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FA5053]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                  </div>
                  <span className="text-[#8B7E6A] text-xs tracking-wide font-medium">
                    lucky — bash
                  </span>
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </LazyMotion>
  );
}
