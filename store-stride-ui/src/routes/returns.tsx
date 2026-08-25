import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronRight, Home, RotateCcw } from "lucide-react";
import { Header } from "@/components/customer/Header";
import { Footer } from "@/components/customer/Footer";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { returnService, type ReturnRequest } from "@/services";

export const Route = createFileRoute("/returns")({ component: ReturnsPage });

function ReturnsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void returnService
      .list()
      .then((items) => {
        if (active) setRequests(items);
      })
      .catch((loadError) => {
        if (active)
          setError(
            loadError instanceof Error ? loadError.message : "Unable to load return requests.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-8 md:py-10">
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Home className="h-4 w-4" />
          Home
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-slate-900">Returns & Refunds</span>
        </div>
        <div className="mb-7">
          <h1 className="text-3xl font-bold text-slate-950">Returns & Refunds</h1>
          <p className="mt-2 text-slate-500">
            Track your item-specific return and replacement requests.
          </p>
        </div>
        {loading ? (
          <div className="space-y-4">
            {[0, 1].map((item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        ) : error ? (
          <EmptyState
            title="Unable to load requests"
            description={error}
            action={{ label: "Try Again", onClick: () => window.location.reload() }}
          />
        ) : requests.length ? (
          <div className="space-y-4">
            {requests.map((request) => (
              <article
                key={request.id}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {request.reason.toLowerCase() === "replacement"
                      ? "Replacement request"
                      : "Return request"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Request #{request.id.slice(0, 8).toUpperCase()} · Submitted{" "}
                    {new Date(request.created_at).toLocaleDateString()}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">Quantity: {request.quantity}</p>
                </div>
                <span
                  className={`w-fit rounded-full px-3 py-1.5 text-sm font-semibold ${request.status === "approved" ? "bg-emerald-50 text-emerald-700" : request.status === "rejected" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}
                >
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No return requests"
            description="Eligible delivered items can be returned or replaced from My Orders."
            action={{ label: "View My Orders", onClick: () => navigate({ to: "/orders" }) }}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
