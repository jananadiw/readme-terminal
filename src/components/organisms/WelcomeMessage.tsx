import ColoredText from "../atoms/ColoredText";
import AsciiHeart from "./AsciiHeart";

export default function WelcomeMessage() {
  return (
    <div>
      <AsciiHeart />
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
