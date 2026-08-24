import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { p as useShop } from "./shop-fTXyFsSH.mjs";
import { t as AdminSidebar } from "./AdminSidebar-B0zSOLa1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.settings-TWhXoYu3.js
var import_jsx_runtime = require_jsx_runtime();
function AdminSettings() {
	const { admin } = useShop();
	if (!admin) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-screen bg-gray-50 overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminSidebar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "flex-1 overflow-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white border-b border-gray-200 sticky top-0 z-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-8 py-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold",
						children: "Settings"
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-white rounded-lg shadow p-12 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-gray-500",
						children: "Settings module coming soon"
					})
				})
			})]
		})]
	});
}
//#endregion
export { AdminSettings as component };
