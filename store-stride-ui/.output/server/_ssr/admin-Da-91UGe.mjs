import { o as require_jsx_runtime } from "../_libs/@mui/material+[...].mjs";
import { f as useShop, r as authService } from "./shop-DLp9rmaL.mjs";
import { _ as Navigate, f as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-Da-91UGe.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Hook to get authentication information and check user roles
* Usage: const { user, isAdmin, isSeller, logout } = useAuth()
*/
function useAuth() {
	const { user, admin } = useShop();
	const getCurrentUser = () => user || admin || null;
	const isAuthenticated = () => {
		return !!user || !!admin;
	};
	const isAdmin = () => {
		return authService.isAdmin();
	};
	const isSeller = () => {
		return authService.isSeller();
	};
	const hasAdminAccess = () => {
		return isAdmin() || isSeller();
	};
	const isCustomer = () => {
		return authService.getUserRoles().includes("customer") && !isAdmin() && !isSeller();
	};
	const hasRole = (role) => {
		return authService.getUserRoles().includes(role);
	};
	const hasAnyRole = (roles) => {
		const userRoles = authService.getUserRoles();
		return roles.some((role) => userRoles.includes(role));
	};
	const getUserId = () => {
		return authService.getUser()?.id || null;
	};
	const getUserEmail = () => {
		return authService.getUser()?.email || null;
	};
	const getUserRoles = () => {
		return authService.getUserRoles();
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
