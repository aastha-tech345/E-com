import { cn } from "@/lib/utils";

export function SiteLogo({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#151a20] shadow-sm shadow-[#7c4a24]/20 ring-1 ring-[#d8c2a2]/50",
        sizes[size],
        className,
      )}
    >
      <img src="/eagle-sun-logo.svg" alt="ShopNest" className="h-full w-full object-cover" />
    </span>
  );
}
