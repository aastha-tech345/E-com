import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { d as useShop } from "./shop-2M7M6sRV.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { G as EyeOff, I as Lock, P as Mail, W as Eye, a as User, w as Phone } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { n as Header, t as Footer } from "./Footer-5XIvVsiU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-BahJvIjr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RegisterPage() {
	const navigate = useNavigate();
	const { login } = useShop();
	const [formData, setFormData] = (0, import_react.useState)({
		name: "",
		email: "",
		phone: "",
		password: "",
		confirmPassword: ""
	});
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [showConfirmPassword, setShowConfirmPassword] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const handleRegister = async (e) => {
		e.preventDefault();
		if (!formData.name || !formData.email || !formData.phone || !formData.password) {
			toast.error("Please fill all fields");
			return;
		}
		if (formData.password !== formData.confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}
		if (formData.password.length < 6) {
			toast.error("Password must be at least 6 characters");
			return;
		}
		setLoading(true);
		setTimeout(() => {
			login({
				id: `USR${Date.now()}`,
				name: formData.name,
				email: formData.email
			});
			toast.success("Account created successfully!");
			navigate({ to: "/" });
			setLoading(false);
		}, 1e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-center py-12 px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-white rounded-xl shadow-lg p-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-3xl font-bold text-gray-900 mb-2",
								children: "Create Account"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-gray-600 mb-8",
								children: "Join us to start shopping"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleRegister,
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-sm font-medium text-gray-700 mb-2",
										children: "Full Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "absolute left-3 top-3 w-5 h-5 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "text",
											placeholder: "John Doe",
											value: formData.name,
											onChange: (e) => setFormData({
												...formData,
												name: e.target.value
											}),
											className: "pl-10 h-11"
										})]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-sm font-medium text-gray-700 mb-2",
										children: "Email Address"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "absolute left-3 top-3 w-5 h-5 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "email",
											placeholder: "you@example.com",
											value: formData.email,
											onChange: (e) => setFormData({
												...formData,
												email: e.target.value
											}),
											className: "pl-10 h-11"
										})]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-sm font-medium text-gray-700 mb-2",
										children: "Phone Number"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "absolute left-3 top-3 w-5 h-5 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "tel",
											placeholder: "+91 98765 43210",
											value: formData.phone,
											onChange: (e) => setFormData({
												...formData,
												phone: e.target.value
											}),
											className: "pl-10 h-11"
										})]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-sm font-medium text-gray-700 mb-2",
										children: "Password"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "absolute left-3 top-3 w-5 h-5 text-gray-400" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: showPassword ? "text" : "password",
												placeholder: "••••••••",
												value: formData.password,
												onChange: (e) => setFormData({
													...formData,
													password: e.target.value
												}),
												className: "w-full pl-10 pr-10 h-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setShowPassword(!showPassword),
												className: "absolute right-3 top-3 text-gray-400 hover:text-gray-600",
												children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "w-5 h-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-5 h-5" })
											})
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-sm font-medium text-gray-700 mb-2",
										children: "Confirm Password"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "absolute left-3 top-3 w-5 h-5 text-gray-400" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: showConfirmPassword ? "text" : "password",
												placeholder: "••••••••",
												value: formData.confirmPassword,
												onChange: (e) => setFormData({
													...formData,
													confirmPassword: e.target.value
												}),
												className: "w-full pl-10 pr-10 h-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setShowConfirmPassword(!showConfirmPassword),
												className: "absolute right-3 top-3 text-gray-400 hover:text-gray-600",
												children: showConfirmPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "w-5 h-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "w-5 h-5" })
											})
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											className: "rounded",
											required: true
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-gray-700",
											children: "I agree to the Terms of Service and Privacy Policy"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										className: "w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold",
										disabled: loading,
										children: loading ? "Creating account..." : "Create Account"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-center text-gray-600 mt-6",
								children: [
									"Already have an account?",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => navigate({ to: "/login" }),
										className: "text-blue-600 hover:underline font-semibold",
										children: "Sign in"
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-gray-600 text-sm mt-8",
						children: "By creating an account, you agree to our Terms of Service and Privacy Policy"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { RegisterPage as component };
