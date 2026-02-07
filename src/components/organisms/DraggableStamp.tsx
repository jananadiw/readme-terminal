"use client";

import { motion } from "framer-motion";

interface DraggableStampProps {
  src: string;
  alt: string;
  initialX: number;
  initialY: number;
  initialRotation?: number;
  size?: number;
  zIndex?: number;
}

export default function DraggableStamp({
  src,
  alt,
  initialX,
  initialY,
  initialRotation = 0,
  size = 160,
  zIndex = 10,
}: DraggableStampProps) {
  return (
    <motion.div
      drag
      dragMomentum={true}
      dragTransition={{
        power: 0.3,
        restDelta: 2,
        timeConstant: 200,
      }}
      initial={{
        rotate: initialRotation,
      }}
      whileTap={{
        scale: 0.98,
        cursor: "grabbing",
      }}
      style={{
        width: size,
        height: size,
        zIndex,
        cursor: "grab",
        position: "absolute",
        left: initialX,
        top: initialY,
      }}
      className="select-none"
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain pointer-events-none"
        style={{
          filter: "drop-shadow(0 10px 15px rgba(0, 0, 0, 0.2))",
        }}
        draggable={false}
      />
    </motion.div>
  );
}
