import {
  forwardRef,
  HTMLAttributes,
  KeyboardEvent,
  PointerEvent as ReactPointerEvent,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/classNames";
import { RETRO_CLASSES } from "@/lib/retroClasses";

const SCROLL_BUTTON_SIZE = 15;
const MIN_THUMB_SIZE = 14;

type ScrollAxis = "x" | "y";

interface WindowContentAreaProps extends HTMLAttributes<HTMLDivElement> {
  keyboardScrollable?: boolean;
  active?: boolean;
  viewportClassName?: string;
  horizontalScrollbar?: boolean;
}

function getScrollDeltaY(key: string, el: HTMLDivElement) {
  const lineStep = 32;
  const pageStep = Math.max(el.clientHeight - 32, 48);

  switch (key) {
    case "ArrowUp":
      return { top: -lineStep };
    case "ArrowDown":
      return { top: lineStep };
    case "PageUp":
      return { top: -pageStep };
    case "PageDown":
      return { top: pageStep };
    case "Home":
      return { top: -el.scrollTop };
    case "End":
      return { top: el.scrollHeight };
    default:
      return null;
  }
}

function getScrollDeltaX(key: string, el: HTMLDivElement) {
  const lineStep = 32;
  const pageStep = Math.max(el.clientWidth - 32, 48);

  switch (key) {
    case "ArrowLeft":
      return { left: -lineStep };
    case "ArrowRight":
      return { left: lineStep };
    case "PageUp":
      return { left: -pageStep };
    case "PageDown":
      return { left: pageStep };
    case "Home":
      return { left: -el.scrollLeft };
    case "End":
      return { left: el.scrollWidth };
    default:
      return null;
  }
}

interface ScrollMetrics {
  scrollTop: number;
  scrollLeft: number;
  scrollHeight: number;
  scrollWidth: number;
  clientHeight: number;
  clientWidth: number;
}

const EMPTY_METRICS: ScrollMetrics = {
  scrollTop: 0,
  scrollLeft: 0,
  scrollHeight: 0,
  scrollWidth: 0,
  clientHeight: 0,
  clientWidth: 0,
};

function readMetrics(el: HTMLDivElement): ScrollMetrics {
  return {
    scrollTop: el.scrollTop,
    scrollLeft: el.scrollLeft,
    scrollHeight: el.scrollHeight,
    scrollWidth: el.scrollWidth,
    clientHeight: el.clientHeight,
    clientWidth: el.clientWidth,
  };
}

function axisThumbMetrics(metrics: ScrollMetrics, axis: ScrollAxis) {
  const client = axis === "y" ? metrics.clientHeight : metrics.clientWidth;
  const scrollSize = axis === "y" ? metrics.scrollHeight : metrics.scrollWidth;
  const scrollOffset = axis === "y" ? metrics.scrollTop : metrics.scrollLeft;
  const maxScroll = Math.max(scrollSize - client, 0);
  const trackSize = Math.max(client - SCROLL_BUTTON_SIZE * 2, 0);

  if (!trackSize || !client || !scrollSize) {
    return {
      trackSize,
      thumbSize: trackSize,
      thumbPos: 0,
      maxScroll,
      pageStep: Math.max(client - 32, 48),
    };
  }

  const rawThumbSize = (client / scrollSize) * trackSize;
  const thumbSize = maxScroll
    ? Math.min(trackSize, Math.max(MIN_THUMB_SIZE, rawThumbSize))
    : trackSize;
  const thumbTravel = Math.max(trackSize - thumbSize, 0);
  const thumbPos = maxScroll ? (scrollOffset / maxScroll) * thumbTravel : 0;

  return {
    trackSize,
    thumbSize,
    thumbPos,
    maxScroll,
    pageStep: Math.max(client - 32, 48),
  };
}

function ScrollArrow({
  direction,
}: {
  direction: "up" | "down" | "left" | "right";
}) {
  if (direction === "up") {
    return (
      <span className="h-0 w-0 border-x-[4px] border-x-transparent border-b-[6px] border-b-[var(--retro-text-chrome)]" />
    );
  }
  if (direction === "down") {
    return (
      <span className="h-0 w-0 border-x-[4px] border-x-transparent border-t-[6px] border-t-[var(--retro-text-chrome)]" />
    );
  }
  if (direction === "left") {
    return (
      <span className="h-0 w-0 border-y-[4px] border-y-transparent border-r-[6px] border-r-[var(--retro-text-chrome)]" />
    );
  }
  return (
    <span className="h-0 w-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-[var(--retro-text-chrome)]" />
  );
}

function WindowContentAreaImpl(
  {
    keyboardScrollable = true,
    active = true,
    horizontalScrollbar = false,
    className,
    viewportClassName,
    tabIndex,
    onKeyDown,
    onScroll,
    children,
    ...props
  }: WindowContentAreaProps,
  ref: Ref<HTMLDivElement>
) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState<ScrollMetrics>(EMPTY_METRICS);
  const dragStateRef = useRef<{
    axis: ScrollAxis;
    pointerId: number;
    startCoord: number;
    startScroll: number;
  } | null>(null);

  useImperativeHandle(ref, () => viewportRef.current as HTMLDivElement, []);

  const syncMetrics = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const next = readMetrics(el);

    setMetrics((prev) => {
      if (
        prev.scrollTop === next.scrollTop &&
        prev.scrollLeft === next.scrollLeft &&
        prev.scrollHeight === next.scrollHeight &&
        prev.scrollWidth === next.scrollWidth &&
        prev.clientHeight === next.clientHeight &&
        prev.clientWidth === next.clientWidth
      ) {
        return prev;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    syncMetrics();

    const el = viewportRef.current;
    if (!el) return;

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => syncMetrics())
        : null;

    resizeObserver?.observe(el);
    if (el.firstElementChild instanceof HTMLElement) {
      resizeObserver?.observe(el.firstElementChild);
    }

    window.addEventListener("resize", syncMetrics);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", syncMetrics);
    };
  }, [syncMetrics]);

  useEffect(() => {
    const rafId = requestAnimationFrame(syncMetrics);
    return () => cancelAnimationFrame(rafId);
  });

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || !keyboardScrollable) return;

      const target = event.currentTarget;
      const vertical = getScrollDeltaY(event.key, target);

      if (vertical) {
        event.preventDefault();
        target.scrollBy({
          top: vertical.top,
          behavior: "auto",
        });
        return;
      }

      if (!horizontalScrollbar) return;

      const horizontal = getScrollDeltaX(event.key, target);
      if (!horizontal) return;

      event.preventDefault();
      target.scrollBy({
        left: horizontal.left,
        behavior: "auto",
      });
    },
    [horizontalScrollbar, keyboardScrollable, onKeyDown]
  );

  const scrollByAxis = useCallback((axis: ScrollAxis, amount: number) => {
    const el = viewportRef.current;
    if (!el) return;
    el.scrollBy(
      axis === "y"
        ? {
            top: amount,
            behavior: "auto",
          }
        : {
            left: amount,
            behavior: "auto",
          }
    );
    syncMetrics();
  }, [syncMetrics]);

  const setScrollByAxis = useCallback((axis: ScrollAxis, amount: number) => {
    const el = viewportRef.current;
    if (!el) return;
    el.scrollTo(
      axis === "y"
        ? {
            top: amount,
            behavior: "auto",
          }
        : {
            left: amount,
            behavior: "auto",
          }
    );
    syncMetrics();
  }, [syncMetrics]);

  const vertical = axisThumbMetrics(metrics, "y");
  const horizontal = axisThumbMetrics(metrics, "x");

  const handleTrackPointerDown = useCallback(
    (axis: ScrollAxis, clientPos: number, trackRectStart: number) => {
      const axisMetrics = axis === "y" ? vertical : horizontal;
      const pointerPos = clientPos - trackRectStart;
      const thumbStart = axisMetrics.thumbPos;
      const thumbEnd = axisMetrics.thumbPos + axisMetrics.thumbSize;

      if (pointerPos < thumbStart) {
        scrollByAxis(axis, -axisMetrics.pageStep);
      } else if (pointerPos > thumbEnd) {
        scrollByAxis(axis, axisMetrics.pageStep);
      }
    },
    [horizontal, scrollByAxis, vertical]
  );

  const beginThumbDrag = useCallback(
    (
      axis: ScrollAxis,
      pointerId: number,
      clientCoord: number,
      currentTarget: HTMLElement
    ) => {
      const el = viewportRef.current;
      if (!el) return;

      dragStateRef.current = {
        axis,
        pointerId,
        startCoord: clientCoord,
        startScroll: axis === "y" ? el.scrollTop : el.scrollLeft,
      };

      currentTarget.setPointerCapture(pointerId);
    },
    []
  );

  const handleThumbPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      const drag = dragStateRef.current;
      const el = viewportRef.current;
      if (!drag || !el || drag.pointerId !== event.pointerId) return;

      const axisMetrics = axisThumbMetrics(readMetrics(el), drag.axis);
      const thumbTravel = Math.max(axisMetrics.trackSize - axisMetrics.thumbSize, 1);
      const maxScroll = Math.max(axisMetrics.maxScroll, 1);
      const deltaCoord =
        (drag.axis === "y" ? event.clientY : event.clientX) - drag.startCoord;
      const nextScroll = drag.startScroll + (deltaCoord / thumbTravel) * maxScroll;

      setScrollByAxis(
        drag.axis,
        Math.max(0, Math.min(axisMetrics.maxScroll, nextScroll))
      );
    },
    [setScrollByAxis]
  );

  const handleThumbPointerEnd = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (dragStateRef.current?.pointerId === event.pointerId) {
        dragStateRef.current = null;
      }
    },
    []
  );

  const handleThumbKeyDown = useCallback(
    (axis: ScrollAxis, event: KeyboardEvent<HTMLButtonElement>) => {
      const el = viewportRef.current;
      if (!el) return;

      const lineStep = 32;
      const pageStep =
        axis === "y"
          ? Math.max(el.clientHeight - 32, 48)
          : Math.max(el.clientWidth - 32, 48);

      switch (event.key) {
        case axis === "y" ? "ArrowUp" : "ArrowLeft":
          event.preventDefault();
          scrollByAxis(axis, -lineStep);
          break;
        case axis === "y" ? "ArrowDown" : "ArrowRight":
          event.preventDefault();
          scrollByAxis(axis, lineStep);
          break;
        case "PageUp":
          event.preventDefault();
          scrollByAxis(axis, -pageStep);
          break;
        case "PageDown":
          event.preventDefault();
          scrollByAxis(axis, pageStep);
          break;
        case "Home":
          event.preventDefault();
          setScrollByAxis(axis, 0);
          break;
        case "End":
          event.preventDefault();
          setScrollByAxis(axis, el.scrollHeight);
          break;
        default:
          break;
      }
    },
    [scrollByAxis, setScrollByAxis]
  );

  return (
    <div
      data-window-content-shell
      data-window-active={active ? "true" : "false"}
      className={cn(
        "grid min-h-0 min-w-0",
        horizontalScrollbar
          ? "grid-cols-[minmax(0,1fr)_15px] grid-rows-[minmax(0,1fr)_15px]"
          : "grid-cols-[minmax(0,1fr)_15px]",
        className
      )}
    >
      <div
        ref={viewportRef}
        tabIndex={keyboardScrollable ? (tabIndex ?? 0) : tabIndex}
        onKeyDown={handleKeyDown}
        onScroll={(event) => {
          syncMetrics();
          onScroll?.(event);
        }}
        data-window-content-area
        className={cn(
          "col-start-1 row-start-1 min-h-0 min-w-0 overflow-y-auto retro-hide-native-scrollbar focus-visible:outline-none",
          horizontalScrollbar ? "overflow-x-auto" : "overflow-x-hidden",
          "bg-transparent",
          active && RETRO_CLASSES.focusRing,
          viewportClassName
        )}
        {...props}
      >
        {children}
      </div>

      <div
        className={cn(
          "col-start-2 row-start-1 grid grid-rows-[15px_minmax(0,1fr)_15px] border-l border-[var(--retro-border-soft)]",
          horizontalScrollbar && "min-h-0"
        )}
        role="group"
        aria-label="Vertical scrollbar"
      >
        <button
          type="button"
          aria-label="Scroll up"
          className="retro-scroll-btn grid h-[15px] w-[15px] place-items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--retro-focus)]"
          onClick={() => scrollByAxis("y", -32)}
        >
          <ScrollArrow direction="up" />
        </button>
        <div
          className="retro-scroll-track"
          onPointerDown={(event) => {
            if ((event.target as HTMLElement).closest("[data-scroll-thumb]")) return;
            handleTrackPointerDown(
              "y",
              event.clientY,
              event.currentTarget.getBoundingClientRect().top
            );
          }}
        >
          <button
            type="button"
            data-scroll-thumb
            aria-label="Vertical scroll thumb"
            className="retro-scroll-thumb left-0.5 right-0.5"
            style={{
              height: Math.max(vertical.thumbSize - 2, 0),
              transform: `translateY(${Math.max(vertical.thumbPos, 0)}px)`,
              top: 0,
            }}
            onPointerDown={(event) =>
              beginThumbDrag("y", event.pointerId, event.clientY, event.currentTarget)
            }
            onPointerMove={handleThumbPointerMove}
            onPointerUp={handleThumbPointerEnd}
            onPointerCancel={handleThumbPointerEnd}
            onKeyDown={(event) => handleThumbKeyDown("y", event)}
          />
        </div>
        <button
          type="button"
          aria-label="Scroll down"
          className="retro-scroll-btn grid h-[15px] w-[15px] place-items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--retro-focus)]"
          onClick={() => scrollByAxis("y", 32)}
        >
          <ScrollArrow direction="down" />
        </button>
      </div>

      {horizontalScrollbar ? (
        <>
          <div
            className="col-start-1 row-start-2 grid grid-cols-[15px_minmax(0,1fr)_15px] border-t border-[var(--retro-border-soft)]"
            role="group"
            aria-label="Horizontal scrollbar"
          >
            <button
              type="button"
              aria-label="Scroll left"
              className="retro-scroll-btn grid h-[15px] w-[15px] place-items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--retro-focus)]"
              onClick={() => scrollByAxis("x", -32)}
            >
              <ScrollArrow direction="left" />
            </button>
            <div
              className="retro-scroll-track"
              onPointerDown={(event) => {
                if ((event.target as HTMLElement).closest("[data-scroll-thumb]")) return;
                handleTrackPointerDown(
                  "x",
                  event.clientX,
                  event.currentTarget.getBoundingClientRect().left
                );
              }}
            >
              <button
                type="button"
                data-scroll-thumb
                aria-label="Horizontal scroll thumb"
                className="retro-scroll-thumb bottom-0.5 top-0.5"
                style={{
                  left: 0,
                  transform: `translateX(${Math.max(horizontal.thumbPos, 0)}px)`,
                  width: Math.max(horizontal.thumbSize - 2, 0),
                }}
                onPointerDown={(event) =>
                  beginThumbDrag("x", event.pointerId, event.clientX, event.currentTarget)
                }
                onPointerMove={handleThumbPointerMove}
                onPointerUp={handleThumbPointerEnd}
                onPointerCancel={handleThumbPointerEnd}
                onKeyDown={(event) => handleThumbKeyDown("x", event)}
              />
            </div>
            <button
              type="button"
              aria-label="Scroll right"
              className="retro-scroll-btn grid h-[15px] w-[15px] place-items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--retro-focus)]"
              onClick={() => scrollByAxis("x", 32)}
            >
              <ScrollArrow direction="right" />
            </button>
          </div>

          <div
            aria-hidden="true"
            className="retro-scroll-corner col-start-2 row-start-2 border-l border-t border-[var(--retro-border-soft)]"
          />
        </>
      ) : null}
    </div>
  );
}

const WindowContentArea = forwardRef<HTMLDivElement, WindowContentAreaProps>(
  WindowContentAreaImpl
);

WindowContentArea.displayName = "WindowContentArea";

export default WindowContentArea;
