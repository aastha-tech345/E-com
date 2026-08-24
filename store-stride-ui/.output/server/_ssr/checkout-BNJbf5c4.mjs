import { i as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@emotion/react+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@mui/material+[...].mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { f as useShop } from "./shop-DLp9rmaL.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { E as Package, I as Lock, N as MapPin, X as CircleCheckBig, ot as ArrowLeft, q as CreditCard, s as Truck } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { n as Header, t as Footer } from "./Footer-DV3d5YjR.mjs";
import { t as Price } from "./Price-EXOzJVUM.mjs";
import { t as EmptyState } from "./EmptyState-BFwqIhiN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-BNJbf5c4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CheckoutPage() {
	const navigate = useNavigate();
	const { cartProducts, totals, clearCart, user, addresses, addAddress } = useShop();
	const [step, setStep] = import_react.useState("address");
	const [selectedAddress, setSelectedAddress] = import_react.useState(addresses[0]?.id || null);
	const [selectedDelivery, setSelectedDelivery] = import_react.useState("standard");
	const [newAddress, setNewAddress] = import_react.useState({
		name: "",
		phone: "",
		line1: "",
		city: "",
		state: "",
		pincode: ""
	});
	if (cartProducts.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-white flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 flex items-center justify-center py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "Your cart is empty",
					description: "Add items to proceed with checkout",
					action: {
						label: "Back to Shop",
						onClick: () => navigate({
							to: "/products",
							search: { page: 1 }
						})
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
	const handleAddNewAddress = () => {
		if (!newAddress.name || !newAddress.phone || !newAddress.line1 || !newAddress.city || !newAddress.state || !newAddress.pincode) {
			toast.error("Please fill all address fields");
			return;
		}
		addAddress({
			id: `AD${Date.now()}`,
			...newAddress,
			type: "home"
		});
		setNewAddress({
			name: "",
			phone: "",
			line1: "",
			city: "",
			state: "",
			pincode: ""
		});
		toast.success("Address added successfully");
	};
	const handleCompleteOrder = () => {
		if (!selectedAddress || !selectedDelivery) {
			toast.error("Please select address and delivery method");
			return;
		}
		toast.success("Order placed successfully!");
		clearCart();
		setTimeout(() => {
			navigate({ to: "/orders" });
		}, 1e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-gradient-to-b from-slate-50 to-white",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-6xl mx-auto px-4 py-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-12",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-4xl font-bold text-gray-900 mb-2",
							children: "Checkout"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-gray-600",
							children: "Complete your purchase securely"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden md:flex items-center gap-2 text-sm text-gray-600",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-5 h-5 text-green-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Secure & encrypted" })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepIndicator, {
						step,
						setStep
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-2",
						children: [
							step === "address" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-8",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										className: "text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-6 h-6 text-blue-600" }), "Delivery Address"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-semibold text-gray-900 mb-4 text-lg",
										children: "Your Addresses"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-3",
										children: addresses.map((addr) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: `border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 ${selectedAddress === addr.id ? "border-blue-600 bg-blue-50 shadow-md" : "border-gray-200 hover:border-gray-300 hover:shadow-sm"}`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-start gap-4",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: `w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${selectedAddress === addr.id ? "border-blue-600 bg-blue-600" : "border-gray-300"}`,
														children: selectedAddress === addr.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2 h-2 bg-white rounded-full" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex-1",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "font-semibold text-gray-900 text-base",
																children: addr.name
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																className: "text-sm text-gray-600 mt-1",
																children: ["📱 ", addr.phone]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																className: "text-sm text-gray-700 mt-2 leading-relaxed",
																children: [
																	addr.line1,
																	", ",
																	addr.city,
																	", ",
																	addr.state,
																	" ",
																	addr.pincode
																]
															}),
															addr.type && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full capitalize",
																children: addr.type
															})
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "radio",
														name: "address",
														value: addr.id,
														checked: selectedAddress === addr.id,
														onChange: (e) => setSelectedAddress(e.target.value),
														className: "hidden"
													})
												]
											})
										}, addr.id))
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border-t-2 mt-8 pt-8",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-semibold text-gray-900 mb-6 text-lg",
												children: "Add New Address"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-1 md:grid-cols-2 gap-4",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														placeholder: "Full Name",
														value: newAddress.name,
														onChange: (e) => setNewAddress({
															...newAddress,
															name: e.target.value
														}),
														className: "rounded-lg border-gray-200 focus:border-blue-600"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														placeholder: "Phone Number",
														value: newAddress.phone,
														onChange: (e) => setNewAddress({
															...newAddress,
															phone: e.target.value
														}),
														className: "rounded-lg border-gray-200 focus:border-blue-600"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														placeholder: "Street Address",
														className: "md:col-span-2 rounded-lg border-gray-200 focus:border-blue-600",
														value: newAddress.line1,
														onChange: (e) => setNewAddress({
															...newAddress,
															line1: e.target.value
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														placeholder: "City",
														value: newAddress.city,
														onChange: (e) => setNewAddress({
															...newAddress,
															city: e.target.value
														}),
														className: "rounded-lg border-gray-200 focus:border-blue-600"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														placeholder: "State",
														value: newAddress.state,
														onChange: (e) => setNewAddress({
															...newAddress,
															state: e.target.value
														}),
														className: "rounded-lg border-gray-200 focus:border-blue-600"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														placeholder: "Pincode",
														value: newAddress.pincode,
														onChange: (e) => setNewAddress({
															...newAddress,
															pincode: e.target.value
														}),
														className: "rounded-lg border-gray-200 focus:border-blue-600"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												onClick: handleAddNewAddress,
												variant: "outline",
												className: "mt-6 rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50",
												children: "+ Add New Address"
											})
										]
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => setStep("delivery"),
									className: "w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-base",
									disabled: !selectedAddress,
									children: ["Continue to Delivery ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-4 h-4 ml-2 rotate-180" })]
								})]
							}),
							step === "delivery" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-8",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "w-6 h-6 text-blue-600" }), "Delivery Method"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-4",
									children: [
										{
											id: "standard",
											label: "Standard Delivery",
											days: "5-7 business days",
											price: 49,
											badge: "STANDARD"
										},
										{
											id: "express",
											label: "Express Delivery",
											days: "2-3 business days",
											price: 149,
											badge: "FASTER"
										},
										{
											id: "priority",
											label: "Priority Delivery",
											days: "Next day",
											price: 299,
											badge: "FASTEST"
										}
									].map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: `border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 ${selectedDelivery === option.id ? "border-blue-600 bg-blue-50 shadow-md" : "border-gray-200 hover:border-gray-300 hover:shadow-sm"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start gap-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: `w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${selectedDelivery === option.id ? "border-blue-600 bg-blue-600" : "border-gray-300"}`,
													children: selectedDelivery === option.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2 h-2 bg-white rounded-full" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-3 mb-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "font-semibold text-gray-900 text-base",
															children: option.label
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "px-2.5 py-0.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold rounded-full",
															children: option.badge
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-sm text-gray-600",
														children: ["🚚 ", option.days]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex-shrink-0 text-right",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Price, {
														value: option.price,
														className: "font-bold text-lg"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "radio",
													name: "delivery",
													value: option.id,
													checked: selectedDelivery === option.id,
													onChange: (e) => setSelectedDelivery(e.target.value),
													className: "hidden"
												})
											]
										})
									}, option.id))
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										onClick: () => setStep("address"),
										className: "flex-1 rounded-lg border-gray-200 hover:bg-gray-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-4 h-4 mr-2" }), "Back"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: () => setStep("payment"),
										className: "flex-1 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold",
										children: ["Continue to Payment ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-4 h-4 ml-2 rotate-180" })]
									})]
								})]
							}),
							step === "payment" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-8",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										className: "text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "w-6 h-6 text-blue-600" }), "Payment Method"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-4",
										children: [
											{
												id: "upi",
												label: "UPI",
												desc: "Fast & secure using UPI apps",
												icon: "📱"
											},
											{
												id: "card",
												label: "Credit/Debit Card",
												desc: "Visa, Mastercard, RuPay",
												icon: "💳"
											},
											{
												id: "wallet",
												label: "Digital Wallet",
												desc: "PhonePe, Google Pay, Amazon Pay",
												icon: "👛"
											},
											{
												id: "cod",
												label: "Cash on Delivery",
												desc: "Pay when you receive your order",
												icon: "💰"
											}
										].map((option, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 border-gray-200 hover:border-gray-300 hover:shadow-sm",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-start gap-4",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: `w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${idx === 0 ? "border-blue-600 bg-blue-600" : "border-gray-300"}`,
														children: idx === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-2 h-2 bg-white rounded-full" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "font-semibold text-gray-900 text-base",
															children: [
																option.icon,
																" ",
																option.label
															]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-sm text-gray-600 mt-1",
															children: option.desc
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "radio",
														name: "payment",
														value: option.id,
														defaultChecked: idx === 0,
														className: "hidden"
													})
												]
											})
										}, option.id))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-8 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-5 h-5 text-green-600 flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold text-green-900 text-sm",
											children: "Secure Payment"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-green-700",
											children: "Your payment information is encrypted and secure"
										})] })]
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										onClick: () => setStep("delivery"),
										className: "flex-1 rounded-lg border-gray-200 hover:bg-gray-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-4 h-4 mr-2" }), "Back"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: () => setStep("review"),
										className: "flex-1 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold",
										children: ["Continue to Review ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-4 h-4 ml-2 rotate-180" })]
									})]
								})]
							}),
							step === "review" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-8",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										className: "text-2xl font-bold text-gray-900 flex items-center gap-2 mb-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "w-6 h-6 text-blue-600" }), "Order Review"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border-2 border-gray-200 rounded-xl p-6 mb-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-semibold text-gray-900 mb-4 text-lg",
											children: "Order Items"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-4",
											children: cartProducts.filter(({ product }) => product).map(({ product, line }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0",
												children: [
													product.images?.[0] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: product.images[0],
														alt: product.name,
														className: "w-16 h-16 rounded-lg object-cover bg-gray-100"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex-1 min-w-0",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "font-semibold text-gray-900 truncate",
																children: product.name
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																className: "text-sm text-gray-600",
																children: ["Quantity: ", line.quantity]
															}),
															line.color && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																className: "text-xs text-gray-600 mt-1",
																children: ["Color: ", line.color]
															}),
															line.size && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																className: "text-xs text-gray-600",
																children: ["Size: ", line.size]
															})
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Price, {
														value: product.price * line.quantity,
														className: "font-bold text-lg flex-shrink-0"
													})
												]
											}, `${product.id}-${line.color || ""}-${line.size || ""}`))
										})]
									}),
									selectedAddress && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border-2 border-gray-200 rounded-xl p-6 mb-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "font-semibold text-gray-900 mb-3 text-lg flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-5 h-5 text-blue-600" }), "Delivery Address"]
										}), addresses.find((a) => a.id === selectedAddress) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold text-gray-900",
												children: addresses.find((a) => a.id === selectedAddress)?.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-sm text-gray-600 mt-2",
												children: [
													addresses.find((a) => a.id === selectedAddress)?.line1,
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
													addresses.find((a) => a.id === selectedAddress)?.city,
													", ",
													addresses.find((a) => a.id === selectedAddress)?.state,
													" ",
													addresses.find((a) => a.id === selectedAddress)?.pincode
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-sm text-gray-600 mt-2",
												children: ["📱 ", addresses.find((a) => a.id === selectedAddress)?.phone]
											})
										] })]
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										onClick: () => setStep("payment"),
										className: "flex-1 rounded-lg border-gray-200 hover:bg-gray-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-4 h-4 mr-2" }), "Back"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: handleCompleteOrder,
										className: "flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-lg font-semibold text-base py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "w-5 h-5 mr-2" }), "Place Order Now"]
									})]
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg:col-span-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-2 border-gray-200 rounded-xl p-6 sticky top-24 shadow-lg bg-gradient-to-b from-white to-gray-50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "text-xl font-bold text-gray-900 mb-6 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "w-5 h-5 text-blue-600" }), "Order Summary"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-3 max-h-96 overflow-y-auto mb-6 pb-6 border-b border-gray-200",
									children: cartProducts.filter(({ product }) => product).map(({ product, line }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-start text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-gray-700 truncate font-medium",
												children: product.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-gray-600",
												children: ["x", line.quantity]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Price, {
											value: product.price * line.quantity,
											className: "text-gray-900 font-semibold flex-shrink-0 ml-2"
										})]
									}, `${product.id}-${line.color || ""}-${line.size || ""}`))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3 mb-6",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-gray-600",
												children: "Subtotal"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-gray-900 font-semibold",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Price, { value: totals.subtotal })
											})]
										}),
										totals.discount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-gray-600",
												children: "Discount"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-green-600 font-semibold",
												children: ["-₹", totals.discount]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-gray-600",
												children: "Delivery"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-gray-900 font-semibold",
												children: totals.shipping === 0 ? "FREE 🎉" : `₹${totals.shipping}`
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-t-2 border-gray-200 pt-4 flex justify-between items-center text-lg font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-gray-900",
										children: "Total"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xl text-blue-600",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Price, { value: totals.total })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 pt-6 border-t border-gray-200 space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 text-xs text-gray-600",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "w-4 h-4 text-green-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Secure checkout" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 text-xs text-gray-600",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "w-4 h-4 text-green-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "7-day returns" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 text-xs text-gray-600",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "w-4 h-4 text-blue-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Fast delivery" })]
										})
									]
								})
							]
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
function StepIndicator({ step, setStep }) {
	const steps = [
		{
			id: "address",
			label: "Address",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "w-5 h-5" })
		},
		{
			id: "delivery",
			label: "Delivery",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "w-5 h-5" })
		},
		{
			id: "payment",
			label: "Payment",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "w-5 h-5" })
		},
		{
			id: "review",
			label: "Review",
			icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "w-5 h-5" })
		}
	];
	const currentStepIndex = {
		address: 0,
		delivery: 1,
		payment: 2,
		review: 3
	}[step];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-between",
			children: steps.map((s, idx) => {
				const isComplete = idx < currentStepIndex;
				const isCurrent = idx === currentStepIndex;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setStep(s.id),
					className: `flex flex-col items-center gap-2.5 transition-all duration-200 ${isCurrent ? "opacity-100" : "opacity-75 hover:opacity-100"}`,
					disabled: idx > currentStepIndex,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `w-12 h-12 rounded-full flex items-center justify-center border-2 font-semibold text-sm transition-all duration-200 ${isComplete ? "border-green-600 bg-green-600 text-white" : isCurrent ? "border-blue-600 bg-blue-50 text-blue-600 shadow-lg" : "border-gray-300 bg-white text-gray-400"}`,
						children: isComplete ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "w-6 h-6" }) : s.icon
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `text-xs font-semibold transition-colors ${isCurrent ? "text-blue-600" : isComplete ? "text-green-600" : "text-gray-600"}`,
						children: s.label
					})]
				}), idx < steps.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `flex-1 h-1 mx-3 rounded-full transition-all duration-200 ${isComplete ? "bg-gradient-to-r from-green-600 to-green-600" : isCurrent ? "bg-gradient-to-r from-gray-300 to-gray-300" : "bg-gray-200"}` })] }, s.id);
			})
		})
	});
}
//#endregion
export { CheckoutPage as component };
