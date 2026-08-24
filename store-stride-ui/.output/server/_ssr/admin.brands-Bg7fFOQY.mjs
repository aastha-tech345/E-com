import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as catalogService, p as useShop } from "./shop-fTXyFsSH.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { p as SquarePen, u as Trash2, w as Plus } from "../_libs/lucide-react.mjs";
import { t as AdminSidebar } from "./AdminSidebar-B0zSOLa1.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.brands-Bg7fFOQY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminBrands() {
	const { admin } = useShop();
	const [brands, setBrands] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [formData, setFormData] = (0, import_react.useState)({
		name: "",
		slug: ""
	});
	(0, import_react.useEffect)(() => {
		loadBrands();
	}, []);
	const loadBrands = async () => {
		setLoading(true);
		try {
			const data = await catalogService.brands();
			setBrands(data);
		} catch (err) {
			console.error("Error loading brands:", err);
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
			const newBrand = {
				id: Date.now().toString(),
				...formData
			};
			setBrands([...brands, newBrand]);
			setFormData({
				name: "",
				slug: ""
			});
			setShowForm(false);
			toast.success("Brand created successfully");
		} catch (err) {
			toast.error("Failed to create brand");
		}
	};
	const handleDelete = (id) => {
		if (confirm("Are you sure?")) {
			setBrands(brands.filter((b) => b.id !== id));
			toast.success("Brand deleted");
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
							children: "Brands"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-gray-600 text-sm mt-1",
							children: "Manage product brands"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => setShowForm(!showForm),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-2" }), "Add Brand"]
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
							children: "New Brand"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Brand Name",
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
				}) : brands.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-white rounded-lg p-12 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-gray-500",
						children: "No brands found"
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
							children: brands.map((brand) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-gray-50",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-6 py-4 text-sm font-medium",
										children: brand.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-6 py-4 text-sm text-gray-600",
										children: brand.slug
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
											onClick: () => handleDelete(brand.id),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4 text-red-600" })
										})]
									})
								]
							}, brand.id))
						})]
					})
				})]
			})]
		})]
	});
}
//#endregion
export { AdminBrands as component };
