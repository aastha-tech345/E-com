import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { t as ShopProvider } from "./shop-fTXyFsSH.mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, x as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as stringType, n as booleanType, r as objectType, t as arrayType } from "../_libs/zod.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DRjkIjlY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-Dib6ZpwN.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$37 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Lovable App" },
			{
				name: "description",
				content: "Lovable Generated Project"
			},
			{
				name: "author",
				content: "Lovable"
			},
			{
				property: "og:title",
				content: "Lovable App"
			},
			{
				property: "og:description",
				content: "Lovable Generated Project"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}, {
			rel: "icon",
			href: "/favicon.ico",
			type: "image/x-icon"
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$37.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) })
	});
}
var $$splitComponentImporter$36 = () => import("./routes-BQ8vOz0D.mjs");
var Route$36 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$36, "component") });
var $$splitComponentImporter$35 = () => import("./admin-BrngK7SH.mjs");
var Route$35 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$35, "component") });
var $$splitComponentImporter$34 = () => import("./cart-CV-WpUIC.mjs");
var Route$34 = createFileRoute("/cart")({ component: lazyRouteComponent($$splitComponentImporter$34, "component") });
var $$splitComponentImporter$33 = () => import("./checkout-C8KNZ2SB.mjs");
var Route$33 = createFileRoute("/checkout")({ component: lazyRouteComponent($$splitComponentImporter$33, "component") });
var $$splitComponentImporter$32 = () => import("./login-1DFQaTI2.mjs");
var Route$32 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$32, "component") });
var $$splitComponentImporter$31 = () => import("./profile-BLOwvzJc.mjs");
var Route$31 = createFileRoute("/profile")({ component: lazyRouteComponent($$splitComponentImporter$31, "component") });
var $$splitComponentImporter$30 = () => import("./register-DvFAcaoo.mjs");
var Route$30 = createFileRoute("/register")({ component: lazyRouteComponent($$splitComponentImporter$30, "component") });
var $$splitComponentImporter$29 = () => import("./search-D8FxvavJ.mjs");
var Route$29 = createFileRoute("/search")({
	validateSearch: (search) => ({ q: search.q || "" }),
	component: lazyRouteComponent($$splitComponentImporter$29, "component")
});
var $$splitComponentImporter$28 = () => import("./wishlist-C85woYsI.mjs");
var Route$28 = createFileRoute("/wishlist")({ component: lazyRouteComponent($$splitComponentImporter$28, "component") });
var $$splitComponentImporter$27 = () => import("./admin.index-BAMUipBt.mjs");
var Route$27 = createFileRoute("/admin/")({ component: lazyRouteComponent($$splitComponentImporter$27, "component") });
var $$splitComponentImporter$26 = () => import("./admin.admin-users-DjSVoaLG.mjs");
var Route$26 = createFileRoute("/admin/admin-users")({ component: lazyRouteComponent($$splitComponentImporter$26, "component") });
var $$splitComponentImporter$25 = () => import("./admin.attributes-C4qHIAQS.mjs");
var Route$25 = createFileRoute("/admin/attributes")({ component: lazyRouteComponent($$splitComponentImporter$25, "component") });
var $$splitComponentImporter$24 = () => import("./admin.banners-CuB0hW6p.mjs");
var Route$24 = createFileRoute("/admin/banners")({ component: lazyRouteComponent($$splitComponentImporter$24, "component") });
var $$splitComponentImporter$23 = () => import("./admin.brands-Bg7fFOQY.mjs");
var Route$23 = createFileRoute("/admin/brands")({ component: lazyRouteComponent($$splitComponentImporter$23, "component") });
var $$splitComponentImporter$22 = () => import("./admin.categories-Dr58OL1Z.mjs");
var Route$22 = createFileRoute("/admin/categories")({ component: lazyRouteComponent($$splitComponentImporter$22, "component") });
var $$splitComponentImporter$21 = () => import("./admin.coupons-Xm2VC7tf.mjs");
var Route$21 = createFileRoute("/admin/coupons")({ component: lazyRouteComponent($$splitComponentImporter$21, "component") });
var $$splitComponentImporter$20 = () => import("./admin.customers-B7gDwd-B.mjs");
var Route$20 = createFileRoute("/admin/customers")({ component: lazyRouteComponent($$splitComponentImporter$20, "component") });
var $$splitComponentImporter$19 = () => import("./admin.dashboard-CDzD0lwM.mjs");
var Route$19 = createFileRoute("/admin/dashboard")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
var $$splitComponentImporter$18 = () => import("./admin.inventory-BSzPIO2m.mjs");
var Route$18 = createFileRoute("/admin/inventory")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./admin.login-BPWrZVYO.mjs");
var Route$17 = createFileRoute("/admin/login")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./admin.orders-BDw4bIro.mjs");
var Route$16 = createFileRoute("/admin/orders")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./admin.product-attributes-DoBnaCH6.mjs");
var Route$15 = createFileRoute("/admin/product-attributes")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./admin.products-CTGZ7rut.mjs");
var Route$14 = createFileRoute("/admin/products")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./admin.promotions-BLaSybWY.mjs");
var Route$13 = createFileRoute("/admin/promotions")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./admin.reviews-8ptLVOIh.mjs");
var Route$12 = createFileRoute("/admin/reviews")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./admin.settings-TWhXoYu3.mjs");
var Route$11 = createFileRoute("/admin/settings")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./admin.subcategories-CGrTrHZk.mjs");
var Route$10 = createFileRoute("/admin/subcategories")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./category._slug-DexPgvU2.mjs");
var Route$9 = createFileRoute("/category/$slug")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./checkout.cancel-bqJ15Ppd.mjs");
var Route$8 = createFileRoute("/checkout/cancel")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./checkout.success-Cila5_7P.mjs");
var Route$7 = createFileRoute("/checkout/success")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./orders.index-gBJVVeQQ.mjs");
var Route$6 = createFileRoute("/orders/")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./orders._id-CRIDH_w-.mjs");
var Route$5 = createFileRoute("/orders/$id")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./products.index-CQg4WKav.mjs");
var Route$4 = createFileRoute("/products/")({
	validateSearch: (search) => ({
		search: search.search || "",
		category: search.category || "",
		brand: Array.isArray(search.brand) ? search.brand : typeof search.brand === "string" ? search.brand.split(",").filter(Boolean) : [],
		priceMin: search.priceMin || 0,
		priceMax: search.priceMax || 15e3,
		rating: search.rating || 0,
		sort: search.sort || "relevance",
		layout: search.layout || "grid",
		page: search.page || 1
	}),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./products._id-Cu9oWJ8q.mjs");
var Route$3 = createFileRoute("/products/$id")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./admin.products.index-CH9tmMJ9.mjs");
var Route$2 = createFileRoute("/admin/products/")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./admin.products.create-qxxpY_gy.mjs");
var Route$1 = createFileRoute("/admin/products/create")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
objectType({
	name: stringType().min(2, "Name is required"),
	slug: stringType().min(2, "Slug is required"),
	category_id: stringType().min(1, "Category is required"),
	brand_id: stringType().optional(),
	short_description: stringType().optional(),
	description: stringType().optional(),
	is_published: booleanType().default(false),
	variants: arrayType(objectType({
		name: stringType().min(1, "Variant name required"),
		sku: stringType().min(2, "SKU required"),
		price: stringType().transform((v) => parseFloat(v)),
		quantity_available: stringType().transform((v) => parseInt(v)),
		is_default: booleanType().default(false)
	})),
	media: arrayType(objectType({
		media_url: stringType().url("Valid URL required"),
		alt_text: stringType().optional()
	}))
});
var $$splitComponentImporter = () => import("./admin.products._id.edit-B9mzU2C6.mjs");
var Route = createFileRoute("/admin/products/$id/edit")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$36.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$37
});
var AdminRoute = Route$35.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$37
});
var CartRoute = Route$34.update({
	id: "/cart",
	path: "/cart",
	getParentRoute: () => Route$37
});
var CheckoutRoute = Route$33.update({
	id: "/checkout",
	path: "/checkout",
	getParentRoute: () => Route$37
});
var LoginRoute = Route$32.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$37
});
var ProfileRoute = Route$31.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => Route$37
});
var RegisterRoute = Route$30.update({
	id: "/register",
	path: "/register",
	getParentRoute: () => Route$37
});
var SearchRoute = Route$29.update({
	id: "/search",
	path: "/search",
	getParentRoute: () => Route$37
});
var WishlistRoute = Route$28.update({
	id: "/wishlist",
	path: "/wishlist",
	getParentRoute: () => Route$37
});
var AdminIndexRoute = Route$27.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var AdminAdminUsersRoute = Route$26.update({
	id: "/admin-users",
	path: "/admin-users",
	getParentRoute: () => AdminRoute
});
var AdminAttributesRoute = Route$25.update({
	id: "/attributes",
	path: "/attributes",
	getParentRoute: () => AdminRoute
});
var AdminBannersRoute = Route$24.update({
	id: "/banners",
	path: "/banners",
	getParentRoute: () => AdminRoute
});
var AdminBrandsRoute = Route$23.update({
	id: "/brands",
	path: "/brands",
	getParentRoute: () => AdminRoute
});
var AdminCategoriesRoute = Route$22.update({
	id: "/categories",
	path: "/categories",
	getParentRoute: () => AdminRoute
});
var AdminCouponsRoute = Route$21.update({
	id: "/coupons",
	path: "/coupons",
	getParentRoute: () => AdminRoute
});
var AdminCustomersRoute = Route$20.update({
	id: "/customers",
	path: "/customers",
	getParentRoute: () => AdminRoute
});
var AdminDashboardRoute = Route$19.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AdminRoute
});
var AdminInventoryRoute = Route$18.update({
	id: "/inventory",
	path: "/inventory",
	getParentRoute: () => AdminRoute
});
var AdminLoginRoute = Route$17.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => AdminRoute
});
var AdminOrdersRoute = Route$16.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => AdminRoute
});
var AdminProductAttributesRoute = Route$15.update({
	id: "/product-attributes",
	path: "/product-attributes",
	getParentRoute: () => AdminRoute
});
var AdminProductsRoute = Route$14.update({
	id: "/products",
	path: "/products",
	getParentRoute: () => AdminRoute
});
var AdminPromotionsRoute = Route$13.update({
	id: "/promotions",
	path: "/promotions",
	getParentRoute: () => AdminRoute
});
var AdminReviewsRoute = Route$12.update({
	id: "/reviews",
	path: "/reviews",
	getParentRoute: () => AdminRoute
});
var AdminSettingsRoute = Route$11.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AdminRoute
});
var AdminSubcategoriesRoute = Route$10.update({
	id: "/subcategories",
	path: "/subcategories",
	getParentRoute: () => AdminRoute
});
var CategorySlugRoute = Route$9.update({
	id: "/category/$slug",
	path: "/category/$slug",
	getParentRoute: () => Route$37
});
var CheckoutCancelRoute = Route$8.update({
	id: "/cancel",
	path: "/cancel",
	getParentRoute: () => CheckoutRoute
});
var CheckoutSuccessRoute = Route$7.update({
	id: "/success",
	path: "/success",
	getParentRoute: () => CheckoutRoute
});
var OrdersIndexRoute = Route$6.update({
	id: "/orders/",
	path: "/orders/",
	getParentRoute: () => Route$37
});
var OrdersIdRoute = Route$5.update({
	id: "/orders/$id",
	path: "/orders/$id",
	getParentRoute: () => Route$37
});
var ProductsIndexRoute = Route$4.update({
	id: "/products/",
	path: "/products/",
	getParentRoute: () => Route$37
});
var ProductsIdRoute = Route$3.update({
	id: "/products/$id",
	path: "/products/$id",
	getParentRoute: () => Route$37
});
var AdminProductsIndexRoute = Route$2.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminProductsRoute
});
var AdminProductsRouteChildren = {
	AdminProductsCreateRoute: Route$1.update({
		id: "/create",
		path: "/create",
		getParentRoute: () => AdminProductsRoute
	}),
	AdminProductsIndexRoute,
	AdminProductsIdEditRoute: Route.update({
		id: "/$id/edit",
		path: "/$id/edit",
		getParentRoute: () => AdminProductsRoute
	})
};
var AdminRouteChildren = {
	AdminAdminUsersRoute,
	AdminAttributesRoute,
	AdminBannersRoute,
	AdminBrandsRoute,
	AdminCategoriesRoute,
	AdminCouponsRoute,
	AdminCustomersRoute,
	AdminDashboardRoute,
	AdminInventoryRoute,
	AdminLoginRoute,
	AdminOrdersRoute,
	AdminProductAttributesRoute,
	AdminProductsRoute: AdminProductsRoute._addFileChildren(AdminProductsRouteChildren),
	AdminPromotionsRoute,
	AdminReviewsRoute,
	AdminSettingsRoute,
	AdminSubcategoriesRoute,
	AdminIndexRoute
};
var AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
var CheckoutRouteChildren = {
	CheckoutCancelRoute,
	CheckoutSuccessRoute
};
var rootRouteChildren = {
	IndexRoute,
	AdminRoute: AdminRouteWithChildren,
	CartRoute,
	CheckoutRoute: CheckoutRoute._addFileChildren(CheckoutRouteChildren),
	LoginRoute,
	ProfileRoute,
	RegisterRoute,
	SearchRoute,
	WishlistRoute,
	CategorySlugRoute,
	OrdersIdRoute,
	ProductsIdRoute,
	OrdersIndexRoute,
	ProductsIndexRoute
};
var routeTree = Route$37._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
