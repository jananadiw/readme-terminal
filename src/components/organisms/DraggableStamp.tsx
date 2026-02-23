"use client";

import { useState } from "react";
import Image from "next/image";
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
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const tooltipId = tooltip
    ? `stamp-tip-${src.replaceAll("/", "").replaceAll(".", "-")}`
    : undefined;

  return (
    <m.div
      className="absolute select-none pointer-events-auto"
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
      onMouseEnter={() => setTooltipVisible(true)}
      onMouseLeave={() => setTooltipVisible(false)}
    >
      <button
        type="button"
        data-stamp-interactive
        aria-label={tooltip ? `${alt}. ${tooltip}` : alt}
        aria-describedby={tooltipVisible && tooltipId ? tooltipId : undefined}
        className="block w-full h-full rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D26CC]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F6FC]"
        onPointerDown={(e) => {
          e.stopPropagation();
          if (e.pointerType !== "mouse") {
            setTooltipVisible((visible) => !visible);
          }
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onFocus={() => setTooltipVisible(true)}
        onBlur={() => setTooltipVisible(false)}
      >
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          sizes={`(max-width: 640px) min(42vw, ${size}px), ${size}px`}
          quality={70}
          className="w-full h-full object-contain pointer-events-none"
          style={{ filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.2))" }}
          draggable={false}
          loading="lazy"
        />
      </button>
      <AnimatePresence>
        {tooltipVisible && tooltip && (
          <m.div
            id={tooltipId}
            role="tooltip"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="absolute left-1/2 -translate-x-1/2 mt-2 max-w-[240px] px-3 py-2 bg-[#0D26CC] text-white text-sm leading-5 text-center font-[Inconsolata] whitespace-normal rounded-lg shadow-[0_6px_18px_rgba(0,0,0,0.25)] pointer-events-none"
          >
            {tooltip}
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
}
