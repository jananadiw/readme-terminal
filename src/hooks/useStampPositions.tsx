import { useState, useEffect } from "react";
import { StampPositions } from "@/lib/types";

export function useStampPositions() {
  const [stampPositions, setStampPositions] = useState<StampPositions>({
    japan: { x: 100, y: 64 },
    lanka: { x: 100, y: 70 },
  });

  useEffect(() => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    setStampPositions({
      japan: { x: centerX + 400, y: centerY - 220 },
      lanka: { x: centerX - 560, y: centerY + 180 },
    });
  }, []);

  return { stampPositions };
}
