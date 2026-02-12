"use client";

import { useRef, useState, useCallback } from "react";
import { useTerminal } from "@/hooks/useTerminal";
import { useWhoami } from "@/hooks/useWhoami";
import { useStampPositions } from "@/hooks/useStampPositions";
import DraggableStamp from "@/components/organisms/DraggableStamp";
import TerminalWindow from "@/components/organisms/TerminalWindow";

export default function HomeTemplate() {
  const { content: whoamiContent } = useWhoami();
  const { stampPositions } = useStampPositions();
  const { history, input, setInput, handleSubmit, bottomRef, inputRef } =
    useTerminal(whoamiContent);

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [topIndex, setTopIndex] = useState(-1);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  }, []);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden relative cursor-grab active:cursor-grabbing">
      {/* Dotted grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          backgroundPosition: `${offset.x % 24}px ${offset.y % 24}px`,
        }}
      />

      {/* Draggable background layer with stamps */}
      <div
        className="absolute inset-0"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
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
            zIndex={topIndex === i ? 100 : 10 + i}
            index={i}
            onBringToFront={() => setTopIndex(i)}
          />
        ))}
      </div>

      {/* Fixed terminal overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
        <div className="pointer-events-auto">
          <TerminalWindow
            history={history}
            input={input}
            onInputChange={setInput}
            onSubmit={() => handleSubmit()}
            onSuggestionClick={handleSubmit}
            inputRef={inputRef}
            bottomRef={bottomRef}
          />
        </div>
      </div>
    </div>
  );
}
