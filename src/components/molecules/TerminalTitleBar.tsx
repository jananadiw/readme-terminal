import { DragControls } from "framer-motion";
import TerminalDot from "../atoms/TerminalDot";

interface TerminalTitleBarProps {
  title: string;
  onMinimize: () => void;
  dragControls: DragControls;
}

export default function TerminalTitleBar({
  title,
  onMinimize,
  dragControls,
}: TerminalTitleBarProps) {
  return (
    <div
      className="flex items-center px-4 h-10 bg-[#E8E0D0]/90 border-b border-[#D4C5A9] cursor-grab active:cursor-grabbing select-none"
      onPointerDown={(e) => {
        // Only start drag if not clicking a dot button
        if (!(e.target as HTMLElement).closest("[data-dot-btn]")) {
          dragControls.start(e);
        }
      }}
    >
      <div className="flex gap-2">
        <TerminalDot color="red" />
        <div data-dot-btn onClick={(e) => { e.stopPropagation(); onMinimize(); }}>
          <TerminalDot color="yellow" />
        </div>
        <TerminalDot color="green" />
      </div>
      <span className="flex-1 text-center text-[#8B7E6A] text-xs tracking-wide">
        {title}
      </span>
      <div className="w-[52px]" />
    </div>
  );
}
