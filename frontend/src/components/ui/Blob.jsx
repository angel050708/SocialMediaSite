import { cn } from "../../lib/cn.js";

const SHAPES = ["blob-1", "blob-2", "blob-3"];
const COLORS = {
  primary: "bg-primary/20",
  secondary: "bg-secondary/20",
  accent: "bg-accent/40",
};

export function Blob({ shapeIndex = 0, color = "primary", size = 400, className }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute blur-3xl",
        SHAPES[shapeIndex % SHAPES.length],
        COLORS[color],
        className,
      )}
      style={{ width: size, height: size }}
    />
  );
}
