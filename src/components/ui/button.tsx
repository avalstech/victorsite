import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const v =
      variant === "default"
        ? "bg-brand-600 text-white hover:bg-brand-700"
        : variant === "secondary"
          ? "bg-slate-900 text-white hover:bg-slate-800"
          : variant === "outline"
            ? "border border-slate-200 hover:bg-slate-50"
            : "hover:bg-slate-50";
    const s = size === "sm" ? "h-9 px-3 text-sm" : size === "lg" ? "h-12 px-5 text-base" : "h-10 px-4 text-sm";
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition focus:outline-none focus:ring-2 focus:ring-brand-300 disabled:opacity-50 disabled:pointer-events-none",
          v,
          s,
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
