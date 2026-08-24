import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { p as useShop } from "./shop-fTXyFsSH.mjs";
import { g as Link, l as useLocation } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { D as Package, I as LogOut, M as Megaphone, d as Tag, f as Star, h as ShoppingCart, i as Users, j as Menu, nt as ChevronDown, r as X, y as Settings, z as LayoutDashboard } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AdminSidebar-B0zSOLa1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminSidebar() {
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const location = useLocation();
	const { admin, adminLogout } = useShop();
	const getVisibleMenuItems = () => {
		return [
			{
				label: "Dashboard",
				icon: LayoutDashboard,
				href: "/admin",
				roles: [
					"super_admin",
					"admin",
					"admin_catalog",
					"admin_orders",
					"admin_payments",
					"admin_customers",
					"admin_marketing",
					"admin_support",
					"seller_owner"
				],
				badge: void 0
			},
			{
				label: "Catalog",
				icon: Package,
				roles: [
					"super_admin",
					"admin_catalog",
					"seller_owner"
				],
				submenu: [
					{
						label: "Categories",
						href: "/admin/categories",
						roles: ["super_admin", "admin_catalog"]
					},
					{
						label: "Brands",
						href: "/admin/brands",
						roles: ["super_admin", "admin_catalog"]
					},
					{
						label: "Products",
						href: "/admin/products",
						roles: [
							"super_admin",
							"admin_catalog",
							"seller_owner"
						]
					},
					{
						label: "Add Product",
						href: "/admin/products/create",
						roles: [
							"super_admin",
							"admin_catalog",
							"seller_owner"
						]
					},
					{
						label: "Attributes",
						href: "/admin/attributes",
						roles: ["super_admin", "admin_catalog"]
					}
				]
			},
			{
				label: "Inventory",
				icon: Tag,
				roles: [
					"super_admin",
					"admin_catalog",
					"seller_owner"
				],
				submenu: [
					{
						label: "Inventory",
						href: "/admin/inventory",
						roles: [
							"super_admin",
							"admin_catalog",
							"seller_owner"
						]
					},
					{
						label: "Stock Adjustment",
						href: "/admin/inventory/adjust",
						roles: [
							"super_admin",
							"admin_catalog",
							"seller_owner"
						]
					},
					{
						label: "Low Stock",
						href: "/admin/inventory/low-stock",
						roles: [
							"super_admin",
							"admin_catalog",
							"seller_owner"
						]
					}
				]
			},
			{
				label: "Orders",
				icon: ShoppingCart,
				roles: [
					"super_admin",
					"admin_orders",
					"seller_owner"
				],
				submenu: [
					{
						label: "All Orders",
						href: "/admin/orders",
						roles: [
							"super_admin",
							"admin_orders",
							"seller_owner"
						]
					},
					{
						label: "Pending",
						href: "/admin/orders?status=pending",
						roles: [
							"super_admin",
							"admin_orders",
							"seller_owner"
						]
					},
					{
						label: "Processing",
						href: "/admin/orders?status=processing",
						roles: [
							"super_admin",
							"admin_orders",
							"seller_owner"
						]
					},
					{
						label: "Shipped",
						href: "/admin/orders?status=shipped",
						roles: [
							"super_admin",
							"admin_orders",
							"seller_owner"
						]
					},
					{
						label: "Delivered",
						href: "/admin/orders?status=delivered",
						roles: [
							"super_admin",
							"admin_orders",
							"seller_owner"
						]
					}
				]
			},
			{
				label: "Customers",
				icon: Users,
				roles: ["super_admin", "admin_customers"],
				submenu: [{
					label: "All Customers",
					href: "/admin/customers",
					roles: ["super_admin", "admin_customers"]
				}, {
					label: "Customer Details",
					href: "/admin/customers/:id",
					roles: ["super_admin", "admin_customers"]
				}]
			},
			{
				label: "Marketing",
				icon: Megaphone,
				roles: ["super_admin", "admin_marketing"],
				submenu: [
					{
						label: "Coupons",
						href: "/admin/coupons",
						roles: ["super_admin", "admin_marketing"]
					},
					{
						label: "Banners",
						href: "/admin/banners",
						roles: ["super_admin", "admin_marketing"]
					},
					{
						label: "Promotions",
						href: "/admin/promotions",
						roles: ["super_admin", "admin_marketing"]
					}
				]
			},
			{
				label: "Reviews",
				icon: Star,
				href: "/admin/reviews",
				roles: ["super_admin"]
			},
			{
				label: "Settings",
				icon: Settings,
				roles: ["super_admin"],
				submenu: [
					{
						label: "General",
						href: "/admin/settings",
						roles: ["super_admin"]
					},
					{
						label: "Store Settings",
						href: "/admin/settings/store",
						roles: ["super_admin"]
					},
					{
						label: "Admin Profile",
						href: "/admin/profile",
						roles: ["super_admin"]
					}
				]
			}
		].filter((item) => {
			const userRoles = admin?.roles || [];
			return item.roles.some((role) => userRoles.includes(role));
		}).map((item) => ({
			...item,
			submenu: item.submenu?.filter((subitem) => {
				const userRoles = admin?.roles || [];
				return subitem.roles.some((role) => userRoles.includes(role));
			})
		}));
	};
	const menuItems = getVisibleMenuItems();
	const isActive = (href) => location.pathname === href;
	const NavItem = ({ item }) => {
		const [expanded, setExpanded] = (0, import_react.useState)(false);
		if (!("submenu" in item && item.submenu && item.submenu.length > 0) || !("submenu" in item) || !item.submenu) {
			const href = "href" in item ? item.href : "";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: href,
				className: cn("flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200", isActive(href) ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10" : "text-gray-300 hover:bg-gray-700/50 hover:text-gray-100"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "w-5 h-5 flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex-1",
					children: item.label
				})]
			});
		}
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setExpanded(!expanded),
			className: cn("flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 w-full", expanded ? "bg-gray-700/50 text-gray-100" : "text-gray-300 hover:bg-gray-700/50 hover:text-gray-100"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "w-5 h-5 flex-shrink-0" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex-1 text-left",
					children: item.label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("w-4 h-4 transition-transform flex-shrink-0", expanded && "rotate-180") })
			]
		}), expanded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "ml-4 mt-1 space-y-1 pl-2 border-l border-gray-700",
			children: item.submenu.map((subitem) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: subitem.href,
				className: cn("block px-3 py-2 rounded text-sm transition-all duration-200", isActive(subitem.href) ? "bg-blue-600/20 text-blue-400 font-medium border border-blue-500/30" : "text-gray-400 hover:text-gray-100 hover:bg-gray-700/30"),
				children: subitem.label
			}, subitem.href))
		})] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => setIsOpen(!isOpen),
			className: "md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700",
			children: isOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-6 h-6 text-white" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "w-6 h-6 text-white" })
		}),
		isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "md:hidden fixed inset-0 bg-black/50 z-40",
			onClick: () => setIsOpen(false)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: cn("fixed md:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700 transition-transform md:translate-x-0 flex flex-col", isOpen ? "translate-x-0" : "-translate-x-full"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-6 border-b border-gray-700",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-white font-bold text-lg",
								children: "📦"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-lg font-bold text-white",
							children: "Store Admin"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-gray-400",
							children: "Dashboard"
						})] })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex-1 overflow-y-auto p-4 space-y-1",
					children: menuItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, { item }, item.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-gray-700 p-4 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-3 py-2 rounded-lg bg-gray-800/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-gray-400",
								children: "Logged in as"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-white truncate",
								children: admin?.full_name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 rounded text-xs font-medium text-blue-300 border border-blue-500/30",
								children: admin?.roles.includes("seller_owner") ? "🏪 Seller" : "👤 Admin"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "w-full justify-start bg-gray-700 hover:bg-gray-600 text-gray-100 border border-gray-600 transition-colors gap-2",
						onClick: () => {
							adminLogout();
							window.location.href = "/admin/login";
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "w-4 h-4" }), "Logout"]
					})]
				})
			]
		})
	] });
}
//#endregion
export { AdminSidebar as t };
