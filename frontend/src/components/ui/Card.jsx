import { cn } from "../../lib/cn.js";

// Each variant sets all four corners in one arbitrary value (CSS order: TL TR BR BL) so a
// shorthand utility can never lose a specificity tie-break against a per-corner longhand.
const RADIUS_VARIANTS = [
  "rounded-[2rem]",
  "rounded-[4rem_2rem_2rem_2rem]",
  "rounded-[2rem_2rem_4rem_2rem]",
  "rounded-[2rem_5rem_2rem_2rem]",
  "rounded-[2rem_2rem_2rem_5rem]",
  "rounded-[4rem_2rem_4rem_2rem]",
];

export function Card({ className, radiusVariant = 0, interactive = false, children, ...props }) {
  return (
    <div
      className={cn(
        "bg-card border border-border/50 shadow-soft transition-[transform,box-shadow] duration-300 ease-organic",
        RADIUS_VARIANTS[radiusVariant % RADIUS_VARIANTS.length],
        interactive && "hover:-translate-y-1 hover:shadow-soft-lg",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
