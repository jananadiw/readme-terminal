"use client";

import { useTerminal } from "@/hooks/useTerminal";
import { useWhoami } from "@/hooks/useWhoami";
import { useStampPositions } from "@/hooks/useStampPositions";
import DraggableStamp from "@/components/organisms/DraggableStamp";
import TerminalWindow from "@/components/organisms/TerminalWindow";

export default function HomeTemplate() {
  const { content: whoamiContent } = useWhoami();
  const { stampPositions } = useStampPositions();
  const { history, input, setInput, handleSubmit, bottomRef, inputRef } =
    useTerminal(whoamiContent);

  return (
    <div className="h-screen flex items-center justify-center p-8 relative">
      {/* Memory collage - draggable stamps scattered around terminal */}
      <DraggableStamp
        src="/janan.png"
        alt="Fujiyoshida, Japan"
        initialX={stampPositions.japan.x}
        initialY={stampPositions.japan.y}
        initialRotation={3}
        size={160}
        zIndex={10}
      />

      <DraggableStamp
        src="/lanka.png"
        alt="Ceylon, Sri Lanka"
        initialX={stampPositions.lanka.x}
        initialY={stampPositions.lanka.y}
        initialRotation={5}
        size={144}
        zIndex={10}
      />

      {/* Ghostty-style terminal — centered window */}
      <TerminalWindow
        history={history}
        input={input}
        onInputChange={setInput}
        onSubmit={() => handleSubmit()}
        onSuggestionClick={handleSubmit}
        inputRef={inputRef}
        bottomRef={bottomRef}
      />
    </div>
  );
}
