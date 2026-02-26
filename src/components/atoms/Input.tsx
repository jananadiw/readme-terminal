import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/classNames";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-7 flex-1 bg-transparent px-2 py-0.5 text-sm sm:text-base text-[var(--retro-text-primary)] placeholder-[var(--retro-text-subtle)]",
          "outline-none focus:outline-none focus-visible:outline-none disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
