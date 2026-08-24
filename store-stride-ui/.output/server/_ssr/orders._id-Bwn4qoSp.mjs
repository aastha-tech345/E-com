import { o as require_jsx_runtime } from "../_libs/@mui/material+[...].mjs";
import { c as orders } from "./shop-DLp9rmaL.mjs";
import { b as useParams, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { $ as ChevronLeft, J as Clock, tt as Check } from "../_libs/lucide-react.mjs";
import { n as Header, t as Footer } from "./Footer-DV3d5YjR.mjs";
import { t as Price } from "./Price-EXOzJVUM.mjs";
import { t as EmptyState } from "./EmptyState-BFwqIhiN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders._id-Bwn4qoSp.js
var import_jsx_runtime = require_jsx_runtime();
function OrderDetailsPage() {
	const navigate = useNavigate();
	const { id } = useParams({ from: "/orders/$id" });
	const order = orders.find((o) => o.id === id);
	if (!order) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-white flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 flex items-center justify-center py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "Order not found",
					description: "The order you're looking for doesn't exist",
					action: {
						label: "Back to Orders",
						onClick: () => navigate({ to: "/orders" })
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-white",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-7xl mx-auto px-4 py-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						onClick: () => navigate({ to: "/orders" }),
						className: "mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-4 h-4 mr-2" }), "Back to Orders"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-start mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "text-3xl font-bold text-gray-900 mb-2",
							children: ["Order ", order.id]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-gray-600",
							children: ["Placed on ", new Date(order.date).toLocaleDateString()]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `px-4 py-2 rounded-full font-semibold ${{
								pending: "bg-yellow-100 text-yellow-800",
								processing: "bg-blue-100 text-blue-800",
								shipped: "bg-purple-100 text-purple-800",
								delivered: "bg-green-100 text-green-800",
								cancelled: "bg-red-100 text-red-800"
							}[order.status] || "bg-gray-100 text-gray-800"}`,
							children: order.status.charAt(0).toUpperCase() + order.status.slice(1)
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-2 space-y-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border rounded-lg p-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-bold text-gray-900 mb-6",
									children: "Order Timeline"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-6",
									children: order.timeline.map((event, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col items-center",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `w-10 h-10 rounded-full flex items-center justify-center ${event.done ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`,
												children: event.done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "w-5 h-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "w-5 h-5" })
											}), idx < order.timeline.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `w-0.5 h-12 ${event.done ? "bg-green-100" : "bg-gray-100"}` })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "pt-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold text-gray-900",
												children: event.label
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-gray-600",
												children: new Date(event.date).toLocaleDateString()
											})]
										})]
									}, idx))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border rounded-lg p-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-bold text-gray-900 mb-6",
									children: "Order Items"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-4",
									children: order.items.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-4 pb-4 border-b last:border-0 last:pb-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: item.image,
												alt: item.name,
												className: "w-20 h-20 rounded-lg object-cover bg-gray-100"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-semibold text-gray-900",
														children: item.name
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-sm text-gray-600",
														children: item.variant
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-sm text-gray-600",
														children: ["Qty: ", item.quantity]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Price, {
												value: item.price * item.quantity,
												className: "font-semibold"
											})
										]
									}, idx))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border rounded-lg p-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-lg font-bold text-gray-900 mb-4",
										children: "Delivery Address"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-gray-900",
										children: order.address.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-gray-600",
										children: order.address.phone
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-gray-700 mt-2",
										children: [
											order.address.line1,
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											order.address.city,
											", ",
											order.address.state,
											" ",
											order.address.pincode
										]
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-1 space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border rounded-lg p-6 sticky top-20",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-lg font-bold text-gray-900 mb-4",
										children: "Price Details"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-gray-600",
													children: "Subtotal"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Price, { value: order.subtotal })]
											}),
											order.discount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between text-green-600",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Discount" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["-₹", order.discount] })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-gray-600",
													children: "Delivery"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: order.shipping === 0 ? "FREE" : `₹${order.shipping}` })]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border-t mt-4 pt-4 flex justify-between font-bold text-lg",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Price, { value: order.total })]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border rounded-lg p-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-bold text-gray-900 mb-4",
									children: "Payment"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-gray-600",
											children: "Method"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-gray-900",
											children: order.payment.method
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-gray-600",
											children: "Status"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `font-semibold ${order.payment.status === "paid" ? "text-green-600" : order.payment.status === "pending" ? "text-yellow-600" : "text-red-600"}`,
											children: order.payment.status.charAt(0).toUpperCase() + order.payment.status.slice(1)
										})]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										className: "w-full",
										variant: "outline",
										children: "Track Order"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										className: "w-full",
										variant: "outline",
										children: "Print Invoice"
									}),
									order.status === "delivered" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										className: "w-full",
										variant: "outline",
										children: "Write Review"
									})
								]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { OrderDetailsPage as component };
