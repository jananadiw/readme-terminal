# Claude.md: Best Practices for Next.js 16, React 19, Framer Motion 12, OpenAI 6 Stack

This guide outlines best practices to ensure smooth browser performance, leveraging React 19's compiler for automatic optimizations and Framer Motion's GPU-accelerated animations. Follow these to minimize re-renders, optimize animations, and handle AI calls efficiently.

## Next.js 16 Structure
Use the App Router for enhanced routing with layout deduplication and incremental prefetching, reducing network overhead for smoother navigation. Enable React Compiler support out-of-the-box for automatic memoization, minimizing manual useMemo/useCallback. Implement Turbopack for 5-10x faster Fast Refresh and file system caching for large apps.

## React 19 Components
Prefer functional components with Server Components by default to reduce client bundle size and leverage automatic optimizations from the React Compiler. Use View Transitions API for seamless page changes and useEffectEvent for non-reactive logic extraction. Profile with React Profiler and Chrome DevTools to ensure 60fps rendering, avoiding unnecessary state updates.

## Framer Motion 12 Animations
Animate only GPU-accelerated properties like transform (x, y, scale, rotate) and opacity to prevent layout thrashing and ensure smooth 60fps browser performance. Use LazyMotion and (m) component for bundle size reduction, variants for batched updates, and layoutId for shared transitions. Add `will-change` sparingly, respect `useReducedMotion` for accessibility, and test on low-end devices.

| Optimization | Benefit | Example Usage |
|--------------|---------|---------------|
| `transform` properties | Hardware acceleration | `animate={{ x: 100, scale: 1.1 }}` |
| `variants` | Batch multiple elements | Define shared timings |
| `AnimatePresence` | Smooth exits | Short durations only |

## OpenAI 6 Integration
Handle OpenAI calls exclusively in server-side API Routes or Route Handlers to keep heavy computations off the client, preventing browser slowdowns. Stream responses with Server-Sent Events (SSE) for real-time UI updates without blocking renders. Use caching (e.g., Redis) and limit payloads; avoid client-side calls.

## Performance Monitoring
Test animations and interactions on Chrome, Firefox, and mobile for cross-browser smoothness, using `initial={false}` to skip mount animations. Lazy load animation-heavy components and monitor with Lighthouse for Core Web Vitals. Profile frequently to catch re-render issues early.
