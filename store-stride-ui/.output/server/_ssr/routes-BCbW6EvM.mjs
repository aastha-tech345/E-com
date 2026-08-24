import { o as require_jsx_runtime } from "../_libs/@mui/material+[...].mjs";
import { f as useShop, u as productService } from "./shop-DLp9rmaL.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { S as RotateCcw, at as ArrowRight, d as Star, g as ShieldCheck, p as Sparkles, s as Truck } from "../_libs/lucide-react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as Header, t as Footer } from "./Footer-DV3d5YjR.mjs";
import { n as ShoppingAssistant } from "./ShoppingAssistant-DGNcaMsg.mjs";
import { t as ProductCard } from "./ProductCard-Cmjj3Zcs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BCbW6EvM.js
var import_jsx_runtime = require_jsx_runtime();
function Index() {
	const navigate = useNavigate();
	const { markViewed } = useShop();
	const { data: featured = [] } = useQuery({
		queryKey: ["featured"],
		queryFn: () => productService.featured()
	});
	const { data: trending = [] } = useQuery({
		queryKey: ["trending"],
		queryFn: () => productService.trending()
	});
	const { data: bestSellers = [] } = useQuery({
		queryKey: ["bestSellers"],
		queryFn: () => productService.bestSellers()
	});
	const { data: deals = [] } = useQuery({
		queryKey: ["deals"],
		queryFn: () => productService.deals()
	});
	const handleProductClick = (productId) => {
		markViewed(productId);
		navigate({
			to: "/products/$id",
			params: { id: productId }
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-[#fcfaf6]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative overflow-hidden border-b border-stone-200 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.18),_transparent_28%),linear-gradient(135deg,#122033_0%,#1f3045_48%,#2f4b68_100%)] text-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.04)_50%,transparent_100%)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[1.2fr_0.8fr] md:py-24 lg:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-4 inline-flex rounded-full border border-white/15 bg-white/8 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-amber-200",
							children: "Premium marketplace"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "max-w-3xl text-4xl font-bold leading-tight md:text-5xl lg:text-6xl",
							children: "Timeless essentials for a smarter, more elegant way to shop."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 max-w-2xl text-lg leading-8 text-slate-200",
							children: "ShopNest brings together elevated fashion, trusted electronics, beauty, and home picks with dependable service and curated value."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex gap-4 flex-wrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "lg",
								variant: "secondary",
								onClick: () => navigate({ to: "/products" }),
								className: "rounded-full bg-amber-400 px-7 text-slate-950 hover:bg-amber-300",
								children: ["Explore Collection ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2 w-4 h-4" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								variant: "ghost",
								className: "rounded-full border border-white/20 bg-white/5 text-white hover:bg-white/10",
								onClick: () => navigate({
									to: "/products",
									search: { category: "electronics" }
								}),
								children: "Shop Electronics"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-10 grid gap-4 sm:grid-cols-3",
							children: [
								{
									value: "50K+",
									label: "curated shoppers"
								},
								{
									value: "1K+",
									label: "trusted brands"
								},
								{
									value: "4.8/5",
									label: "average rating"
								}
							].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-3xl border border-white/10 bg-white/6 px-5 py-4 backdrop-blur",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-2xl font-semibold text-white",
									children: item.value
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-slate-300",
									children: item.label
								})]
							}, item.label))
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden md:block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-[32px] border border-white/10 bg-white/8 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-[28px] bg-[#f8f3e7] p-6 text-slate-900",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold uppercase tracking-[0.24em] text-amber-700",
										children: "Editor’s pick"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-2 text-2xl font-bold",
										children: "Classic living, modern utility"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-full bg-white p-3 shadow-sm",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-6 w-6 text-amber-600" })
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-8 grid gap-4",
									children: [
										"Handpicked arrivals refreshed daily",
										"Exclusive offers on premium essentials",
										"Fast delivery with reliable after-sales support"
									].map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-medium text-slate-700",
											children: line
										})]
									}, line))
								})]
							})
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "py-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-7xl px-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-5 md:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-[28px] border border-stone-200 bg-white px-6 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-8 w-8 text-amber-700" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-semibold text-slate-900",
										children: "Free Delivery"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-slate-600",
										children: "On orders above ₹999"
									})] })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-[28px] border border-stone-200 bg-white px-6 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-8 w-8 text-amber-700" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-semibold text-slate-900",
										children: "7-Day Returns"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-slate-600",
										children: "Easy replacements"
									})] })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-[28px] border border-stone-200 bg-white px-6 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-8 w-8 text-amber-700" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-semibold text-slate-900",
										children: "100% Authentic"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-slate-600",
										children: "Guaranteed products"
									})] })]
								})
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-center mb-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-[0.24em] text-amber-700",
							children: "Best of ShopNest"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl md:text-3xl font-bold text-slate-900",
							children: "Featured Products"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							onClick: () => navigate({ to: "/products" }),
							className: "rounded-full text-slate-700 hover:text-slate-950",
							children: ["View All ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 w-4 h-4" })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
						children: featured.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
							product,
							onProductClick: () => handleProductClick(product.id)
						}, product.id))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-center mb-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-[0.24em] text-amber-700",
							children: "Fresh demand"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl md:text-3xl font-bold text-slate-900",
							children: "Trending Now"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							onClick: () => navigate({
								to: "/products",
								search: { sort: "trending" }
							}),
							className: "rounded-full text-slate-700 hover:text-slate-950",
							children: ["View All ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 w-4 h-4" })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
						children: trending.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
							product,
							onProductClick: () => handleProductClick(product.id)
						}, product.id))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-center mb-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-[0.24em] text-amber-700",
							children: "Customer favorites"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl md:text-3xl font-bold text-slate-900",
							children: "Best Sellers"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							onClick: () => navigate({
								to: "/products",
								search: { sort: "best-seller" }
							}),
							className: "rounded-full text-slate-700 hover:text-slate-950",
							children: ["View All ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 w-4 h-4" })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
						children: bestSellers.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
							product,
							onProductClick: () => handleProductClick(product.id)
						}, product.id))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-center mb-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-[0.24em] text-amber-800",
								children: "Limited-time selection"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl md:text-3xl font-bold text-slate-900",
								children: "Hot Deals"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-slate-600",
								children: "Exceptional value on standout picks"
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							onClick: () => navigate({
								to: "/products",
								search: { sort: "deals" }
							}),
							className: "rounded-full text-slate-700 hover:text-slate-950",
							children: ["View All ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 w-4 h-4" })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
						children: deals.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
							product,
							onProductClick: () => handleProductClick(product.id)
						}, product.id))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingAssistant, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { Index as component };
