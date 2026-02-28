# Visual Contrast Improvement Plan

## Context

The current color palette is almost entirely lavender/periwinkle monochrome. Every surface — desktop, window frame, title bar, content area, dock — lives within a narrow range of `#d4d8e8` to `#f7f8fe`. This creates a washed-out look where layers blend together, the window doesn't "pop" from the desktop, and interactive elements lack visual affordance.

The goal: **darken the chrome** (title bars, borders, window frame) to separate it from bright content areas, and **introduce a warm accent color** for interactive elements to break the blue monotone.

---

## Color Changes

### 1. Darken the Chrome, Lighten Content

Increase the contrast gap between UI chrome and content surfaces.

| Variable | Current | Proposed | Rationale |
|---|---|---|---|
| `--retro-desktop` | `#ececf4` | `#dfe2f0` | Slightly darker desktop so windows lift off it |
| `--retro-window` | `#dde0f2` | `#c8cde4` | Noticeably darker window frame — the biggest change |
| `--retro-window-alt` | `#e5e8f5` | `#d5d9ec` | Toolbar/input bar darker to match frame |
| `--retro-surface` | `#d9dcef` | `#bfc4da` | Dock and surface panels darker |
| `--retro-inset` | `#f7f8fe` | `#ffffff` | Pure white content area — maximum contrast against darkened chrome |
| `--retro-inset-alt` | `#eef1ff` | `#f0f3ff` | Suggestion chips slightly brighter |
| `--retro-titlebar` | `#d4d8e8` | `#b5bbd4` | Darker title bar — prominent chrome element |
| `--retro-border` | `#aeb4cc` | `#8e95b4` | Darker borders for crisp edges |
| `--retro-border-soft` | `#c4cadf` | `#a4abc6` | Softer borders also darkened proportionally |
| `--retro-shadow` | `rgba(142,149,174,0.78)` | `rgba(100,108,140,0.80)` | Deeper 3D bevel shadow |
| `--retro-text-chrome` | `#4c5367` | `#3a4058` | Slightly darker chrome text for contrast on darker chrome |

### 2. Introduce Warm Accent Color

Add an amber/terracotta accent for interactive and highlighted elements. This complements the cool lavender base (warm vs cool) and draws the eye to actionable items.

| Variable | Current | Proposed | Rationale |
|---|---|---|---|
| `--retro-accent-warm` | *(new)* | `#d4763a` | Primary warm accent — amber/terracotta. Used for links, focus states, active indicators |
| `--retro-accent-warm-text` | *(new)* | `#b85e24` | Darker warm for text — passes WCAG AA on white |
| `--retro-accent-warm-fill` | *(new)* | `#fce8d6` | Light warm fill for active states |
| `--retro-accent-red` | `#fa766e` | `#e85d4a` | Slightly deeper red — the current coral is close to the warm accent, this differentiates it |

### 3. Apply Warm Accent to Interactive Elements

Replace the blue accent on interactive/clickable elements with the warm accent:

- **Links** in About panel: underline decoration → `--retro-accent-warm`
- **"Welcome!"** text in terminal: currently red, change to warm accent for cohesion
- **Suggestion chips hover**: hover background gets a warm tint
- **Active dock item**: active fill uses `--retro-accent-warm-fill` instead of blue fill
- **Top bar text**: change from `#112DE8` to `--retro-accent-warm-text` — creates a warm beacon at the top

Keep blue for:

- Terminal body text (`--retro-accent-blue-text`) — this is the core content color
- Focus rings — blue is a standard focus indicator
- The "help" keyword highlight (green stays)

### 4. Hardcoded Colors to Update

- **`MacTopBar.tsx`**: `backgroundColor: "#B7BFF5"` → use `var(--retro-titlebar)` (now darker, will look cohesive). `color: "#112DE8"` → `var(--retro-accent-warm-text)`
- **`AboutDesktopPanel.tsx`**: tooltip `backgroundColor: "#112DE8"` → `var(--retro-accent-warm)`, tooltip text `#D9D9D9` → `#ffffff`

---

## Files to Modify

1. **`src/app/globals.css`** — Update CSS variable values, add new warm accent variables
2. **`src/lib/retroTheme.ts`** — Add `accentWarm`, `accentWarmText`, `accentWarmFill` to theme object
3. **`src/lib/retroClasses.ts`** — Update `dockItemActive` fill, `panelLink` hover, add warm accent text class
4. **`src/components/organisms/MacTopBar.tsx`** — Replace hardcoded colors with CSS variables
5. **`src/components/organisms/AboutDesktopPanel.tsx`** — Update tooltip colors, link underline decoration color
6. **`src/components/organisms/WelcomeMessage.tsx`** — Change "Welcome!" from `accentRed` to `accentWarm`

---

## Verification

1. Run `npx next build` — ensure no build errors
2. Run `npx next dev` and visually check:
   - Terminal window clearly separates from the desktop background
   - Title bar is visibly darker than the content area
   - Content area reads as bright/white against darker chrome
   - Links and interactive elements use the warm amber accent
   - Top bar stands out with warm text
   - Suggestion chips and dock items have clear hover/active states
   - About panel tooltip uses warm accent background
3. Check WCAG contrast: `--retro-accent-warm-text` (`#b85e24`) on white (`#fff`) = ~4.6:1 ratio (passes AA)
4. Check that the 3D bevel effects (inset shadows) still read correctly with darker chrome
