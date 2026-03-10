"use client";

import { useRef, useCallback, useEffect, useMemo, useState } from "react";
import {
  LazyMotion,
  domMax,
  m,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  AnimatePresence,
  useDragControls,
  useReducedMotion,
} from "framer-motion";
import { useTerminal } from "@/hooks/useTerminal";
import { useStampPositions, CANVAS_CENTER } from "@/hooks/useStampPositions";
import {
  ABOUT_PANEL_CONTENT,
  DESKTOP_DOCK_ITEMS,
  STAMP_TOOLTIPS,
} from "@/lib/constants";
import { cn } from "@/lib/classNames";
import type { BlogPreviewArticle, DesktopDockItemId } from "@/lib/types";
import DraggableStamp from "@/components/organisms/DraggableStamp";
import TerminalWindow from "@/components/organisms/TerminalWindow";
import MacTopBar from "@/components/organisms/MacTopBar";
import MacFileDock from "@/components/organisms/MacFileDock";
import AboutDesktopPanel from "@/components/organisms/AboutDesktopPanel";
import ResumeWindow from "@/components/organisms/ResumeWindow";
import BlogDesktopPanel from "@/components/organisms/BlogDesktopPanel";
import BlogArticleWindow from "@/components/organisms/BlogArticleWindow";

const STAMP_CULL_MARGIN = 260;
const CANVAS_GRID_SIZE = 28;
const CANVAS_GRID_LINE_COLOR = "#d9dcef";
const MOBILE_DOCK_CLEARANCE_CLASS =
  "bottom-[calc(env(safe-area-inset-bottom)+5rem)]";
const INITIAL_CANVAS_SCALE = 0.9;
const MIN_CANVAS_SCALE = 0.45;
const MAX_CANVAS_SCALE = 1;
const KEYBOARD_ZOOM_STEP = 0.1;
const WHEEL_ZOOM_SENSITIVITY = 0.0018;
const PINCH_WHEEL_ZOOM_SENSITIVITY = 0.006;
const ZOOM_SPRING = { stiffness: 420, damping: 44, mass: 0.55 };
const MOBILE_BREAKPOINT = 640;

type DesktopWindowId = "terminal" | "about" | "resume" | "blog" | "article";

interface HomeTemplateProps {
  blogArticles: BlogPreviewArticle[];
}

export default function HomeTemplate({ blogArticles }: HomeTemplateProps) {
  const { stampPositions } = useStampPositions();
  const {
    history,
    input,
    setInput,
    handleSubmit,
    scrollRef,
    inputRef,
    streaming,
    cancelAutoType,
  } = useTerminal();
  const prefersReducedMotion = useReducedMotion();

  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const scaleMotion = useMotionValue(INITIAL_CANVAS_SCALE);
  const smoothOffsetX = useSpring(offsetX, ZOOM_SPRING);
  const smoothOffsetY = useSpring(offsetY, ZOOM_SPRING);
  const smoothScale = useSpring(scaleMotion, ZOOM_SPRING);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const dragPointerId = useRef<number | null>(null);
  const touchCountRef = useRef(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const panSyncRafRef = useRef<number | null>(null);
  const scaleSyncRafRef = useRef<number | null>(null);
  const pinchRafRef = useRef<number | null>(null);
  const pinchPendingRef = useRef<{
    scale: number;
    anchor: { x: number; y: number };
  } | null>(null);
  const latestCanvasOffsetRef = useRef({ x: 0, y: 0 });
  const latestCanvasScaleRef = useRef(INITIAL_CANVAS_SCALE);
  const isDraggingCanvas = useRef(false);
  const isPinchingCanvas = useRef(false);
  const smoothScaleRef = useRef(INITIAL_CANVAS_SCALE);

  // Pinch-to-zoom state
  const [canvasScale, setCanvasScale] = useState(INITIAL_CANVAS_SCALE);
  const canvasScaleRef = useRef(INITIAL_CANVAS_SCALE);
  const pinchStartDist = useRef<number | null>(null);
  const pinchStartScale = useRef(1);
  const [activeMobileStampTooltip, setActiveMobileStampTooltip] = useState<
    string | null
  >(null);
  const [showZoomIndicator, setShowZoomIndicator] = useState(false);
  const zoomIndicatorTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isBlogOpen, setIsBlogOpen] = useState(false);
  const [isBlogArticleOpen, setIsBlogArticleOpen] = useState(false);
  const [activeBlogArticle, setActiveBlogArticle] =
    useState<BlogPreviewArticle | null>(null);
  const [activeWindow, setActiveWindow] = useState<DesktopWindowId | null>(
    null,
  );
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const dragControls = useDragControls();
  const aboutDragControls = useDragControls();
  const resumeDragControls = useDragControls();
  const blogDragControls = useDragControls();
  const articleDragControls = useDragControls();
  const terminalBoundsRef = useRef<HTMLDivElement>(null);
  const hasInitializedWindowLayout = useRef(false);

  const isMobileView =
    viewportSize.width > 0 ? viewportSize.width < MOBILE_BREAKPOINT : false;
  const isAnyWindowOpen =
    isTerminalOpen ||
    isAboutOpen ||
    isResumeOpen ||
    isBlogOpen ||
    isBlogArticleOpen;
  const isCanvasInteractionLocked = isMobileView && isAnyWindowOpen;
  const renderOffsetX = isMobileView ? offsetX : smoothOffsetX;
  const renderOffsetY = isMobileView ? offsetY : smoothOffsetY;
  const renderScale = isMobileView ? scaleMotion : smoothScale;

  const updateGridPosition = useCallback((x: number, y: number) => {
    if (gridRef.current) {
      const s = smoothScaleRef.current;
      const scaledSize = CANVAS_GRID_SIZE * s;
      gridRef.current.style.backgroundPosition = `${((x % scaledSize) + scaledSize) % scaledSize}px ${((y % scaledSize) + scaledSize) % scaledSize}px`;
      gridRef.current.style.backgroundSize = `${scaledSize}px ${scaledSize}px`;
    }
  }, []);

  const scheduleCanvasOffsetSync = useCallback(() => {
    if (isDraggingCanvas.current || isPinchingCanvas.current) return;
    if (panSyncRafRef.current !== null) return;

    panSyncRafRef.current = requestAnimationFrame(() => {
      panSyncRafRef.current = null;
      setCanvasOffset({ ...latestCanvasOffsetRef.current });
    });
  }, []);

  const scheduleCanvasScaleSync = useCallback(() => {
    if (scaleSyncRafRef.current !== null) return;

    scaleSyncRafRef.current = requestAnimationFrame(() => {
      scaleSyncRafRef.current = null;
      setCanvasScale(latestCanvasScaleRef.current);
    });
  }, []);

  const syncCanvasState = useCallback(
    (x: number, y: number) => {
      latestCanvasOffsetRef.current = { x, y };
      updateGridPosition(x, y);
      scheduleCanvasOffsetSync();
    },
    [scheduleCanvasOffsetSync, updateGridPosition],
  );

  const applyCanvasScale = useCallback(
    (nextScale: number, anchor?: { x: number; y: number }) => {
      const clampedScale = Math.min(
        MAX_CANVAS_SCALE,
        Math.max(MIN_CANVAS_SCALE, nextScale),
      );
      const previousScale = canvasScaleRef.current;

      if (
        !Number.isFinite(clampedScale) ||
        Math.abs(clampedScale - previousScale) < 0.001
      ) {
        return;
      }

      const fallbackAnchor =
        viewportSize.width > 0 && viewportSize.height > 0
          ? { x: viewportSize.width / 2, y: viewportSize.height / 2 }
          : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
      const zoomAnchor = anchor ?? fallbackAnchor;

      const currentX = offsetX.get();
      const currentY = offsetY.get();
      const anchorWorldX = (zoomAnchor.x - currentX) / previousScale;
      const anchorWorldY = (zoomAnchor.y - currentY) / previousScale;

      const nextX = zoomAnchor.x - anchorWorldX * clampedScale;
      const nextY = zoomAnchor.y - anchorWorldY * clampedScale;

      canvasScaleRef.current = clampedScale;
      latestCanvasScaleRef.current = clampedScale;
      scheduleCanvasScaleSync();
      scaleMotion.set(clampedScale);
      offsetX.set(nextX);
      offsetY.set(nextY);
    },
    [
      offsetX,
      offsetY,
      scaleMotion,
      scheduleCanvasScaleSync,
      viewportSize.height,
      viewportSize.width,
    ],
  );

  const flashZoomIndicator = useCallback(() => {
    setShowZoomIndicator(true);
    if (zoomIndicatorTimeout.current) {
      clearTimeout(zoomIndicatorTimeout.current);
    }
    zoomIndicatorTimeout.current = setTimeout(
      () => setShowZoomIndicator(false),
      800,
    );
  }, []);

  useEffect(() => {
    const updateViewport = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
      if (!hasInitializedWindowLayout.current) {
        if (window.innerWidth < MOBILE_BREAKPOINT) {
          setIsTerminalOpen(false);
          setIsResumeOpen(false);
          setIsBlogOpen(false);
          setIsBlogArticleOpen(false);
          setActiveBlogArticle(null);
          setIsAboutOpen(true);
          setActiveWindow("about");
        } else {
          setIsAboutOpen(false);
          setIsResumeOpen(false);
          setIsBlogOpen(false);
          setIsBlogArticleOpen(false);
          setActiveBlogArticle(null);
          setIsTerminalOpen(true);
          setActiveWindow("terminal");
        }
        hasInitializedWindowLayout.current = true;
      }
    };

    const initialX =
      window.innerWidth / 2 - CANVAS_CENTER.x * INITIAL_CANVAS_SCALE;
    const initialY =
      window.innerHeight / 2 - CANVAS_CENTER.y * INITIAL_CANVAS_SCALE;

    updateViewport();
    canvasScaleRef.current = INITIAL_CANVAS_SCALE;
    latestCanvasScaleRef.current = INITIAL_CANVAS_SCALE;
    smoothScaleRef.current = INITIAL_CANVAS_SCALE;
    scaleMotion.set(INITIAL_CANVAS_SCALE);
    offsetX.set(initialX);
    offsetY.set(initialY);
    syncCanvasState(initialX, initialY);

    window.addEventListener("resize", updateViewport);

    return () => {
      if (panSyncRafRef.current !== null) {
        cancelAnimationFrame(panSyncRafRef.current);
      }
      if (scaleSyncRafRef.current !== null) {
        cancelAnimationFrame(scaleSyncRafRef.current);
      }
      window.removeEventListener("resize", updateViewport);
    };
  }, [offsetX, offsetY, scaleMotion, syncCanvasState]);

  useMotionValueEvent(renderOffsetX, "change", (x) => {
    syncCanvasState(x, renderOffsetY.get());
  });

  useMotionValueEvent(renderOffsetY, "change", (y) => {
    syncCanvasState(renderOffsetX.get(), y);
  });

  useMotionValueEvent(renderScale, "change", (nextScale) => {
    smoothScaleRef.current = nextScale;
    updateGridPosition(renderOffsetX.get(), renderOffsetY.get());
  });

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (isMobileView) {
      setActiveMobileStampTooltip(null);
    }
    if (isCanvasInteractionLocked) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (e.pointerType !== "mouse" && !e.isPrimary) return;
    if (isPinchingCanvas.current) return;

    dragging.current = true;
    isDraggingCanvas.current = true;
    dragPointerId.current = e.pointerId;
    lastPos.current = { x: e.clientX, y: e.clientY };
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Ignore pointer capture failures on browsers that transiently reject capture.
    }
  }, [isCanvasInteractionLocked, isMobileView]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      if (isCanvasInteractionLocked) return;
      if (isPinchingCanvas.current || touchCountRef.current > 1) return;
      if (dragPointerId.current !== null && e.pointerId !== dragPointerId.current)
        return;

      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
      offsetX.set(offsetX.get() + dx);
      offsetY.set(offsetY.get() + dy);
    };
    const onUp = (e: PointerEvent) => {
      if (dragPointerId.current !== null && e.pointerId !== dragPointerId.current)
        return;
      dragging.current = false;
      isDraggingCanvas.current = false;
      dragPointerId.current = null;
      setCanvasOffset({ ...latestCanvasOffsetRef.current });
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [isCanvasInteractionLocked, offsetX, offsetY]);

  // Pinch-to-zoom handlers
  useEffect(() => {
    const getTouchDist = (t1: Touch, t2: Touch) =>
      Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

    const flushPendingPinchScale = () => {
      pinchRafRef.current = null;
      const pending = pinchPendingRef.current;
      pinchPendingRef.current = null;

      if (!pending) return;
      applyCanvasScale(pending.scale, pending.anchor);
      flashZoomIndicator();
    };

    const onTouchStart = (e: TouchEvent) => {
      touchCountRef.current = e.touches.length;
      if (isCanvasInteractionLocked) return;

      if (e.touches.length === 2) {
        setActiveMobileStampTooltip(null);
        if (e.cancelable) {
          e.preventDefault();
        }
        isPinchingCanvas.current = true;
        dragging.current = false;
        isDraggingCanvas.current = false;
        dragPointerId.current = null;
        pinchStartDist.current = getTouchDist(e.touches[0], e.touches[1]);
        pinchStartScale.current = canvasScaleRef.current;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      touchCountRef.current = e.touches.length;
      if (isCanvasInteractionLocked) return;

      if (e.touches.length === 2 && pinchStartDist.current !== null) {
        if (e.cancelable) {
          e.preventDefault();
        }
        const dist = getTouchDist(e.touches[0], e.touches[1]);
        const ratio = dist / pinchStartDist.current;
        const anchorX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const anchorY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        pinchPendingRef.current = {
          scale: pinchStartScale.current * ratio,
          anchor: { x: anchorX, y: anchorY },
        };
        if (pinchRafRef.current === null) {
          pinchRafRef.current = requestAnimationFrame(flushPendingPinchScale);
        }
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      touchCountRef.current = e.touches.length;
      if (e.touches.length < 2) {
        if (pinchRafRef.current !== null) {
          cancelAnimationFrame(pinchRafRef.current);
          pinchRafRef.current = null;
          const pending = pinchPendingRef.current;
          pinchPendingRef.current = null;
          if (pending) {
            applyCanvasScale(pending.scale, pending.anchor);
            flashZoomIndicator();
          }
        }
        pinchStartDist.current = null;
        isPinchingCanvas.current = false;
      }
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        dragging.current = true;
        isDraggingCanvas.current = true;
        dragPointerId.current = null;
        lastPos.current = { x: touch.clientX, y: touch.clientY };
      }
      if (e.touches.length === 0) {
        dragging.current = false;
        isDraggingCanvas.current = false;
        dragPointerId.current = null;
        setCanvasOffset({ ...latestCanvasOffsetRef.current });
      }
    };

    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: false });
    window.addEventListener("touchcancel", onTouchEnd, { passive: false });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      if (pinchRafRef.current !== null) {
        cancelAnimationFrame(pinchRafRef.current);
      }
      pinchRafRef.current = null;
      pinchPendingRef.current = null;
      if (zoomIndicatorTimeout.current)
        clearTimeout(zoomIndicatorTimeout.current);
    };
  }, [
    applyCanvasScale,
    flashZoomIndicator,
    isCanvasInteractionLocked,
  ]);

  const handleMobileStampTooltipToggle = useCallback(
    (stampSrc: string) => {
      if (!isMobileView) return;
      setActiveMobileStampTooltip((current) =>
        current === stampSrc ? null : stampSrc,
      );
    },
    [isMobileView],
  );

  const handleCanvasWheel = useCallback(
    (event: React.WheelEvent<HTMLDivElement>) => {
      if (isCanvasInteractionLocked) {
        return;
      }

      if (event.ctrlKey) {
        return;
      }

      const sensitivity = WHEEL_ZOOM_SENSITIVITY;
      const zoomFactor = Math.exp(-event.deltaY * sensitivity);

      if (!Number.isFinite(zoomFactor) || Math.abs(zoomFactor - 1) < 0.0001) {
        return;
      }

      event.preventDefault();
      applyCanvasScale(canvasScaleRef.current * zoomFactor, {
        x: event.clientX,
        y: event.clientY,
      });
      flashZoomIndicator();
    },
    [applyCanvasScale, flashZoomIndicator, isCanvasInteractionLocked],
  );

  useEffect(() => {
    const onCtrlWheel = (event: WheelEvent) => {
      if (isCanvasInteractionLocked) {
        return;
      }

      if (!event.ctrlKey || !event.cancelable) {
        return;
      }

      const zoomFactor = Math.exp(-event.deltaY * PINCH_WHEEL_ZOOM_SENSITIVITY);
      if (!Number.isFinite(zoomFactor) || Math.abs(zoomFactor - 1) < 0.0001) {
        return;
      }

      event.preventDefault();
      applyCanvasScale(canvasScaleRef.current * zoomFactor, {
        x: event.clientX,
        y: event.clientY,
      });
      flashZoomIndicator();
    };

    window.addEventListener("wheel", onCtrlWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onCtrlWheel);
    };
  }, [applyCanvasScale, flashZoomIndicator, isCanvasInteractionLocked]);

  useEffect(() => {
    const preventGestureZoom = (event: Event) => {
      if (event.cancelable) {
        event.preventDefault();
      }
    };

    window.addEventListener("gesturestart", preventGestureZoom, {
      passive: false,
    });
    window.addEventListener("gesturechange", preventGestureZoom, {
      passive: false,
    });

    return () => {
      window.removeEventListener("gesturestart", preventGestureZoom);
      window.removeEventListener("gesturechange", preventGestureZoom);
    };
  }, []);

  useEffect(() => {
    const isEditableTarget = (target: EventTarget | null) => {
      const element = target as HTMLElement | null;
      if (!element) return false;
      const tag = element.tagName;
      return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        element.isContentEditable
      );
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isEditableTarget(event.target)) return;
      if (isCanvasInteractionLocked) return;

      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        applyCanvasScale(canvasScaleRef.current * (1 + KEYBOARD_ZOOM_STEP));
        flashZoomIndicator();
        return;
      }

      if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        applyCanvasScale(canvasScaleRef.current * (1 - KEYBOARD_ZOOM_STEP));
        flashZoomIndicator();
        return;
      }

      if (event.key === "0") {
        event.preventDefault();
        applyCanvasScale(INITIAL_CANVAS_SCALE);
        flashZoomIndicator();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [applyCanvasScale, flashZoomIndicator, isCanvasInteractionLocked]);

  useEffect(() => {
    if (!isCanvasInteractionLocked) return;
    dragging.current = false;
    isDraggingCanvas.current = false;
    dragPointerId.current = null;
    touchCountRef.current = 0;
    isPinchingCanvas.current = false;
    pinchStartDist.current = null;
    if (pinchRafRef.current !== null) {
      cancelAnimationFrame(pinchRafRef.current);
    }
    pinchRafRef.current = null;
    pinchPendingRef.current = null;
  }, [isCanvasInteractionLocked]);

  const focusTerminalInput = useCallback(() => {
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [inputRef]);

  const getFallbackActiveWindow = useCallback(
    (closedWindow: DesktopWindowId) => {
      if (closedWindow !== "article" && isBlogArticleOpen) return "article";
      if (closedWindow !== "terminal" && isTerminalOpen) return "terminal";
      if (closedWindow !== "resume" && isResumeOpen) return "resume";
      if (closedWindow !== "about" && isAboutOpen) return "about";
      if (closedWindow !== "blog" && isBlogOpen) return "blog";
      return null;
    },
    [isAboutOpen, isBlogArticleOpen, isBlogOpen, isResumeOpen, isTerminalOpen],
  );

  const closeTerminalWindow = useCallback(() => {
    setIsTerminalOpen(false);
    setActiveWindow((current) =>
      current === "terminal" ? getFallbackActiveWindow("terminal") : current,
    );
  }, [getFallbackActiveWindow]);

  const closeAboutWindow = useCallback(() => {
    setIsAboutOpen(false);
    setActiveWindow((current) =>
      current === "about" ? getFallbackActiveWindow("about") : current,
    );
  }, [getFallbackActiveWindow]);

  const closeResumeWindow = useCallback(() => {
    setIsResumeOpen(false);
    setActiveWindow((current) =>
      current === "resume" ? getFallbackActiveWindow("resume") : current,
    );
  }, [getFallbackActiveWindow]);

  const closeBlogWindow = useCallback(() => {
    setIsBlogOpen(false);
    setActiveWindow((current) =>
      current === "blog" ? getFallbackActiveWindow("blog") : current,
    );
  }, [getFallbackActiveWindow]);

  const closeBlogArticleWindow = useCallback(() => {
    setIsBlogArticleOpen(false);
    setActiveBlogArticle(null);
    setActiveWindow((current) =>
      current === "article" ? getFallbackActiveWindow("article") : current,
    );
  }, [getFallbackActiveWindow]);

  const openTerminalWindow = useCallback(() => {
    if (isMobileView) {
      setIsAboutOpen(false);
      setIsResumeOpen(false);
      setIsBlogOpen(false);
      setIsBlogArticleOpen(false);
      setActiveBlogArticle(null);
    }
    setIsTerminalOpen(true);
    setActiveWindow("terminal");
    focusTerminalInput();
  }, [focusTerminalInput, isMobileView]);

  const openAboutWindow = useCallback(() => {
    if (isMobileView) {
      setIsTerminalOpen(false);
      setIsResumeOpen(false);
      setIsBlogOpen(false);
      setIsBlogArticleOpen(false);
      setActiveBlogArticle(null);
    }
    setIsAboutOpen(true);
    setActiveWindow("about");
  }, [isMobileView]);

  const openResumeWindow = useCallback(() => {
    if (isMobileView) {
      setIsTerminalOpen(false);
      setIsAboutOpen(false);
      setIsBlogOpen(false);
      setIsBlogArticleOpen(false);
      setActiveBlogArticle(null);
    }
    setIsResumeOpen(true);
    setActiveWindow("resume");
  }, [isMobileView]);

  const openBlogWindow = useCallback(() => {
    if (isMobileView) {
      setIsTerminalOpen(false);
      setIsAboutOpen(false);
      setIsResumeOpen(false);
      setIsBlogArticleOpen(false);
      setActiveBlogArticle(null);
    }
    setIsBlogOpen(true);
    setActiveWindow("blog");
  }, [isMobileView]);

  const openBlogArticleWindow = useCallback(
    (article: BlogPreviewArticle) => {
      if (!article.mdxContent) return;

      if (isMobileView) {
        setIsTerminalOpen(false);
        setIsAboutOpen(false);
        setIsResumeOpen(false);
        setIsBlogOpen(false);
      }

      setActiveBlogArticle(article);
      setIsBlogArticleOpen(true);
      setActiveWindow("article");
    },
    [isMobileView],
  );

  const closeAllWindows = useCallback(() => {
    setIsTerminalOpen(false);
    setIsAboutOpen(false);
    setIsResumeOpen(false);
    setIsBlogOpen(false);
    setIsBlogArticleOpen(false);
    setActiveBlogArticle(null);
    setActiveWindow(null);
  }, []);

  const handleDockItemClick = useCallback(
    (id: DesktopDockItemId) => {
      switch (id) {
        case "about":
          if (isAboutOpen) {
            closeAboutWindow();
            return;
          }
          openAboutWindow();
          return;
        case "terminal":
          if (isTerminalOpen) {
            closeTerminalWindow();
            return;
          }
          openTerminalWindow();
          return;
        case "resume":
          if (isResumeOpen) {
            closeResumeWindow();
            return;
          }
          openResumeWindow();
          return;
        case "blog":
          if (isBlogOpen) {
            closeBlogWindow();
            return;
          }
          openBlogWindow();
          return;
        case "play":
          closeAllWindows();
          return;
        default:
          return;
      }
    },
    [
      closeAboutWindow,
      closeAllWindows,
      closeBlogWindow,
      closeResumeWindow,
      closeTerminalWindow,
      isAboutOpen,
      isBlogOpen,
      isResumeOpen,
      isTerminalOpen,
      openAboutWindow,
      openBlogWindow,
      openResumeWindow,
      openTerminalWindow,
    ],
  );

  const handleAboutLinkAction = useCallback(() => {
    openResumeWindow();
  }, [openResumeWindow]);

  useEffect(() => {
    if (
      activeWindow !== "about" &&
      activeWindow !== "resume" &&
      activeWindow !== "blog" &&
      activeWindow !== "article"
    ) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (activeWindow === "about") {
          closeAboutWindow();
          return;
        }

        if (activeWindow === "blog") {
          closeBlogWindow();
          return;
        }

        if (activeWindow === "article") {
          closeBlogArticleWindow();
          return;
        }

        closeResumeWindow();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [
    activeWindow,
    closeAboutWindow,
    closeBlogArticleWindow,
    closeBlogWindow,
    closeResumeWindow,
  ]);

  const activeDockIds = useMemo(() => {
    const activeIds: DesktopDockItemId[] = [];
    if (isAboutOpen) {
      activeIds.push("about");
    }
    if (isResumeOpen) {
      activeIds.push("resume");
    }
    if (isTerminalOpen) {
      activeIds.push("terminal");
    }
    if (isBlogOpen || isBlogArticleOpen) {
      activeIds.push("blog");
    }
    if (
      !isAboutOpen &&
      !isResumeOpen &&
      !isTerminalOpen &&
      !isBlogOpen &&
      !isBlogArticleOpen
    ) {
      activeIds.push("play");
    }
    return activeIds;
  }, [isAboutOpen, isBlogArticleOpen, isBlogOpen, isResumeOpen, isTerminalOpen]);

  const noMotion = prefersReducedMotion ?? false;
  const visibleStamps = useMemo(() => {
    if (!stampPositions) return [];

    if (!viewportSize.width || !viewportSize.height) {
      return [];
    }

    const left = (-canvasOffset.x - STAMP_CULL_MARGIN) / canvasScale;
    const top = (-canvasOffset.y - STAMP_CULL_MARGIN) / canvasScale;
    const right =
      (-canvasOffset.x + viewportSize.width + STAMP_CULL_MARGIN) / canvasScale;
    const bottom =
      (-canvasOffset.y + viewportSize.height + STAMP_CULL_MARGIN) / canvasScale;

    return stampPositions.stamps
      .map((stamp, index) => ({ stamp, index }))
      .filter(({ stamp }) => {
        const x1 = stamp.position.x;
        const y1 = stamp.position.y;
        const x2 = x1 + stamp.size;
        const y2 = y1 + stamp.size;

        return x2 >= left && x1 <= right && y2 >= top && y1 <= bottom;
      });
  }, [
    stampPositions,
    viewportSize.width,
    viewportSize.height,
    canvasOffset.x,
    canvasOffset.y,
    canvasScale,
  ]);

  return (
    <LazyMotion features={domMax}>
      <div
        className="relative h-[100dvh] w-screen overflow-hidden"
        style={{ touchAction: "none" }}
      >
        <MacTopBar />

        <div
          ref={gridRef}
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, ${CANVAS_GRID_LINE_COLOR} 1px, transparent 1px), linear-gradient(to bottom, ${CANVAS_GRID_LINE_COLOR} 1px, transparent 1px)`,
            backgroundSize: `${CANVAS_GRID_SIZE * INITIAL_CANVAS_SCALE}px ${CANVAS_GRID_SIZE * INITIAL_CANVAS_SCALE}px`,
            willChange: "background-position",
          }}
        />

        <div
          className={cn(
            "absolute inset-0",
            isCanvasInteractionLocked
              ? "pointer-events-none cursor-default"
              : "cursor-grab active:cursor-grabbing",
          )}
          style={{ touchAction: "none" }}
          onPointerDown={onPointerDown}
          onWheel={handleCanvasWheel}
          aria-hidden="true"
        />

        <m.div
          className="absolute inset-0 pointer-events-none"
          style={{
            x: renderOffsetX,
            y: renderOffsetY,
            scale: renderScale,
            transformOrigin: "0 0",
            willChange: "transform",
          }}
        >
          {visibleStamps.map(({ stamp, index }) => (
            <DraggableStamp
              key={stamp.src}
              src={stamp.src}
              alt={stamp.src.replace("/", "").replace(".png", "")}
              x={stamp.position.x}
              y={stamp.position.y}
              rotation={stamp.rotation}
              size={stamp.size}
              zIndex={10 + index}
              index={index}
              tooltip={STAMP_TOOLTIPS[stamp.src]}
              noMotion={noMotion}
              isMobileView={isMobileView}
              mobileTooltipVisible={
                isMobileView && activeMobileStampTooltip === stamp.src
              }
              onMobileTooltipToggle={handleMobileStampTooltipToggle}
            />
          ))}
        </m.div>

        <div
          ref={terminalBoundsRef}
          className={cn(
            "pointer-events-none absolute inset-x-0 top-8 sm:inset-x-4 sm:top-9 sm:bottom-24",
            MOBILE_DOCK_CLEARANCE_CLASS,
          )}
          aria-hidden="true"
        />

        {/* Zoom indicator */}
        {showZoomIndicator && (
          <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
            <div className="rounded-full bg-[var(--retro-surface)] border border-[var(--retro-border)] px-3 py-1 font-[Inconsolata] text-xs text-[var(--retro-accent-blue-text)] shadow-md opacity-90">
              {Math.round(canvasScale * 100)}%
            </div>
          </div>
        )}

        <div
          className={cn(
            "absolute inset-x-0 top-6 bottom-16 sm:bottom-20 pointer-events-none flex items-start sm:items-center justify-center px-3 sm:px-5",
            activeWindow === "about" ? "z-[62]" : "z-[46]",
          )}
        >
          <AnimatePresence>
            {isAboutOpen && (
              <m.div
                key="about-panel"
                drag
                dragControls={aboutDragControls}
                dragListener={false}
                dragMomentum={false}
                dragElastic={0}
                dragConstraints={terminalBoundsRef}
                initial={noMotion ? false : { opacity: 0, y: 12, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.99 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="pointer-events-auto"
                style={{ willChange: "transform, opacity" }}
              >
                <AboutDesktopPanel
                  content={ABOUT_PANEL_CONTENT}
                  active={activeWindow === "about"}
                  onActivate={() => setActiveWindow("about")}
                  onTitleBarPointerDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    aboutDragControls.start(event);
                  }}
                  onClose={closeAboutWindow}
                  onLinkAction={handleAboutLinkAction}
                />
              </m.div>
            )}
          </AnimatePresence>
        </div>

        <div
          className={cn(
            "absolute inset-x-0 top-6 bottom-16 sm:bottom-20 pointer-events-none flex items-start sm:items-center justify-center px-3 sm:px-5",
            activeWindow === "resume" ? "z-[62]" : "z-[46]",
          )}
        >
          <AnimatePresence>
            {isResumeOpen && (
              <m.div
                key="resume-panel"
                drag
                dragControls={resumeDragControls}
                dragListener={false}
                dragMomentum={false}
                dragElastic={0}
                dragConstraints={terminalBoundsRef}
                initial={noMotion ? false : { opacity: 0, y: 12, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.99 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="pointer-events-auto"
                style={{ willChange: "transform, opacity" }}
              >
                <ResumeWindow
                  active={activeWindow === "resume"}
                  onActivate={() => setActiveWindow("resume")}
                  onTitleBarPointerDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    resumeDragControls.start(event);
                  }}
                  onClose={closeResumeWindow}
                />
              </m.div>
            )}
          </AnimatePresence>
        </div>

        <div
          className={cn(
            "absolute inset-x-0 top-6 bottom-16 sm:bottom-20 pointer-events-none flex items-start sm:items-center justify-center px-3 sm:px-5",
            activeWindow === "blog" ? "z-[62]" : "z-[46]",
          )}
        >
          <AnimatePresence>
            {isBlogOpen && (
              <m.div
                key="blog-panel"
                drag
                dragControls={blogDragControls}
                dragListener={false}
                dragMomentum={false}
                dragElastic={0}
                dragConstraints={terminalBoundsRef}
                initial={noMotion ? false : { opacity: 0, y: 12, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.99 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="pointer-events-auto"
                style={{ willChange: "transform, opacity" }}
              >
                <BlogDesktopPanel
                  articles={blogArticles}
                  active={activeWindow === "blog"}
                  onActivate={() => setActiveWindow("blog")}
                  onOpenArticle={openBlogArticleWindow}
                  onTitleBarPointerDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    blogDragControls.start(event);
                  }}
                  onClose={closeBlogWindow}
                />
              </m.div>
            )}
          </AnimatePresence>
        </div>

        <div
          className={cn(
            "absolute inset-x-0 top-6 bottom-16 sm:bottom-20 pointer-events-none flex items-start sm:items-center justify-center px-3 sm:px-5",
            activeWindow === "article" ? "z-[63]" : "z-[47]",
          )}
        >
          <AnimatePresence>
            {isBlogArticleOpen && activeBlogArticle ? (
              <m.div
                key={`article-panel-${activeBlogArticle.id}`}
                drag
                dragControls={articleDragControls}
                dragListener={false}
                dragMomentum={false}
                dragElastic={0}
                dragConstraints={terminalBoundsRef}
                initial={noMotion ? false : { opacity: 0, y: 12, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.99 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="pointer-events-auto"
                style={{ willChange: "transform, opacity" }}
              >
                <BlogArticleWindow
                  article={activeBlogArticle}
                  active={activeWindow === "article"}
                  onActivate={() => setActiveWindow("article")}
                  onTitleBarPointerDown={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    articleDragControls.start(event);
                  }}
                  onClose={closeBlogArticleWindow}
                />
              </m.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div
          className={cn(
            "absolute inset-x-0 top-6 pointer-events-none flex items-start justify-center px-0 pt-0 sm:px-4 sm:pt-0 sm:items-center sm:bottom-20",
            MOBILE_DOCK_CLEARANCE_CLASS,
            activeWindow === "terminal" ? "z-[62]" : "z-[46]",
          )}
        >
          <AnimatePresence mode="wait">
            {isTerminalOpen ? (
              <m.div
                key="terminal"
                drag
                dragControls={dragControls}
                dragListener={false}
                dragMomentum={false}
                dragElastic={0}
                dragConstraints={terminalBoundsRef}
                initial={noMotion ? false : { opacity: 0, scale: 0.92, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 28,
                  mass: 0.8,
                }}
                className="pointer-events-auto w-full sm:w-auto"
                style={{ willChange: "transform, opacity" }}
                data-terminal
              >
                <TerminalWindow
                  history={history}
                  input={input}
                  onInputChange={(v) => {
                    cancelAutoType();
                    setInput(v);
                  }}
                  onSubmit={() => {
                    cancelAutoType();
                    handleSubmit();
                  }}
                  onSuggestionClick={(s) => {
                    cancelAutoType();
                    handleSubmit(s);
                  }}
                  inputRef={inputRef}
                  scrollRef={scrollRef}
                  onClose={closeTerminalWindow}
                  dragControls={dragControls}
                  streaming={streaming}
                  active={activeWindow === "terminal"}
                  onActivate={() => setActiveWindow("terminal")}
                />
              </m.div>
            ) : null}
          </AnimatePresence>
        </div>

        <MacFileDock
          items={DESKTOP_DOCK_ITEMS}
          activeIds={activeDockIds}
          onItemClick={handleDockItemClick}
        />
      </div>
    </LazyMotion>
  );
}
