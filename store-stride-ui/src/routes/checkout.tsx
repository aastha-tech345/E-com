import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  CreditCard,
  Home,
  Lock,
  MapPin,
  Package,
  Phone,
  Plus,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Price } from "@/components/common/Price";
import { Header } from "@/components/customer/Header";
import { Footer } from "@/components/customer/Footer";
import { useShop } from "@/store/shop";
import { EmptyState } from "@/components/common/EmptyState";
import { toast } from "sonner";
import { cartService, paymentService } from "@/services";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const navigate = useNavigate();
  const { cartProducts, totals, user, addresses, addAddress } = useShop();
  const [step, setStep] = React.useState<"address" | "delivery" | "payment" | "review">("address");
  const [selectedAddress, setSelectedAddress] = React.useState<string | null>(
    addresses[0]?.id || null,
  );
  const [selectedDelivery, setSelectedDelivery] = React.useState("standard");
  const [selectedPayment, setSelectedPayment] = React.useState("stripe");
  const [submittingPayment, setSubmittingPayment] = React.useState(false);
  const [newAddress, setNewAddress] = React.useState({
    name: "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
  });

  const deliveryOptions = [
    {
      id: "standard",
      label: "Standard Delivery",
      days: "5-7 business days",
      price: totals.shipping,
      badge: totals.shipping === 0 ? "FREE" : "STANDARD",
    },
    {
      id: "express",
      label: "Express Delivery",
      days: "2-3 business days",
      price: 149,
      badge: "FASTER",
    },
    {
      id: "priority",
      label: "Priority Delivery",
      days: "Next day",
      price: 299,
      badge: "FASTEST",
    },
  ];
  const selectedAddressDetails = addresses.find((item) => item.id === selectedAddress);
  const selectedDeliveryOption =
    deliveryOptions.find((option) => option.id === selectedDelivery) ?? deliveryOptions[0];
  const checkoutTotal = Math.max(
    0,
    totals.subtotal - totals.discount + selectedDeliveryOption.price,
  );

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
    if (
      !newAddress.name ||
      !newAddress.phone ||
      !newAddress.line1 ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.pincode
    ) {
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
      const address = addresses.find((item) => item.id === selectedAddress);
      if (cartService.isAuthenticated()) {
        await Promise.all(
          cartProducts.map(({ product, line }) =>
            cartService.saveProductQuantity(product.id, line.quantity),
          ),
        );
      }

      const checkoutItems = cartProducts.map(({ product, line }) => ({
        product_id: product.id,
        name: product.name,
        quantity: line.quantity,
        unit_amount: product.price,
        image: product.images?.[0],
      }));
      if (selectedDeliveryOption.price > 0) {
        checkoutItems.push({
          product_id: selectedDeliveryOption.id,
          name: selectedDeliveryOption.label,
          quantity: 1,
          unit_amount: selectedDeliveryOption.price,
          image: undefined,
        });
      }

      const session = await paymentService.createStripeCheckoutSession({
        customer_email: user?.email,
        shipping_name: address?.name,
        address_line1: address?.line1,
        city: address?.city,
        state: address?.state,
        postal_code: address?.pincode,
        success_path: "/checkout/success",
        cancel_path: "/checkout/cancel",
        items: checkoutItems,
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
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
              <p className="text-gray-600">Choose delivery details and complete payment.</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
              <Lock className="w-5 h-5 text-green-600" />
              <span>Secure & encrypted</span>
            </div>
          </div>

          <StepIndicator step={step} setStep={setStep} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === "address" && (
              <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                      <MapPin className="w-6 h-6 text-blue-600" />
                      Delivery Address
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      Select where this order should be delivered.
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    Step 1 of 4
                  </span>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                      Saved addresses
                    </h3>
                    <div className="grid gap-3">
                      {addresses.map((addr) => (
                        <label
                          key={addr.id}
                          className={`block w-full cursor-pointer rounded-lg border p-5 transition-all duration-200 ${
                            selectedAddress === addr.id
                              ? "border-blue-600 bg-blue-50 shadow-sm ring-1 ring-blue-600"
                              : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                                selectedAddress === addr.id
                                  ? "border-blue-600 bg-blue-600"
                                  : "border-gray-300"
                              }`}
                            >
                              {selectedAddress === addr.id && (
                                <div className="w-2 h-2 bg-white rounded-full" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-semibold text-gray-900">{addr.name}</p>
                                {addr.type && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-700">
                                    <Home className="h-3 w-3" />
                                    {addr.type}
                                  </span>
                                )}
                              </div>
                              <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="h-4 w-4 text-gray-400" />
                                {addr.phone}
                              </p>
                              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                                {addr.line1}, {addr.city}, {addr.state} {addr.pincode}
                              </p>
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

                  <div className="border-t border-gray-200 pt-8">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Add New Address</h3>
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
                      className="mt-5 rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Address
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={() => setStep("delivery")}
                  className="mt-8 h-12 w-full rounded-lg bg-blue-600 font-semibold hover:bg-blue-700"
                  disabled={!selectedAddress}
                >
                  Continue to Delivery <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </section>
            )}

            {/* Delivery Step */}
            {step === "delivery" && (
              <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                      <Truck className="w-6 h-6 text-blue-600" />
                      Delivery Method
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      Choose the delivery speed for this order.
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    Step 2 of 4
                  </span>
                </div>

                <div className="grid gap-3">
                  {deliveryOptions.map((option) => (
                    <label
                      key={option.id}
                      className={`block w-full cursor-pointer rounded-lg border p-5 transition-all duration-200 ${
                        selectedDelivery === option.id
                          ? "border-blue-600 bg-blue-50 shadow-sm ring-1 ring-blue-600"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                            selectedDelivery === option.id
                              ? "border-blue-600 bg-blue-600"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedDelivery === option.id && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex flex-wrap items-center gap-3">
                            <p className="font-semibold text-gray-900 text-base">{option.label}</p>
                            <span className="rounded-full bg-gray-900 px-2.5 py-0.5 text-xs font-bold text-white">
                              {option.badge}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{option.days}</p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          {option.price === 0 ? (
                            <span className="font-bold text-green-600">FREE</span>
                          ) : (
                            <Price value={option.price} className="font-bold text-lg" />
                          )}
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

                <div className="mt-8 flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep("address")}
                    className="h-12 flex-1 rounded-lg border-gray-200 hover:bg-gray-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep("payment")}
                    className="h-12 flex-1 rounded-lg bg-blue-600 font-semibold hover:bg-blue-700"
                  >
                    Continue to Payment <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </section>
            )}

            {/* Payment Step */}
            {step === "payment" && (
              <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                      <CreditCard className="w-6 h-6 text-blue-600" />
                      Payment Method
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      You will complete payment on Stripe Checkout.
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    Step 3 of 4
                  </span>
                </div>

                <label
                  className={`block w-full cursor-pointer rounded-lg border p-5 transition-all duration-200 ${
                    selectedPayment === "stripe"
                      ? "border-blue-600 bg-blue-50 shadow-sm ring-1 ring-blue-600"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                        selectedPayment === "stripe"
                          ? "border-blue-600 bg-blue-600"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedPayment === "stripe" && (
                        <div className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <p className="font-semibold text-gray-900">Stripe Checkout</p>
                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                          Recommended
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        Cards and supported Stripe test payment methods.
                      </p>
                    </div>
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    value="stripe"
                    checked={selectedPayment === "stripe"}
                    onChange={(event) => setSelectedPayment(event.target.value)}
                    className="hidden"
                  />
                </label>

                <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900 text-sm">Secure Payment</p>
                      <p className="text-xs text-green-700">
                        Payment status is confirmed by Stripe webhook after success.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep("delivery")}
                    className="h-12 flex-1 rounded-lg border-gray-200 hover:bg-gray-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep("review")}
                    className="h-12 flex-1 rounded-lg bg-blue-600 font-semibold hover:bg-blue-700"
                  >
                    Continue to Review <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </section>
            )}

            {/* Review Step */}
            {step === "review" && (
              <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:p-8">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                      <Package className="w-6 h-6 text-blue-600" />
                      Order Review
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      Review everything before opening Stripe Checkout.
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    Step 4 of 4
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="rounded-lg border border-gray-200 p-5">
                    <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {cartProducts
                        .filter(({ product }) => product)
                        .map(({ product, line }) => (
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
                              {line.color && (
                                <p className="text-xs text-gray-600 mt-1">Color: {line.color}</p>
                              )}
                              {line.size && (
                                <p className="text-xs text-gray-600">Size: {line.size}</p>
                              )}
                            </div>
                            <Price
                              value={product.price * line.quantity}
                              className="font-bold text-lg flex-shrink-0"
                            />
                          </div>
                        ))}
                    </div>
                  </div>

                  {selectedAddress && (
                    <div className="rounded-lg border border-gray-200 p-5">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        Delivery Address
                      </h3>
                      {selectedAddressDetails && (
                        <div>
                          <p className="font-semibold text-gray-900">
                            {selectedAddressDetails.name}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            {selectedAddressDetails.line1}
                            <br />
                            {selectedAddressDetails.city}, {selectedAddressDetails.state}{" "}
                            {selectedAddressDetails.pincode}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            {selectedAddressDetails.phone}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="rounded-lg border border-gray-200 p-5">
                    <h3 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
                      <Truck className="h-5 w-5 text-blue-600" />
                      Delivery & Payment
                    </h3>
                    <div className="grid gap-3 text-sm text-gray-700 md:grid-cols-2">
                      <div>
                        <p className="font-medium text-gray-900">{selectedDeliveryOption.label}</p>
                        <p className="mt-1 text-gray-600">{selectedDeliveryOption.days}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Stripe Checkout</p>
                        <p className="mt-1 text-gray-600">Payment confirmed by webhook.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep("payment")}
                    className="h-12 flex-1 rounded-lg border-gray-200 hover:bg-gray-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleCompleteOrder}
                    disabled={submittingPayment}
                    className="h-12 flex-1 rounded-lg bg-green-600 font-semibold hover:bg-green-700"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {submittingPayment ? "Opening Stripe..." : "Pay with Stripe"}
                  </Button>
                </div>
              </section>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg border border-gray-200 bg-white p-6 shadow-lg">
              <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-900">
                <Package className="w-5 h-5 text-blue-600" />
                Order Summary
              </h2>

              <div className="mb-6 max-h-96 space-y-3 overflow-y-auto border-b border-gray-200 pb-6">
                {cartProducts
                  .filter(({ product }) => product)
                  .map(({ product, line }) => (
                    <div
                      key={`${product.id}-${line.color || ""}-${line.size || ""}`}
                      className="flex items-start justify-between gap-3 text-sm"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-700 truncate font-medium">{product.name}</p>
                        <p className="text-xs text-gray-600">x{line.quantity}</p>
                      </div>
                      <Price
                        value={product.price * line.quantity}
                        className="text-gray-900 font-semibold flex-shrink-0 ml-2"
                      />
                    </div>
                  ))}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900 font-semibold">
                    <Price value={totals.subtotal} />
                  </span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600 font-semibold">-₹{totals.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-gray-900 font-semibold">
                    {selectedDeliveryOption.price === 0 ? (
                      "FREE"
                    ) : (
                      <Price value={selectedDeliveryOption.price} />
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{selectedDeliveryOption.label}</span>
                  <span>{selectedDeliveryOption.days}</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-lg font-bold">
                <span className="text-gray-900">Total</span>
                <div className="text-xl text-blue-600">
                  <Price value={checkoutTotal} />
                </div>
              </div>

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
                  {isComplete ? <CheckCircle className="w-6 h-6" /> : s.icon}
                </div>
                <span
                  className={`text-xs font-semibold transition-colors ${
                    isCurrent ? "text-blue-600" : isComplete ? "text-green-600" : "text-gray-600"
                  }`}
                >
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
