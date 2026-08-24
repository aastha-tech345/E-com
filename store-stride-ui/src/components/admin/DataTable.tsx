import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

interface DataTableProps {
  columns: Array<{
    key: string;
    label: string;
    width?: string;
    render?: (value: any, row: any) => ReactNode;
  }>;
  data: any[];
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  emptyAction?: ReactNode;
  onSearch?: (query: string) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  rowActions?: (row: any) => ReactNode;
  className?: string;
}

export function DataTable({
  columns,
  data,
  isLoading = false,
  isEmpty = false,
  emptyMessage = "No data found",
  emptyAction,
  onSearch,
  pagination,
  rowActions,
  className,
}: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

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

  // Empty state
  if (isEmpty || data.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground font-medium mb-2">{emptyMessage}</p>
          {emptyAction && <div className="mt-4">{emptyAction}</div>}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      {onSearch && (
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 h-9"
          />
        </div>
      )}

      {/* Table */}
      <Card className={className}>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.key} style={{ width: col.width }} className="font-semibold">
                    {col.label}
                  </TableHead>
                ))}
                {rowActions && <TableHead className="w-12">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, idx) => (
                <TableRow key={idx} className="hover:bg-muted/50 transition-colors">
                  {columns.map((col) => (
                    <TableCell key={`${idx}-${col.key}`} className="py-3">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </TableCell>
                  ))}
                  {rowActions && (
                    <TableCell className="text-right pr-4">
                      {rowActions(row)}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.total > 0 && (
        <div className="flex items-center justify-between">
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
              onClick={() =>
                pagination.onPageChange(
                  Math.max(1, pagination.page - 1)
                )
              }
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {pagination.page}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() =>
                pagination.onPageChange(pagination.page + 1)
              }
              disabled={
                pagination.page >=
                Math.ceil(pagination.total / pagination.pageSize)
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
