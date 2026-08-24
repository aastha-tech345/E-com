import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { p as useShop } from "./shop-fTXyFsSH.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { $ as CircleAlert, V as Heart, tt as ChevronLeft, u as Trash2 } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { n as Header, t as Footer } from "./Footer-CVdFw6bt.mjs";
import { t as Price } from "./Price-DppwMgIf.mjs";
import { n as ShoppingAssistant } from "./ShoppingAssistant-CvyCaPM3.mjs";
import { t as EmptyState } from "./EmptyState-BFwqIhiN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-CV-WpUIC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CartPage() {
	const navigate = useNavigate();
	const { cartProducts, totals, updateQuantity, removeFromCart, clearCart, toggleWishlist, applyCoupon, coupon } = useShop();
	const [couponCode, setCouponCode] = import_react.useState("");
	if (cartProducts.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-white flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 flex items-center justify-center py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "Your cart is empty",
					description: "Add some products to get started",
					action: {
						label: "Continue Shopping",
						onClick: () => navigate({ to: "/products" })
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
	const handleApplyCoupon = () => {
		if (!couponCode.trim()) {
			toast.error("Enter a coupon code");
			return;
		}
		applyCoupon(couponCode);
		setCouponCode("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-white",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-7xl mx-auto px-4 py-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-bold text-gray-900 mb-2",
						children: "Shopping Cart"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-gray-600",
						children: [cartProducts.length, " items in cart"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4",
							children: cartProducts.filter(({ product }) => product).map(({ product, line }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border rounded-lg p-4 flex gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0",
										children: product.images?.[0] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: product.images[0],
											alt: product.name,
											className: "w-full h-full object-cover"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 min-w-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => navigate({
													to: "/products/$id",
													params: { id: product.id }
												}),
												className: "font-semibold text-gray-900 hover:text-blue-600 truncate",
												children: product.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-gray-600",
												children: product.brand
											}),
											line.color && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-sm text-gray-600",
												children: ["Color: ", line.color]
											}),
											line.size && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-sm text-gray-600",
												children: ["Size: ", line.size]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col items-end justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Price, {
											value: product.price,
											className: "font-bold text-lg"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "icon",
												onClick: () => toggleWishlist(product.id),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "w-4 h-4" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "icon",
												onClick: () => removeFromCart(product.id),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4 text-red-600" })
											})]
										})]
									})
								]
							}, `${product.id}-${line.color || ""}-${line.size || ""}`))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								onClick: () => navigate({ to: "/products" }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-4 h-4 mr-2" }), "Continue Shopping"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: clearCart,
								className: "text-red-600 hover:text-red-700",
								children: "Clear Cart"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg:col-span-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border rounded-lg p-6 sticky top-20 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-bold text-gray-900",
									children: "Order Summary"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												placeholder: "Coupon code",
												value: couponCode,
												onChange: (e) => setCouponCode(e.target.value),
												disabled: !!coupon
											}), coupon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "icon",
												onClick: () => applyCoupon(""),
												children: "✕"
											})]
										}),
										!coupon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											className: "w-full",
											onClick: handleApplyCoupon,
											children: "Apply Coupon"
										}),
										coupon && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "bg-green-50 text-green-700 p-2 rounded text-sm",
											children: [
												"✓ Coupon ",
												coupon,
												" applied"
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-t pt-4 space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between text-gray-700",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Price, { value: totals.subtotal })]
										}),
										totals.discount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between text-green-600",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Discount" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["-₹", totals.discount] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between text-gray-700",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Delivery" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: totals.shipping === 0 ? "FREE" : `₹${totals.shipping}` })]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-t pt-4 flex justify-between text-lg font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Price, { value: totals.total })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: "w-full bg-blue-600 hover:bg-blue-700 text-white h-12",
									onClick: () => navigate({ to: "/checkout" }),
									children: "Proceed to Checkout"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-blue-50 border border-blue-200 rounded p-3 flex gap-2 text-sm text-blue-700",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 flex-shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Free delivery on orders above ₹999" })]
								})
							]
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingAssistant, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { CartPage as component };
