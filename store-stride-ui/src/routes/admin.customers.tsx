import { createFileRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/DataTable";
import { type AdminCustomer, customerService } from "@/services";
import { useShop } from "@/store/shop";

export const Route = createFileRoute("/admin/customers")({ component: AdminCustomers });

function AdminCustomers() {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin } = useShop();
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterField, setFilterField] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const load = async () => {
    setLoading(true);
    try {
      const result = await customerService.adminList({ q: search, field: filterField, page, pageSize });
      setCustomers(result.items);
      setTotal(result.total);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [page, search, filterField]);

  if (!admin) return null;

  // File-based routing makes the detail route a child of this list route.
  // Render only the child page when a customer id is present in the URL.
  if (location.pathname !== "/admin/customers") return <Outlet />;

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-bold text-slate-900">Customers Management</h1>
          <p className="mt-1 text-sm text-slate-600">View all registered customer accounts.</p>
        </div>
        <DataTable
          columns={[
            { key: "name", label: "Customer" },
            { key: "email", label: "Email" },
            {
              key: "status",
              label: "Status",
              render: (value: string) => <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium capitalize text-emerald-700">{value}</span>,
            },
            { key: "created_at", label: "Joined", render: (value: string) => new Date(value).toLocaleDateString() },
          ]}
          data={customers}
          isLoading={loading}
          searchFields={["name", "email", "status"]}
          fieldSearchPlaceholder={`Filter by ${filterField === "all" ? "customer" : filterField}...`}
          onFieldSearch={(query) => {
            setSearch(query);
            setPage(1);
          }}
          onSearch={(query) => {
            setFilterField("all");
            setSearch(query);
            setPage(1);
          }}
          filterLabel="All columns"
          filterValue={filterField}
          onFilterChange={(value) => { setFilterField(value); setPage(1); }}
          filterOptions={[{ label: "All columns", value: "all" }, { label: "Customer", value: "name" }, { label: "Email", value: "email" }, { label: "Status", value: "status" }, { label: "Joined", value: "created_at" }]}
          searchPlaceholder="Search customers..."
          onRefresh={() => void load()}
          pagination={{ page, pageSize, total, onPageChange: setPage }}
          actions={[{ label: "View", onClick: (customer) => navigate({ to: "/admin/customers/$id", params: { id: customer.id } }) }]}
        />
      </div>
    </AdminLayout>
  );
}
