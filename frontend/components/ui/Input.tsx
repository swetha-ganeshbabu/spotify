"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full bg-spotify-card text-white placeholder-spotify-light",
          "rounded-full px-5 py-3 text-sm",
          "border border-transparent",
          "focus:outline-none focus:ring-2 focus:ring-spotify-green focus:border-transparent",
          "transition-all",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
