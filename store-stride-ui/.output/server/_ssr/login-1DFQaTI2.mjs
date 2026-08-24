import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { p as useShop, r as authService } from "./shop-fTXyFsSH.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-1DFQaTI2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const navigate = useNavigate();
	const { setUser } = useShop();
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
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
			setUser(response.user, {
				access_token: response.access_token,
				refresh_token: response.refresh_token
			});
			toast.success("Welcome back!");
			navigate({ to: "/" });
		} catch (err) {
			const message = err instanceof Error ? err.message : "Login failed";
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-lg shadow-xl p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center mb-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-white text-xl font-bold",
									children: "S"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-3xl font-bold text-gray-900",
								children: "Store Stride"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-gray-600 text-sm mt-1",
								children: "Sign in to your account"
							})
						]
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
								placeholder: "you@example.com",
								disabled: loading,
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium text-gray-900 mb-2",
								children: "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: showPassword ? "text" : "password",
									value: password,
									onChange: (e) => setPassword(e.target.value),
									placeholder: "••••••••",
									disabled: loading,
									required: true
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowPassword(!showPassword),
									className: "absolute right-3 top-3 text-gray-500 hover:text-gray-700",
									children: showPassword ? "Hide" : "Show"
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center justify-between",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										className: "w-4 h-4 rounded border-gray-300 text-blue-600",
										disabled: loading
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-2 text-sm text-gray-700",
										children: "Remember me"
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold",
								disabled: loading,
								children: loading ? "Signing in..." : "Sign In"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative my-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 flex items-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-full border-t border-gray-300" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative flex justify-center text-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-2 bg-white text-gray-500",
								children: "or"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3 mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Google" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Apple" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-center text-sm text-gray-600",
						children: [
							"Don't have an account?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/register",
								className: "text-blue-600 hover:text-blue-700 font-semibold",
								children: "Create one"
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-center text-xs text-gray-600 mt-6",
				children: [
					"By signing in, you agree to our",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "#",
						className: "text-blue-600 hover:underline",
						children: "Terms of Service"
					}),
					" ",
					"and",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "#",
						className: "text-blue-600 hover:underline",
						children: "Privacy Policy"
					})
				]
			})]
		})
	});
}
//#endregion
export { LoginPage as component };
