import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { d as useShop } from "./shop-2M7M6sRV.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { E as Package, i as Users, m as ShoppingCart } from "../_libs/lucide-react.mjs";
import { t as AdminSidebar } from "./AdminSidebar-BjOiwkEQ.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, l as Pie, n as BarChart, o as Line, r as LineChart, s as CartesianGrid, t as PieChart, u as Cell } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.dashboard-CL8jwd-i.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminDashboard() {
	const { admin } = useShop();
	const [stats, setStats] = (0, import_react.useState)({
		totalProducts: 0,
		totalCategories: 0,
		totalCustomers: 0,
		totalOrders: 0,
		revenue: 0
	});
	(0, import_react.useEffect)(() => {
		setStats({
			totalProducts: 150,
			totalCategories: 8,
			totalCustomers: 1250,
			totalOrders: 3450,
			revenue: 25e5
		});
	}, []);
	if (!admin) return null;
	const revenueData = [
		{
			month: "Jan",
			revenue: 18e4
		},
		{
			month: "Feb",
			revenue: 22e4
		},
		{
			month: "Mar",
			revenue: 2e5
		},
		{
			month: "Apr",
			revenue: 27e4
		},
		{
			month: "May",
			revenue: 25e4
		},
		{
			month: "Jun",
			revenue: 29e4
		}
	];
	const ordersData = [
		{
			month: "Jan",
			orders: 240
		},
		{
			month: "Feb",
			orders: 290
		},
		{
			month: "Mar",
			orders: 200
		},
		{
			month: "Apr",
			orders: 320
		},
		{
			month: "May",
			orders: 280
		},
		{
			month: "Jun",
			orders: 350
		}
	];
	const categoryData = [
		{
			name: "Electronics",
			value: 35
		},
		{
			name: "Fashion",
			value: 25
		},
		{
			name: "Home",
			value: 20
		},
		{
			name: "Others",
			value: 20
		}
	];
	const COLORS = [
		"#3b82f6",
		"#ec4899",
		"#f59e0b",
		"#10b981"
	];
	const StatCard = ({ title, value, icon: Icon, color }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-white p-6 rounded-lg shadow border-l-4",
		style: { borderLeftColor: color },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-gray-500 text-sm",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-2xl font-bold mt-2",
				children: typeof value === "number" && value > 1e3 ? (value / 1e3).toFixed(1) + "K" : value
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				className: "w-8 h-8",
				style: { color }
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-screen bg-gray-50 overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminSidebar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "flex-1 overflow-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white border-b border-gray-200 sticky top-0 z-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-8 py-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-bold",
							children: "Dashboard"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-gray-600 text-sm mt-1",
							children: ["Welcome back, ", admin.name]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { children: "Export Report" })]
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								title: "Total Products",
								value: stats.totalProducts,
								icon: Package,
								color: "#3b82f6"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								title: "Categories",
								value: stats.totalCategories,
								icon: Package,
								color: "#10b981"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								title: "Total Customers",
								value: stats.totalCustomers,
								icon: Users,
								color: "#f59e0b"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								title: "Total Orders",
								value: stats.totalOrders,
								icon: ShoppingCart,
								color: "#ec4899"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white p-6 rounded-lg shadow",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-bold mb-4",
								children: "Revenue Over Time"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: 300,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
									data: revenueData,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, { strokeDasharray: "3 3" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, { dataKey: "month" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
											type: "monotone",
											dataKey: "revenue",
											stroke: "#3b82f6"
										})
									]
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white p-6 rounded-lg shadow",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-bold mb-4",
								children: "Orders Over Time"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: 300,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: ordersData,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, { strokeDasharray: "3 3" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, { dataKey: "month" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "orders",
											fill: "#10b981"
										})
									]
								})
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white p-6 rounded-lg shadow",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-bold mb-4",
								children: "Sales by Category"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: 300,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
									data: categoryData,
									cx: "50%",
									cy: "50%",
									labelLine: false,
									label: ({ name, value }) => `${name}: ${value}%`,
									outerRadius: 80,
									fill: "#8884d8",
									dataKey: "value",
									children: categoryData.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {})] })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white p-6 rounded-lg shadow",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-bold mb-4",
								children: "Recent Orders"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-4",
								children: [
									1,
									2,
									3
								].map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center p-4 border border-gray-200 rounded",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-medium",
										children: ["Order #", 1e3 + order]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-gray-500 text-sm",
										children: "Customer Name"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium",
											children: "₹5,999"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-green-600 text-sm",
											children: "Delivered"
										})]
									})]
								}, order))
							})]
						})]
					})
				]
			})]
		})]
	});
}
//#endregion
export { AdminDashboard as component };
