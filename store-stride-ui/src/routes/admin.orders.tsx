import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmationDialog } from "@/components/admin/ConfirmationDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type AdminOrder, orderService } from "@/services";
import { useShop } from "@/store/shop";

export const Route = createFileRoute("/admin/orders")({ component: AdminOrders });

function AdminOrders() {
  const { admin } = useShop();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterField, setFilterField] = useState("all");
  const [pendingStatus, setPendingStatus] = useState<{ order: AdminOrder; status: string } | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const load = async () => {
    setLoading(true);
    try {
      const result = await orderService.adminList({ q: search, field: filterField, page, pageSize });
      setOrders(result.items);
      setTotal(result.total);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [page, search, filterField]);

  if (!admin) return null;

  const printInvoice = (order: AdminOrder) => {
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) {
      toast.error("Allow pop-ups to print the invoice.");
      return;
    }
    const escapeHtml = (value: string | number) => String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
    const rows = order.items.map((item) => `<tr><td>${escapeHtml(item.product_name)}</td><td>${escapeHtml(item.variant_name)}</td><td>${escapeHtml(item.sku)}</td><td>${item.quantity}</td><td>Rs. ${item.unit_price.toLocaleString("en-IN")}</td><td>Rs. ${item.line_total.toLocaleString("en-IN")}</td></tr>`).join("");
    printWindow.document.write(`<!doctype html><html><head><title>Invoice ${escapeHtml(order.order_number)}</title><style>body{font-family:Arial,sans-serif;color:#172033;padding:36px}h1{margin:0}table{width:100%;border-collapse:collapse;margin-top:28px}th,td{border-bottom:1px solid #dbe2ea;padding:10px;text-align:left}th{background:#f6f8fb}.total{text-align:right;font-size:18px;font-weight:bold;margin-top:18px}</style></head><body><h1>Store Admin Invoice</h1><p>Order: <strong>${escapeHtml(order.order_number)}</strong><br>Placed: ${escapeHtml(new Date(order.created_at).toLocaleDateString())}<br>Status: ${escapeHtml(order.status)}</p><p><strong>Customer:</strong> ${escapeHtml(order.customer)}<br>${escapeHtml(order.shipping_address.line1)}, ${escapeHtml(order.shipping_address.city)}, ${escapeHtml(order.shipping_address.state)} - ${escapeHtml(order.shipping_address.postal_code)}</p><table><thead><tr><th>Product</th><th>Variant</th><th>SKU</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead><tbody>${rows}</tbody></table><p class="total">Order Total: Rs. ${order.total.toLocaleString("en-IN")}</p><script>window.onload=()=>window.print()<\/script></body></html>`);
    printWindow.document.close();
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-bold text-slate-900">Orders Management</h1>
          <p className="mt-1 text-sm text-slate-600">View and manage all customer orders.</p>
        </div>
        <DataTable
          columns={[
            { key: "order_number", label: "Order #" },
            { key: "customer", label: "Customer" },
            { key: "total", label: "Total", render: (value: number) => `Rs. ${Number(value).toLocaleString("en-IN")}` },
            {
              key: "status",
              label: "Status",
              render: (value: string, order: AdminOrder) => (
                <select
                  value={value}
                  onChange={(event) => {
                    if (event.target.value !== value) setPendingStatus({ order, status: event.target.value });
                  }}
                  className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs font-medium capitalize text-slate-700"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              ),
            },
            { key: "created_at", label: "Created", render: (value: string) => new Date(value).toLocaleDateString() },
          ]}
          data={orders}
          isLoading={loading}
          searchFields={["order_number", "customer", "status"]}
          fieldSearchPlaceholder={`Filter by ${filterField === "all" ? "selected field" : filterField.replace("_", " ")}...`}
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
          onFilterChange={(value) => {
            setFilterField(value);
            setSearch("");
            setPage(1);
          }}
          filterOptions={[
            { label: "All columns", value: "all" },
            { label: "Order #", value: "order_number" },
            { label: "Customer", value: "customer" },
            { label: "Total", value: "total" },
            { label: "Status", value: "status" },
            { label: "Created", value: "created_at" },
          ]}
          searchPlaceholder="Search orders..."
          onRefresh={() => void load()}
          pagination={{ page, pageSize, total, onPageChange: setPage }}
          actions={[{ label: "View", onClick: setSelectedOrder }]}
        />
        <Dialog open={Boolean(selectedOrder)} onOpenChange={(open) => { if (!open) setSelectedOrder(null); }}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Order {selectedOrder?.order_number}</DialogTitle>
              <DialogDescription>Customer, delivery, and purchased product details.</DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-5">
                <div className="grid gap-3 rounded-lg bg-slate-50 p-4 text-sm sm:grid-cols-2">
                  <div><p className="text-slate-500">Customer</p><p className="font-medium">{selectedOrder.customer}</p></div>
                  <div><p className="text-slate-500">Delivery address</p><p className="font-medium">{selectedOrder.shipping_address.line1}, {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} - {selectedOrder.shipping_address.postal_code}</p></div>
                </div>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-sm"><thead className="bg-slate-50 text-left text-slate-500"><tr><th className="p-3">Product</th><th className="p-3">SKU</th><th className="p-3">Qty</th><th className="p-3">Price</th><th className="p-3">Total</th></tr></thead><tbody>{selectedOrder.items.map((item) => <tr key={`${item.sku}-${item.variant_name}`} className="border-t border-slate-100"><td className="p-3 font-medium">{item.product_name}<span className="block text-xs font-normal text-slate-500">{item.variant_name}</span></td><td className="p-3">{item.sku}</td><td className="p-3">{item.quantity}</td><td className="p-3">Rs. {item.unit_price.toLocaleString("en-IN")}</td><td className="p-3 font-medium">Rs. {item.line_total.toLocaleString("en-IN")}</td></tr>)}</tbody></table>
                </div>
                <p className="text-right text-base font-semibold">Order total: Rs. {selectedOrder.total.toLocaleString("en-IN")}</p>
              </div>
            )}
            <DialogFooter><Button variant="outline" onClick={() => setSelectedOrder(null)}>Close</Button><Button onClick={() => selectedOrder && printInvoice(selectedOrder)}>Print invoice</Button></DialogFooter>
          </DialogContent>
        </Dialog>
        <ConfirmationDialog
          open={Boolean(pendingStatus)}
          title="Change order status?"
          description={`Change ${pendingStatus?.order.order_number ?? "this order"} from ${pendingStatus?.order.status ?? ""} to ${pendingStatus?.status ?? ""}?`}
          confirmLabel="Update status"
          onOpenChange={(open) => {
            if (!open) setPendingStatus(null);
          }}
          onConfirm={() => {
            if (!pendingStatus) return;
            void (async () => {
              try {
                await orderService.updateStatus(pendingStatus.order.id, pendingStatus.status);
                setOrders((current) => current.map((order) => order.id === pendingStatus.order.id ? { ...order, status: pendingStatus.status } : order));
                toast.success("Order status updated.");
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Unable to update order status.");
              } finally {
                setPendingStatus(null);
              }
            })();
          }}
        />
      </div>
    </AdminLayout>
  );
}
