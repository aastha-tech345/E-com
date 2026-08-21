import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { d as useShop } from "./shop-2M7M6sRV.mjs";
import { g as Link, l as useLocation } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { $ as ChevronDown, A as Menu, E as Package, F as LogOut, R as LayoutDashboard, d as Star, i as Users, j as Megaphone, m as ShoppingCart, r as X, u as Tag, v as Settings } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AdminSidebar-BjOiwkEQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminSidebar() {
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const location = useLocation();
	const { adminLogout } = useShop();
	const menuItems = [
		{
			label: "Dashboard",
			icon: LayoutDashboard,
			href: "/admin",
			badge: void 0
		},
		{
			label: "Catalog",
			icon: Package,
			submenu: [
				{
					label: "Categories",
					href: "/admin/categories"
				},
				{
					label: "Brands",
					href: "/admin/brands"
				},
				{
					label: "Products",
					href: "/admin/products"
				},
				{
					label: "Add Product",
					href: "/admin/products/create"
				},
				{
					label: "Attributes",
					href: "/admin/attributes"
				}
			]
		},
		{
			label: "Inventory",
			icon: Tag,
			submenu: [
				{
					label: "Inventory",
					href: "/admin/inventory"
				},
				{
					label: "Stock Adjustment",
					href: "/admin/inventory/adjust"
				},
				{
					label: "Low Stock",
					href: "/admin/inventory/low-stock"
				}
			]
		},
		{
			label: "Orders",
			icon: ShoppingCart,
			submenu: [
				{
					label: "All Orders",
					href: "/admin/orders"
				},
				{
					label: "Pending",
					href: "/admin/orders?status=pending"
				},
				{
					label: "Processing",
					href: "/admin/orders?status=processing"
				},
				{
					label: "Shipped",
					href: "/admin/orders?status=shipped"
				},
				{
					label: "Delivered",
					href: "/admin/orders?status=delivered"
				}
			]
		},
		{
			label: "Customers",
			icon: Users,
			submenu: [{
				label: "All Customers",
				href: "/admin/customers"
			}, {
				label: "Customer Details",
				href: "/admin/customers/:id"
			}]
		},
		{
			label: "Marketing",
			icon: Megaphone,
			submenu: [
				{
					label: "Coupons",
					href: "/admin/coupons"
				},
				{
					label: "Banners",
					href: "/admin/banners"
				},
				{
					label: "Promotions",
					href: "/admin/promotions"
				}
			]
		},
		{
			label: "Reviews",
			icon: Star,
			href: "/admin/reviews"
		},
		{
			label: "Settings",
			icon: Settings,
			submenu: [
				{
					label: "General",
					href: "/admin/settings"
				},
				{
					label: "Store Settings",
					href: "/admin/settings/store"
				},
				{
					label: "Admin Profile",
					href: "/admin/profile"
				}
			]
		}
	];
	const isActive = (href) => location.pathname === href;
	const NavItem = ({ item }) => {
		const [expanded, setExpanded] = (0, import_react.useState)(false);
		if (!("submenu" in item)) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: item.href,
			className: cn("flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors", isActive(item.href) ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "w-5 h-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label })]
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setExpanded(!expanded),
			className: cn("flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full", "text-gray-700 hover:bg-gray-100"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "w-5 h-5" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex-1 text-left",
					children: item.label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("w-4 h-4 transition-transform", expanded && "rotate-180") })
			]
		}), expanded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "ml-4 mt-2 space-y-1",
			children: item.submenu.map((subitem) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: subitem.href,
				className: cn("block px-4 py-2 rounded text-sm transition-colors", isActive(subitem.href) ? "bg-blue-100 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-100"),
				children: subitem.label
			}, subitem.href))
		})] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => setIsOpen(!isOpen),
			className: "md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow",
			children: isOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-6 h-6" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "w-6 h-6" })
		}),
		isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "md:hidden fixed inset-0 bg-black/50 z-40",
			onClick: () => setIsOpen(false)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: cn("fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform md:translate-x-0", isOpen ? "translate-x-0" : "-translate-x-full"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-6 border-b border-gray-200",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-xl font-bold text-gray-900",
						children: "Store Admin"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex-1 overflow-y-auto p-4 space-y-2",
					children: menuItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, { item }, item.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-t border-gray-200 p-4 space-y-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						className: "w-full justify-start",
						onClick: () => {
							adminLogout();
							window.location.href = "/admin/login";
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "w-4 h-4 mr-2" }), "Logout"]
					})
				})
			]
		})
	] });
}
//#endregion
export { AdminSidebar as t };
