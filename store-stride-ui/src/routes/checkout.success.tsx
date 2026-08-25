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
import { paymentService } from "@/services";
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
  const [paymentStatus, setPaymentStatus] = useState<"confirming" | "paid" | "pending">(
    "confirming",
  );

  useEffect(() => {
    if (!hydrated || paymentStatus !== "paid") return;
    if (cleared.current) return;
    cleared.current = true;
    clearCart({ syncBackend: false });
  }, [clearCart, hydrated, paymentStatus]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkoutSessionId = params.get("session_id");
    setSessionId(checkoutSessionId);
    if (!checkoutSessionId) {
      setPaymentStatus("pending");
      return;
    }
    void paymentService
      .confirmStripeCheckout(checkoutSessionId)
      .then(() => setPaymentStatus("paid"))
      .catch(() => setPaymentStatus("pending"));
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="max-w-md text-center">
          <CheckCircle className="mx-auto mb-4 h-14 w-14 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            {paymentStatus === "paid" ? "Payment successful" : "Confirming payment"}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {paymentStatus === "paid"
              ? "Stripe confirmed your payment and your order is ready to process."
              : "We are verifying the payment directly with Stripe before updating your order."}
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
            <DialogTitle className="text-xl">
              {paymentStatus === "paid" ? "Payment confirmed" : "Confirming payment"}
            </DialogTitle>
            <DialogDescription>
              {paymentStatus === "paid"
                ? "Your Stripe payment was received successfully. Your cart has been updated."
                : "Your order will show Payment successful as soon as Stripe confirms it."}
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
