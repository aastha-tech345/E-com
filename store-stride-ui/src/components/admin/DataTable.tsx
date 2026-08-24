import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreVertical,
  RefreshCw,
  Plus,
  Check,
  ArrowDownUp,
  X,
} from "lucide-react";
import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { ConfirmationDialog } from "@/components/admin/ConfirmationDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableProps<T extends object> {
  columns: Array<{
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
    render?: (value: never, row: T) => ReactNode;
  }>;
  data: T[];
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  emptyAction?: ReactNode;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  filterLabel?: string;
  filterOptions?: Array<string | { label: string; value: string }>;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  onFieldSearch?: (query: string) => void;
  fieldSearchPlaceholder?: string;
  onRefresh?: () => void;
  addAction?: { label: string; onClick: () => void };
  searchFields?: string[];
  actions?: Array<{ label: string; onClick: (row: T) => void }>;
  getRowLabel?: (row: T) => string;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  rowActions?: (row: T) => ReactNode;
  className?: string;
  hideToolbar?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (column: string, order: "asc" | "desc") => void;
}

export function DataTable<T extends object>({
  columns,
  data,
  isLoading = false,
  isEmpty = false,
  emptyMessage = "No data found",
  emptyAction,
  onSearch,
  searchPlaceholder = "Search records...",
  filterLabel = "Filter",
  filterOptions = [],
  filterValue,
  onFilterChange,
  onFieldSearch,
  fieldSearchPlaceholder = "Filter by selected field...",
  onRefresh,
  addAction,
  searchFields = [],
  actions,
  getRowLabel,
  pagination,
  rowActions,
  className,
  hideToolbar = false,
  sortBy,
  sortOrder = "desc",
  onSort,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [fieldSearchQuery, setFieldSearchQuery] = useState("");
  const [internalFilter, setInternalFilter] = useState(filterValue ?? "all");
  const [pendingDelete, setPendingDelete] = useState<{ action: { label: string; onClick: (row: T) => void }; row: T } | null>(null);
  const activeFilter = filterValue ?? internalFilter;
  const selectedFilterOption = filterOptions.find(
    (option) => (typeof option === "string" ? option : option.value) === activeFilter,
  );
  const activeFilterLabel =
    typeof selectedFilterOption === "object" ? selectedFilterOption.label : filterLabel;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const filteredData =
    searchQuery && !onSearch
      ? data.filter((row) =>
          searchFields.some((field) =>
            String((row as Record<string, unknown>)[field] ?? "")
              .toLowerCase()
              .includes(searchQuery.toLowerCase()),
          ),
        )
      : data;
  const effectiveRowActions =
    rowActions ??
    (actions
      ? (row: T) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {actions.map((action) => (
                <DropdownMenuItem
                  key={action.label}
                  className={action.label.toLowerCase() === "delete" ? "text-red-600 focus:text-red-600" : undefined}
                  onClick={() => {
                    if (action.label.toLowerCase() === "delete") setPendingDelete({ action, row });
                    else action.onClick(row);
                  }}
                >
                  {action.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      : undefined);

  // Loading state
  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.key} style={{ width: col.width }}>
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={`${i}-${col.key}`}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  const showEmpty = isEmpty || filteredData.length === 0;

  return (
    <div className="space-y-4">
      {!hideToolbar && (onSearch || searchFields.length > 0 || addAction || onRefresh) && (
        <Card className="border-slate-200 shadow-none">
          <CardContent className="flex flex-wrap items-center gap-3 p-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  {activeFilterLabel}
                </Button>
              </DropdownMenuTrigger>
              {filterOptions.length > 0 && (
                <DropdownMenuContent align="start">
                  {filterOptions.map((option) => {
                    const value = typeof option === "string" ? option : option.value;
                    const label = typeof option === "string" ? option : option.label;
                    return (
                    <DropdownMenuItem key={value} onClick={() => {
                      setInternalFilter(value);
                      onFilterChange?.(value);
                    }}>
                      {value === activeFilter && <Check className="h-3.5 w-3.5" />}
                      {label}
                    </DropdownMenuItem>
                  )})}
                </DropdownMenuContent>
              )}
            </DropdownMenu>
            <div className="relative w-full min-w-0 sm:w-52">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder={fieldSearchPlaceholder}
                value={fieldSearchQuery}
                onChange={(event) => {
                  setFieldSearchQuery(event.target.value);
                  onFieldSearch?.(event.target.value);
                }}
                className="h-9 pl-9 pr-8"
              />
              {fieldSearchQuery && (
                <button
                  type="button"
                  aria-label="Clear field filter"
                  onClick={() => {
                    setFieldSearchQuery("");
                    onFieldSearch?.("");
                  }}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="ml-auto flex w-full items-center gap-2 sm:w-auto">
              <div className="relative min-w-0 flex-1 sm:w-64 sm:flex-none">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="h-9 pl-9 pr-8"
                />
                {searchQuery && (
                  <button
                    type="button"
                    aria-label="Clear global search"
                    onClick={() => handleSearch("")}
                    className="absolute right-2 top-2 text-slate-400 hover:text-slate-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {addAction && (
                <Button size="sm" onClick={addAction.onClick}>
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  {addAction.label}
                </Button>
              )}
              {onRefresh && (
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={onRefresh}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card className={cn("border-slate-200 shadow-none", className)}>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    style={{ width: col.width }}
                    onClick={() => {
                      if (!col.sortable || !onSort) return;
                      onSort(col.key, sortBy === col.key && sortOrder === "asc" ? "desc" : "asc");
                    }}
                    className={cn(
                      "h-9 bg-slate-50 text-xs font-semibold text-slate-500",
                      col.sortable && onSort && "cursor-pointer select-none hover:bg-slate-100",
                    )}
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {col.sortable && <ArrowDownUp className={cn("h-3.5 w-3.5", sortBy === col.key && "text-blue-600")} />}
                    </span>
                  </TableHead>
                ))}
                {effectiveRowActions && <TableHead className="w-12">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {showEmpty ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (effectiveRowActions ? 1 : 0)} className="py-12 text-center">
                    <Search className="mx-auto mb-3 h-9 w-9 text-slate-300" />
                    <p className="font-medium text-slate-600">{emptyMessage}</p>
                    {emptyAction && <div className="mt-4">{emptyAction}</div>}
                  </TableCell>
                </TableRow>
              ) : filteredData.map((row, idx) => (
                <TableRow key={idx} className="hover:bg-muted/50 transition-colors">
                  {columns.map((col) => (
                    <TableCell key={`${idx}-${col.key}`} className="py-2.5 text-sm">
                      {col.render
                        ? col.render((row as Record<string, unknown>)[col.key] as never, row)
                        : String((row as Record<string, unknown>)[col.key] ?? "")}
                    </TableCell>
                  ))}
                  {effectiveRowActions && (
                    <TableCell className="text-right pr-4">{effectiveRowActions(row)}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.total > 0 && (
        <Card className="border-slate-200 shadow-none">
          <CardContent className="flex items-center justify-between py-3">
            <p className="text-sm text-muted-foreground">
              Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
              {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{" "}
              {pagination.total} results
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => pagination.onPageChange(Math.max(1, pagination.page - 1))}
                disabled={pagination.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">Page {pagination.page}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => pagination.onPageChange(pagination.page + 1)}
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      <ConfirmationDialog
        open={Boolean(pendingDelete)}
        title="Delete record?"
        description={`This will remove ${pendingDelete ? getRowLabel?.(pendingDelete.row) ?? "this record" : "this record"}. This action can be restored only where soft-delete is supported.`}
        confirmLabel="Delete"
        destructive
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        onConfirm={() => {
          if (pendingDelete) pendingDelete.action.onClick(pendingDelete.row);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
