import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { d as productService, p as useShop } from "./shop-fTXyFsSH.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { p as SquarePen, u as Trash2, w as Plus } from "../_libs/lucide-react.mjs";
import { t as AdminSidebar } from "./AdminSidebar-B0zSOLa1.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.products-CTGZ7rut.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminProducts() {
	const { admin } = useShop();
	const navigate = useNavigate();
	const [products, setProducts] = (0, import_react.useState)([]);
	const [search, setSearch] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		loadProducts();
	}, []);
	const loadProducts = async () => {
		setLoading(true);
		try {
			const data = await productService.list({ search });
			setProducts(data.items);
		} catch (err) {
			console.error("Error loading products:", err);
		} finally {
			setLoading(false);
		}
	};
	if (!admin) return null;
	const handleDelete = (id) => {
		if (confirm("Are you sure you want to delete this product?")) setProducts(products.filter((p) => p.id !== id));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-screen bg-gray-50 overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminSidebar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "flex-1 overflow-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white border-b border-gray-200 sticky top-0 z-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-8 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-center mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-bold",
							children: "Products"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-gray-600 text-sm mt-1",
							children: "Manage your product catalog"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => navigate({ to: "/admin/products/create" }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-2" }), "Add Product"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search products...",
							value: search,
							onChange: (e) => {
								setSearch(e.target.value);
								loadProducts();
							},
							className: "max-w-xs"
						})
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-8",
				children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center py-12",
					children: "Loading..."
				}) : products.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-lg p-12 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-gray-500",
						children: "No products found"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => navigate({ to: "/admin/products/create" }),
						className: "mt-4",
						children: "Create First Product"
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-white rounded-lg shadow overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-gray-50 border-b border-gray-200",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-3 text-left text-sm font-semibold text-gray-900",
									children: "Product"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-3 text-left text-sm font-semibold text-gray-900",
									children: "Category"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-3 text-left text-sm font-semibold text-gray-900",
									children: "Price"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-3 text-left text-sm font-semibold text-gray-900",
									children: "Stock"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-3 text-left text-sm font-semibold text-gray-900",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-3 text-left text-sm font-semibold text-gray-900",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-gray-200",
							children: products.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-gray-50",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-6 py-4 text-sm text-gray-900",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium",
											children: product.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-gray-500",
											children: product.slug
										})] })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-6 py-4 text-sm text-gray-900",
										children: product.category_id
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-6 py-4 text-sm text-gray-900",
										children: ["₹", product.variants?.[0]?.price || "N/A"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-6 py-4 text-sm text-gray-900",
										children: product.variants?.[0]?.quantity_available || 0
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-6 py-4 text-sm",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `px-3 py-1 rounded-full text-xs font-semibold ${product.is_published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`,
											children: product.is_published ? "Published" : "Draft"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-6 py-4 text-sm",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "outline",
												size: "sm",
												onClick: () => navigate({
													to: "/admin/products/$id/edit",
													params: { id: product.id }
												}),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "w-4 h-4" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "outline",
												size: "sm",
												onClick: () => handleDelete(product.id),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4 text-red-600" })
											})]
										})
									})
								]
							}, product.id))
						})]
					})
				})
			})]
		})]
	});
}
//#endregion
export { AdminProducts as component };
