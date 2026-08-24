import { i as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@emotion/react+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@mui/material+[...].mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { d as products, f as useShop, i as brands, o as categories } from "./shop-DLp9rmaL.mjs";
import { b as useParams, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { $ as ChevronLeft, a as Upload, l as Trash2 } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as AdminLayout } from "./AdminLayout-ChA3nkKE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.products._id.edit-BIgySmC6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EditProductPage() {
	const navigate = useNavigate();
	const { id } = useParams({ from: "/admin/products/$id/edit" });
	const { admin } = useShop();
	const product = products.find((p) => p.id === id);
	const [formData, setFormData] = (0, import_react.useState)({
		name: product?.name || "",
		sku: product?.sku || "",
		brand: product?.brand || "",
		category: categories.find((c) => c.name === product?.category)?.id || "",
		subcategory: product?.subcategory || "",
		shortDescription: product?.shortDescription || "",
		description: product?.description || "",
		mrp: product?.mrp || 0,
		price: product?.price || 0,
		costPrice: product?.costPrice || 0,
		stock: product?.stock || 0,
		minStock: product?.minStock || 10,
		maxStock: product?.stock || 1e3,
		status: product?.status || "active",
		colors: product?.colors?.join(", ") || "",
		sizes: product?.sizes?.join(", ") || ""
	});
	if (!admin || !product) return null;
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!formData.name || !formData.sku || !formData.brand || !formData.category) {
			toast.error("Please fill all required fields");
			return;
		}
		toast.success("Product updated successfully!");
		navigate({ to: "/admin/products" });
	};
	const selectedCategory = categories.find((c) => c.id === formData.category);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-4 mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => navigate({ to: "/admin/products" }),
				className: "p-2 hover:bg-gray-100 rounded-lg transition",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-5 h-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold text-gray-900",
				children: "Edit Product"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-gray-600",
				children: product.name
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "max-w-4xl space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-lg border border-gray-200 p-6 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-semibold text-gray-900",
						children: "Basic Information"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium text-gray-700 mb-2",
								children: "Product Name *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Enter product name",
								value: formData.name,
								onChange: (e) => setFormData({
									...formData,
									name: e.target.value
								}),
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium text-gray-700 mb-2",
								children: "SKU *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "SKU-xxxxx",
								value: formData.sku,
								onChange: (e) => setFormData({
									...formData,
									sku: e.target.value
								}),
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium text-gray-700 mb-2",
								children: "Brand *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: formData.brand,
								onChange: (e) => setFormData({
									...formData,
									brand: e.target.value
								}),
								className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
								required: true,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Select Brand"
								}), brands.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: b.name,
									children: b.name
								}, b.id))]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium text-gray-700 mb-2",
								children: "Category *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: formData.category,
								onChange: (e) => setFormData({
									...formData,
									category: e.target.value,
									subcategory: ""
								}),
								className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
								required: true,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Select Category"
								}), categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c.id,
									children: c.name
								}, c.id))]
							})] }),
							selectedCategory && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium text-gray-700 mb-2",
								children: "Subcategory"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: formData.subcategory,
								onChange: (e) => setFormData({
									...formData,
									subcategory: e.target.value
								}),
								className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Select Subcategory"
								}), selectedCategory.subcategories.map((sub) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: sub.name,
									children: sub.name
								}, sub.id))]
							})] })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-lg border border-gray-200 p-6 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-semibold text-gray-900",
							children: "Description"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-sm font-medium text-gray-700 mb-2",
							children: "Short Description"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Brief product description",
							value: formData.shortDescription,
							onChange: (e) => setFormData({
								...formData,
								shortDescription: e.target.value
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-sm font-medium text-gray-700 mb-2",
							children: "Full Description"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							placeholder: "Detailed product description",
							value: formData.description,
							onChange: (e) => setFormData({
								...formData,
								description: e.target.value
							}),
							className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
							rows: 4
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-lg border border-gray-200 p-6 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-semibold text-gray-900",
						children: "Pricing"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-3 gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium text-gray-700 mb-2",
								children: "MRP (₹) *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								placeholder: "0",
								value: formData.mrp,
								onChange: (e) => setFormData({
									...formData,
									mrp: Number(e.target.value)
								}),
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium text-gray-700 mb-2",
								children: "Selling Price (₹) *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								placeholder: "0",
								value: formData.price,
								onChange: (e) => setFormData({
									...formData,
									price: Number(e.target.value)
								}),
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium text-gray-700 mb-2",
								children: "Cost Price (₹)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								placeholder: "0",
								value: formData.costPrice,
								onChange: (e) => setFormData({
									...formData,
									costPrice: Number(e.target.value)
								})
							})] })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-lg border border-gray-200 p-6 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-semibold text-gray-900",
						children: "Inventory"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-3 gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium text-gray-700 mb-2",
								children: "Stock *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								placeholder: "0",
								value: formData.stock,
								onChange: (e) => setFormData({
									...formData,
									stock: Number(e.target.value)
								}),
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium text-gray-700 mb-2",
								children: "Min Stock"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								placeholder: "10",
								value: formData.minStock,
								onChange: (e) => setFormData({
									...formData,
									minStock: Number(e.target.value)
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium text-gray-700 mb-2",
								children: "Max Stock"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								placeholder: "1000",
								value: formData.maxStock,
								onChange: (e) => setFormData({
									...formData,
									maxStock: Number(e.target.value)
								})
							})] })
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-lg border border-gray-200 p-6 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-semibold text-gray-900",
							children: "Images"
						}),
						product.images.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-gray-700 mb-3",
								children: "Current Images"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 md:grid-cols-4 gap-3",
								children: product.images.map((img, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: img,
										alt: `Product ${idx}`,
										className: "w-full h-24 rounded-lg object-cover"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-lg",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4 text-white" })
									})]
								}, idx))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-2 border-dashed border-gray-300 rounded-lg p-8 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-8 h-8 text-gray-400 mx-auto mb-2" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-gray-600 mb-2",
									children: "Drag and drop images here or click to browse"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-gray-500 text-sm",
									children: "Supported formats: JPG, PNG, GIF (Max 5MB each)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "file",
									multiple: true,
									accept: "image/*",
									className: "mt-4"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-lg border border-gray-200 p-6 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-semibold text-gray-900",
							children: "Variants"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-sm font-medium text-gray-700 mb-2",
							children: "Colors (comma-separated)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Red, Blue, Black, White",
							value: formData.colors,
							onChange: (e) => setFormData({
								...formData,
								colors: e.target.value
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-sm font-medium text-gray-700 mb-2",
							children: "Sizes (comma-separated)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "S, M, L, XL, XXL",
							value: formData.sizes,
							onChange: (e) => setFormData({
								...formData,
								sizes: e.target.value
							})
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white rounded-lg border border-gray-200 p-6 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-semibold text-gray-900",
						children: "Status"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "block text-sm font-medium text-gray-700 mb-2",
						children: "Product Status"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: formData.status,
						onChange: (e) => setFormData({
							...formData,
							status: e.target.value
						}),
						className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "draft",
								children: "Draft"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "active",
								children: "Active"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "inactive",
								children: "Inactive"
							})
						]
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "bg-blue-600 hover:bg-blue-700 text-white",
							children: "Save Changes"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => navigate({ to: "/admin/products" }),
							children: "Cancel"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							className: "text-red-600 hover:text-red-700 ml-auto",
							children: "Delete Product"
						})
					]
				})
			]
		})]
	}) });
}
//#endregion
export { EditProductPage as component };
