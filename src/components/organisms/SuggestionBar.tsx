import SuggestionChip from "../molecules/SuggestionChip";
import { RETRO_CLASSES } from "@/lib/retroClasses";

interface SuggestionBarProps {
  suggestions: readonly string[];
  onSuggestionClick: (suggestion: string) => void;
}

export default function SuggestionBar({
  suggestions,
  onSuggestionClick,
}: SuggestionBarProps) {
  return (
    <div className={`flex gap-2 flex-wrap px-2.5 py-2 sm:px-4 sm:py-2.5 ${RETRO_CLASSES.toolbarRow}`}>
      {suggestions.map((suggestion) => (
        <SuggestionChip
          key={suggestion}
          text={suggestion}
          onClick={() => onSuggestionClick(suggestion)}
        />
      ))}
    </div>
  );
}
