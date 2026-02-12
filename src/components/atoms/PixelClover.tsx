const CELL = 8;
const COLS = 13;
const ROWS = 16;

const COLORS: Record<number, string> = {
  1: "#0F4D0F",
  2: "#008000",
};

const FOUR_LEAF: number[][] = [
  [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
  [0, 1, 2, 2, 2, 1, 0, 1, 2, 2, 2, 1, 0],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
  [0, 1, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1, 0],
  [0, 0, 1, 2, 1, 1, 1, 1, 1, 2, 1, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 2, 1, 1, 1, 1, 1, 2, 1, 0, 0],
  [0, 1, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1, 0],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
  [0, 1, 2, 2, 2, 1, 0, 1, 2, 2, 2, 1, 0],
  [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
];

const THREE_LEAF: number[][] = [
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0],
  [0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
  [0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
  [0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0],
  [0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0],
  [1, 2, 2, 2, 1, 1, 2, 1, 1, 2, 2, 2, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
  [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
  [1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1],
  [0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
];

interface PixelCloverProps {
  leaves: 3 | 4;
}

export default function PixelClover({ leaves }: PixelCloverProps) {
  const grid = FOUR_LEAF;
  const targetGrid = leaves === 4 ? FOUR_LEAF : THREE_LEAF;

  return (
    <svg
      width={COLS * CELL}
      height={ROWS * CELL}
      viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`}
      aria-label={`${leaves}-leaf clover`}
    >
      {grid.map((row, y) =>
        row.map((cell, x) => {
          if (cell === 0) return null;
          const isVisible = targetGrid[y][x] !== 0;
          return (
            <rect
              key={`${x}-${y}`}
              x={x * CELL}
              y={y * CELL}
              width={CELL}
              height={CELL}
              fill={COLORS[cell]}
              opacity={isVisible ? 1 : 0}
              style={{ transition: "opacity 0.6s ease-in-out" }}
            />
          );
        }),
      )}
    </svg>
  );
}
