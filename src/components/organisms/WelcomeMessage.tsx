import ColoredText from "../atoms/ColoredText";
import PixelClover from "../atoms/PixelClover";

interface WelcomeMessageProps {
  hasOutput?: boolean;
}

export default function WelcomeMessage({ hasOutput = false }: WelcomeMessageProps) {
  return (
    <div>
      <div className="py-2">
        <PixelClover leaves={hasOutput ? 4 : 3} />
      </div>
      <div className="mt-2">
        <ColoredText color="#FA766E">Welcome!</ColoredText> I&apos;m
        Jananadi&apos;s portfolio terminal.
      </div>
      <div className="mt-1">
        Type <ColoredText color="#2E6F40">help</ColoredText> for commands, or try
        asking:
      </div>
      <div>{'  • "What do you do?"'}</div>
      <div>{'  • "Tell me about your projects"'}</div>
    </div>
  );
}
