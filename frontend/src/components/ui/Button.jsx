import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/cn.js";

const VARIANTS = {
  primary:
    "bg-primary text-primary-foreground shadow-soft hover:shadow-[0_6px_24px_-4px_rgba(93,112,82,0.25)] disabled:hover:shadow-soft",
  outline: "border-2 border-secondary text-secondary bg-transparent hover:bg-secondary/10",
  ghost: "text-primary bg-transparent hover:bg-primary/10",
  destructive: "bg-destructive text-white shadow-soft hover:shadow-[0_6px_24px_-4px_rgba(168,84,72,0.3)]",
};

const SIZES = {
  sm: "h-11 px-6 text-sm",
  default: "h-12 px-8 text-base",
  lg: "h-14 px-10 text-lg",
};

export const Button = forwardRef(function Button(
  { className, variant = "primary", size = "default", loading = false, disabled, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-bold",
        "transition-[transform,box-shadow,background-color,color] duration-200 ease-organic",
        "hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:hover:scale-100",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});
