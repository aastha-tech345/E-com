import { createFileRoute, Link } from "@tanstack/react-router";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/customer/Header";
import { Footer } from "@/components/customer/Footer";

export const Route = createFileRoute("/checkout/cancel")({
  component: CheckoutCancelPage,
});

function CheckoutCancelPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="max-w-md text-center">
          <XCircle className="mx-auto mb-4 h-14 w-14 text-red-600" />
          <h1 className="text-2xl font-bold text-gray-900">Payment cancelled</h1>
          <p className="mt-2 text-sm text-gray-600">
            Your cart is still available. You can try Stripe Checkout again whenever you are ready.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild>
              <Link to="/checkout">Return to Checkout</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/cart">View Cart</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
