import { useNavigate, useParams } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, Check, Clock, Package, Box, Printer, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/common/Price";
import { Header } from "@/components/customer/Header";
import { Footer } from "@/components/customer/Footer";
import { EmptyState } from "@/components/common/EmptyState";
import { orderService, returnService } from "@/services";
import { toast } from "sonner";
import type { Order } from "@/types";

export const Route = createFileRoute("/orders/$id")({
  component: OrderDetailsPage,
});

function OrderDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/orders/$id" });
  const [order, setOrder] = useState<Order | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replacementItemId, setReplacementItemId] = useState("");
  const [requestingReplacement, setRequestingReplacement] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadOrder() {
      setLoading(true);
      setError(null);
      try {
        const loadedOrder = await orderService.byId(id);
        if (active) setOrder(loadedOrder);
      } catch (err) {
        if (active) {
          setOrder(undefined);
          setError(err instanceof Error ? err.message : "Unable to load order");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadOrder();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="rounded-lg border p-8 text-center text-gray-600">Loading order...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center py-12">
          <EmptyState
            title={error ? "Unable to load order" : "Order not found"}
            description={error ?? "The order you're looking for doesn't exist"}
            action={{
              label: "Back to Orders",
              onClick: () => navigate({ to: "/orders" }),
            }}
          />
        </div>
        <Footer />
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    replacement_requested: "bg-orange-100 text-orange-800",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate({ to: "/orders" })} className="mb-5 -ml-2 text-slate-700">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>

        </div>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-6 flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-500"><Box className="h-7 w-7" /></div><div><h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Order {order.order_number || order.id}</h1><p className="mt-1 text-sm text-slate-500">Placed on {new Date(order.date).toLocaleString()}</p></div></div>
            <span className={`w-fit rounded-full px-4 py-2 text-sm font-semibold capitalize ${statusColors[order.status] || "bg-slate-100 text-slate-800"}`}>{order.status.replace(/_/g, " ")}</span>
          </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-5 lg:col-span-2">
            {/* Timeline */}
            <div className="rounded-lg border border-slate-200 p-5 md:p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Timeline</h2>
              <div className="space-y-5">
                {order.timeline.map((event, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          event.done ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {event.done ? <Check className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                      </div>
                      {idx < order.timeline.length - 1 && (
                        <div className={`h-10 w-0.5 ${event.done ? "bg-emerald-200" : "bg-slate-200"}`} />
                      )}
                    </div>
                    <div className="pt-1">
                      <p className="font-semibold text-gray-900">{event.label}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="rounded-lg border border-slate-200 p-5 md:p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover bg-gray-100"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                        <Package className="h-6 w-6" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.variant}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <Price value={item.price * item.quantity} className="font-semibold" />
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="rounded-lg border border-slate-200 p-5 md:p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Delivery Address</h2>
              <p className="font-semibold text-gray-900">{order.address.name}</p>
              <p className="text-gray-600">{order.address.phone}</p>
              <p className="text-gray-700 mt-2">
                {order.address.line1}
                <br />
                {order.address.city}, {order.address.state} {order.address.pincode}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5 lg:col-span-1">
            {/* Price Summary */}
            <div className="rounded-lg border border-slate-200 p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Price Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <Price value={order.subtotal} />
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{order.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span>{order.shipping === 0 ? "FREE" : `₹${order.shipping}`}</span>
                </div>
              </div>

              <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <Price value={order.total} />
              </div>
            </div>

            {/* Payment Info */}
            <div className="rounded-lg border border-slate-200 p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Payment</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method</span>
                  <span className="font-semibold text-gray-900">{order.payment.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`font-semibold ${
                      order.payment.status === "paid"
                        ? "text-green-600"
                        : order.payment.status === "pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    {order.payment.status.charAt(0).toUpperCase() + order.payment.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Button className="w-full" variant="outline">
                <Truck className="mr-2 h-4 w-4" /> Track Order
              </Button>
              <Button className="w-full" variant="outline" onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" /> Print Invoice
              </Button>
              {order.status === "delivered" && (
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                  <p className="mb-2 text-sm font-semibold text-orange-900">Need a replacement?</p>
                  <select value={replacementItemId} onChange={(event) => setReplacementItemId(event.target.value)} className="mb-2 h-9 w-full rounded-md border border-orange-200 bg-white px-2 text-sm">
                    <option value="">Select a product</option>
                    {order.items.map((item) => <option key={item.id ?? item.productId} value={item.id ?? ""}>{item.name} ({item.variant})</option>)}
                  </select>
                  <Button className="w-full" variant="outline" disabled={!replacementItemId || requestingReplacement} onClick={async () => {
                    setRequestingReplacement(true);
                    try {
                      await returnService.requestReplacement(replacementItemId, 1);
                      toast.success("Replacement requested. Order status updated.");
                      const refreshed = await orderService.byId(order.id);
                      setOrder(refreshed);
                    } catch (requestError) { toast.error(requestError instanceof Error ? requestError.message : "Unable to request replacement."); }
                    finally { setRequestingReplacement(false); }
                  }}>{requestingReplacement ? "Submitting..." : "Request Replacement"}</Button>
                </div>
              )}
            </div>
          </div>
        </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
