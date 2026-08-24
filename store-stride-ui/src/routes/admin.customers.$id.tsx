import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, MapPin, Package, UserRound } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { type AdminCustomerDetail, customerService } from "@/services";
import { useShop } from "@/store/shop";

export const Route = createFileRoute("/admin/customers/$id")({ component: CustomerDetailPage });

function CustomerDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { admin } = useShop();
  const [customer, setCustomer] = useState<AdminCustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        setCustomer(await customerService.adminById(id));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to load customer details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (!admin) return null;

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-start gap-3 border-b border-slate-200 pb-4">
          <Button variant="outline" size="icon" onClick={() => navigate({ to: "/admin/customers" })} aria-label="Back to customers">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div><h1 className="text-2xl font-bold text-slate-900">Customer Details</h1><p className="mt-1 text-sm text-slate-600">Account metadata and saved delivery addresses.</p></div>
        </div>
        {loading ? <p className="text-sm text-slate-500">Loading customer details...</p> : customer ? <>
          <div className="grid gap-4 md:grid-cols-3">
            <section className="rounded-lg border border-slate-200 bg-white p-5 md:col-span-2"><div className="mb-4 flex items-center gap-2 text-slate-900"><UserRound className="h-5 w-5 text-blue-600" /><h2 className="font-semibold">Profile</h2></div><dl className="grid gap-4 text-sm sm:grid-cols-2"><div><dt className="text-slate-500">Customer name</dt><dd className="mt-1 font-medium">{customer.name}</dd></div><div><dt className="text-slate-500">Email</dt><dd className="mt-1 font-medium">{customer.email}</dd></div><div><dt className="text-slate-500">Status</dt><dd className="mt-1 capitalize font-medium">{customer.status}</dd></div><div><dt className="text-slate-500">Joined</dt><dd className="mt-1 font-medium">{new Date(customer.created_at).toLocaleDateString()}</dd></div></dl></section>
            <section className="rounded-lg border border-slate-200 bg-white p-5"><div className="mb-4 flex items-center gap-2 text-slate-900"><Package className="h-5 w-5 text-blue-600" /><h2 className="font-semibold">Order summary</h2></div><p className="text-2xl font-bold">{customer.orders_count}</p><p className="text-sm text-slate-500">Orders placed</p><p className="mt-4 text-lg font-semibold">Rs. {customer.total_spent.toLocaleString("en-IN")}</p><p className="text-sm text-slate-500">Total spent</p></section>
          </div>
          <section className="rounded-lg border border-slate-200 bg-white p-5"><div className="mb-4 flex items-center gap-2 text-slate-900"><MapPin className="h-5 w-5 text-blue-600" /><h2 className="font-semibold">Saved Addresses</h2></div>{customer.addresses.length === 0 ? <p className="text-sm text-slate-500">No saved addresses yet. Addresses are stored when the customer completes checkout.</p> : <div className="grid gap-3 md:grid-cols-2">{customer.addresses.map((address) => <article key={address.id} className="rounded-md border border-slate-200 p-4 text-sm"><p className="font-semibold">{address.recipient_name}</p><p className="mt-2 text-slate-600">{address.line1}<br />{address.city}, {address.state} - {address.postal_code}</p><p className="mt-3 text-xs text-slate-400">Last used {new Date(address.updated_at).toLocaleDateString()}</p></article>)}</div>}</section>
        </> : <p className="text-sm text-slate-500">Customer record was not found.</p>}
      </div>
    </AdminLayout>
  );
}
