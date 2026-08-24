import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { d as productService, o as categories, p as useShop } from "./shop-fTXyFsSH.mjs";
import { b as useParams, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { et as ChevronRight } from "../_libs/lucide-react.mjs";
import { n as Header, t as Footer } from "./Footer-CVdFw6bt.mjs";
import { n as ShoppingAssistant } from "./ShoppingAssistant-CvyCaPM3.mjs";
import { t as EmptyState } from "./EmptyState-BFwqIhiN.mjs";
import { t as ProductCard } from "./ProductCard-oGErQ-lL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/category._slug-DexPgvU2.js
var import_jsx_runtime = require_jsx_runtime();
function CategoryPage() {
	const navigate = useNavigate();
	const { slug } = useParams({ from: "/category/$slug" });
	const { markViewed } = useShop();
	const category = categories.find((c) => c.slug === slug);
	if (!category) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-white",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-center py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "Category not found",
					description: "The category you're looking for doesn't exist",
					action: {
						label: "Back to Shopping",
						onClick: () => navigate({ to: "/products" })
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
	const products = productService.all().filter((p) => p.categorySlug === category.slug && p.status === "active");
	const handleProductClick = (productId) => {
		markViewed(productId);
		navigate({
			to: "/products/$id",
			params: { id: productId }
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-white",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-gradient-to-r from-blue-600 to-blue-700 text-white",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-w-7xl mx-auto px-4 py-12",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: category.image,
							alt: category.name,
							className: "w-24 h-24 rounded-lg object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-4xl font-bold mb-2",
									children: category.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-blue-100 mb-4",
									children: category.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-blue-100",
									children: [products.length, " products available"]
								})
							]
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b bg-gray-50",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => navigate({ to: "/" }),
							className: "text-blue-600 hover:underline",
							children: "Home"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4 text-gray-500" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-gray-700",
							children: category.name
						})
					]
				})
			}),
			category.subcategories.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-7xl mx-auto px-4 py-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-bold text-gray-900 mb-4",
					children: "Subcategories"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
					children: category.subcategories.map((sub) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => navigate({
							to: "/products",
							search: { category: category.slug }
						}),
						className: "p-4 border rounded-lg hover:border-blue-600 hover:bg-blue-50 transition text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-gray-900",
							children: sub.name
						})
					}, sub.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-7xl mx-auto px-4 py-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-bold text-gray-900 mb-6",
					children: "All Products"
				}), products.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
					children: products.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
						product,
						onProductClick: () => handleProductClick(product.id)
					}, product.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "No products in this category",
					description: "Check back soon for new products",
					action: {
						label: "Browse Other Categories",
						onClick: () => navigate({ to: "/products" })
					}
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingAssistant, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { CategoryPage as component };
