import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "suggestion" | "primary" | "ghost";
}

const VARIANT_CLASSES = {
  suggestion:
    "px-3 py-1.5 bg-[#E8E0D0] hover:bg-[#DDD3BF] border border-[#D4C5A9] rounded-full text-base text-[#6B5D4F] hover:text-[#3E3326] transition-colors",
  primary:
    "px-4 py-2 bg-[#2E6F40] hover:bg-[#366899] text-white rounded transition-colors",
  ghost:
    "px-4 py-2 bg-transparent hover:bg-[#E8E0D0]/50 text-[#3E3326] rounded transition-colors",
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
