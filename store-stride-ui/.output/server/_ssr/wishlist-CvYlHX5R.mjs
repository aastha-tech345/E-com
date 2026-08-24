import { o as require_jsx_runtime } from "../_libs/@mui/material+[...].mjs";
import { f as useShop, u as productService } from "./shop-DLp9rmaL.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Header, t as Footer } from "./Footer-DV3d5YjR.mjs";
import { n as ShoppingAssistant } from "./ShoppingAssistant-DGNcaMsg.mjs";
import { t as EmptyState } from "./EmptyState-BFwqIhiN.mjs";
import { t as ProductCard } from "./ProductCard-Cmjj3Zcs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wishlist-CvYlHX5R.js
var import_jsx_runtime = require_jsx_runtime();
function WishlistPage() {
	const navigate = useNavigate();
	const { wishlist, markViewed } = useShop();
	const wishlistProducts = wishlist.map((id) => productService.byId(id)).filter((p) => p !== void 0);
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
						children: "My Wishlist"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-gray-600 mb-8",
						children: [
							wishlistProducts.length,
							" ",
							wishlistProducts.length === 1 ? "item" : "items"
						]
					}),
					wishlistProducts.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
						children: wishlistProducts.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
							product,
							onProductClick: () => handleProductClick(product.id)
						}, product.id))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						title: "Your wishlist is empty",
						description: "Add products to your wishlist to save them for later",
						action: {
							label: "Start Shopping",
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
export { WishlistPage as component };
