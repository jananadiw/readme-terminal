import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/classNames";
import { RETRO_CLASSES } from "@/lib/retroClasses";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-7 flex-1 bg-transparent px-2 py-0.5 text-sm sm:text-base text-[var(--retro-text-primary)] placeholder-[var(--retro-text-subtle)]",
          "disabled:cursor-not-allowed",
          RETRO_CLASSES.focusRing,
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
