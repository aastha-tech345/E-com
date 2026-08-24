import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Truck, CreditCard, CheckCircle, Package, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Price } from "@/components/common/Price";
import { Header } from "@/components/customer/Header";
import { Footer } from "@/components/customer/Footer";
import { useShop } from "@/store/shop";
import { EmptyState } from "@/components/common/EmptyState";
import { toast } from "sonner";
import { paymentService } from "@/services";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const { cartProducts, totals, clearCart, user, addresses, addAddress } = useShop();
  const [step, setStep] = React.useState<"address" | "delivery" | "payment" | "review">("address");
  const [selectedAddress, setSelectedAddress] = React.useState<string | null>(addresses[0]?.id || null);
  const [selectedDelivery, setSelectedDelivery] = React.useState("standard");
  const [submittingPayment, setSubmittingPayment] = React.useState(false);
  const [newAddress, setNewAddress] = React.useState({
    name: "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
  });

  if (cartProducts.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center py-12">
          <EmptyState
            title="Your cart is empty"
            description="Add items to proceed with checkout"
            action={{
              label: "Back to Shop",
              onClick: () => navigate({ to: "/products", search: { page: 1 } }),
            }}
          />
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddNewAddress = () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.line1 || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      toast.error("Please fill all address fields");
      return;
    }
    addAddress({
      id: `AD${Date.now()}`,
      ...newAddress,
      type: "home",
    });
    setNewAddress({
      name: "",
      phone: "",
      line1: "",
      city: "",
      state: "",
      pincode: "",
    });
    toast.success("Address added successfully");
  };

  const handleCompleteOrder = async () => {
    if (!selectedAddress || !selectedDelivery) {
      toast.error("Please select address and delivery method");
      return;
    }
    setSubmittingPayment(true);
    try {
      const session = await paymentService.createStripeCheckoutSession({
        customer_email: user?.email,
        success_path: "/checkout/success",
        cancel_path: "/checkout/cancel",
        items: cartProducts.map(({ product, line }) => ({
          product_id: product.id,
          name: product.name,
          quantity: line.quantity,
          unit_amount: product.price,
          image: product.images?.[0],
        })),
      });
      window.location.assign(session.checkout_url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to start Stripe checkout");
      setSubmittingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
              <p className="text-gray-600">Complete your purchase securely</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
              <Lock className="w-5 h-5 text-green-600" />
              <span>Secure & encrypted</span>
            </div>
          </div>

          {/* Progress Indicator */}
          <StepIndicator step={step} setStep={setStep} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Address Step */}
            {step === "address" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                    <MapPin className="w-6 h-6 text-blue-600" />
                    Delivery Address
                  </h2>

                  {/* Existing Addresses */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 text-lg">Your Addresses</h3>
                    <div className="space-y-3">
                      {addresses.map((addr) => (
                        <label
                          key={addr.id}
                          className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 ${
                            selectedAddress === addr.id
                              ? "border-blue-600 bg-blue-50 shadow-md"
                              : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                              selectedAddress === addr.id
                                ? "border-blue-600 bg-blue-600"
                                : "border-gray-300"
                            }`}>
                              {selectedAddress === addr.id && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 text-base">{addr.name}</p>
                              <p className="text-sm text-gray-600 mt-1">📱 {addr.phone}</p>
                              <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                                {addr.line1}, {addr.city}, {addr.state} {addr.pincode}
                              </p>
                              {addr.type && (
                                <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full capitalize">
                                  {addr.type}
                                </span>
                              )}
                            </div>
                            <input
                              type="radio"
                              name="address"
                              value={addr.id}
                              checked={selectedAddress === addr.id}
                              onChange={(e) => setSelectedAddress(e.target.value)}
                              className="hidden"
                            />
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Add New Address */}
                  <div className="border-t-2 mt-8 pt-8">
                    <h3 className="font-semibold text-gray-900 mb-6 text-lg">Add New Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Full Name"
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        className="rounded-lg border-gray-200 focus:border-blue-600"
                      />
                      <Input
                        placeholder="Phone Number"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="rounded-lg border-gray-200 focus:border-blue-600"
                      />
                      <Input
                        placeholder="Street Address"
                        className="md:col-span-2 rounded-lg border-gray-200 focus:border-blue-600"
                        value={newAddress.line1}
                        onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                      />
                      <Input
                        placeholder="City"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="rounded-lg border-gray-200 focus:border-blue-600"
                      />
                      <Input
                        placeholder="State"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="rounded-lg border-gray-200 focus:border-blue-600"
                      />
                      <Input
                        placeholder="Pincode"
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                        className="rounded-lg border-gray-200 focus:border-blue-600"
                      />
                    </div>
                    <Button
                      onClick={handleAddNewAddress}
                      variant="outline"
                      className="mt-6 rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      + Add New Address
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={() => setStep("delivery")}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-base"
                  disabled={!selectedAddress}
                >
                  Continue to Delivery <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </Button>
              </div>
            )}

            {/* Delivery Step */}
            {step === "delivery" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                    <Truck className="w-6 h-6 text-blue-600" />
                    Delivery Method
                  </h2>

                  <div className="space-y-4">
                    {[
                      { id: "standard", label: "Standard Delivery", days: "5-7 business days", price: 49, badge: "STANDARD" },
                      { id: "express", label: "Express Delivery", days: "2-3 business days", price: 149, badge: "FASTER" },
                      { id: "priority", label: "Priority Delivery", days: "Next day", price: 299, badge: "FASTEST" },
                    ].map((option) => (
                      <label
                        key={option.id}
                        className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 ${
                          selectedDelivery === option.id
                            ? "border-blue-600 bg-blue-50 shadow-md"
                            : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                            selectedDelivery === option.id
                              ? "border-blue-600 bg-blue-600"
                              : "border-gray-300"
                          }`}>
                            {selectedDelivery === option.id && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <p className="font-semibold text-gray-900 text-base">{option.label}</p>
                              <span className="px-2.5 py-0.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold rounded-full">
                                {option.badge}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">🚚 {option.days}</p>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <Price value={option.price} className="font-bold text-lg" />
                          </div>
                          <input
                            type="radio"
                            name="delivery"
                            value={option.id}
                            checked={selectedDelivery === option.id}
                            onChange={(e) => setSelectedDelivery(e.target.value)}
                            className="hidden"
                          />
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep("address")} 
                    className="flex-1 rounded-lg border-gray-200 hover:bg-gray-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    onClick={() => setStep("payment")} 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
                  >
                    Continue to Payment <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                  </Button>
                </div>
              </div>
            )}

            {/* Payment Step */}
            {step === "payment" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                    Payment Method
                  </h2>

                  <div className="space-y-4">
                    {[
                      { id: "upi", label: "UPI", desc: "Fast & secure using UPI apps", icon: "📱" },
                      { id: "card", label: "Credit/Debit Card", desc: "Visa, Mastercard, RuPay", icon: "💳" },
                      { id: "wallet", label: "Digital Wallet", desc: "PhonePe, Google Pay, Amazon Pay", icon: "👛" },
                      { id: "cod", label: "Cash on Delivery", desc: "Pay when you receive your order", icon: "💰" },
                    ].map((option, idx) => (
                      <label
                        key={option.id}
                        className="border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                            idx === 0
                              ? "border-blue-600 bg-blue-600"
                              : "border-gray-300"
                          }`}>
                            {idx === 0 && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-base">{option.icon} {option.label}</p>
                            <p className="text-sm text-gray-600 mt-1">{option.desc}</p>
                          </div>
                          <input 
                            type="radio" 
                            name="payment" 
                            value={option.id}
                            defaultChecked={idx === 0}
                            className="hidden"
                          />
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Payment Security Badge */}
                  <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                    <Lock className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-green-900 text-sm">Secure Payment</p>
                      <p className="text-xs text-green-700">Your payment information is encrypted and secure</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep("delivery")} 
                    className="flex-1 rounded-lg border-gray-200 hover:bg-gray-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    onClick={() => setStep("review")} 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
                  >
                    Continue to Review <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                  </Button>
                </div>
              </div>
            )}

            {/* Review Step */}
            {step === "review" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                    <Package className="w-6 h-6 text-blue-600" />
                    Order Review
                  </h2>

                  {/* Items Summary */}
                  <div className="border-2 border-gray-200 rounded-xl p-6 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-4 text-lg">Order Items</h3>
                    <div className="space-y-4">
                      {cartProducts.filter(({ product }) => product).map(({ product, line }) => (
                        <div
                          key={`${product.id}-${line.color || ""}-${line.size || ""}`}
                          className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0"
                        >
                          {product.images?.[0] && (
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                            <p className="text-sm text-gray-600">Quantity: {line.quantity}</p>
                            {line.color && <p className="text-xs text-gray-600 mt-1">Color: {line.color}</p>}
                            {line.size && <p className="text-xs text-gray-600">Size: {line.size}</p>}
                          </div>
                          <Price value={product.price * line.quantity} className="font-bold text-lg flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Address */}
                  {selectedAddress && (
                    <div className="border-2 border-gray-200 rounded-xl p-6 mb-6">
                      <h3 className="font-semibold text-gray-900 mb-3 text-lg flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        Delivery Address
                      </h3>
                      {addresses.find((a) => a.id === selectedAddress) && (
                        <div>
                          <p className="font-semibold text-gray-900">
                            {addresses.find((a) => a.id === selectedAddress)?.name}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            {addresses.find((a) => a.id === selectedAddress)?.line1}
                            <br />
                            {addresses.find((a) => a.id === selectedAddress)?.city}, {addresses.find((a) => a.id === selectedAddress)?.state} {addresses.find((a) => a.id === selectedAddress)?.pincode}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            📱 {addresses.find((a) => a.id === selectedAddress)?.phone}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setStep("payment")} 
                    className="flex-1 rounded-lg border-gray-200 hover:bg-gray-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleCompleteOrder}
                    disabled={submittingPayment}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-lg font-semibold text-base py-3"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {submittingPayment ? "Opening Stripe..." : "Pay with Stripe"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="border-2 border-gray-200 rounded-xl p-6 sticky top-24 shadow-lg bg-gradient-to-b from-white to-gray-50">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Order Summary
              </h2>

              <div className="space-y-3 max-h-96 overflow-y-auto mb-6 pb-6 border-b border-gray-200">
                {cartProducts.filter(({ product }) => product).map(({ product, line }) => (
                  <div key={`${product.id}-${line.color || ""}-${line.size || ""}`} className="flex justify-between items-start text-sm">
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-700 truncate font-medium">{product.name}</p>
                      <p className="text-xs text-gray-600">x{line.quantity}</p>
                    </div>
                    <Price value={product.price * line.quantity} className="text-gray-900 font-semibold flex-shrink-0 ml-2" />
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-semibold"><Price value={totals.subtotal} /></span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600 font-semibold">-₹{totals.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-gray-900 font-semibold">{totals.shipping === 0 ? "FREE 🎉" : `₹${totals.shipping}`}</span>
                </div>
              </div>

              <div className="border-t-2 border-gray-200 pt-4 flex justify-between items-center text-lg font-bold">
                <span className="text-gray-900">Total</span>
                <div className="text-xl text-blue-600">
                  <Price value={totals.total} />
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Lock className="w-4 h-4 text-green-600" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>7-day returns</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>Fast delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function StepIndicator({
  step,
  setStep,
}: {
  step: "address" | "delivery" | "payment" | "review";
  setStep: (step: "address" | "delivery" | "payment" | "review") => void;
}) {
  const steps: Array<{
    id: "address" | "delivery" | "payment" | "review";
    label: string;
    icon: React.ReactNode;
  }> = [
    { id: "address", label: "Address", icon: <MapPin className="w-5 h-5" /> },
    { id: "delivery", label: "Delivery", icon: <Truck className="w-5 h-5" /> },
    { id: "payment", label: "Payment", icon: <CreditCard className="w-5 h-5" /> },
    { id: "review", label: "Review", icon: <CheckCircle className="w-5 h-5" /> },
  ];

  const stepOrder = { address: 0, delivery: 1, payment: 2, review: 3 };
  const currentStepIndex = stepOrder[step];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((s, idx) => {
          const isComplete = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          
          return (
            <React.Fragment key={s.id}>
              <button
                onClick={() => setStep(s.id)}
                className={`flex flex-col items-center gap-2.5 transition-all duration-200 ${
                  isCurrent ? "opacity-100" : "opacity-75 hover:opacity-100"
                }`}
                disabled={idx > currentStepIndex}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 font-semibold text-sm transition-all duration-200 ${
                    isComplete
                      ? "border-green-600 bg-green-600 text-white"
                      : isCurrent
                        ? "border-blue-600 bg-blue-50 text-blue-600 shadow-lg"
                        : "border-gray-300 bg-white text-gray-400"
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    s.icon
                  )}
                </div>
                <span className={`text-xs font-semibold transition-colors ${
                  isCurrent
                    ? "text-blue-600"
                    : isComplete
                      ? "text-green-600"
                      : "text-gray-600"
                }`}>
                  {s.label}
                </span>
              </button>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-3 rounded-full transition-all duration-200 ${
                    isComplete
                      ? "bg-gradient-to-r from-green-600 to-green-600"
                      : isCurrent
                        ? "bg-gradient-to-r from-gray-300 to-gray-300"
                        : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
