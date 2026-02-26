import { HistoryItem as HistoryItemType } from "@/lib/types";
import TerminalPrompt from "./TerminalPrompt";

interface HistoryItemProps {
  item: HistoryItemType;
}

export default function HistoryItem({ item }: HistoryItemProps) {
  const className =
    item.type === "input"
      ? "text-[var(--retro-accent-blue-text)]"
      : "text-[var(--retro-accent-blue-text)]";

  return (
    <div className={className}>
      {item.type === "input" && <TerminalPrompt />}
      {typeof item.content === "string" ? (
        <span className="whitespace-pre-wrap break-words">{item.content}</span>
      ) : (
        item.content
      )}
    </div>
  );
}
