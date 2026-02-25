import { ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/classNames";
import { RETRO_BUTTON_VARIANTS, RETRO_CLASSES } from "@/lib/retroClasses";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: keyof typeof RETRO_BUTTON_VARIANTS;
}

export default function Button({
  children,
  variant = "suggestion",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        RETRO_CLASSES.buttonBase,
        RETRO_CLASSES.focusRing,
        RETRO_BUTTON_VARIANTS[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
