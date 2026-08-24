import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { p as useShop, r as authService } from "./shop-fTXyFsSH.mjs";
import { _ as Navigate, f as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-BrngK7SH.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Hook to get authentication information and check user roles
* Usage: const { user, isAdmin, isSeller, logout } = useAuth()
*/
function useAuth() {
	const { user, admin } = useShop();
	const getCurrentUser = () => user || admin || null;
	const getCurrentRoles = () => {
		return getCurrentUser()?.roles ?? authService.getUserRoles();
	};
	const isAuthenticated = () => {
		return !!user || !!admin;
	};
	const isAdmin = () => {
		return getCurrentRoles().some((role) => ["super_admin", "admin_catalog"].includes(role));
	};
	const isSeller = () => {
		return getCurrentRoles().includes("seller_owner");
	};
	const hasAdminAccess = () => {
		return isAdmin() || isSeller();
	};
	const isCustomer = () => {
		return getCurrentRoles().includes("customer") && !isAdmin() && !isSeller();
	};
	const hasRole = (role) => {
		return getCurrentRoles().includes(role);
	};
	const hasAnyRole = (roles) => {
		const userRoles = getCurrentRoles();
		return roles.some((role) => userRoles.includes(role));
	};
	const getUserId = () => {
		return getCurrentUser()?.id || null;
	};
	const getUserEmail = () => {
		return getCurrentUser()?.email || null;
	};
	const getUserRoles = () => {
		return getCurrentRoles();
	};
	const getAccessToken = () => {
		return authService.getAccessToken();
	};
	return {
		user: getCurrentUser(),
		isAuthenticated,
		isAdmin,
		isSeller,
		hasAdminAccess,
		isCustomer,
		hasRole,
		hasAnyRole,
		getUserId,
		getUserEmail,
		getUserRoles,
		getAccessToken
	};
}
function AdminLayout() {
	const { hasAdminAccess, isAuthenticated } = useAuth();
	if (!isAuthenticated()) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/admin/login" });
	if (!hasAdminAccess()) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
}
//#endregion
export { AdminLayout as component };
