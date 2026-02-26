import Button from "../atoms/Button";

interface SuggestionChipProps {
  text: string;
  onClick: () => void;
}

export default function SuggestionChip({ text, onClick }: SuggestionChipProps) {
  return (
    <Button variant="panelLink" onClick={onClick} className="max-w-full text-[15px]">
      {text}
    </Button>
  );
}
