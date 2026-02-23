import { InputHTMLAttributes, forwardRef } from "react";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`flex-1 rounded-md bg-transparent px-1 py-0.5 text-base text-[#2F2D31] placeholder-[#7D7467] outline-none focus-visible:ring-2 focus-visible:ring-[#0D26CC]/30 ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
