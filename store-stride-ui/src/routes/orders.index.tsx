import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Circle,
  CircleDollarSign,
  Clipboard,
  Clock3,
  Copy,
  Headphones,
  Heart,
  Home,
  House,
  MapPin,
  Menu,
  Package,
  PackageCheck,
  RotateCcw,
  Search,
  Settings,
  Star,
  Truck,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/common/Price";
import { Header } from "@/components/customer/Header";
import { Footer } from "@/components/customer/Footer";
import { useShop } from "@/store/shop";
import { EmptyState } from "@/components/common/EmptyState";
import { orderService, returnService, type OrderItemTracking } from "@/services";
import type { Order, OrderItem, OrderStatus } from "@/types";
import { toast } from "sonner";

export const Route = createFileRoute("/orders/")({ component: OrdersPage });

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-800 ring-amber-200",
  processing: "bg-sky-50 text-sky-800 ring-sky-200",
  packed: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  shipped: "bg-violet-50 text-violet-800 ring-violet-200",
  partially_shipped: "bg-violet-50 text-violet-800 ring-violet-200",
  delivered: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  partially_delivered: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  cancelled: "bg-rose-50 text-rose-800 ring-rose-200",
  confirmed: "bg-sky-50 text-sky-800 ring-sky-200",
  out_for_delivery: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  returned: "bg-slate-100 text-slate-700 ring-slate-200",
  refunded: "bg-slate-100 text-slate-700 ring-slate-200",
  replacement_requested: "bg-orange-50 text-orange-800 ring-orange-200",
  return_requested: "bg-orange-50 text-orange-800 ring-orange-200",
  return_approved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  replacement_approved: "bg-emerald-50 text-emerald-800 ring-emerald-200",
};

function statusLabel(status: string) {
  return status.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function orderStatus(order: Order): OrderStatus {
  const statuses = new Set(order.items.map((item) => item.status ?? "pending"));
  if (!statuses.size || statuses.size === 1) return [...statuses][0] ?? "pending";
  if (statuses.has("delivered")) return "partially_delivered";
  if (statuses.has("shipped")) return "partially_shipped";
  if (statuses.has("processing") || statuses.has("packed")) return "processing";
  return order.status;
}

function itemMatchesSearch(item: OrderItem, search: string) {
  if (!search) return false;
  const query = search.toLowerCase();
  return [item.itemNumber, item.name, item.trackingNumber].some((value) =>
    value?.toLowerCase().includes(query),
  );
}

function CopyId({ value, label }: { value: string; label: string }) {
  return (
    <button
      type="button"
      aria-label={`Copy ${label}`}
      title={`Copy ${label}`}
      onClick={() =>
        void navigator.clipboard
          .writeText(value)
          .then(() => toast.success("Copied successfully"))
          .catch(() => toast.error("Unable to copy"))
      }
      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
    >
      <Copy className="h-3.5 w-3.5" />
    </button>
  );
}

function OrderMeta({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0 lg:border-r lg:border-slate-100 lg:pr-4 last:lg:border-r-0">
      <p className="mb-1 text-[11px] font-medium text-slate-500">{label}</p>
      {children}
    </div>
  );
}

function ItemMeta({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-l border-slate-100 pl-4">
      <p className="mb-1.5 text-[11px] font-medium text-slate-500">{label}</p>
      {children}
    </div>
  );
}

function OrdersPage() {
  const navigate = useNavigate();
  const { user, logout } = useShop();
  const logoutAndNavigate = () => {
    logout();
    navigate({ to: "/" });
  };
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trackingItemId, setTrackingItemId] = useState<string | null>(null);
  const [tracking, setTracking] = useState<OrderItemTracking | null>(null);
  const [trackingError, setTrackingError] = useState<string | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [summaryOrder, setSummaryOrder] = useState<Order | null>(null);
  const [returnItem, setReturnItem] = useState<{
    item: OrderItem;
    action: "return" | "replace";
  } | null>(null);

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
        if (active) {
          const newestFirst = [...loadedOrders].sort(
            (first, second) => new Date(second.date).getTime() - new Date(first.date).getTime(),
          );
          setUserOrders(newestFirst);
        }
      } catch (loadError) {
        if (active) {
          setUserOrders([]);
          setError(loadError instanceof Error ? loadError.message : "Unable to load orders");
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

  useEffect(() => {
    if (!trackingItemId) return;
    let active = true;
    setTrackingLoading(true);
    setTracking(null);
    setTrackingError(null);
    void orderService
      .itemTracking(trackingItemId)
      .then((itemTracking) => {
        if (active) setTracking(itemTracking);
      })
      .catch((loadError) => {
        if (active)
          setTrackingError(
            loadError instanceof Error ? loadError.message : "Unable to load item tracking.",
          );
      })
      .finally(() => {
        if (active) setTrackingLoading(false);
      });
    return () => {
      active = false;
    };
  }, [trackingItemId]);

  const query = search.trim().toLowerCase();
  const productOrders = userOrders.flatMap((order) =>
    order.items.map((item) => ({
      ...order,
      items: [item],
      subtotal: item.price * item.quantity,
      total: item.price * item.quantity,
    })),
  );
  const filteredOrders = productOrders.filter((order) => {
    const item = order.items[0];
    const matchesStatus = statusFilter === "all" || orderStatus(order) === statusFilter;
    const matchesSearch =
      !query ||
      [order.order_number, item?.itemNumber, item?.name, item?.trackingNumber].some((value) =>
        value?.toLowerCase().includes(query),
      );
    return matchesStatus && matchesSearch;
  });
  const paidOrders = productOrders.filter((order) => order.payment.status === "paid");
  const pendingOrders = productOrders.filter((order) => orderStatus(order) === "pending");
  const deliveredOrders = productOrders.filter((order) => orderStatus(order) === "delivered");
  const totalSpent = paidOrders.reduce((total, order) => total + order.total, 0);

  return (
    <div className="min-h-screen bg-[#fbf8f3]">
      <Header />
      <main className="mx-auto max-w-[1320px] px-4 py-6 lg:px-6 lg:py-7">
        <div className="mb-5 lg:hidden">
          <details className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 font-semibold text-slate-900">
              <Menu className="h-4 w-4 text-primary" /> My Account
            </summary>
            <AccountNavigation
              onNavigate={(path) => navigate({ to: path })}
              onLogout={logoutAndNavigate}
            />
          </details>
        </div>
        <div className="flex items-start gap-6 xl:gap-7">
          <aside className="sticky top-28 hidden w-[216px] shrink-0 lg:block">
            <AccountNavigation
              onNavigate={(path) => navigate({ to: path })}
              onLogout={logoutAndNavigate}
            />
          </aside>
          <section className="min-w-0 flex-1">
            <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
              <Home className="h-3.5 w-3.5" /> Home <ChevronRight className="h-3.5 w-3.5" />{" "}
              <span className="font-medium text-slate-900">My Orders</span>
            </div>
            <div className="mb-5 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-950">My Orders</h1>
                <p className="mt-1 text-sm text-slate-500">
                  {productOrders.length} {productOrders.length === 1 ? "order" : "orders"}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="h-10 min-w-44 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm outline-none focus:border-[#b56f29]"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="partially_shipped">Partially Shipped</option>
                  <option value="shipped">Shipped</option>
                  <option value="partially_delivered">Partially Delivered</option>
                  <option value="delivered">Delivered</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="returned">Returned</option>
                  <option value="refunded">Refunded</option>
                </select>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search order ID, item or tracking..."
                    className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none shadow-sm focus:border-[#b56f29] sm:w-72"
                  />
                </div>
              </div>
            </div>
            {!loading && !error && productOrders.length > 0 && (
              <OrderOverview
                totalOrders={productOrders.length}
                totalSpent={totalSpent}
                paymentMethods={new Set(productOrders.map((order) => order.payment.method)).size}
                pendingOrders={pendingOrders.length}
                deliveredOrders={deliveredOrders.length}
              />
            )}
            {loading ? (
              <OrderSkeletons />
            ) : error ? (
              <EmptyState
                title="Unable to load orders"
                description={error}
                action={{ label: "Try Again", onClick: () => window.location.reload() }}
              />
            ) : filteredOrders.length ? (
              <div className="space-y-3">
                {filteredOrders.map((order) => (
                  <OrderCard
                    key={order.items[0]?.id ?? order.items[0]?.itemNumber ?? order.id}
                    order={order}
                    query={query}
                    onTrackItem={setTrackingItemId}
                    onTrackOrder={() => setSummaryOrder(order)}
                    onViewOrder={() => navigate({ to: "/orders/$id", params: { id: order.id } })}
                    onViewItem={(productId) =>
                      navigate({ to: "/products/$id", params: { id: productId } })
                    }
                    onRequestReturn={(item, action) => setReturnItem({ item, action })}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No orders found"
                description="Try a different order, item ID, product, or tracking number."
                action={{ label: "Start Shopping", onClick: () => navigate({ to: "/products" }) }}
              />
            )}
          </section>
        </div>
      </main>
      {trackingItemId && (
        <ItemTrackingModal
          tracking={tracking}
          loading={trackingLoading}
          error={trackingError}
          onClose={() => setTrackingItemId(null)}
        />
      )}
      {summaryOrder && (
        <OrderTrackingSummary
          order={summaryOrder}
          onClose={() => setSummaryOrder(null)}
          onTrackItem={setTrackingItemId}
        />
      )}
      {returnItem && (
        <ReturnItemModal
          item={returnItem.item}
          action={returnItem.action}
          onClose={() => setReturnItem(null)}
          onSubmitted={(status) => {
            setUserOrders((orders) =>
              orders.map((order) => ({
                ...order,
                items: order.items.map((item) =>
                  item.id === returnItem.item.id ? { ...item, status } : item,
                ),
              })),
            );
            setReturnItem(null);
          }}
        />
      )}
      <Footer />
    </div>
  );
}

function OrderOverview({
  totalOrders,
  totalSpent,
  paymentMethods,
  pendingOrders,
  deliveredOrders,
}: {
  totalOrders: number;
  totalSpent: number;
  paymentMethods: number;
  pendingOrders: number;
  deliveredOrders: number;
}) {
  const metrics = [
    {
      label: "Total Orders",
      value: totalOrders,
      caption: "All time",
      icon: Clipboard,
      tone: "bg-slate-100 text-slate-600",
    },
    {
      label: "Total Spent",
      value: `₹${totalSpent.toLocaleString("en-IN")}`,
      caption: "All time",
      icon: CircleDollarSign,
      tone: "bg-blue-50 text-blue-700",
    },
    {
      label: "Payment Methods",
      value: paymentMethods,
      caption: "Cards & others",
      icon: WalletCards,
      tone: "bg-sky-50 text-sky-700",
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      caption: "Awaiting update",
      icon: Clock3,
      tone: "bg-orange-50 text-orange-700",
    },
    {
      label: "Delivered Orders",
      value: deliveredOrders,
      caption: "Completed",
      icon: PackageCheck,
      tone: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <section className="mb-3 grid overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_8px_22px_-20px_rgba(15,23,42,0.5)] sm:grid-cols-2 lg:grid-cols-5">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.label}
            className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 last:border-b-0 sm:even:border-l lg:border-b-0 lg:border-l lg:first:border-l-0"
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${metric.tone}`}
            >
              <Icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[11px] font-medium text-slate-500">{metric.label}</p>
              <p className="mt-0.5 text-sm font-bold text-slate-900">{metric.value}</p>
              <p className="text-[10px] text-slate-400">{metric.caption}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}

function OrderCard({
  order,
  query,
  onTrackItem,
  onTrackOrder,
  onViewOrder,
  onViewItem,
  onRequestReturn,
}: {
  order: Order;
  query: string;
  onTrackItem: (id: string) => void;
  onTrackOrder: () => void;
  onViewOrder: () => void;
  onViewItem: (id: string) => void;
  onRequestReturn: (item: OrderItem, action: "return" | "replace") => void;
}) {
  const aggregateStatus = orderStatus(order);
  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_10px_24px_-22px_rgba(15,23,42,0.55)]">
      <header className="grid gap-3 border-b border-slate-200 px-4 py-3.5 sm:grid-cols-2 lg:grid-cols-[1.2fr_1.15fr_0.9fr_1fr_0.8fr_auto] lg:items-center lg:gap-4">
        <OrderMeta label="Order ID">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-950">{order.order_number || order.id}</span>
            <CopyId value={order.order_number || order.id} label="Order ID" />
          </div>
        </OrderMeta>
        <OrderMeta label="Placed on">
          <span className="text-xs font-medium text-slate-800">
            {new Intl.DateTimeFormat("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(order.date))}
          </span>
        </OrderMeta>
        <OrderMeta label="Payment method">
          <span className="font-medium text-slate-800">
            {order.payment.method === "Stripe" ? "Paid Online" : order.payment.method}
          </span>
        </OrderMeta>
        <OrderMeta label="Order status">
          <span
            className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyles[aggregateStatus] ?? "bg-slate-100 text-slate-700 ring-slate-200"}`}
          >
            {statusLabel(aggregateStatus)}
          </span>
        </OrderMeta>
        <OrderMeta label="Order total">
          <Price value={order.total} className="text-base font-bold text-slate-950" />
        </OrderMeta>
        <div className="flex items-center gap-2 lg:justify-end">
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-slate-300 px-3 text-xs"
            onClick={onViewOrder}
          >
            View Details <ChevronRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </header>
      <div className="px-4">
        {order.items.map((item) => (
          <OrderItemCard
            key={item.id ?? item.itemNumber}
            item={item}
            highlighted={itemMatchesSearch(item, query)}
            onTrack={() => item.id && onTrackItem(item.id)}
            onView={() => onViewItem(item.productId)}
            onTrackOrder={onTrackOrder}
            onRequestReturn={(action) => onRequestReturn(item, action)}
          />
        ))}
      </div>
    </article>
  );
}

function OrderItemCard({
  item,
  highlighted,
  onTrack,
  onView,
  onTrackOrder,
  onRequestReturn,
}: {
  item: OrderItem;
  highlighted: boolean;
  onTrack: () => void;
  onView: () => void;
  onTrackOrder: () => void;
  onRequestReturn: (action: "return" | "replace") => void;
}) {
  const itemStatus = item.status ?? "pending";
  return (
    <section className={`py-3.5 transition-colors ${highlighted ? "-mx-2 bg-[#fff6ea] px-2" : ""}`}>
      <div className="grid gap-4 lg:grid-cols-[minmax(250px,1.55fr)_0.85fr_0.7fr_1.1fr_auto] lg:items-center lg:gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="h-20 w-20 shrink-0 rounded-lg border border-slate-200 bg-slate-50 object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
              <Package className="h-6 w-6" />
            </div>
          )}
          <button type="button" onClick={onView} className="min-w-0 text-left hover:text-[#9a5d25]">
            <p className="truncate text-sm font-semibold text-slate-900">{item.name}</p>
            {item.variant && <p className="mt-1 text-xs text-slate-500">{item.variant}</p>}
          </button>
        </div>
        <ItemMeta label="Item ID">
          <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-slate-700">
            {item.itemNumber ?? item.id}
            <CopyId value={item.itemNumber ?? item.id ?? ""} label="Item ID" />
          </div>
        </ItemMeta>
        <ItemMeta label="Quantity">
          <p className="text-sm font-semibold text-slate-900">{item.quantity}</p>
          <p className="mt-2 text-[11px] text-slate-500">Price</p>
          <Price value={item.price} className="text-sm font-bold text-slate-900" />
        </ItemMeta>
        <ItemMeta label="Tracking ID">
          {item.trackingNumber ? (
            <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-800">
              {item.trackingNumber}
              <CopyId value={item.trackingNumber} label="Tracking ID" />
            </div>
          ) : (
            <span className="text-xs text-slate-500">Not available</span>
          )}
          <p className="mt-2 text-[11px] text-slate-500">Expected delivery</p>
          <p className="text-xs font-medium text-slate-700">
            {item.deliveredAt
              ? `Delivered ${new Date(item.deliveredAt).toLocaleDateString("en-IN")}`
              : item.estimatedDelivery
                ? new Intl.DateTimeFormat("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(item.estimatedDelivery))
                : "Awaiting dispatch"}
          </p>
        </ItemMeta>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-slate-300 px-3 text-xs"
            disabled={!item.id}
            onClick={onTrack}
          >
            <MapPin className="mr-1.5 h-3.5 w-3.5" />
            Track Order
          </Button>
          <Button
            size="sm"
            className="h-8 bg-[#172230] px-3 text-xs hover:bg-[#26384c]"
            onClick={onTrackOrder}
          >
            View Order Details <ChevronRight className="ml-1 h-3.5 w-3.5" />
          </Button>
          {itemStatus === "delivered" && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => onRequestReturn("return")}
              >
                Return
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => onRequestReturn("replace")}
              >
                Replace
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function ReturnItemModal({
  item,
  action,
  onClose,
  onSubmitted,
}: {
  item: OrderItem;
  action: "return" | "replace";
  onClose: () => void;
  onSubmitted: (status: OrderStatus) => void;
}) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const title = action === "replace" ? "Request replacement" : "Request return";
  const submit = async () => {
    if (!item.id) return;
    if (action === "return" && reason.trim().length < 3) {
      toast.error("Please share a brief reason for the return.");
      return;
    }
    setSubmitting(true);
    try {
      await returnService.requestReturn(
        item.id,
        item.quantity,
        action === "replace" ? "replacement" : reason.trim(),
      );
      toast.success(
        action === "replace" ? "Replacement request submitted." : "Return request submitted.",
      );
      onSubmitted(action === "replace" ? "replacement_requested" : "return_requested");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to submit your request.");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Modal title={title} onClose={onClose}>
      <div className="space-y-5 p-5 sm:p-6">
        <div className="flex gap-3 rounded-xl bg-slate-50 p-4">
          {item.image ? (
            <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-white text-slate-400">
              <Package className="h-5 w-5" />
            </div>
          )}
          <div>
            <p className="font-semibold text-slate-900">{item.name}</p>
            <p className="mt-1 text-sm text-slate-500">{item.itemNumber}</p>
            <p className="mt-1 text-sm text-slate-600">Quantity: {item.quantity}</p>
          </div>
        </div>
        <div>
          <label htmlFor="return-reason" className="mb-2 block text-sm font-medium text-slate-800">
            {action === "replace" ? "What is wrong with this item?" : "Reason for return"}
          </label>
          <textarea
            id="return-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder={
              action === "replace"
                ? "Describe the issue, such as damaged or incorrect item"
                : "Tell us why you would like to return this item"
            }
            className="min-h-24 w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={() => void submit()} disabled={submitting}>
            {submitting ? "Submitting..." : title}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function AccountNavigation({
  onNavigate,
  onLogout,
}: {
  onNavigate: (path: "/profile" | "/orders" | "/returns" | "/wishlist") => void;
  onLogout: () => void;
}) {
  const entries: Array<{
    label: string;
    icon: ReactNode;
    path?: "/profile" | "/orders" | "/returns" | "/wishlist";
    active?: boolean;
  }> = [
    { label: "Dashboard", icon: <House className="h-4 w-4" />, path: "/profile" },
    { label: "My Orders", icon: <Clipboard className="h-4 w-4" />, path: "/orders", active: true },
    { label: "Returns & Refunds", icon: <RotateCcw className="h-4 w-4" />, path: "/returns" },
    { label: "My Addresses", icon: <MapPin className="h-4 w-4" />, path: "/profile" },
    { label: "My Payments", icon: <WalletCards className="h-4 w-4" />, path: "/profile" },
    { label: "Wishlist", icon: <Heart className="h-4 w-4" />, path: "/wishlist" },
    { label: "My Reviews", icon: <Star className="h-4 w-4" />, path: "/profile" },
    { label: "Settings", icon: <Settings className="h-4 w-4" />, path: "/profile" },
  ];
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.45)]">
      <p className="px-3 py-2 text-sm font-bold text-slate-950">My Account</p>
      <nav className="space-y-1">
        {entries.map((entry) => (
          <button
            key={entry.label}
            type="button"
            onClick={() => entry.path && onNavigate(entry.path)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${entry.active ? "bg-primary/10 text-primary" : "text-slate-700 hover:bg-slate-50"}`}
          >
            {entry.icon}
            {entry.label}
          </button>
        ))}
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <UserRound className="h-4 w-4" />
          Logout
        </button>
      </nav>
      <div className="mt-4 rounded-xl border border-primary/15 bg-primary/[0.04] p-4">
        <Headphones className="h-5 w-5 text-primary" />
        <p className="mt-3 text-sm font-semibold text-slate-900">Need help?</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">We're here to help you</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-3 w-full border-primary/25 text-primary hover:bg-primary/5"
          onClick={() => {
            window.location.href = "mailto:support@shopnest.com";
          }}
        >
          <Headphones className="mr-2 h-4 w-4" />
          Contact Support
        </Button>
      </div>
    </div>
  );
}

function OrderSkeletons() {
  return (
    <div className="space-y-5" aria-label="Loading orders">
      {[0, 1].map((index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white"
        >
          <div className="grid gap-4 border-b border-slate-100 p-5 sm:grid-cols-3 lg:grid-cols-6">
            {[0, 1, 2, 3, 4, 5].map((cell) => (
              <div key={cell} className="space-y-2">
                <div className="h-3 w-16 rounded bg-slate-100" />
                <div className="h-5 w-full rounded bg-slate-100" />
              </div>
            ))}
          </div>
          <div className="space-y-4 p-5">
            {[0, 1].map((item) => (
              <div key={item} className="flex gap-4">
                <div className="h-20 w-20 rounded-lg bg-slate-100" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-1/3 rounded bg-slate-100" />
                  <div className="h-3 w-2/3 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ItemTrackingModal({
  tracking,
  loading,
  error,
  onClose,
}: {
  tracking: OrderItemTracking | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
}) {
  const stages = ["pending", "processing", "packed", "shipped", "out_for_delivery", "delivered"];
  const currentIndex = stages.indexOf(tracking?.status ?? "pending");
  const events = new Map(tracking?.events.map((event) => [event.status, event]) ?? []);
  return (
    <Modal title={tracking ? `Track ${tracking.item_number}` : "Track Item"} onClose={onClose}>
      {loading ? (
        <p className="p-6 text-center text-slate-500">Loading tracking details...</p>
      ) : error ? (
        <p className="p-6 text-center text-rose-600">{error}</p>
      ) : (
        tracking && (
          <div className="space-y-6 p-5 sm:p-6">
            <div className="flex gap-4 rounded-lg bg-slate-50 p-4 text-sm">
              {tracking.product_image ? (
                <img
                  src={tracking.product_image}
                  alt={tracking.product_name}
                  className="h-16 w-16 rounded-lg border border-slate-200 object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-white text-slate-400">
                  <Package className="h-5 w-5" />
                </div>
              )}
              <div>
                <p className="font-semibold text-slate-900">{tracking.product_name}</p>
                <p className="mt-1 text-slate-600">Order #{tracking.order_number}</p>
                <p className="mt-1 text-slate-600">
                  Status:{" "}
                  <span className="font-medium text-slate-900">{statusLabel(tracking.status)}</span>
                </p>
                {tracking.tracking_number && (
                  <p className="mt-1 text-slate-600">
                    Tracking:{" "}
                    <span className="font-mono text-xs font-semibold text-slate-900">
                      {tracking.tracking_number}
                    </span>
                    {tracking.shipping_partner ? ` · ${tracking.shipping_partner}` : ""}
                  </p>
                )}
                {tracking.estimated_delivery && (
                  <p className="mt-1 text-slate-600">
                    Expected delivery: {new Date(tracking.estimated_delivery).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-slate-900">Tracking timeline</h3>
              <div className="space-y-4">
                {stages.map((stage, index) => {
                  const event = events.get(stage);
                  const complete = index <= currentIndex && tracking.status !== "cancelled";
                  return (
                    <div key={stage} className="flex gap-3">
                      <div className="pt-0.5">
                        {complete ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-slate-300" />
                        )}
                      </div>
                      <div>
                        <p
                          className={`text-sm font-medium ${complete ? "text-slate-900" : "text-slate-500"}`}
                        >
                          {statusLabel(stage === "pending" ? "order placed" : stage)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {event ? new Date(event.created_at).toLocaleString() : "Pending"}
                          {event?.note ? ` · ${event.note}` : ""}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-2 rounded-lg border border-slate-200 p-4 text-sm text-slate-600">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <p>
                {tracking.shipping_name}
                <br />
                {tracking.address_line1}, {tracking.city}, {tracking.state} {tracking.postal_code}
              </p>
            </div>
          </div>
        )
      )}
    </Modal>
  );
}

function OrderTrackingSummary({
  order,
  onClose,
  onTrackItem,
}: {
  order: Order;
  onClose: () => void;
  onTrackItem: (id: string) => void;
}) {
  return (
    <Modal title={`Order #${order.order_number || order.id}`} onClose={onClose}>
      <div className="p-5 sm:p-6">
        <p className="mb-4 text-sm text-slate-500">
          Each product has its own delivery status and tracking.
        </p>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div
              key={item.id ?? item.itemNumber}
              className="flex items-center gap-3 rounded-lg border border-slate-200 p-3"
            >
              <Clock3 className="h-4 w-4 text-slate-400" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">{item.itemNumber}</p>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[item.status ?? "pending"]}`}
              >
                {statusLabel(item.status ?? "pending")}
              </span>
              {item.id && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onClose();
                    onTrackItem(item.id!);
                  }}
                >
                  Track
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <h2 className="font-semibold text-slate-900">{title}</h2>
          <button
            aria-label="Close"
            onClick={onClose}
            className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
