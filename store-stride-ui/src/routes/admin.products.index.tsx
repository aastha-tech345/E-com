import { useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/DataTable";
import { useShop } from "@/store/shop";
import { products } from "@/data/catalog";

export const Route = createFileRoute("/admin/products/")({
  component: AdminProductsPage,
});

function AdminProductsPage() {
  const navigate = useNavigate();
  const { admin } = useShop();

  if (!admin) {
    return null;
  }

  const columns = [
    {
      key: "images",
      label: "Image",
      width: "80px",
      render: (value: string[]) => (
        <img
          src={value[0]}
          alt="product"
          className="w-10 h-10 rounded object-cover bg-gray-100"
        />
      ),
    },
    {
      key: "name",
      label: "Product Name",
      render: (value: string) => (
        <div className="font-medium text-gray-900">{value}</div>
      ),
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
      render: (value: number) => (
        <span className="font-semibold text-gray-900">₹{value}</span>
      ),
    },
    {
      key: "stock",
      label: "Stock",
      render: (value: number, row: any) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            value - row.reserved < row.minStock
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {value - row.reserved}
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
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600">Manage your product catalog</p>
          </div>
          <Button
            onClick={() => navigate({ to: "/admin/products/create" })}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <DataTable
            columns={columns}
            data={products}
            searchFields={["name", "sku", "brand"]}
            actions={[
              {
                label: "Edit",
                onClick: (row) =>
                  navigate({ to: "/admin/products/$id/edit", params: { id: row.id } }),
              },
              {
                label: "Delete",
                onClick: (row) => alert(`Delete product: ${row.name}`),
              },
            ]}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
