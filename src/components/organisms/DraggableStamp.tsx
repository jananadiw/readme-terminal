"use client";

import { memo, useRef, useState } from "react";
import Image from "next/image";
import { m, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/classNames";
import { RETRO_CLASSES } from "@/lib/retroClasses";

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
  isMobileView?: boolean;
  mobileActive?: boolean;
  onMobileTooltipToggle?: (stampSrc: string) => void;
}

function DraggableStamp({
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
  isMobileView = false,
  mobileActive = false,
  onMobileTooltipToggle,
}: StampProps) {
  const [desktopTooltipVisible, setDesktopTooltipVisible] = useState(false);
  const touchTapStateRef = useRef<{
    pointerId: number | null;
    x: number;
    y: number;
    moved: boolean;
  }>({ pointerId: null, x: 0, y: 0, moved: false });

  const tooltipVisible = !isMobileView && desktopTooltipVisible;
  const tooltipId = tooltip
    ? `stamp-tip-${src.replaceAll("/", "").replaceAll(".", "-")}`
    : undefined;

  return (
    <m.div
      className="absolute select-none pointer-events-auto"
      initial={noMotion ? false : { opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: isMobileView && mobileActive ? 1.03 : 1,
        rotate: rotation,
      }}
      transition={{
        opacity: { duration: 0.34, delay: index * 0.014, ease: "easeOut" },
        rotate: { duration: 0.36, delay: index * 0.014, ease: "easeOut" },
        scale: { type: "spring", stiffness: 420, damping: 32, mass: 0.6 },
      }}
      whileHover={
        isMobileView
          ? undefined
          : {
              scale: 1.04,
              transition: { type: "spring", stiffness: 400, damping: 25 },
            }
      }
      whileTap={{
        scale: isMobileView ? 0.985 : 0.99,
        transition: { duration: 0.08, ease: "easeOut" },
      }}
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        zIndex,
        willChange: "transform, opacity",
        WebkitUserSelect: "none",
        userSelect: "none",
        WebkitTouchCallout: "none",
      }}
      onMouseEnter={() => {
        if (!isMobileView) setDesktopTooltipVisible(true);
      }}
      onMouseLeave={() => {
        if (!isMobileView) setDesktopTooltipVisible(false);
      }}
    >
      <button
        type="button"
        data-stamp-interactive
        aria-label={tooltip ? `${alt}. ${tooltip}` : alt}
        aria-describedby={tooltipVisible && tooltipId ? tooltipId : undefined}
        className={cn(
          "block w-full h-full rounded-sm",
          RETRO_CLASSES.focusRing,
          RETRO_CLASSES.stampFocusOffset,
          "select-none touch-manipulation"
        )}
        onPointerDown={(e) => {
          e.stopPropagation();
          if (!isMobileView || e.pointerType === "mouse") return;
          touchTapStateRef.current = {
            pointerId: e.pointerId,
            x: e.clientX,
            y: e.clientY,
            moved: false,
          };
        }}
        onPointerMove={(e) => {
          if (!isMobileView || e.pointerType === "mouse") return;
          if (touchTapStateRef.current.pointerId !== e.pointerId) return;

          const dx = e.clientX - touchTapStateRef.current.x;
          const dy = e.clientY - touchTapStateRef.current.y;
          if (Math.hypot(dx, dy) > 8) {
            touchTapStateRef.current.moved = true;
          }
        }}
        onPointerUp={(e) => {
          e.stopPropagation();
          if (!isMobileView || e.pointerType === "mouse") return;
          if (touchTapStateRef.current.pointerId !== e.pointerId) return;

          if (!touchTapStateRef.current.moved) {
            onMobileTooltipToggle?.(src);
          }
          touchTapStateRef.current.pointerId = null;
        }}
        onPointerCancel={(e) => {
          if (touchTapStateRef.current.pointerId === e.pointerId) {
            touchTapStateRef.current.pointerId = null;
          }
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onFocus={() => {
          if (!isMobileView) setDesktopTooltipVisible(true);
        }}
        onBlur={() => {
          if (!isMobileView) setDesktopTooltipVisible(false);
        }}
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
      <AnimatePresence initial={false}>
        {tooltipVisible && tooltip && (
          <m.div
            id={tooltipId}
            role="tooltip"
            initial={noMotion ? false : { opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={noMotion ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.98 }}
            transition={
              noMotion
                ? { duration: 0.08, ease: "linear" }
                : { type: "spring", stiffness: 480, damping: 34, mass: 0.62 }
            }
            className={cn(
              "absolute left-1/2 -translate-x-1/2 mt-2 w-[220px] max-w-[calc(100vw-2rem)] px-3 py-2 text-xs sm:text-sm leading-5 text-center font-[Inconsolata] whitespace-normal pointer-events-none",
              RETRO_CLASSES.tooltip
            )}
            style={{ textWrap: "balance" }}
          >
            {tooltip}
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
}

export default memo(DraggableStamp);
