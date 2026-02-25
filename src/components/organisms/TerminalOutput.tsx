import { HistoryItem as HistoryItemType } from "@/lib/types";
import { RETRO_CLASSES } from "@/lib/retroClasses";
import HistoryItem from "../molecules/HistoryItem";
import { RefObject } from "react";
import WindowContentArea from "../molecules/WindowContentArea";

interface TerminalOutputProps {
  history: HistoryItemType[];
  scrollRef: RefObject<HTMLDivElement | null>;
  active?: boolean;
}

export default function TerminalOutput({
  history,
  scrollRef,
  active = true,
}: TerminalOutputProps) {
  return (
    <WindowContentArea
      ref={scrollRef}
      role="log"
      aria-label="Terminal output"
      aria-live="polite"
      aria-relevant="additions text"
      aria-atomic={false}
      active={active}
      className={`m-2 mb-0 sm:m-3 sm:mb-0 flex-1 ${RETRO_CLASSES.inset}`}
      viewportClassName="px-3 py-2.5 sm:px-4 sm:py-3 space-y-2 text-sm sm:text-base leading-6 sm:leading-7 terminal-scroll"
    >
      {history.map((item, i) => (
        <HistoryItem key={i} item={item} />
      ))}
    </WindowContentArea>
  );
}
