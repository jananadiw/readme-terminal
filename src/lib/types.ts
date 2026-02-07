import { ReactNode } from "react";

export interface HistoryItem {
  type: "input" | "output";
  content: string | ReactNode;
}

export interface StampPosition {
  x: number;
  y: number;
}

export interface StampPositions {
  japan: StampPosition;
  lanka: StampPosition;
}

export interface TerminalState {
  history: HistoryItem[];
  input: string;
}

export type CommandResult = string | ReactNode | undefined;
