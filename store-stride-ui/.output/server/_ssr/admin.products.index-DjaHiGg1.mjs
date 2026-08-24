import { o as require_jsx_runtime } from "../_libs/@mui/material+[...].mjs";
import { d as products, f as useShop } from "./shop-DLp9rmaL.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { C as Plus } from "../_libs/lucide-react.mjs";
import { t as AdminLayout } from "./AdminLayout-ChA3nkKE.mjs";
import { t as DataTable } from "./DataTable-CTsHbxJL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.products.index-DjaHiGg1.js
var import_jsx_runtime = require_jsx_runtime();
function AdminProductsPage() {
	const navigate = useNavigate();
	const { admin } = useShop();
	if (!admin) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-between items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold text-gray-900",
				children: "Products"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-gray-600",
				children: "Manage your product catalog"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => navigate({ to: "/admin/products/create" }),
				className: "bg-blue-600 hover:bg-blue-700",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-2" }), "Add Product"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bg-white rounded-lg border border-gray-200 p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				columns: [
					{
						key: "images",
						label: "Image",
						width: "80px",
						render: (value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: value[0],
							alt: "product",
							className: "w-10 h-10 rounded object-cover bg-gray-100"
						})
					},
					{
						key: "name",
						label: "Product Name",
						render: (value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium text-gray-900",
							children: value
						})
					},
					{
						key: "sku",
						label: "SKU",
						render: (value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "text-xs bg-gray-100 px-2 py-1 rounded",
							children: value
						})
					},
					{
						key: "category",
						label: "Category"
					},
					{
						key: "price",
						label: "Price",
						render: (value) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-semibold text-gray-900",
							children: ["₹", value]
						})
					},
					{
						key: "stock",
						label: "Stock",
						render: (value, row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `px-2 py-1 rounded text-xs font-medium ${value - row.reserved < row.minStock ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`,
							children: value - row.reserved
						})
					},
					{
						key: "status",
						label: "Status",
						render: (value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `px-2 py-1 rounded text-xs font-medium ${value === "active" ? "bg-green-100 text-green-800" : value === "draft" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`,
							children: value
						})
					}
				],
				data: products,
				searchFields: [
					"name",
					"sku",
					"brand"
				],
				actions: [{
					label: "Edit",
					onClick: (row) => navigate({
						to: "/admin/products/$id/edit",
						params: { id: row.id }
					})
				}, {
					label: "Delete",
					onClick: (row) => alert(`Delete product: ${row.name}`)
				}]
			})
		})]
	}) });
}
//#endregion
export { AdminProductsPage as component };
