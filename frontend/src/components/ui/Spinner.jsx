import { Loader2 } from "lucide-react";
import { cn } from "../../lib/cn.js";

export function Spinner({ className, size = 24 }) {
  return (
    <Loader2
      role="status"
      aria-label="Loading"
      className={cn("animate-spin text-primary", className)}
      size={size}
    />
  );
}

export function FullPageSpinner() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Spinner size={32} />
    </div>
  );
}
