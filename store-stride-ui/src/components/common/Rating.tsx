import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  count,
  size = 14,
  className,
}: {
  value?: number;
  count?: number;
  size?: number;
  className?: string;
}) {
  if (!value) {
    return (
      <div className={cn("flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
        <Star size={size - 3} className="text-muted-foreground/60" aria-hidden />
        <span>No ratings yet</span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <span
        className="inline-flex items-center gap-1 rounded bg-success px-1.5 py-0.5 text-[11px] font-semibold text-success-foreground"
        aria-label={`Rated ${value} out of 5`}
      >
        {value.toFixed(1)}
        <Star size={size - 3} className="fill-current" aria-hidden />
      </span>
      {count != null && (
        <span className="text-xs text-muted-foreground">({count.toLocaleString("en-IN")})</span>
      )}
    </div>
  );
}

export function StarRow({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i <= Math.round(value) ? "fill-accent text-accent" : "text-muted-foreground/40"
          }
          aria-hidden
        />
      ))}
    </div>
  );
}
