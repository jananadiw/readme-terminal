"use client";

import { useState } from "react";
import { m, AnimatePresence } from "framer-motion";

interface StampProps {
  src: string;
  alt: string;
  x: number;
  y: number;
  rotation?: number;
  size?: number;
  zIndex?: number;
  index?: number;
  tooltip?: string;
  noMotion?: boolean;
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
  tooltip,
  noMotion = false,
}: StampProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <m.div
      className="absolute select-none"
      initial={noMotion ? false : { opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, rotate: rotation }}
      transition={{
        duration: 0.45,
        delay: index * 0.02,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        scale: 1.04,
        transition: { type: "spring", stiffness: 400, damping: 25 },
      }}
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        zIndex,
        willChange: "transform, opacity",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain pointer-events-none"
        style={{ filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.2))" }}
        draggable={false}
        loading="lazy"
      />
      <AnimatePresence>
        {hovered && tooltip && (
          <m.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="absolute left-1/2 -translate-x-1/2 mt-2 px-4 py-2 bg-[#0D26CC] text-white text-sm font-[Inconsolata] whitespace-nowrap rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.25)] pointer-events-none"
          >
            {tooltip}
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
}
