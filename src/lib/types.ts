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

export type DesktopDockItemId = "about" | "terminal" | "resume";

export interface DesktopDockItem {
  id: DesktopDockItemId;
  label: string;
  kind: "folder" | "terminal" | "resume";
}

export interface AboutPanelLink {
  id: string;
  label: string;
  href?: string;
  action?: "resume";
}

export interface AboutPanelContent {
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  paragraphs: string[];
  links: AboutPanelLink[];
  footer: string;
}
