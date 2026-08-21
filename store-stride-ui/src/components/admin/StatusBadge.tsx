import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusVariant =
  | "active"
  | "inactive"
  | "pending"
  | "processing"
  | "completed"
  | "cancelled"
  | "shipped"
  | "delivered"
  | "rejected"
  | "approved"
  | "draft"
  | "published"
  | "low-stock"
  | "out-of-stock"
  | "in-stock";

const statusStyles: Record<StatusVariant, { bg: string; text: string; border?: string }> = {
  active: { bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-700 dark:text-green-300", border: "border-green-200 dark:border-green-800" },
  inactive: { bg: "bg-gray-50 dark:bg-gray-900/20", text: "text-gray-600 dark:text-gray-300", border: "border-gray-200 dark:border-gray-800" },
  pending: { bg: "bg-yellow-50 dark:bg-yellow-900/20", text: "text-yellow-700 dark:text-yellow-300", border: "border-yellow-200 dark:border-yellow-800" },
  processing: { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-800" },
  completed: { bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-700 dark:text-green-300", border: "border-green-200 dark:border-green-800" },
  cancelled: { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-700 dark:text-red-300", border: "border-red-200 dark:border-red-800" },
  shipped: { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-800" },
  delivered: { bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-700 dark:text-green-300", border: "border-green-200 dark:border-green-800" },
  rejected: { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-700 dark:text-red-300", border: "border-red-200 dark:border-red-800" },
  approved: { bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-700 dark:text-green-300", border: "border-green-200 dark:border-green-800" },
  draft: { bg: "bg-gray-50 dark:bg-gray-900/20", text: "text-gray-600 dark:text-gray-300", border: "border-gray-200 dark:border-gray-800" },
  published: { bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-700 dark:text-green-300", border: "border-green-200 dark:border-green-800" },
  "low-stock": { bg: "bg-orange-50 dark:bg-orange-900/20", text: "text-orange-700 dark:text-orange-300", border: "border-orange-200 dark:border-orange-800" },
  "out-of-stock": { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-700 dark:text-red-300", border: "border-red-200 dark:border-red-800" },
  "in-stock": { bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-700 dark:text-green-300", border: "border-green-200 dark:border-green-800" },
};

interface StatusBadgeProps {
  status: StatusVariant | string;
  label?: string;
  showDot?: boolean;
}

export function StatusBadge({ status, label, showDot = true }: StatusBadgeProps) {
  const style = statusStyles[status as StatusVariant] || statusStyles.inactive;
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <Badge className={cn("gap-1.5 px-2.5", style.bg, style.text, style.border, "border")}>
      {showDot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {displayLabel}
    </Badge>
  );
}
