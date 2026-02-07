import { HistoryItem as HistoryItemType } from "@/lib/types";
import HistoryItem from "../molecules/HistoryItem";
import { RefObject } from "react";

interface TerminalOutputProps {
  history: HistoryItemType[];
  bottomRef: RefObject<HTMLDivElement | null>;
}

export default function TerminalOutput({
  history,
  bottomRef,
}: TerminalOutputProps) {
  return (
    <div className="flex-1 overflow-y-auto p-5 space-y-2 text-sm">
      {history.map((item, i) => (
        <HistoryItem key={i} item={item} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
