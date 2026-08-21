import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { d as useShop } from "./shop-2M7M6sRV.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { $ as ChevronDown, A as Menu, E as Package, F as LogOut, R as LayoutDashboard, i as Users, m as ShoppingCart, r as X, u as Tag, v as Settings } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AdminLayout-DYXV5w0R.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminLayout({ children }) {
	const navigate = useNavigate();
	const { admin, adminLogout } = useShop();
	const [sidebarOpen, setSidebarOpen] = (0, import_react.useState)(true);
	const [expandedMenu, setExpandedMenu] = (0, import_react.useState)(null);
	if (!admin) return null;
	const menuItems = [
		{
			label: "Dashboard",
			icon: LayoutDashboard,
			path: "/admin/dashboard"
		},
		{
			label: "Catalog",
			icon: Package,
			submenu: [
				{
					label: "Products",
					path: "/admin/products"
				},
				{
					label: "Add Product",
					path: "/admin/products/create"
				},
				{
					label: "Categories",
					path: "/admin/categories"
				},
				{
					label: "Subcategories",
					path: "/admin/subcategories"
				},
				{
					label: "Brands",
					path: "/admin/brands"
				},
				{
					label: "Attributes",
					path: "/admin/product-attributes"
				}
			]
		},
		{
			label: "Inventory",
			icon: Package,
			submenu: [{
				label: "Stock",
				path: "/admin/inventory"
			}, {
				label: "Low Stock",
				path: "/admin/inventory?filter=low"
			}]
		},
		{
			label: "Orders",
			icon: ShoppingCart,
			path: "/admin/orders"
		},
		{
			label: "Customers",
			icon: Users,
			path: "/admin/customers"
		},
		{
			label: "Marketing",
			icon: Tag,
			submenu: [
				{
					label: "Coupons",
					path: "/admin/coupons"
				},
				{
					label: "Banners",
					path: "/admin/banners"
				},
				{
					label: "Reviews",
					path: "/admin/reviews"
				}
			]
		},
		{
			label: "Users",
			icon: Users,
			submenu: [{
				label: "Admin Users",
				path: "/admin/admin-users"
			}, {
				label: "Roles & Permissions",
				path: "/admin/admin-users"
			}]
		},
		{
			label: "Settings",
			icon: Settings,
			path: "/admin/settings"
		}
	];
	const toggleMenu = (label) => {
		setExpandedMenu(expandedMenu === label ? null : label);
	};
	const handleLogout = () => {
		adminLogout();
		navigate({ to: "/admin/login" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-screen bg-gray-100",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `${sidebarOpen ? "w-64" : "w-20"} bg-slate-900 text-white transition-all duration-300 flex flex-col`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6 border-b border-slate-700 flex items-center justify-between",
					children: [sidebarOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl font-bold",
						children: "Shop Admin"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-slate-400",
						children: "Management Portal"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setSidebarOpen(!sidebarOpen),
						className: "hover:bg-slate-800 p-2 rounded-lg transition",
						children: sidebarOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "w-5 h-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex-1 overflow-y-auto p-4 space-y-2",
					children: menuItems.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [item.submenu ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => toggleMenu(item.label),
						className: "w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-800 transition group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "w-5 h-5 group-hover:text-blue-400" }), sidebarOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label })]
						}), sidebarOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `w-4 h-4 transition ${expandedMenu === item.label ? "rotate-180" : ""}` })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => navigate({ to: item.path }),
						className: "w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "w-5 h-5 group-hover:text-blue-400" }), sidebarOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label })]
					}), item.submenu && expandedMenu === item.label && sidebarOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "ml-4 mt-2 space-y-1 border-l border-slate-700 pl-4",
						children: item.submenu.map((subitem, subIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => navigate({ to: subitem.path }),
							className: "w-full text-left text-sm p-2 rounded hover:bg-slate-800 transition text-slate-300 hover:text-white",
							children: subitem.label
						}, subIdx))
					})] }, idx))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 border-t border-slate-700 space-y-2",
					children: [sidebarOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-2 bg-slate-800 rounded-lg text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: admin.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-400",
							children: admin.role
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						className: "w-full text-slate-300 hover:text-white",
						onClick: handleLogout,
						size: "sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "w-4 h-4 mr-2" }), sidebarOpen && "Logout"]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 flex flex-col overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-semibold text-gray-900",
					children: "Admin Dashboard"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "p-2 hover:bg-gray-100 rounded-lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
							className: "w-5 h-5 text-gray-600",
							fill: "none",
							stroke: "currentColor",
							viewBox: "0 0 24 24",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								strokeWidth: 2,
								d: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
							})
						})
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-auto",
				children
			})]
		})]
	});
}
//#endregion
export { AdminLayout as t };
