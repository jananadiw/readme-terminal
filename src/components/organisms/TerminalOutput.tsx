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
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-2 text-sm sm:text-base">
      {history.map((item, i) => (
        <HistoryItem key={i} item={item} />
      ))}
    </div>
  );
}
