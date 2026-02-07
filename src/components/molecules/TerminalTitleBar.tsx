import TerminalDot from "../atoms/TerminalDot";

interface TerminalTitleBarProps {
  title: string;
}

export default function TerminalTitleBar({ title }: TerminalTitleBarProps) {
  return (
    <div className="flex items-center px-4 h-10 bg-[#E8E0D0]/90 border-b border-[#D4C5A9]">
      <div className="flex gap-2">
        <TerminalDot color="red" />
        <TerminalDot color="yellow" />
        <TerminalDot color="green" />
      </div>
      <span className="flex-1 text-center text-[#8B7E6A] text-xs tracking-wide">
        {title}
      </span>
      <div className="w-[52px]" />
    </div>
  );
}
