import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/customer/Header";
import { Footer } from "@/components/customer/Footer";
import { useShop } from "@/store/shop";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/checkout/success")({
  component: CheckoutSuccessPage,
});

function CheckoutSuccessPage() {
  const { clearCart } = useShop();
  const cleared = useRef(false);

  useEffect(() => {
    if (cleared.current) return;
    cleared.current = true;
    clearCart();
  }, [clearCart]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="max-w-md text-center">
          <CheckCircle className="mx-auto mb-4 h-14 w-14 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">Payment successful</h1>
          <p className="mt-2 text-sm text-gray-600">
            Stripe confirmed your checkout. Your order flow can now be connected to backend order creation.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild>
              <Link to="/orders">View Orders</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/products" search={{ page: 1 }}>Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
