import { o as require_jsx_runtime } from "../_libs/@mui/material+[...].mjs";
import { f as useShop, l as productAttributes } from "./shop-DLp9rmaL.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { C as Plus } from "../_libs/lucide-react.mjs";
import { t as AdminLayout } from "./AdminLayout-ChA3nkKE.mjs";
import { t as DataTable } from "./DataTable-CTsHbxJL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.product-attributes-6_5dxg5C.js
var import_jsx_runtime = require_jsx_runtime();
function AdminAttributesPage() {
	useNavigate();
	const { admin } = useShop();
	if (!admin) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-between items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold text-gray-900",
				children: "Product Attributes"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-gray-600",
				children: "Manage product attributes and variants"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "bg-blue-600 hover:bg-blue-700",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-2" }), "Add Attribute"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bg-white rounded-lg border border-gray-200 p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				columns: [
					{
						key: "name",
						label: "Attribute Name",
						render: (value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium text-gray-900",
							children: value
						})
					},
					{
						key: "type",
						label: "Type",
						render: (value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-gray-600 capitalize",
							children: value
						})
					},
					{
						key: "values",
						label: "Values",
						render: (value) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1 flex-wrap",
							children: [value.slice(0, 3).map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded",
								children: v
							}, i)), value.length > 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-gray-600 text-xs",
								children: ["+", value.length - 3]
							})]
						})
					}
				],
				data: productAttributes,
				searchFields: ["name"],
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
export { AdminAttributesPage as component };
