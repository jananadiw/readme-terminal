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
      className="flex items-center px-4 h-11 bg-[#DFE4F0] border-b border-[#C8CFDD] cursor-grab active:cursor-grabbing select-none"
      onPointerDown={(e) => {
        // Only start drag if not clicking a dot button
        if (!(e.target as HTMLElement).closest("[data-dot-btn]")) {
          dragControls.start(e);
        }
      }}
    >
      <div className="flex gap-2" role="group" aria-label="Window controls">
        <span className="grid place-items-center w-6 h-6" aria-hidden="true">
          <TerminalDot color="red" />
        </span>
        <button
          type="button"
          data-dot-btn
          aria-label="Minimize terminal"
          title="Minimize terminal"
          className="grid place-items-center w-6 h-6 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D26CC]/35"
          onClick={(e) => {
            e.stopPropagation();
            onMinimize();
          }}
        >
          <TerminalDot color="yellow" />
        </button>
        <span className="grid place-items-center w-6 h-6" aria-hidden="true">
          <TerminalDot color="green" />
        </span>
      </div>
      <span className="flex-1 text-center text-[#5C6273] text-xs tracking-[0.12em] font-medium">
        {title}
      </span>
      <div className="w-[60px]" />
    </div>
  );
}
