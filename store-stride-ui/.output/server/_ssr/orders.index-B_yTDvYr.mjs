import { i as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@emotion/react+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@mui/material+[...].mjs";
import { c as orders, f as useShop } from "./shop-DLp9rmaL.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { W as Eye } from "../_libs/lucide-react.mjs";
import { n as Header, t as Footer } from "./Footer-DV3d5YjR.mjs";
import { t as Price } from "./Price-EXOzJVUM.mjs";
import { t as EmptyState } from "./EmptyState-BFwqIhiN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders.index-B_yTDvYr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OrdersPage() {
	const navigate = useNavigate();
	const { user } = useShop();
	const [statusFilter, setStatusFilter] = (0, import_react.useState)(null);
	const userOrders = orders.slice(0, 8);
	const filteredOrders = statusFilter ? userOrders.filter((o) => o.status === statusFilter) : userOrders;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-white",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-7xl mx-auto px-4 py-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-bold text-gray-900 mb-2",
						children: "My Orders"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-gray-600 mb-8",
						children: [filteredOrders.length, " orders"]
					}),
					filteredOrders.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-4",
						children: filteredOrders.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderCard, {
							order,
							onViewDetails: () => navigate({
								to: "/orders/$id",
								params: { id: order.id }
							})
						}, order.id))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						title: "No orders found",
						description: "You haven't placed any orders yet",
						action: {
							label: "Start Shopping",
							onClick: () => navigate({ to: "/products" })
						}
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
function OrderCard({ order, onViewDetails }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border rounded-lg p-4 hover:shadow-md transition",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 md:grid-cols-5 gap-4 items-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-gray-600",
					children: "Order ID"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold text-gray-900",
					children: order.id
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-gray-600",
					children: "Date"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold text-gray-900",
					children: new Date(order.date).toLocaleDateString()
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-gray-600",
					children: "Items"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-semibold text-gray-900",
					children: [order.items.length, " products"]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `inline-block px-3 py-1 rounded-full text-xs font-semibold ${{
						pending: "bg-yellow-100 text-yellow-800",
						processing: "bg-blue-100 text-blue-800",
						shipped: "bg-purple-100 text-purple-800",
						delivered: "bg-green-100 text-green-800",
						cancelled: "bg-red-100 text-red-800"
					}[order.status] || "bg-gray-100 text-gray-800"}`,
					children: {
						pending: "Pending",
						processing: "Processing",
						shipped: "Shipped",
						delivered: "Delivered",
						cancelled: "Cancelled"
					}[order.status] || order.status
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between md:justify-end gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Price, {
						value: order.total,
						className: "font-bold text-lg"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "icon",
						onClick: onViewDetails,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-4 h-4" })
					})]
				})
			]
		})
	});
}
//#endregion
export { OrdersPage as component };
