import { i as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@emotion/react+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@mui/material+[...].mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { f as useShop, r as authService } from "./shop-DLp9rmaL.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.login-D-C4aX4q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminLogin() {
	const navigate = useNavigate();
	const { setAdmin } = useShop();
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			if (!email || !password) {
				toast.error("Email and password are required");
				setLoading(false);
				return;
			}
			const response = await authService.login(email, password);
			if (!response.user.roles.some((role) => [
				"super_admin",
				"admin",
				"admin_catalog",
				"admin_orders",
				"admin_payments",
				"admin_customers",
				"admin_marketing",
				"admin_support",
				"seller_owner"
			].includes(role))) {
				authService.logout();
				toast.error("Admin access denied. Your account does not have admin or seller privileges.");
				setLoading(false);
				return;
			}
			setAdmin(response.user, {
				access_token: response.access_token,
				refresh_token: response.refresh_token
			});
			navigate({ to: "/admin/dashboard" });
		} catch (err) {
			const message = err instanceof Error ? err.message : "Login failed";
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "bg-white rounded-lg shadow-xl p-8 w-full max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center mb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-3xl font-bold text-gray-900",
						children: "Store Admin"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-gray-600 text-sm mt-2",
						children: "Sign in to your admin panel"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-sm font-medium text-gray-900 mb-2",
							children: "Email Address"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							placeholder: "admin@example.com",
							required: true
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "block text-sm font-medium text-gray-900 mb-2",
							children: "Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "password",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							placeholder: "Enter your password",
							required: true
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							disabled: loading,
							children: loading ? "Signing in..." : "Sign In"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-gray-600 text-center mt-6",
					children: "Demo: Use admin@example.com / password (see .env.example)"
				})
			]
		})
	});
}
//#endregion
export { AdminLogin as component };
