import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { d as productService, i as brands, o as categories, p as useShop } from "./shop-fTXyFsSH.mjs";
import { v as useNavigate, y as useSearch } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { H as Grid3x3, R as List, U as Funnel, r as X, rt as Check } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { n as CheckboxIndicator, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as Header, t as Footer } from "./Footer-CVdFw6bt.mjs";
import { n as ShoppingAssistant } from "./ShoppingAssistant-CvyCaPM3.mjs";
import { t as EmptyState } from "./EmptyState-BFwqIhiN.mjs";
import { t as ProductCard } from "./ProductCard-oGErQ-lL.mjs";
import { i as SliderTrack, n as SliderRange, r as SliderThumb, t as Slider$1 } from "../_libs/@radix-ui/react-slider+[...].mjs";
import { t as Drawer } from "../_libs/vaul.mjs";
import { t as Root } from "../_libs/radix-ui__react-separator.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products.index-CQg4WKav.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Slider = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Slider$1, {
	ref,
	className: cn("relative flex w-full touch-none select-none items-center", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderTrack, {
		className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderRange, { className: "absolute h-full bg-primary" })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderThumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" })]
}));
Slider.displayName = Slider$1.displayName;
var Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
	ref,
	className: cn("grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
		className: cn("grid place-content-center text-current"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
	})
}));
Checkbox.displayName = Checkbox$1.displayName;
var Drawer$1 = ({ shouldScaleBackground = true, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Root, {
	shouldScaleBackground,
	...props
});
Drawer$1.displayName = "Drawer";
Drawer.Trigger;
var DrawerPortal = Drawer.Portal;
Drawer.Close;
var DrawerOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Overlay, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80", className),
	...props
}));
DrawerOverlay.displayName = Drawer.Overlay.displayName;
var DrawerContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DrawerPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Drawer.Content, {
	ref,
	className: cn("fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" }), children]
})] }));
DrawerContent.displayName = "DrawerContent";
var DrawerHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("grid gap-1.5 p-4 text-center sm:text-left", className),
	...props
});
DrawerHeader.displayName = "DrawerHeader";
var DrawerFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("mt-auto flex flex-col gap-2 p-4", className),
	...props
});
DrawerFooter.displayName = "DrawerFooter";
var DrawerTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Title, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DrawerTitle.displayName = Drawer.Title.displayName;
var DrawerDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer.Description, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DrawerDescription.displayName = Drawer.Description.displayName;
var Separator = import_react.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	decorative,
	orientation,
	className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className),
	...props
}));
Separator.displayName = Root.displayName;
function ProductListingPage() {
	const navigate = useNavigate();
	const search = useSearch({ from: "/products/" });
	const { markViewed } = useShop();
	const [mobileFilterOpen, setMobileFilterOpen] = (0, import_react.useState)(false);
	const [localPriceMin, setLocalPriceMin] = (0, import_react.useState)(search.priceMin);
	const [localPriceMax, setLocalPriceMax] = (0, import_react.useState)(search.priceMax);
	const allProducts = productService.all().filter((p) => p.status === "active");
	const filtered = (0, import_react.useMemo)(() => {
		let result = allProducts;
		if (search.search) {
			const q = search.search.toLowerCase();
			result = result.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
		}
		if (search.category) result = result.filter((p) => p.categorySlug === search.category);
		if (search.brand.length > 0) result = result.filter((p) => search.brand.includes(p.brand));
		result = result.filter((p) => p.price >= search.priceMin && p.price <= search.priceMax);
		if (search.rating > 0) result = result.filter((p) => p.rating >= search.rating);
		const sorted = [...result];
		switch (search.sort) {
			case "price-low":
				sorted.sort((a, b) => a.price - b.price);
				break;
			case "price-high":
				sorted.sort((a, b) => b.price - a.price);
				break;
			case "rating":
				sorted.sort((a, b) => b.rating - a.rating);
				break;
			case "newest":
				sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
				break;
			case "best-seller":
				sorted.sort((a, b) => b.reviewCount - a.reviewCount);
				break;
			case "deals": sorted.sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp);
		}
		return sorted;
	}, [allProducts, search]);
	const itemsPerPage = 12;
	const totalPages = Math.ceil(filtered.length / itemsPerPage);
	const currentPage = Math.min(search.page, totalPages) || 1;
	const paginatedProducts = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
	const handleProductClick = (productId) => {
		markViewed(productId);
		navigate({
			to: "/products/$id",
			params: { id: productId }
		});
	};
	const updateSearch = (updates) => {
		navigate({
			to: "/products/",
			search: {
				...search,
				...updates,
				page: 1
			}
		});
	};
	const clearFilters = () => {
		navigate({
			to: "/products/",
			search: {
				search: "",
				category: "",
				brand: [],
				priceMin: 0,
				priceMax: 15e3,
				rating: 0,
				sort: "relevance",
				layout: "grid",
				page: 1
			}
		});
	};
	const hasActiveFilters = search.search || search.category || search.brand.length > 0 || search.rating > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-white",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-7xl mx-auto px-4 py-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-bold text-gray-900 mb-2",
						children: "Products"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-gray-600",
						children: [
							"Showing ",
							filtered.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0,
							" to",
							" ",
							Math.min(currentPage * itemsPerPage, filtered.length),
							" of ",
							filtered.length,
							" products"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 lg:grid-cols-4 gap-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hidden lg:block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterPanel, {
								search,
								onSearchChange: updateSearch,
								localPriceMin,
								localPriceMax,
								onPriceMinChange: setLocalPriceMin,
								onPriceMaxChange: setLocalPriceMax,
								onPriceApply: () => {
									updateSearch({
										priceMin: localPriceMin,
										priceMax: localPriceMax
									});
								},
								onClearFilters: clearFilters,
								hasActiveFilters
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "lg:hidden mb-4 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								onClick: () => setMobileFilterOpen(true),
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "w-4 h-4 mr-2" }), "Filters"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "icon",
								onClick: () => updateSearch({ layout: search.layout === "grid" ? "list" : "grid" }),
								children: search.layout === "grid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "w-4 h-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid3x3, { className: "w-4 h-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "lg:col-span-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "hidden lg:flex justify-between items-center mb-6 pb-4 border-b",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: search.sort,
										onChange: (e) => updateSearch({ sort: e.target.value }),
										className: "px-3 py-2 border border-gray-300 rounded-md text-sm bg-white",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "relevance",
												children: "Relevance"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "price-low",
												children: "Price: Low to High"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "price-high",
												children: "Price: High to Low"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "rating",
												children: "Rating"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "newest",
												children: "Newest"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "best-seller",
												children: "Best Seller"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "deals",
												children: "Deals"
											})
										]
									}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: search.layout === "grid" ? "default" : "outline",
											size: "icon",
											onClick: () => updateSearch({ layout: "grid" }),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid3x3, { className: "w-4 h-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: search.layout === "list" ? "default" : "outline",
											size: "icon",
											onClick: () => updateSearch({ layout: "list" }),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "w-4 h-4" })
										})]
									})]
								}),
								paginatedProducts.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: search.layout === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" : "space-y-4 mb-8",
									children: paginatedProducts.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
										product,
										onProductClick: () => handleProductClick(product.id),
										layout: search.layout
									}, product.id))
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
									title: "No products found",
									description: "Try adjusting your filters or search terms",
									action: {
										label: "Clear Filters",
										onClick: clearFilters
									}
								}),
								totalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											disabled: currentPage === 1,
											onClick: () => updateSearch({ page: currentPage - 1 }),
											children: "Previous"
										}),
										Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: page === currentPage ? "default" : "outline",
											onClick: () => updateSearch({ page }),
											children: page
										}, page)),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											disabled: currentPage === totalPages,
											onClick: () => updateSearch({ page: currentPage + 1 }),
											children: "Next"
										})
									]
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Drawer$1, {
				open: mobileFilterOpen,
				onOpenChange: setMobileFilterOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DrawerContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DrawerTitle, { children: "Filters" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-4 pb-8 max-h-96 overflow-y-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterPanel, {
						search,
						onSearchChange: updateSearch,
						localPriceMin,
						localPriceMax,
						onPriceMinChange: setLocalPriceMin,
						onPriceMaxChange: setLocalPriceMax,
						onPriceApply: () => {
							updateSearch({
								priceMin: localPriceMin,
								priceMax: localPriceMax
							});
							setMobileFilterOpen(false);
						},
						onClearFilters: clearFilters,
						hasActiveFilters
					})
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingAssistant, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
function FilterPanel({ search, onSearchChange, localPriceMin, localPriceMax, onPriceMinChange, onPriceMaxChange, onPriceApply, onClearFilters, hasActiveFilters }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			hasActiveFilters && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				className: "w-full",
				onClick: onClearFilters,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-4 h-4 mr-2" }), "Clear All Filters"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "block text-sm font-semibold text-gray-900 mb-3",
				children: "Search"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Search products...",
				value: search.search,
				onChange: (e) => onSearchChange({ search: e.target.value }),
				className: "w-full"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "block text-sm font-semibold text-gray-900 mb-3",
				children: "Category"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: categories.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
						checked: search.category === cat.slug,
						onCheckedChange: (checked) => onSearchChange({ category: checked ? cat.slug : "" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-gray-700",
						children: cat.name
					})]
				}, cat.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "block text-sm font-semibold text-gray-900 mb-3",
				children: "Brand"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2 max-h-40 overflow-y-auto",
				children: brands.map((brand) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
						checked: search.brand.includes(brand.name),
						onCheckedChange: (checked) => {
							onSearchChange({ brand: (checked ? [...search.brand, brand.name] : search.brand.filter((b) => b !== brand.name)).join(",") });
						}
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-gray-700",
						children: brand.name
					})]
				}, brand.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "block text-sm font-semibold text-gray-900 mb-3",
				children: "Price Range"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
						value: [localPriceMin, localPriceMax],
						onValueChange: ([min, max]) => {
							onPriceMinChange(min);
							onPriceMaxChange(max);
						},
						min: 0,
						max: 15e3,
						step: 100,
						className: "w-full"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: localPriceMin,
							onChange: (e) => onPriceMinChange(Number(e.target.value)),
							className: "w-full px-2 py-1 border border-gray-300 rounded",
							placeholder: "Min"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: localPriceMax,
							onChange: (e) => onPriceMaxChange(Number(e.target.value)),
							className: "w-full px-2 py-1 border border-gray-300 rounded",
							placeholder: "Max"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: onPriceApply,
						className: "w-full",
						size: "sm",
						children: "Apply Price"
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "block text-sm font-semibold text-gray-900 mb-3",
				children: "Rating"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: [
					4.5,
					4,
					3.5,
					3
				].map((rating) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
						checked: search.rating === rating,
						onCheckedChange: (checked) => onSearchChange({ rating: checked ? rating : 0 })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm text-gray-700",
						children: [rating, " ★ and above"]
					})]
				}, rating))
			})] })
		]
	});
}
//#endregion
export { ProductListingPage as component };
