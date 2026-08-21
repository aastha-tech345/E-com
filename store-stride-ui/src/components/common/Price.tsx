import { cn } from "@/lib/utils";
import { discountPercent, formatPrice } from "@/lib/format";

export function Price({
  price,
  value,
  mrp,
  size = "md",
  className,
}: {
  price?: number;
  value?: number;
  mrp?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const amount = price ?? value ?? 0;
  const off = mrp ? discountPercent(mrp, amount) : 0;
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl",
  } as const;
  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span className={cn("font-bold tracking-tight", sizes[size])}>{formatPrice(amount)}</span>
      {mrp && off > 0 && (
        <>
          <span className="text-xs text-muted-foreground line-through">{formatPrice(mrp)}</span>
          <span className="text-xs font-semibold text-success">{off}% off</span>
        </>
      )}
    </div>
  );
}
