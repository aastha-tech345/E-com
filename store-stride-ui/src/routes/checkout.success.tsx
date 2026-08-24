import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Header } from "@/components/customer/Header";
import { Footer } from "@/components/customer/Footer";
import { useShop } from "@/store/shop";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/checkout/success")({
  component: CheckoutSuccessPage,
});

function CheckoutSuccessPage() {
  const { clearCart, hydrated } = useShop();
  const cleared = useRef(false);
  const [confirmOpen, setConfirmOpen] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (cleared.current) return;
    cleared.current = true;
    clearCart({ syncBackend: false });
  }, [clearCart, hydrated]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSessionId(params.get("session_id"));
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="max-w-md text-center">
          <CheckCircle className="mx-auto mb-4 h-14 w-14 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">Payment successful</h1>
          <p className="mt-2 text-sm text-gray-600">
            Stripe confirmed your checkout. Your order flow can now be connected to backend order
            creation.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild>
              <Link to="/orders">View Orders</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/products" search={{ page: 1 }}>
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm text-center sm:rounded-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl">Payment confirmed</DialogTitle>
            <DialogDescription>
              Your Stripe payment was received successfully. Your cart has been updated.
            </DialogDescription>
          </DialogHeader>
          {sessionId && (
            <p className="rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-600">
              Session: {sessionId}
            </p>
          )}
          <DialogFooter className="sm:justify-center">
            <Button onClick={() => setConfirmOpen(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
