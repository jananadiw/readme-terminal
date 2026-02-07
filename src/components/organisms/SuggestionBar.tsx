import SuggestionChip from "../molecules/SuggestionChip";

interface SuggestionBarProps {
  suggestions: readonly string[];
  onSuggestionClick: (suggestion: string) => void;
}

export default function SuggestionBar({
  suggestions,
  onSuggestionClick,
}: SuggestionBarProps) {
  return (
    <div className="flex gap-2 flex-wrap px-5 py-3 border-t border-[#D4C5A9]/50">
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
