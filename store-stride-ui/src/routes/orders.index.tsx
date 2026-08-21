import { useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Price } from "@/components/common/Price";
import { Header } from "@/components/customer/Header";
import { Footer } from "@/components/customer/Footer";
import { useShop } from "@/store/shop";
import { orders } from "@/data/catalog";
import { EmptyState } from "@/components/common/EmptyState";

export const Route = createFileRoute("/orders/")({
  component: OrdersPage,
});

function OrdersPage() {
  const navigate = useNavigate();
  const { user } = useShop();
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Mock: use first customer's orders for demo
  const userOrders = orders.slice(0, 8);
  const filteredOrders = statusFilter
    ? userOrders.filter((o) => o.status === statusFilter)
    : userOrders;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600 mb-8">{filteredOrders.length} orders</p>

        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetails={() =>
                  navigate({ to: "/orders/$id", params: { id: order.id } })
                }
              />
            ))}
          </div>
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

function OrderCard({ order, onViewDetails }: any) {
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

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        {/* Order ID */}
        <div>
          <p className="text-sm text-gray-600">Order ID</p>
          <p className="font-semibold text-gray-900">{order.id}</p>
        </div>

        {/* Date */}
        <div>
          <p className="text-sm text-gray-600">Date</p>
          <p className="font-semibold text-gray-900">
            {new Date(order.date).toLocaleDateString()}
          </p>
        </div>

        {/* Items */}
        <div>
          <p className="text-sm text-gray-600">Items</p>
          <p className="font-semibold text-gray-900">{order.items.length} products</p>
        </div>

        {/* Status */}
        <div>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}>
            {statusLabels[order.status] || order.status}
          </span>
        </div>

        {/* Amount & Action */}
        <div className="flex items-center justify-between md:justify-end gap-4">
          <Price value={order.total} className="font-bold text-lg" />
          <Button
            variant="outline"
            size="icon"
            onClick={onViewDetails}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
