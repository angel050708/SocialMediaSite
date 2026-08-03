import { cn } from "../../lib/cn.js";

const SIZES = {
  sm: "h-9 w-9",
  default: "h-11 w-11",
  lg: "h-16 w-16",
  xl: "h-28 w-28",
};

export function Avatar({ src, alt, size = "default", organic = false, className }) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        "shrink-0 border-2 border-white object-cover shadow-soft",
        organic ? "blob-2" : "rounded-full",
        SIZES[size],
        className,
      )}
    />
  );
}
