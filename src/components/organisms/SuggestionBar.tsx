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
    <div
      className={`retro-hide-native-scrollbar flex flex-nowrap gap-1.5 overflow-x-auto px-2.5 py-2 sm:flex-wrap sm:gap-2 sm:overflow-visible sm:px-4 sm:py-2.5 font-[Inconsolata] text-[var(--retro-accent-blue-text)] ${RETRO_CLASSES.toolbarRow}`}
    >
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
