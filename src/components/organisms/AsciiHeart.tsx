import ColoredText from "../atoms/ColoredText";
import SparkleText from "../atoms/SparkleText";

export default function AsciiHeart() {
  return (
    <div className="leading-[1.2] text-[9px] select-none whitespace-pre">
      <div>
        {"      "}
        <SparkleText delay={0}>*</SparkleText>
        {"  "}
        <ColoredText>####</ColoredText>
        {"         "}
        <ColoredText>####</ColoredText>
        {"    "}
        <SparkleText delay={1.8}>||</SparkleText>
      </div>
      <div>
        {"       "}
        <ColoredText>########</ColoredText>
        {"     "}
        <ColoredText>########</ColoredText>
        {"  "}
        <SparkleText delay={0.5}>*</SparkleText>
      </div>
      <div>
        {"  "}
        <SparkleText delay={2.2}>+</SparkleText>
        {"   "}
        <ColoredText>######################</ColoredText>
      </div>
      <div>
        {"       "}
        <ColoredText>####################</ColoredText>
      </div>
      <div>
        {"        "}
        <ColoredText>##################</ColoredText>
        {"  "}
        <SparkleText delay={1.2}>--</SparkleText>
      </div>
      <div>
        {"          "}
        <ColoredText>##############</ColoredText>
      </div>
      <div>
        {"     "}
        <SparkleText delay={0.8}>*</SparkleText>
        {"     "}
        <ColoredText>##########</ColoredText>
        {"  "}
        <SparkleText delay={2.5}>+</SparkleText>
      </div>
      <div>
        {"              "}
        <ColoredText>######</ColoredText>
      </div>
      <div>
        {"          "}
        <SparkleText delay={1.5}>--</SparkleText>
        {"    "}
        <ColoredText>##</ColoredText>
        {"  "}
        <SparkleText delay={0.3}>*</SparkleText>
      </div>
    </div>
  );
}
