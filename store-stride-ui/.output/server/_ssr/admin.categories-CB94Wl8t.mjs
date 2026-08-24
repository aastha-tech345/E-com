import { i as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@emotion/react+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@mui/material+[...].mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as catalogService, f as useShop } from "./shop-DLp9rmaL.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { C as Plus, f as SquarePen, l as Trash2 } from "../_libs/lucide-react.mjs";
import { t as AdminSidebar } from "./AdminSidebar-R9T8teqq.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.categories-CB94Wl8t.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminCategories() {
	const { admin } = useShop();
	const [categories, setCategories] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [formData, setFormData] = (0, import_react.useState)({
		name: "",
		slug: ""
	});
	(0, import_react.useEffect)(() => {
		loadCategories();
	}, []);
	const loadCategories = async () => {
		setLoading(true);
		try {
			const data = await catalogService.categories();
			setCategories(data);
		} catch (err) {
			console.error("Error loading categories:", err);
		} finally {
			setLoading(false);
		}
	};
	if (!admin) return null;
	const handleCreate = async () => {
		if (!formData.name || !formData.slug) {
			toast.error("Please fill in all fields");
			return;
		}
		try {
			const newCategory = {
				id: Date.now().toString(),
				...formData
			};
			setCategories([...categories, newCategory]);
			setFormData({
				name: "",
				slug: ""
			});
			setShowForm(false);
			toast.success("Category created successfully");
		} catch (err) {
			toast.error("Failed to create category");
		}
	};
	const handleDelete = (id) => {
		if (confirm("Are you sure?")) {
			setCategories(categories.filter((c) => c.id !== id));
			toast.success("Category deleted");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-screen bg-gray-50 overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminSidebar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "flex-1 overflow-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white border-b border-gray-200 sticky top-0 z-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-8 py-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-bold",
							children: "Categories"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-gray-600 text-sm mt-1",
							children: "Manage product categories"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => setShowForm(!showForm),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-2" }), "Add Category"]
						})]
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-8",
				children: [showForm && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-white p-6 rounded-lg shadow mb-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-bold mb-4",
							children: "New Category"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Category Name",
								value: formData.name,
								onChange: (e) => setFormData({
									...formData,
									name: e.target.value
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Slug",
								value: formData.slug,
								onChange: (e) => setFormData({
									...formData,
									slug: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: handleCreate,
								children: "Create"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setShowForm(false),
								children: "Cancel"
							})]
						})
					]
				}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-center py-12",
					children: "Loading..."
				}) : categories.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-white rounded-lg p-12 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-gray-500",
						children: "No categories found"
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-white rounded-lg shadow overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-gray-50 border-b border-gray-200",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-3 text-left text-sm font-semibold",
									children: "Name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-3 text-left text-sm font-semibold",
									children: "Slug"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-3 text-left text-sm font-semibold",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-gray-200",
							children: categories.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-gray-50",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-6 py-4 text-sm font-medium",
										children: category.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-6 py-4 text-sm text-gray-600",
										children: category.slug
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-6 py-4 text-sm flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											size: "sm",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "w-4 h-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											size: "sm",
											onClick: () => handleDelete(category.id),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4 text-red-600" })
										})]
									})
								]
							}, category.id))
						})]
					})
				})]
			})]
		})]
	});
}
//#endregion
export { AdminCategories as component };
