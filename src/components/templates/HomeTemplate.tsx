"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, AnimatePresence, useDragControls } from "framer-motion";
import { useTerminal } from "@/hooks/useTerminal";
import { useWhoami } from "@/hooks/useWhoami";
import { useStampPositions, CANVAS_CENTER } from "@/hooks/useStampPositions";
import { STAMP_TOOLTIPS } from "@/lib/constants";
import DraggableStamp from "@/components/organisms/DraggableStamp";
import TerminalWindow from "@/components/organisms/TerminalWindow";

export default function HomeTemplate() {
  const { content: whoamiContent } = useWhoami();
  const { stampPositions } = useStampPositions();
  const { history, input, setInput, handleSubmit, scrollRef, inputRef, streaming } =
    useTerminal(whoamiContent);

  // Canvas panning state — start at 0, then center on mount (avoids hydration mismatch)
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const gridRef = useRef<HTMLDivElement>(null);

  // Terminal state
  const [minimized, setMinimized] = useState(false);
  const dragControls = useDragControls();
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Center the canvas so CANVAS_CENTER maps to viewport center (client-only)
  useEffect(() => {
    offsetX.set(window.innerWidth / 2 - CANVAS_CENTER.x);
    offsetY.set(window.innerHeight / 2 - CANVAS_CENTER.y);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync dotted grid background position with canvas offset
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

  // Canvas drag: use window-level listeners so pointer events on child
  // elements (stamps, tooltips) never steal or block the drag gesture.
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    // Don't start canvas drag if interacting with the terminal
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

  return (
    <div
      ref={constraintsRef}
      className="h-screen w-screen overflow-hidden relative cursor-grab active:cursor-grabbing"
    >
      {/* Dotted grid background */}
      <div
        ref={gridRef}
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Draggable canvas layer with stamps */}
      <motion.div
        className="absolute inset-0"
        style={{ x: offsetX, y: offsetY, touchAction: "none", willChange: "transform" }}
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
          />
        ))}
      </motion.div>

      {/* Terminal overlay – draggable & minimizable */}
      <div className="absolute inset-0 pointer-events-none z-50">
        <AnimatePresence mode="wait">
          {!minimized ? (
            <motion.div
              key="terminal"
              drag
              dragControls={dragControls}
              dragListener={false}
              dragMomentum={false}
              dragElastic={0}
              dragConstraints={constraintsRef}
              initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
              animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
              exit={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="pointer-events-auto absolute"
              style={{
                left: "50%",
                top: "50%",
              }}
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
            </motion.div>
          ) : (
            <motion.div
              key="minimized-bar"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="pointer-events-auto fixed bottom-6 left-1/2 -translate-x-1/2 cursor-pointer"
              onClick={() => setMinimized(false)}
            >
              <div className="flex items-center gap-3 px-5 py-2.5 bg-[#E8E0D0]/95 backdrop-blur-sm rounded-xl border border-[#D4C5A9] shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FA5053]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                </div>
                <span className="text-[#8B7E6A] text-xs tracking-wide font-medium">
                  lucky — bash
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
