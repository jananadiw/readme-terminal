import { ReactNode } from "react";

export interface HistoryItem {
  type: "input" | "output";
  content: string | ReactNode;
}

export interface StampPosition {
  x: number;
  y: number;
}

export interface StampConfig {
  src: string;
  position: StampPosition;
  rotation: number;
  size: number;
}

export interface StampPositions {
  stamps: StampConfig[];
}

export interface TerminalState {
  history: HistoryItem[];
  input: string;
}

export type CommandResult = string | ReactNode | undefined;
