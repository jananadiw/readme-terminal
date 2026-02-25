import { DragControls } from "framer-motion";
import ClassicWindowTitleBar from "./ClassicWindowTitleBar";

interface TerminalTitleBarProps {
  title: string;
  onClose: () => void;
  onMinimize: () => void;
  dragControls: DragControls;
  active?: boolean;
}

export default function TerminalTitleBar({
  title,
  onClose,
  onMinimize,
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
      secondaryActionLabel="Minimize terminal"
      secondaryActionIcon="minimize"
      onSecondaryAction={onMinimize}
      className="cursor-grab active:cursor-grabbing select-none"
      onBarPointerDown={(event) => {
        dragControls.start(event);
      }}
    />
  );
}
