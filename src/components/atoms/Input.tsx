import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`flex-1 bg-transparent outline-none text-base text-[#3E3326] placeholder-[#B5A68F] ${className}`}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
