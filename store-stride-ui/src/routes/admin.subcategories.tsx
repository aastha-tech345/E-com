import { useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/DataTable";
import { useShop } from "@/store/shop";
import { categories } from "@/data/catalog";

export const Route = createFileRoute("/admin/subcategories")({
  component: AdminSubcategoriesPage,
});

function AdminSubcategoriesPage() {
  const navigate = useNavigate();
  const { admin } = useShop();

  if (!admin) {
    return null;
  }

  const subcategories = categories.flatMap((cat) =>
    cat.subcategories.map((sub) => ({
      ...sub,
      categoryName: cat.name,
      categoryId: cat.id,
    }))
  );

  const columns = [
    {
      key: "name",
      label: "Subcategory Name",
      render: (value: string) => (
        <div className="font-medium text-gray-900">{value}</div>
      ),
    },
    {
      key: "categoryName",
      label: "Category",
      render: (value: string) => (
        <span className="text-gray-600">{value}</span>
      ),
    },
    {
      key: "slug",
      label: "Slug",
      render: (value: string) => (
        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{value}</code>
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
            <h1 className="text-2xl font-bold text-gray-900">Subcategories</h1>
            <p className="text-gray-600">Manage product subcategories</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Subcategory
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <DataTable
            columns={columns}
            data={subcategories}
            searchFields={["name", "categoryName"]}
            actions={[
              {
                label: "Edit",
                onClick: (row) => alert(`Edit: ${row.name}`),
              },
              {
                label: "Delete",
                onClick: (row) => alert(`Delete: ${row.name}`),
              },
            ]}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
