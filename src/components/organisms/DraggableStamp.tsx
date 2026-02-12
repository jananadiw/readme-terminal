"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface DraggableStampProps {
  src: string;
  alt: string;
  x: number;
  y: number;
  rotation?: number;
  size?: number;
  zIndex?: number;
  index?: number;
  onBringToFront?: () => void;
}

export default function DraggableStamp({
  src,
  alt,
  x,
  y,
  rotation = 0,
  size = 160,
  zIndex = 10,
  index = 0,
  onBringToFront,
}: DraggableStampProps) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const startRef = useRef({ x: 0, y: 0 });

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      onBringToFront?.();
      dragging.current = true;
      startRef.current = { x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [dragOffset, onBringToFront],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      setDragOffset({
        x: e.clientX - startRef.current.x,
        y: e.clientY - startRef.current.y,
      });
    },
    [],
  );

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <motion.div
      className="absolute select-none cursor-grab active:cursor-grabbing"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.03, ease: "easeOut" }}
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
        zIndex,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain pointer-events-none"
        style={{ filter: "drop-shadow(0 10px 15px rgba(0, 0, 0, 0.2))" }}
        draggable={false}
      />
    </motion.div>
  );
}
