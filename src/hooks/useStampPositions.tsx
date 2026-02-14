"use client";

import { useMemo } from "react";
import { StampPositions } from "@/lib/types";

/**
 * Generative canvas layout — positions are calculated algorithmically
 * to be equally spaced around the center.
 *
 * - Uses a spiral grid traversal to find positions.
 * - Skips the center area where the terminal is.
 * - Adds slight random jitter for a hand-placed look.
 * - Deterministic: The same algorithm runs every time, so the layout is stable.
 */

interface StampDef {
  src: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
}

// Canvas center
const CX = 2500;
const CY = 2000;

// Config
const GRID_SIZE = 360; // Base spacing between items
const EXCLUSION_RADIUS_X = 500; // No items in this width from center
const EXCLUSION_RADIUS_Y = 400; // No items in this height from center
const VARIANCE = 60; // Max random offset from grid point

// The image list (without positions)
const STAMP_IMAGES = [
  { src: "/boardingpass.png", size: 220 },
  { src: "/busan.png", size: 200 },
  { src: "/handmadechoco.png", size: 240 },
  { src: "/kiyotemple.png", size: 200 },
  { src: "/shoes.png", size: 200 },
  { src: "/parisdeli.png", size: 230 },
  { src: "/eiffel.png", size: 260 },
  { src: "/floppy.png", size: 180 },
  { src: "/harderkulm.png", size: 220 },
  { src: "/swisapls.png", size: 200 },
  { src: "/nystamp.png", size: 200 },
  { src: "/usa_stamp.png", size: 240 },
  { src: "/sl_stamp.png", size: 200 },
  { src: "/JR.png", size: 200 },
  { src: "/fujiyoshida.png", size: 240 },
  { src: "/perruche.png", size: 200 },
  { src: "/kiyomisutemple.png", size: 220 },
  { src: "/pastrypicnic.png", size: 220 },
  { src: "/Rome.png", size: 200 },
  { src: "/greece.png", size: 200 },
  { src: "/seoul.png", size: 220 },
  { src: "/colstamp.png", size: 180 },
  { src: "/journal.png", size: 200 },
  { src: "/vatican.png", size: 200 },
  { src: "/bizzaria.png", size: 200 },
  { src: "/parismurals.png", size: 220 },
  { src: "/japanbill.png", size: 180 },
  { src: "/parisdeli2.png", size: 200 },
  { src: "/firenze.png", size: 220 },
  { src: "/austria.png", size: 200 },
  { src: "/shakespeare.png", size: 200 },
  { src: "/spain.png", size: 200 },
  { src: "/pompei.png", size: 200 },
  { src: "/wien.png", size: 200 },
  { src: "/stPeters.png", size: 220 },
  { src: "/zurich.png", size: 220 },
  { src: "/vietnam.png", size: 200 },
  { src: "/brandi.png", size: 200 },
  { src: "/japsalttoek.png", size: 180 },
  { src: "/malta.png", size: 200 },
  { src: "/WienLib.png", size: 240 },
  { src: "/shanghai.png", size: 240 },
];

// Simple pseudo-random number generator for deterministic results
function mulberry32(a: number) {
  return function () {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function useStampPositions() {
  const stampPositions = useMemo<StampPositions>(() => {
    const stamps: StampDef[] = [];
    const rand = mulberry32(123456); // Fixed seed for reproducible layout

    // Spiral generation state
    let x = 0;
    let y = 0;
    let dx = 0;
    let dy = -1;

    // Use a large enough range to find spots
    // We basically walk a grid in a spiral from (0,0) outwards
    // If a spot is outside the exclusion zone, we place an image there.
    let count = 0;
    let imageIndex = 0;

    // Safety break to prevent infinite loops
    const MAX_SEARCH = 1000;

    while (imageIndex < STAMP_IMAGES.length && count < MAX_SEARCH) {
      count++;

      // We place images everywhere now, even behind the terminal
      // The terminal is z-index 50, stamps are z-index 10+
      const image = STAMP_IMAGES[imageIndex];

      // Add some "jitter" so it doesn't look like a perfect grid
      const jitterX = (rand() - 0.5) * VARIANCE * 2;
      const jitterY = (rand() - 0.5) * VARIANCE * 2;
      const rotation = (rand() - 0.5) * 20; // -10 to 10 degrees

      stamps.push({
        src: image.src,
        x: CX + x * GRID_SIZE + jitterX,
        y: CY + y * GRID_SIZE + jitterY,
        size: image.size,
        rotation: rotation,
      });

      imageIndex++;

      // Move to next point in spiral
      // Logic: if we are at a corner, turn right
      // essentially: if (-x/2 < y <= x/2) -> right?
      // Simpler spiral logic:
      if (x === y || (x < 0 && x === -y) || (x > 0 && x === 1 - y)) {
        const temp = dx;
        dx = -dy;
        dy = temp;
      }
      x += dx;
      y += dy;
    }

    return {
      stamps: stamps.map((s) => ({
        src: s.src,
        position: { x: s.x, y: s.y },
        rotation: s.rotation,
        size: s.size,
      })),
    };
  }, []);

  return { stampPositions };
}

// Canvas dimensions for centering
export const CANVAS_CENTER = { x: CX, y: CY };
