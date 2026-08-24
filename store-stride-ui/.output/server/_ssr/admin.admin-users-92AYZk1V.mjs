import { o as require_jsx_runtime } from "../_libs/@mui/material+[...].mjs";
import { f as useShop, n as adminUsers } from "./shop-DLp9rmaL.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { C as Plus, h as Shield } from "../_libs/lucide-react.mjs";
import { t as AdminLayout } from "./AdminLayout-ChA3nkKE.mjs";
import { t as DataTable } from "./DataTable-CTsHbxJL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.admin-users-92AYZk1V.js
var import_jsx_runtime = require_jsx_runtime();
function AdminUsersPage() {
	useNavigate();
	const { admin } = useShop();
	if (!admin) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-6 space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-between items-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold text-gray-900",
				children: "Admin Users"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-gray-600",
				children: "Manage admin accounts and permissions"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "bg-blue-600 hover:bg-blue-700",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-2" }), "Add Admin"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "bg-white rounded-lg border border-gray-200 p-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				columns: [
					{
						key: "name",
						label: "Name",
						render: (value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium text-gray-900",
							children: value
						})
					},
					{
						key: "email",
						label: "Email",
						render: (value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-gray-600",
							children: value
						})
					},
					{
						key: "role",
						label: "Role",
						render: (value) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-3 h-3" }), value]
						})
					},
					{
						key: "lastActive",
						label: "Last Active",
						render: (value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-gray-600",
							children: new Date(value).toLocaleDateString()
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
				data: adminUsers,
				searchFields: [
					"name",
					"email",
					"role"
				],
				actions: [{
					label: "Edit",
					onClick: (row) => alert(`Edit user: ${row.name}`)
				}, {
					label: "Deactivate",
					onClick: (row) => alert(`Deactivate user: ${row.name}`)
				}]
			})
		})]
	}) });
}
//#endregion
export { AdminUsersPage as component };
