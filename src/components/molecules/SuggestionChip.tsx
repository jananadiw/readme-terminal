import Button from "../atoms/Button";

interface SuggestionChipProps {
  text: string;
  onClick: () => void;
}

export default function SuggestionChip({ text, onClick }: SuggestionChipProps) {
  return (
    <Button variant="suggestion" onClick={onClick} className="max-w-full">
      {text}
    </Button>
  );
}
