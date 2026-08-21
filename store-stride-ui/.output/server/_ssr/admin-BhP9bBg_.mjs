import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { d as useShop } from "./shop-2M7M6sRV.mjs";
import { _ as Navigate, f as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-BhP9bBg_.js
var import_jsx_runtime = require_jsx_runtime();
function AdminLayout() {
	const { admin } = useShop();
	if (!admin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/admin/login" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
}
//#endregion
export { AdminLayout as component };
