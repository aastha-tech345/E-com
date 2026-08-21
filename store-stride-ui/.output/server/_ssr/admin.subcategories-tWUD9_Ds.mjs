import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as categories, d as useShop } from "./shop-2M7M6sRV.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { C as Plus } from "../_libs/lucide-react.mjs";
import { t as AdminLayout } from "./AdminLayout-DYXV5w0R.mjs";
import { t as DataTable } from "./DataTable-fSEL0JVj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.subcategories-tWUD9_Ds.js
var import_jsx_runtime = require_jsx_runtime();
function AdminSubcategoriesPage() {
	useNavigate();
	const { admin } = useShop();
	if (!admin) return null;
	const subcategories = categories.flatMap((cat) => cat.subcategories.map((sub) => ({
		...sub,
		categoryName: cat.name,
		categoryId: cat.id
	})));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-between items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold text-gray-900",
				children: "Subcategories"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-gray-600",
				children: "Manage product subcategories"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "bg-blue-600 hover:bg-blue-700",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-2" }), "Add Subcategory"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bg-white rounded-lg border border-gray-200 p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				columns: [
					{
						key: "name",
						label: "Subcategory Name",
						render: (value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium text-gray-900",
							children: value
						})
					},
					{
						key: "categoryName",
						label: "Category",
						render: (value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-gray-600",
							children: value
						})
					},
					{
						key: "slug",
						label: "Slug",
						render: (value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "text-xs bg-gray-100 px-2 py-1 rounded",
							children: value
						})
					},
					{
						key: "status",
						label: "Status",
						render: (value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `px-2 py-1 rounded text-xs font-medium ${value === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`,
							children: value
						})
					}
				],
				data: subcategories,
				searchFields: ["name", "categoryName"],
				actions: [{
					label: "Edit",
					onClick: (row) => alert(`Edit: ${row.name}`)
				}, {
					label: "Delete",
					onClick: (row) => alert(`Delete: ${row.name}`)
				}]
			})
		})]
	}) });
}
//#endregion
export { AdminSubcategoriesPage as component };
