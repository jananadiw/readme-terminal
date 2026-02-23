import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "suggestion" | "primary" | "ghost";
}

const VARIANT_CLASSES = {
  suggestion:
    "px-3 py-1.5 rounded-full border border-[#C6CBDA] bg-[#E7EBF7] text-base text-[#51483C] hover:bg-[#DCE3F2] hover:text-[#2F2D31] transition-colors duration-150 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D26CC]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F6FC]",
  primary:
    "px-4 py-2 rounded border border-[#255A34] bg-[#2E6F40] text-white hover:bg-[#245E34] transition-colors duration-150 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D26CC]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F6FC]",
  ghost:
    "px-4 py-2 rounded border border-transparent bg-transparent text-[#3E3326] hover:bg-[#E8E0D0]/50 transition-colors duration-150 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D26CC]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4F6FC]",
} as const;

export default function Button({
  children,
  variant = "suggestion",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button className={`${VARIANT_CLASSES[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
