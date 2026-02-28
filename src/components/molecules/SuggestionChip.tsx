import Button from "../atoms/Button";

interface SuggestionChipProps {
  text: string;
  onClick: () => void;
}

export default function SuggestionChip({ text, onClick }: SuggestionChipProps) {
  return (
    <Button
      variant="panelLink"
      onClick={onClick}
      className="max-w-full shrink-0 whitespace-nowrap text-[14px] sm:text-[15px]"
    >
      {text}
    </Button>
  );
}
