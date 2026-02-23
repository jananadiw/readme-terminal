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
    <div className="flex gap-2 flex-wrap px-3 py-2 sm:px-5 sm:py-3 border-t border-[#C9D0DF] bg-[#EDF1FB]">
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
