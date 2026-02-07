import { ReactNode } from "react";

interface SparkleTextProps {
  children: ReactNode;
  delay?: number;
}

export default function SparkleText({ children, delay = 0 }: SparkleTextProps) {
  return (
    <span
      className="inline-block animate-sparkle text-[#FFCC00]"
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </span>
  );
}
