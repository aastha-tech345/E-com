import { i as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@emotion/react+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@mui/material+[...].mjs";
import { f as useShop, u as productService } from "./shop-DLp9rmaL.mjs";
import { v as useNavigate, y as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Header, t as Footer } from "./Footer-DV3d5YjR.mjs";
import { n as ShoppingAssistant } from "./ShoppingAssistant-DGNcaMsg.mjs";
import { t as EmptyState } from "./EmptyState-BFwqIhiN.mjs";
import { t as ProductCard } from "./ProductCard-Cmjj3Zcs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-DJKtfSun.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SearchPage() {
	const navigate = useNavigate();
	const { q } = useSearch({ from: "/search" });
	const { markViewed, addRecentSearch } = useShop();
	const results = (0, import_react.useMemo)(() => {
		if (!q.trim()) return [];
		addRecentSearch(q);
		const query = q.toLowerCase();
		return productService.all().filter((p) => p.status === "active" && (p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query) || p.category.toLowerCase().includes(query))).slice(0, 50);
	}, [q, addRecentSearch]);
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-7xl mx-auto px-4 py-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-bold text-gray-900 mb-2",
						children: "Search Results"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-gray-600 mb-8",
						children: [
							results.length,
							" results found for \"",
							q,
							"\""
						]
					}),
					results.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
						children: results.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
							product,
							onProductClick: () => handleProductClick(product.id)
						}, product.id))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						title: "No products found",
						description: `We couldn't find any products matching "${q}"`,
						action: {
							label: "Browse All Products",
							onClick: () => navigate({ to: "/products" })
						}
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingAssistant, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { SearchPage as component };
