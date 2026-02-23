import { HistoryItem as HistoryItemType } from "@/lib/types";
import HistoryItem from "../molecules/HistoryItem";
import { RefObject } from "react";

interface TerminalOutputProps {
  history: HistoryItemType[];
  scrollRef: RefObject<HTMLDivElement | null>;
}

export default function TerminalOutput({
  history,
  scrollRef,
}: TerminalOutputProps) {
  return (
    <div
      ref={scrollRef}
      role="log"
      aria-label="Terminal output"
      aria-live="polite"
      aria-relevant="additions text"
      aria-atomic={false}
      className="flex-1 overflow-y-auto bg-[#F7F9FE] p-3 sm:p-5 space-y-2 text-sm sm:text-base leading-7 terminal-scroll"
    >
      {history.map((item, i) => (
        <HistoryItem key={i} item={item} />
      ))}
    </div>
  );
}
