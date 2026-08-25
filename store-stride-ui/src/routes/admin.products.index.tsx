import { useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Check, Filter, RefreshCw, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/DataTable";
import { useShop } from "@/store/shop";
import { catalogService } from "@/services";
import { toast } from "sonner";
import type { Product } from "@/types";

export const Route = createFileRoute("/admin/products/")({
  component: AdminProductsPage,
});

function ProductThumbnail({ images, name }: { images?: string[]; name: string }) {
  const [failed, setFailed] = useState(false);
  const source = images?.[0];

  if (!source || failed) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded bg-slate-100 text-[10px] font-medium text-slate-500">
        No image
      </div>
    );
  }

  return (
    <img
      src={source}
      alt={name}
      className="h-10 w-10 rounded bg-gray-100 object-cover"
      onError={() => setFailed(true)}
    />
  );
}

function AdminProductsPage() {
  const navigate = useNavigate();
  const { admin, hydrated } = useShop();
  const [page, setPage] = useState(1);
  const [filterField, setFilterField] = useState<"name" | "sku" | "category" | "brand">("name");
  const [filterValue, setFilterValue] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [productRows, setProductRows] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const pageSize = 10;
  const fields = [
    { key: "name", label: "Product Name" },
    { key: "sku", label: "SKU" },
    { key: "category", label: "Category" },
    { key: "brand", label: "Brand" },
  ] as const;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await catalogService.adminProducts({
        q: globalSearch || filterValue,
        field: globalSearch ? "all" : filterField,
        page,
        pageSize,
      });
      setProductRows(result.items);
      setTotal(result.total);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load products.");
    } finally {
      setLoading(false);
    }
  }, [filterField, filterValue, globalSearch, page]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!hydrated) {
    return (
      <AdminLayout>
        <p className="text-sm text-slate-600">Loading products...</p>
      </AdminLayout>
    );
  }

  if (!admin) {
    return null;
  }

  const removeProduct = async (product: Product) => {
    try {
      await catalogService.deleteProduct(product.id);
      toast.success("Product deleted.");
      if (productRows.length === 1 && page > 1) setPage(page - 1);
      else await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete product.");
    }
  };

  const columns = [
    {
      key: "images",
      label: "Image",
      width: "80px",
      render: (value: string[], row: Product) => (
        <ProductThumbnail images={value} name={row.name} />
      ),
    },
    {
      key: "name",
      label: "Product Name",
      render: (value: string) => <div className="font-medium text-gray-900">{value}</div>,
    },
    {
      key: "sku",
      label: "SKU",
      render: (value: string) => (
        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{value}</code>
      ),
    },
    {
      key: "category",
      label: "Category",
    },
    {
      key: "price",
      label: "Price",
      render: (value: number) => <span className="font-semibold text-gray-900">₹{value}</span>,
    },
    {
      key: "stock",
      label: "Stock",
      render: (value: unknown, row: Product) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            Number(value) - row.reserved < row.minStock
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {Number(value) - row.reserved}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            value === "active"
              ? "bg-green-100 text-green-800"
              : value === "draft"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="mt-1 text-sm text-slate-600">Manage your product catalog</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                {fields.find((field) => field.key === filterField)?.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {fields.map((field) => (
                <DropdownMenuItem
                  key={field.key}
                  onClick={() => {
                    setFilterField(field.key);
                    setFilterValue("");
                    setPage(1);
                  }}
                >
                  {field.key === filterField && <Check className="h-4 w-4" />}
                  {field.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="relative w-52">
            <Input
              className="h-9 w-full pr-8"
              value={filterValue}
              onChange={(event) => {
                setFilterValue(event.target.value);
                setPage(1);
              }}
              placeholder={`Filter by ${fields.find((field) => field.key === filterField)?.label.toLowerCase()}...`}
            />
            {filterValue && (
              <button
                type="button"
                aria-label="Clear field filter"
                onClick={() => {
                  setFilterValue("");
                  setPage(1);
                }}
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                className="h-9 pl-9 pr-8"
                value={globalSearch}
                onChange={(event) => {
                  setGlobalSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search all columns..."
              />
              {globalSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setGlobalSearch("");
                    setPage(1);
                  }}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button size="sm" onClick={() => navigate({ to: "/admin/products/create" })}>
              + Add Product
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => {
                setFilterValue("");
                setGlobalSearch("");
                setPage(1);
              }}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={productRows}
          isLoading={loading}
          hideToolbar
          pagination={{ page, pageSize, total, onPageChange: setPage }}
          getRowLabel={(product) => product.name}
          actions={[
            {
              label: "Edit",
              onClick: (row) =>
                navigate({ to: "/admin/products/$id/edit", params: { id: row.id } }),
            },
            {
              label: "Delete",
              onClick: (row) => void removeProduct(row),
            },
          ]}
        />
      </div>
    </AdminLayout>
  );
}
