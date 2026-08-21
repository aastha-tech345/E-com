import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { d as useShop, l as productService } from "./shop-2M7M6sRV.mjs";
import { b as useParams, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { B as Heart, C as Plus, O as Minus, S as RotateCcw, Z as ChevronRight, _ as Share2, c as Truck, g as ShieldCheck } from "../_libs/lucide-react.mjs";
import { n as Header, t as Footer } from "./Footer-5XIvVsiU.mjs";
import { t as Price } from "./Price-DPNiyVSw.mjs";
import { n as ShoppingAssistant, r as StarRow } from "./ShoppingAssistant-DysFKbmi.mjs";
import { t as ProductCard } from "./ProductCard-DdGkvpq4.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BYfOmXtJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products._id-B0FJur7h.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function QuantitySelector({ value, onChange, max = 10, min = 1 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "inline-flex items-center rounded-md border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "icon",
				className: "h-9 w-9 rounded-r-none",
				"aria-label": "Decrease quantity",
				disabled: value <= min,
				onClick: () => onChange(value - 1),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { size: 15 })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "w-10 text-center text-sm font-medium tabular-nums",
				"aria-live": "polite",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "icon",
				className: "h-9 w-9 rounded-l-none",
				"aria-label": "Increase quantity",
				disabled: value >= max,
				onClick: () => onChange(value + 1),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 15 })
			})
		]
	});
}
function ProductDetailsPage() {
	const navigate = useNavigate();
	const { id } = useParams({ from: "/products/$id" });
	const { addToCart, toggleWishlist, isWishlisted, markViewed } = useShop();
	const [quantity, setQuantity] = (0, import_react.useState)(1);
	const [selectedColor, setSelectedColor] = (0, import_react.useState)(null);
	const [selectedSize, setSelectedSize] = (0, import_react.useState)(null);
	const [selectedImage, setSelectedImage] = (0, import_react.useState)(0);
	const product = productService.byId(id);
	if (!product) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-white flex items-center justify-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold text-gray-900 mb-2",
				children: "Product not found"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => navigate({ to: "/products" }),
				className: "mt-4",
				children: "Back to Products"
			})]
		})]
	});
	markViewed(product.id);
	const relatedProducts = productService.all().filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 4);
	const handleAddToCart = () => {
		if (product.colors.length > 0 && !selectedColor) {
			toast.error("Please select a color");
			return;
		}
		if (product.sizes.length > 0 && !selectedSize) {
			toast.error("Please select a size");
			return;
		}
		addToCart(product.id, quantity, {
			color: selectedColor || void 0,
			size: selectedSize || void 0
		});
		setQuantity(1);
	};
	const discount = Math.round((product.mrp - product.price) / product.mrp * 100);
	const inStock = product.stock - product.reserved > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-white",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => navigate({
								to: "/products",
								search: { category: product.categorySlug }
							}),
							className: "text-blue-600 hover:underline",
							children: product.category
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4 text-gray-500" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-gray-700",
							children: product.name
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-7xl mx-auto px-4 py-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-8 mb-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-gray-100 rounded-lg overflow-hidden mb-4 aspect-square flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: product.images[selectedImage],
								alt: product.name,
								className: "w-full h-full object-cover"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-4 gap-2",
							children: product.images.map((img, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSelectedImage(idx),
								className: `aspect-square rounded-lg overflow-hidden border-2 ${selectedImage === idx ? "border-blue-600" : "border-gray-200"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: img,
									alt: `${product.name} ${idx}`,
									className: "w-full h-full object-cover"
								})
							}, idx))
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-gray-600 mb-1",
										children: product.brand
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "text-2xl md:text-3xl font-bold text-gray-900 mb-2",
										children: product.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center gap-4 mb-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarRow, {
												value: product.rating,
												size: 16
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-sm text-gray-600",
												children: [
													product.rating,
													" (",
													product.reviewCount,
													" reviews)"
												]
											})]
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-gray-50 rounded-lg p-4 mb-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-baseline gap-3 mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Price, {
										value: product.price,
										className: "text-3xl font-bold"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Price, {
										value: product.mrp,
										className: "text-lg line-through text-gray-500"
									})]
								}), discount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-red-600 font-semibold text-lg",
									children: [discount, "% OFF"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: `font-semibold ${inStock ? "text-green-600" : "text-red-600"}`,
									children: inStock ? `${product.stock - product.reserved} in stock` : "Out of stock"
								})
							}),
							product.colors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-sm font-semibold text-gray-900 mb-3",
									children: "Color"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex gap-3",
									children: product.colors.map((color) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setSelectedColor(color),
										className: `px-4 py-2 rounded-lg border-2 text-sm font-medium ${selectedColor === color ? "border-blue-600 bg-blue-50" : "border-gray-300 hover:border-gray-400"}`,
										children: color
									}, color))
								})]
							}),
							product.sizes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-sm font-semibold text-gray-900 mb-3",
									children: "Size"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex gap-3",
									children: product.sizes.map((size) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setSelectedSize(size),
										className: `px-4 py-2 rounded-lg border-2 text-sm font-medium ${selectedSize === size ? "border-blue-600 bg-blue-50" : "border-gray-300 hover:border-gray-400"}`,
										children: size
									}, size))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-6 space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-sm font-semibold text-gray-900 mb-3",
										children: "Quantity"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuantitySelector, {
										value: quantity,
										max: product.stock - product.reserved,
										onChange: setQuantity
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "lg",
											className: "flex-1 bg-blue-600 hover:bg-blue-700 text-white",
											onClick: handleAddToCart,
											disabled: !inStock,
											children: "Add to Cart"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "lg",
											variant: "outline",
											onClick: () => toggleWishlist(product.id),
											className: isWishlisted(product.id) ? "text-red-600" : "",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `w-5 h-5 ${isWishlisted(product.id) ? "fill-current" : ""}` })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "lg",
										variant: "outline",
										className: "w-full",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "w-4 h-4 mr-2" }), "Share"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 border-t pt-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold text-gray-900",
											children: "Free Delivery"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-gray-600",
											children: "On orders above ₹999"
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold text-gray-900",
											children: "7-Day Returns"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-gray-600",
											children: "Easy replacements"
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold text-gray-900",
											children: "1 Year Warranty"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-gray-600",
											children: "Brand warranty included"
										})] })]
									})
								]
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-12",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
							defaultValue: "description",
							className: "w-full",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
									className: "border-b bg-transparent rounded-none w-full justify-start",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
											value: "description",
											className: "rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-blue-600",
											children: "Description"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
											value: "specifications",
											className: "rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-blue-600",
											children: "Specifications"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
											value: "reviews",
											className: "rounded-none border-b-2 border-b-transparent data-[state=active]:border-b-blue-600",
											children: "Reviews"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
									value: "description",
									className: "py-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-gray-700 leading-relaxed",
										children: product.description
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
									value: "specifications",
									className: "py-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-4",
										children: product.specifications?.map((spec, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex border-b pb-3 last:border-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-gray-900 w-32",
												children: spec.label
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-gray-700",
												children: spec.value
											})]
										}, idx))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
									value: "reviews",
									className: "py-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-gray-700",
											children: [
												product.reviewCount,
												" customer reviews • Average rating ",
												product.rating,
												"/5"
											]
										})
									})
								})
							]
						})
					}),
					relatedProducts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-bold text-gray-900 mb-6",
						children: "Related Products"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
						children: relatedProducts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
							product: p,
							onProductClick: () => {
								markViewed(p.id);
								navigate({
									to: "/products/$id",
									params: { id: p.id }
								});
							}
						}, p.id))
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingAssistant, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { ProductDetailsPage as component };
