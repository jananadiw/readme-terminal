"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
}: StampProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="absolute select-none"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: rotation,
      }}
      transition={{ duration: 0.4, delay: index * 0.03, ease: "easeOut" }}
      whileHover={{ scale: 1.05 }}
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        zIndex,
        willChange: "transform",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain pointer-events-none"
        style={{ filter: "drop-shadow(0 10px 15px rgba(0, 0, 0, 0.2))" }}
        draggable={false}
      />
      <AnimatePresence>
        {hovered && tooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 -translate-x-1/2 mt-2 px-4 py-2 bg-[#FF6B35] text-white text-sm font-[Inconsolata] whitespace-nowrap rounded-lg border-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.25)] pointer-events-none"
          >
            {tooltip}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
