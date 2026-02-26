import { DragControls } from "framer-motion";
import ClassicWindowTitleBar from "./ClassicWindowTitleBar";

interface TerminalTitleBarProps {
  title: string;
  onClose: () => void;
  dragControls: DragControls;
  active?: boolean;
}

export default function TerminalTitleBar({
  title,
  onClose,
  dragControls,
  active = true,
}: TerminalTitleBarProps) {
  return (
    <ClassicWindowTitleBar
      title={title}
      active={active}
      primaryActionLabel="Close terminal"
      primaryActionIcon="close"
      onPrimaryAction={onClose}
      className="cursor-grab active:cursor-grabbing select-none"
      onBarPointerDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
        dragControls.start(event);
      }}
    />
  );
}
