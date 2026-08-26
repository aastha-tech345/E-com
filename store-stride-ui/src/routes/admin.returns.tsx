import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Clock3, ExternalLink, PackageCheck, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { adminReturnService, type ReturnRequest } from "@/services";

export const Route = createFileRoute("/admin/returns")({ component: AdminReturns });

function AdminReturns() {
  const [requests, setRequests] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setRequests(await adminReturnService.list());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load return requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const decide = async (request: ReturnRequest, status: "approved" | "rejected") => {
    setUpdatingId(request.id);
    try {
      await adminReturnService.decide(request.id, status);
      setRequests((current) =>
        current.map((item) => (item.id === request.id ? { ...item, status } : item)),
      );
      toast.success(`Request ${status}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update request.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Returns & Replacements</h1>
            <p className="mt-1 text-sm text-slate-600">
              Review customer return tickets, proof files, and replacement requests.
            </p>
          </div>
          <Button variant="outline" onClick={() => void load()}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="grid gap-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-28 animate-pulse rounded-lg border border-slate-200 bg-white" />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
            <p className="font-semibold text-slate-900">No return requests yet</p>
            <p className="mt-1 text-sm text-slate-500">Customer tickets will appear here after submission.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="p-3">Ticket</th>
                  <th className="p-3">Request</th>
                  <th className="p-3">Products</th>
                  <th className="p-3">Issue & Proof</th>
                  <th className="p-3">Proof</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id} className="border-t border-slate-100">
                    <td className="p-3">
                      <p className="font-bold text-slate-950">{formatRequestReference(request.id)}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {request.order_number || request.order_id}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {new Date(request.created_at).toLocaleString()}
                      </p>
                    </td>
                    <td className="p-3">
                      <p className="font-semibold text-slate-900">
                        {request.reason.toLowerCase() === "replacement" ? "Replacement" : "Refund/Return"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">Qty: {request.quantity}</p>
                    </td>
                    <td className="p-3">
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-semibold uppercase text-slate-500">Damaged item</p>
                          <p className="font-semibold text-slate-900">
                            {request.product_name || request.order_item_id}
                          </p>
                        </div>
                        {request.replacement_product_name || request.replacement_product_id ? (
                          <div className="rounded-md border border-blue-100 bg-blue-50 px-2 py-1.5">
                            <p className="text-xs font-semibold uppercase text-blue-600">
                              Selected replacement
                            </p>
                            <p className="font-semibold text-blue-950">
                              {request.replacement_product_name || request.replacement_product_id}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="font-medium text-slate-800">
                        {request.issue_reason || request.reason}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {request.proof_url ? "Proof submitted" : "Proof missing"}
                      </p>
                    </td>
                    <td className="p-3">
                      {request.proof_url ? (
                        <a
                          href={request.proof_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                        >
                          View {request.proof_type || "proof"}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">No proof</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="space-y-1.5">
                        <span className={lifecycleClass(request.lifecycle_status || request.status)}>
                          {(request.lifecycle_status || "open") === "closed" ? (
                            <PackageCheck className="h-3.5 w-3.5" />
                          ) : (
                            <Clock3 className="h-3.5 w-3.5" />
                          )}
                          {formatStatus(request.lifecycle_status || "open")}
                        </span>
                        <span className={statusClass(request.status)}>{formatStatus(request.status)}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={request.status !== "requested" || updatingId === request.id}
                          onClick={() => void decide(request, "rejected")}
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          disabled={request.status !== "requested" || updatingId === request.id}
                          onClick={() => void decide(request, "approved")}
                        >
                          Approve
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function formatRequestReference(id: string) {
  return `RET-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

function formatStatus(status: string) {
  return status
    .replace(/_/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function statusClass(status: string) {
  const base = "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold";
  if (status === "approved") return `${base} bg-emerald-50 text-emerald-700`;
  if (status === "rejected") return `${base} bg-rose-50 text-rose-700`;
  return `${base} bg-amber-50 text-amber-700`;
}

function lifecycleClass(status: string) {
  const base = "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold";
  if (status === "closed") return `${base} bg-slate-100 text-slate-700`;
  return `${base} bg-blue-50 text-blue-700`;
}
