import { useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, Search, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/common/Price";
import { Header } from "@/components/customer/Header";
import { Footer } from "@/components/customer/Footer";
import { useShop } from "@/store/shop";
import { EmptyState } from "@/components/common/EmptyState";
import { orderService } from "@/services";
import type { Order } from "@/types";

export const Route = createFileRoute("/orders/")({
  component: OrdersPage,
});

function OrdersPage() {
  const navigate = useNavigate();
  const { user } = useShop();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      if (!user) {
        setUserOrders([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const loadedOrders = await orderService.list();
        if (active) setUserOrders(loadedOrders);
      } catch (err) {
        if (active) {
          setUserOrders([]);
          setError(err instanceof Error ? err.message : "Unable to load orders");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadOrders();
    return () => {
      active = false;
    };
  }, [user]);

  const filteredOrders = userOrders.filter((order) =>
    (statusFilter === "all" || order.status === statusFilter) &&
    `${order.id} ${order.items.map((item) => item.name).join(" ")}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
        <div className="mb-7 flex items-center gap-2 text-sm text-slate-500"><Home className="h-4 w-4" /> Home <ChevronRight className="h-4 w-4" /> <span className="font-medium text-slate-900">My Orders</span></div>
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><h1 className="text-3xl font-bold text-slate-900">My Orders</h1><p className="mt-2 text-slate-500">{userOrders.length} {userOrders.length === 1 ? "order" : "orders"}</p></div><div className="flex flex-col gap-3 sm:flex-row"><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700"><option value="all">All Orders</option><option value="pending">Pending</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="replacement_requested">Replacement requested</option></select><div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search orders..." className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-orange-400 sm:w-72" /></div></div></div>

        {loading ? (
          <div className="rounded-lg border p-8 text-center text-gray-600">Loading orders...</div>
        ) : error ? (
          <EmptyState
            title="Unable to load orders"
            description={error}
            action={{
              label: "Try Again",
              onClick: () => window.location.reload(),
            }}
          />
        ) : filteredOrders.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm"><table className="min-w-[900px] w-full text-left"><thead className="border-b border-slate-200 bg-slate-50 text-sm font-medium text-slate-500"><tr><th className="p-5">Order ID</th><th className="p-5">Date</th><th className="p-5">Items</th><th className="p-5">Status</th><th className="p-5">Total</th><th className="p-5">Actions</th></tr></thead><tbody>{filteredOrders.map((order) => <OrderRow key={order.id} order={order} onViewDetails={() => navigate({ to: "/orders/$id", params: { id: order.id } })} />)}</tbody></table></div>
        ) : (
          <EmptyState
            title="No orders found"
            description="You haven't placed any orders yet"
            action={{
              label: "Start Shopping",
              onClick: () => navigate({ to: "/products" }),
            }}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}

function OrderRow({ order, onViewDetails }: { order: Order; onViewDetails: () => void }) {
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const statusLabels: Record<string, string> = {
    pending: "Pending",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50"><td className="p-5"><p className="max-w-56 font-semibold text-slate-900 break-words">{order.id}</p><p className="mt-2 text-sm text-slate-500">Placed on {new Date(order.date).toLocaleString()}</p></td><td className="p-5 font-medium text-slate-800">{new Date(order.date).toLocaleDateString()}<span className="mt-1 block text-sm font-normal text-slate-500">{new Date(order.date).toLocaleTimeString()}</span></td><td className="p-5"><p className="font-medium text-slate-800">{order.items.length} {order.items.length === 1 ? "product" : "products"}</p><p className="mt-1 text-sm text-orange-600">View items</p></td><td className="p-5"><span className={`inline-block rounded-xl px-4 py-2 text-sm font-semibold capitalize ${statusColors[order.status] || "bg-slate-100 text-slate-700"}`}>{statusLabels[order.status] || order.status.replace(/_/g, " ")}</span></td><td className="p-5"><Price value={order.total} className="font-bold text-lg" /><p className="mt-1 text-sm text-slate-500">{order.items.length} item</p></td><td className="p-5"><Button variant="outline" onClick={onViewDetails}><Eye className="mr-2 h-4 w-4" />View Order</Button></td></tr>;
}
