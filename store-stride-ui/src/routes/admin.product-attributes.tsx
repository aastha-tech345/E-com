import { useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/DataTable";
import { useShop } from "@/store/shop";
import { productAttributes } from "@/data/catalog";

export const Route = createFileRoute("/admin/product-attributes")({
  component: AdminAttributesPage,
});

function AdminAttributesPage() {
  const navigate = useNavigate();
  const { admin } = useShop();

  if (!admin) {
    return null;
  }

  const columns = [
    {
      key: "name",
      label: "Attribute Name",
      render: (value: string) => <div className="font-medium text-gray-900">{value}</div>,
    },
    {
      key: "type",
      label: "Type",
      render: (value: string) => <span className="text-gray-600 capitalize">{value}</span>,
    },
    {
      key: "values",
      label: "Values",
      render: (value: string[]) => (
        <div className="flex gap-1 flex-wrap">
          {value.slice(0, 3).map((v, i) => (
            <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
              {v}
            </span>
          ))}
          {value.length > 3 && <span className="text-gray-600 text-xs">+{value.length - 3}</span>}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Attributes</h1>
            <p className="text-gray-600">Manage product attributes and variants</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Attribute
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <DataTable
            columns={columns}
            data={productAttributes}
            searchFields={["name"]}
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
