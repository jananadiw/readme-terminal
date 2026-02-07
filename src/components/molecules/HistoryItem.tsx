import { HistoryItem as HistoryItemType } from "@/lib/types";
import TerminalPrompt from "./TerminalPrompt";

interface HistoryItemProps {
  item: HistoryItemType;
}

export default function HistoryItem({ item }: HistoryItemProps) {
  const className = item.type === "input" ? "text-[#9B8B75]" : "text-[#3E3326]";

  return (
    <div className={className}>
      {item.type === "input" && <TerminalPrompt />}
      {typeof item.content === "string" ? (
        <span
          dangerouslySetInnerHTML={{
            __html: item.content.replace(/\n/g, "<br/>"),
          }}
        />
      ) : (
        item.content
      )}
    </div>
  );
}
