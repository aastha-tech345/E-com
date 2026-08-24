import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime, l as Slot, n as AvatarFallback$1, r as AvatarImage$1, t as Avatar$1 } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { p as useShop } from "./shop-fTXyFsSH.mjs";
import { l as useLocation } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { I as LogOut, K as Ellipsis, a as User, at as Bell, et as ChevronRight, nt as ChevronDown, x as Search, y as Settings } from "../_libs/lucide-react.mjs";
import { t as AdminSidebar } from "./AdminSidebar-B0zSOLa1.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { a as DropdownMenuSeparator, i as DropdownMenuLabel, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-DemMJ4FS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AdminLayout-DgEe2D9g.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Avatar = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar$1, {
	ref,
	className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
	...props
}));
Avatar.displayName = Avatar$1.displayName;
var AvatarImage = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage$1, {
	ref,
	className: cn("aspect-square h-full w-full", className),
	...props
}));
AvatarImage.displayName = AvatarImage$1.displayName;
var AvatarFallback = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback$1, {
	ref,
	className: cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className),
	...props
}));
AvatarFallback.displayName = AvatarFallback$1.displayName;
var Breadcrumb = import_react.forwardRef(({ ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
	ref,
	"aria-label": "breadcrumb",
	...props
}));
Breadcrumb.displayName = "Breadcrumb";
var BreadcrumbList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
	ref,
	className: cn("flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5", className),
	...props
}));
BreadcrumbList.displayName = "BreadcrumbList";
var BreadcrumbItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
	ref,
	className: cn("inline-flex items-center gap-1.5", className),
	...props
}));
BreadcrumbItem.displayName = "BreadcrumbItem";
var BreadcrumbLink = import_react.forwardRef(({ asChild, className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "a", {
		ref,
		className: cn("transition-colors hover:text-foreground", className),
		...props
	});
});
BreadcrumbLink.displayName = "BreadcrumbLink";
var BreadcrumbPage = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
	ref,
	role: "link",
	"aria-disabled": "true",
	"aria-current": "page",
	className: cn("font-normal text-foreground", className),
	...props
}));
BreadcrumbPage.displayName = "BreadcrumbPage";
var BreadcrumbSeparator = ({ children, className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
	role: "presentation",
	"aria-hidden": "true",
	className: cn("[&>svg]:w-3.5 [&>svg]:h-3.5", className),
	...props,
	children: children ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})
});
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";
var BreadcrumbEllipsis = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
	role: "presentation",
	"aria-hidden": "true",
	className: cn("flex h-9 w-9 items-center justify-center", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "sr-only",
		children: "More"
	})]
});
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis";
var routeTitles = {
	"/admin": {
		title: "Dashboard",
		breadcrumbs: [{ label: "Admin" }, { label: "Dashboard" }]
	},
	"/admin/products": {
		title: "Products",
		breadcrumbs: [
			{ label: "Admin" },
			{
				label: "Catalog",
				href: "#"
			},
			{ label: "Products" }
		]
	},
	"/admin/products/create": {
		title: "Add Product",
		breadcrumbs: [
			{ label: "Admin" },
			{
				label: "Catalog",
				href: "#"
			},
			{
				label: "Products",
				href: "/admin/products"
			},
			{ label: "Add Product" }
		]
	},
	"/admin/categories": {
		title: "Categories",
		breadcrumbs: [
			{ label: "Admin" },
			{
				label: "Catalog",
				href: "#"
			},
			{ label: "Categories" }
		]
	},
	"/admin/brands": {
		title: "Brands",
		breadcrumbs: [
			{ label: "Admin" },
			{
				label: "Catalog",
				href: "#"
			},
			{ label: "Brands" }
		]
	},
	"/admin/attributes": {
		title: "Attributes",
		breadcrumbs: [
			{ label: "Admin" },
			{
				label: "Catalog",
				href: "#"
			},
			{ label: "Attributes" }
		]
	},
	"/admin/inventory": {
		title: "Inventory",
		breadcrumbs: [{ label: "Admin" }, { label: "Inventory" }]
	},
	"/admin/orders": {
		title: "Orders",
		breadcrumbs: [{ label: "Admin" }, { label: "Orders" }]
	},
	"/admin/customers": {
		title: "Customers",
		breadcrumbs: [{ label: "Admin" }, { label: "Customers" }]
	},
	"/admin/coupons": {
		title: "Coupons",
		breadcrumbs: [
			{ label: "Admin" },
			{
				label: "Marketing",
				href: "#"
			},
			{ label: "Coupons" }
		]
	},
	"/admin/promotions": {
		title: "Promotions",
		breadcrumbs: [
			{ label: "Admin" },
			{
				label: "Marketing",
				href: "#"
			},
			{ label: "Promotions" }
		]
	},
	"/admin/settings": {
		title: "Settings",
		breadcrumbs: [{ label: "Admin" }, { label: "Settings" }]
	}
};
function AdminHeader({ title, description }) {
	const location = useLocation();
	const { admin, adminLogout } = useShop();
	const [searchOpen, setSearchOpen] = (0, import_react.useState)(false);
	const currentRoute = routeTitles[location.pathname] || {
		title: title || "Page",
		breadcrumbs: [{ label: "Admin" }, { label: title || "Page" }]
	};
	const displayTitle = title || currentRoute.title;
	const breadcrumbs = currentRoute.breadcrumbs;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between h-16 px-6 md:px-8 gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumb, {
						className: "hidden md:flex mb-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbList, { children: breadcrumbs.map((crumb, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [idx > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbSeparator, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbItem, { children: crumb.href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbLink, {
								href: crumb.href,
								className: "text-xs",
								children: crumb.label
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium",
								children: crumb.label
							}) })]
						}, idx)) })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-lg md:text-2xl font-bold text-foreground truncate",
						children: displayTitle
					}),
					description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-1 hidden md:block truncate",
						children: description
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 md:gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("hidden md:flex items-center gap-2 transition-all", searchOpen ? "w-48" : "w-auto"),
						children: searchOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search...",
							className: "h-9 px-3 text-sm",
							autoFocus: true,
							onBlur: () => setSearchOpen(false)
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "h-9 w-9",
							onClick: () => setSearchOpen(true),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4" })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "icon",
						className: "h-9 w-9 relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							className: "gap-2 h-9 px-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
									className: "h-8 w-8",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: "" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
										className: "text-xs font-semibold",
										children: admin?.full_name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "AD"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "hidden md:flex flex-col items-start text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: admin?.full_name || "Admin"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground capitalize",
										children: admin?.roles[0]?.replace(/_/g, " ") || "Admin"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 ml-1 opacity-50" })
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
						align: "end",
						className: "w-56",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuLabel, {
								className: "flex flex-col gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: admin?.full_name || "Admin"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground font-normal",
									children: admin?.email || "admin@example.com"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								className: "gap-2 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Profile" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								className: "gap-2 cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Settings" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
								className: "gap-2 cursor-pointer text-destructive focus:text-destructive",
								onClick: () => {
									adminLogout();
									window.location.href = "/admin/login";
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Logout" })]
							})
						]
					})] })
				]
			})]
		})
	});
}
function AdminLayout({ children, title, description }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-screen bg-background overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminSidebar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 flex flex-col overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminHeader, {
				title,
				description
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 overflow-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-6 md:p-8 h-full",
					children
				})
			})]
		})]
	});
}
//#endregion
export { AdminLayout as t };
