import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { Trash2, ChevronLeft, Heart, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuantitySelector } from "@/components/common/QuantitySelector";
import { Price } from "@/components/common/Price";
import { Header } from "@/components/customer/Header";
import { Footer } from "@/components/customer/Footer";
import { ShoppingAssistant } from "@/components/customer/ShoppingAssistant";
import { useShop } from "@/store/shop";
import { EmptyState } from "@/components/common/EmptyState";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const navigate = useNavigate();
  const {
    cartProducts,
    totals,
    updateQuantity,
    removeFromCart,
    clearCart,
    syncCartFromBackend,
    toggleWishlist,
    applyCoupon,
    coupon,
  } = useShop();
  const [couponCode, setCouponCode] = React.useState("");

  React.useEffect(() => {
    syncCartFromBackend().catch((error) => {
      console.warn("Cart refresh failed:", error);
    });
  }, [syncCartFromBackend]);

  if (cartProducts.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center py-12">
          <EmptyState
            title="Your cart is empty"
            description="Add some products to get started"
            action={{
              label: "Continue Shopping",
              onClick: () => navigate({ to: "/products" }),
            }}
          />
        </div>
        <Footer />
      </div>
    );
  }

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Enter a coupon code");
      return;
    }
    applyCoupon(couponCode);
    setCouponCode("");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">{cartProducts.length} items in cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartProducts
                .filter(({ product }) => product)
                .map(({ product, line }) => (
                  <div
                    key={`${product.id}-${line.color || ""}-${line.size || ""}`}
                    className="border rounded-lg p-4 flex gap-4"
                  >
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {product.images?.[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() =>
                          navigate({ to: "/products/$id", params: { id: product.id } })
                        }
                        className="font-semibold text-gray-900 hover:text-blue-600 truncate"
                      >
                        {product.name}
                      </button>
                      <p className="text-sm text-gray-600">{product.brand}</p>
                      {line.color && <p className="text-sm text-gray-600">Color: {line.color}</p>}
                      {line.size && <p className="text-sm text-gray-600">Size: {line.size}</p>}
                      <div className="mt-3">
                        <QuantitySelector
                          value={line.quantity}
                          min={1}
                          max={Math.max(1, product.stock)}
                          onChange={(quantity) => updateQuantity(product.id, quantity)}
                        />
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="flex flex-col items-end justify-between">
                      <Price value={product.price} className="font-bold text-lg" />
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleWishlist(product.id)}
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(product.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Actions */}
            <div className="mt-8 flex gap-4">
              <Button variant="outline" onClick={() => navigate({ to: "/products" })}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-red-600 hover:text-red-700"
              >
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 sticky top-20 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

              {/* Coupon */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={!!coupon}
                  />
                  {coupon && (
                    <Button variant="ghost" size="icon" onClick={() => applyCoupon("")}>
                      ✕
                    </Button>
                  )}
                </div>
                {!coupon && (
                  <Button size="sm" className="w-full" onClick={handleApplyCoupon}>
                    Apply Coupon
                  </Button>
                )}
                {coupon && (
                  <div className="bg-green-50 text-green-700 p-2 rounded text-sm">
                    ✓ Coupon {coupon} applied
                  </div>
                )}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <Price value={totals.subtotal} />
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{totals.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700">
                  <span>Delivery</span>
                  <span>{totals.shipping === 0 ? "FREE" : `₹${totals.shipping}`}</span>
                </div>
              </div>

              <div className="border-t pt-4 flex justify-between text-lg font-bold">
                <span>Total</span>
                <Price value={totals.total} />
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
                onClick={() => navigate({ to: "/checkout" })}
              >
                Proceed to Checkout
              </Button>

              <div className="bg-blue-50 border border-blue-200 rounded p-3 flex gap-2 text-sm text-blue-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>Free delivery on orders above ₹999</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ShoppingAssistant />
      <Footer />
    </div>
  );
}
