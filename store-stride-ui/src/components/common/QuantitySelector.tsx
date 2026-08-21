import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuantitySelector({
  value,
  onChange,
  max = 10,
  min = 1,
}: {
  value: number;
  onChange: (next: number) => void;
  max?: number;
  min?: number;
}) {
  return (
    <div className="inline-flex items-center rounded-md border">
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-r-none"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={15} />
      </Button>
      <span className="w-10 text-center text-sm font-medium tabular-nums" aria-live="polite">
        {value}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-l-none"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={15} />
      </Button>
    </div>
  );
}
