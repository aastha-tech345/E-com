import { o as require_jsx_runtime } from "../_libs/@mui/material+[...].mjs";
import { f as useShop } from "./shop-DLp9rmaL.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { B as Heart, W as Eye, m as ShoppingCart } from "../_libs/lucide-react.mjs";
import { t as Price } from "./Price-EXOzJVUM.mjs";
import { t as Rating } from "./ShoppingAssistant-DGNcaMsg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ProductCard-Cmjj3Zcs.js
var import_jsx_runtime = require_jsx_runtime();
function ProductCard({ product, layout = "grid", onQuickView, className }) {
	const { addToCart, toggleWishlist, isWishlisted } = useShop();
	const wished = isWishlisted(product.id);
	const out = product.stock <= 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cn("group relative flex overflow-hidden rounded-2xl border border-stone-200 bg-card shadow-[0_10px_25px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-[0_18px_35px_rgba(15,23,42,0.09)]", layout === "grid" ? "flex-col" : "flex-col sm:flex-row", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/products/$id",
				params: { id: product.id },
				className: cn("relative block shrink-0 overflow-hidden bg-stone-100", layout === "grid" ? "aspect-[4/5] w-full" : "aspect-square w-full sm:w-52"),
				children: [product.images?.[0] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: product.images[0],
					alt: product.name,
					loading: "lazy",
					className: "h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
				}), out && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute inset-x-0 bottom-0 bg-foreground/80 py-1 text-center text-xs font-medium text-background",
					children: "Out of stock"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute right-2 top-2 flex flex-col gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon",
					variant: "secondary",
					"aria-label": wished ? "Remove from wishlist" : "Add to wishlist",
					"aria-pressed": wished,
					className: "h-8 w-8 rounded-full shadow-sm",
					onClick: () => toggleWishlist(product.id),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
						size: 15,
						className: wished ? "fill-destructive text-destructive" : ""
					})
				}), onQuickView && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon",
					variant: "secondary",
					"aria-label": "Quick view",
					className: "h-8 w-8 rounded-full opacity-0 shadow-sm transition-opacity focus-visible:opacity-100 group-hover:opacity-100",
					onClick: () => onQuickView(product),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { size: 15 })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 flex-col gap-2 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
						children: product.brand
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/products/$id",
						params: { id: product.id },
						className: "line-clamp-2 text-sm font-medium leading-snug hover:underline",
						children: product.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rating, {
						value: product.rating,
						count: product.reviewCount
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Price, {
						price: product.price,
						mrp: product.mrp
					}),
					layout === "list" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "line-clamp-2 text-sm text-muted-foreground",
						children: product.shortDescription
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "mt-auto w-full",
						size: "sm",
						variant: out ? "secondary" : "default",
						disabled: out,
						onClick: () => addToCart(product.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { size: 15 }), out ? "Notify me" : "Add to Cart"]
					})
				]
			})
		]
	});
}
//#endregion
export { ProductCard as t };
