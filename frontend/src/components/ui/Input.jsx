import { forwardRef } from "react";
import { cn } from "../../lib/cn.js";

export const Input = forwardRef(function Input({ className, error, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-12 w-full rounded-full border bg-white/50 px-5 text-sm text-foreground placeholder:text-muted-foreground",
        "transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2",
        error ? "border-destructive" : "border-border",
        className,
      )}
      {...props}
    />
  );
});
