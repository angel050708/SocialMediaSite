import { forwardRef } from "react";
import { cn } from "../../lib/cn.js";

export const Textarea = forwardRef(function Textarea({ className, error, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-3xl border bg-white/50 px-5 py-4 text-sm text-foreground placeholder:text-muted-foreground",
        "resize-none transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2",
        error ? "border-destructive" : "border-border",
        className,
      )}
      {...props}
    />
  );
});
