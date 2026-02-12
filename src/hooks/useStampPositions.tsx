"use client";

import { useEffect, useState } from "react";
import { StampPositions } from "@/lib/types";

const EXCLUDED = ["animated_heart.png", "crumbled_bg.jpg", "heart.png"];

const ALL_IMAGES = [
  "boardingpass.png",
  "floppy.png",
  "eiffel.png",
  "harderkulm.png",
  "swisapls.png",
  "fujiyoshida.png",
  "perruche.png",
  "nystamp.png",
  "kiyomisutemple.png",
  "parisdeli.png",
  "usa_stamp.png",
  "pastrypicnic.png",
  "Rome.png",
  "greece.png",
  "seoul.png",
  "handmadechoco.png",
  "JR.png",
  "colstamp.png",
  "journal.png",
  "bizzaria.png",
  "parismurals.png",
  "busan.png",
  "japanbill.png",
  "parisdeli2.png",
  "firenze.png",
  "shoes.png",
  "austria.png",
  "shakespeare.png",
  "spain.png",
  "pompei.png",
  "wien.png",
  "vatican.png",
  "stPeters.png",
  "sl_stamp.png",
  "kiyotemple.png",
  "zurich.png",
  "vietnam.png",
  "brandi.png",
  "japsalttoek.png",
  "malta.png",
  "WienLib.png",
];

const IMAGES = ALL_IMAGES.filter((img) => !EXCLUDED.includes(img));

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const GAP = 40;

function rectsOverlap(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number },
) {
  return (
    a.x < b.x + b.w + GAP &&
    a.x + a.w + GAP > b.x &&
    a.y < b.y + b.h + GAP &&
    a.y + a.h + GAP > b.y
  );
}

export function useStampPositions() {
  const [stampPositions, setStampPositions] = useState<StampPositions | null>(
    null,
  );

  useEffect(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pad = 300;
    const ox = -pad;
    const oy = -pad;
    const canvasW = vw + pad * 2;
    const canvasH = vh + pad * 2;

    // Terminal exclusion zone at center
    const termX = vw / 2 - 360;
    const termY = vh / 2 - 280;
    const termW = 720;
    const termH = 560;

    const placed: { x: number; y: number; w: number; h: number }[] = [];
    const stamps = IMAGES.map((src, i) => {
      const size = 180 + seededRandom(i + 50) * 140;
      const rotation = (seededRandom(i + 1) - 0.5) * 16;

      let bestX = 0,
        bestY = 0,
        found = false;
      for (let attempt = 0; attempt < 500; attempt++) {
        const x = ox + seededRandom(i * 200 + attempt) * (canvasW - size);
        const y = oy + seededRandom(i * 200 + attempt + 777) * (canvasH - size);
        const candidate = { x, y, w: size, h: size };

        const overlapsTerm =
          x < termX + termW &&
          x + size > termX &&
          y < termY + termH &&
          y + size > termY;

        if (!overlapsTerm && !placed.some((p) => rectsOverlap(candidate, p))) {
          bestX = x;
          bestY = y;
          placed.push(candidate);
          found = true;
          break;
        }
      }

      if (!found) {
        const angle = i * 2.39996;
        const r = 500 + i * 40;
        bestX = vw / 2 + Math.cos(angle) * r;
        bestY = vh / 2 + Math.sin(angle) * r;
        placed.push({ x: bestX, y: bestY, w: size, h: size });
      }

      return {
        src: `/${src}`,
        position: { x: bestX, y: bestY },
        rotation,
        size,
      };
    });

    setStampPositions({ stamps });
  }, []);

  return { stampPositions };
}
