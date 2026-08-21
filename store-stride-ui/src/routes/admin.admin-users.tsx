import { useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Edit, Trash2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/DataTable";
import { useShop } from "@/store/shop";
import { adminUsers } from "@/data/catalog";

export const Route = createFileRoute("/admin/admin-users")({
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const navigate = useNavigate();
  const { admin } = useShop();

  if (!admin) {
    return null;
  }

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (value: string) => (
        <div className="font-medium text-gray-900">{value}</div>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (value: string) => (
        <span className="text-gray-600">{value}</span>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (value: string) => (
        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm font-medium">
          <Shield className="w-3 h-3" />
          {value}
        </span>
      ),
    },
    {
      key: "lastActive",
      label: "Last Active",
      render: (value: string) => (
        <span className="text-gray-600">
          {new Date(value).toLocaleDateString()}
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
            <h1 className="text-2xl font-bold text-gray-900">Admin Users</h1>
            <p className="text-gray-600">Manage admin accounts and permissions</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Admin
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <DataTable
            columns={columns}
            data={adminUsers}
            searchFields={["name", "email", "role"]}
            actions={[
              {
                label: "Edit",
                onClick: (row) => alert(`Edit user: ${row.name}`),
              },
              {
                label: "Deactivate",
                onClick: (row) => alert(`Deactivate user: ${row.name}`),
              },
            ]}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
