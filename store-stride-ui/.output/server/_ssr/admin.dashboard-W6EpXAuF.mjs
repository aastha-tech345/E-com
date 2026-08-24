import { i as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@emotion/react+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@mui/material+[...].mjs";
import { f as useShop } from "./shop-DLp9rmaL.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { E as Package, H as Funnel, K as Download, c as TrendingUp, it as ArrowUpRight, m as ShoppingCart, r as Users, st as ArrowDownRight } from "../_libs/lucide-react.mjs";
import { t as AdminSidebar } from "./AdminSidebar-R9T8teqq.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, l as Pie, n as PieChart, o as Area, p as Legend, r as BarChart, s as CartesianGrid, t as AreaChart, u as Cell } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.dashboard-W6EpXAuF.js
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
	const isSeller = admin.roles.includes("seller_owner");
	const revenueData = [
		{
			month: "Jan",
			revenue: 18e4,
			target: 2e5
		},
		{
			month: "Feb",
			revenue: 22e4,
			target: 2e5
		},
		{
			month: "Mar",
			revenue: 2e5,
			target: 2e5
		},
		{
			month: "Apr",
			revenue: 27e4,
			target: 25e4
		},
		{
			month: "May",
			revenue: 25e4,
			target: 25e4
		},
		{
			month: "Jun",
			revenue: 29e4,
			target: 3e5
		}
	];
	const ordersData = [
		{
			month: "Jan",
			orders: 240,
			completed: 220
		},
		{
			month: "Feb",
			orders: 290,
			completed: 275
		},
		{
			month: "Mar",
			orders: 200,
			completed: 185
		},
		{
			month: "Apr",
			orders: 320,
			completed: 310
		},
		{
			month: "May",
			orders: 280,
			completed: 265
		},
		{
			month: "Jun",
			orders: 350,
			completed: 340
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
	const StatCard = ({ title, value, icon: Icon, color, change, positive }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-gray-600 text-sm font-medium",
							children: title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-3xl font-bold mt-3 text-gray-900",
							children: typeof value === "number" && value > 1e3 ? (value / 1e3).toFixed(1) + "K" : value
						}),
						change && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center gap-1",
							children: [positive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "w-4 h-4 text-green-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDownRight, { className: "w-4 h-4 text-red-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: positive ? "text-green-600 text-sm font-medium" : "text-red-600 text-sm font-medium",
								children: [change, "% from last month"]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-12 h-12 rounded-lg flex items-center justify-center",
					style: { backgroundColor: color + "15" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
						className: "w-6 h-6",
						style: { color }
					})
				})]
			})
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-screen bg-gray-900 overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminSidebar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "flex-1 overflow-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-gray-800 border-b border-gray-700 sticky top-0 z-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-8 py-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-3xl font-bold text-white",
							children: isSeller ? "🏪 Seller Hub" : "📊 Dashboard"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-gray-400 text-sm mt-2",
							children: [
								"Welcome back, ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-blue-400",
									children: admin.full_name
								}),
								isSeller && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-amber-400 ml-2",
									children: "(Seller)"
								})
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "w-4 h-4" }), "Filter"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "bg-blue-600 hover:bg-blue-700 text-white gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4" }), "Export Report"]
							})]
						})]
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-8",
				children: [
					isSeller ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-8 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-2xl",
									children: "📈"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold text-amber-100",
									children: "Sales Tip"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-amber-100/80 text-sm mt-1",
									children: "Your shop is performing great! Consider adding seasonal items to boost sales further."
								})] })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									title: "My Products",
									value: stats.totalProducts,
									icon: Package,
									color: "#3b82f6",
									change: 12,
									positive: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									title: "Total Orders",
									value: stats.totalOrders,
									icon: ShoppingCart,
									color: "#f59e0b",
									change: 8,
									positive: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									title: "Total Customers",
									value: stats.totalCustomers,
									icon: Users,
									color: "#ec4899",
									change: -3,
									positive: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
									title: "Revenue",
									value: "₹" + (stats.revenue / 1e5).toFixed(1) + "L",
									icon: TrendingUp,
									color: "#10b981",
									change: 15,
									positive: true
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-6 rounded-lg transition-all transform hover:scale-105 shadow-lg",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-2xl mb-2",
											children: "➕"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-semibold",
											children: "Add New Product"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-blue-100 mt-1",
											children: "List your products"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-6 rounded-lg transition-all transform hover:scale-105 shadow-lg",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-2xl mb-2",
											children: "📦"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-semibold",
											children: "Manage Inventory"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-purple-100 mt-1",
											children: "Track stock levels"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-6 rounded-lg transition-all transform hover:scale-105 shadow-lg",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-2xl mb-2",
											children: "📊"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-semibold",
											children: "View Analytics"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-green-100 mt-1",
											children: "Performance metrics"
										})
									]
								})
							]
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								title: "Total Products",
								value: stats.totalProducts,
								icon: Package,
								color: "#3b82f6",
								change: 5,
								positive: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								title: "Categories",
								value: stats.totalCategories,
								icon: Package,
								color: "#10b981",
								change: 0,
								positive: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								title: "Total Customers",
								value: stats.totalCustomers,
								icon: Users,
								color: "#f59e0b",
								change: 18,
								positive: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								title: "Total Orders",
								value: stats.totalOrders,
								icon: ShoppingCart,
								color: "#ec4899",
								change: 22,
								positive: true
							})
						]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-bold text-white",
									children: "Revenue Trend"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-gray-400 text-sm mt-1",
									children: "Last 6 months performance"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-3xl",
									children: "📈"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: 300,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
									data: revenueData,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
											id: "colorRevenue",
											x1: "0",
											y1: "0",
											x2: "0",
											y2: "1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
												offset: "5%",
												stopColor: "#3b82f6",
												stopOpacity: .3
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
												offset: "95%",
												stopColor: "#3b82f6",
												stopOpacity: 0
											})]
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "#374151"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "month",
											stroke: "#9ca3af"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { stroke: "#9ca3af" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
											contentStyle: {
												backgroundColor: "#1f2937",
												border: "1px solid #374151",
												borderRadius: "8px"
											},
											labelStyle: { color: "#f3f4f6" }
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
											type: "monotone",
											dataKey: "revenue",
											stroke: "#3b82f6",
											strokeWidth: 2,
											fillOpacity: 1,
											fill: "url(#colorRevenue)"
										})
									]
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-bold text-white",
									children: "Order Stats"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-gray-400 text-sm mt-1",
									children: "Total vs Completed orders"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-3xl",
									children: "📊"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: 300,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: ordersData,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "#374151"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "month",
											stroke: "#9ca3af"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { stroke: "#9ca3af" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
											contentStyle: {
												backgroundColor: "#1f2937",
												border: "1px solid #374151",
												borderRadius: "8px"
											},
											labelStyle: { color: "#f3f4f6" }
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "orders",
											fill: "#3b82f6",
											name: "Total Orders",
											radius: [
												8,
												8,
												0,
												0
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "completed",
											fill: "#10b981",
											name: "Completed",
											radius: [
												8,
												8,
												0,
												0
											]
										})
									]
								})
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-bold text-white",
									children: "Sales by Category"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-gray-400 text-sm mt-1",
									children: "Category distribution"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-3xl",
									children: "🎯"
								})]
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
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									contentStyle: {
										backgroundColor: "#1f2937",
										border: "1px solid #374151",
										borderRadius: "8px"
									},
									labelStyle: { color: "#f3f4f6" }
								})] })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-bold text-white",
									children: "Recent Orders"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-gray-400 text-sm mt-1",
									children: "Latest transactions"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-3xl",
									children: "🛒"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-3",
								children: [
									1,
									2,
									3
								].map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-center p-4 bg-gray-700/50 border border-gray-600 rounded-lg hover:bg-gray-700 transition",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-medium text-white",
											children: ["Order #", 1e3 + order]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-gray-400 text-sm",
											children: ["Customer Name • ", (/* @__PURE__ */ new Date()).toLocaleDateString()]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-semibold text-white",
											children: ["₹", (5999 + order * 1e3).toLocaleString()]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "inline-block px-3 py-1 mt-2 bg-green-500/20 text-green-400 text-xs font-medium rounded-full",
											children: "✓ Delivered"
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
