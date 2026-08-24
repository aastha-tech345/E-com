import { i as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@emotion/react+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@mui/material+[...].mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { f as useShop, r as authService } from "./shop-DLp9rmaL.mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/register-DxH1ZkxP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RegisterPage() {
	const navigate = useNavigate();
	const { setUser } = useShop();
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [agreeTerms, setAgreeTerms] = (0, import_react.useState)(false);
	const [userType, setUserType] = (0, import_react.useState)("customer");
	const validateForm = () => {
		if (!fullName.trim()) {
			toast.error("Full name is required");
			return false;
		}
		if (!email) {
			toast.error("Email is required");
			return false;
		}
		if (!password) {
			toast.error("Password is required");
			return false;
		}
		if (password.length < 8) {
			toast.error("Password must be at least 8 characters");
			return false;
		}
		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return false;
		}
		if (!agreeTerms) {
			toast.error("You must agree to the terms and conditions");
			return false;
		}
		return true;
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			if (!validateForm()) {
				setLoading(false);
				return;
			}
			let response;
			if (userType === "seller") {
				const apiUrl = {
					"BASE_URL": "/",
					"DEV": false,
					"MODE": "production",
					"PROD": true,
					"SSR": true,
					"TSS_DEV_SERVER": "false",
					"TSS_DEV_SSR_STYLES_BASEPATH": "/",
					"TSS_DEV_SSR_STYLES_ENABLED": "true",
					"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
					"TSS_INLINE_CSS_ENABLED": "false",
					"TSS_ROUTER_BASEPATH": "",
					"TSS_SERVER_FN_BASE": "/_serverFn/"
				}["VITE_API_URL"] || "http://localhost:8000/api/v1";
				const apiResponse = await fetch(`${apiUrl}/auth/register-seller`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						email,
						full_name: fullName,
						password
					})
				});
				if (!apiResponse.ok) {
					const data = await apiResponse.json();
					throw new Error(data.detail || "Seller registration failed");
				}
				response = await apiResponse.json();
			} else response = await authService.register(email, fullName, password);
			setUser(response.user, {
				access_token: response.access_token,
				refresh_token: response.refresh_token
			});
			toast.success(`${userType === "seller" ? "Seller" : "Account"} created successfully!`);
			navigate({ to: "/" });
		} catch (err) {
			const message = err instanceof Error ? err.message : "Registration failed";
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
								children: "Create your account"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSubmit,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium text-gray-900 mb-3",
								children: "I want to register as:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: `cursor-pointer p-3 rounded-lg border-2 transition ${userType === "customer" ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "radio",
										name: "userType",
										value: "customer",
										checked: userType === "customer",
										onChange: (e) => setUserType(e.target.value),
										className: "sr-only",
										disabled: loading
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-2xl mb-1",
												children: "🛍️"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm font-medium text-gray-900",
												children: "Customer"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-gray-600",
												children: "Shop & buy"
											})
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: `cursor-pointer p-3 rounded-lg border-2 transition ${userType === "seller" ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "radio",
										name: "userType",
										value: "seller",
										checked: userType === "seller",
										onChange: (e) => setUserType(e.target.value),
										className: "sr-only",
										disabled: loading
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-2xl mb-1",
												children: "🏪"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-sm font-medium text-gray-900",
												children: "Seller"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-gray-600",
												children: "Sell products"
											})
										]
									})]
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium text-gray-900 mb-2",
								children: "Full Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "text",
								value: fullName,
								onChange: (e) => setFullName(e.target.value),
								placeholder: "John Doe",
								disabled: loading,
								required: true
							})] }),
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "block text-sm font-medium text-gray-900 mb-2",
									children: "Password"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
										className: "absolute right-3 top-3 text-gray-500 hover:text-gray-700 text-sm",
										children: showPassword ? "Hide" : "Show"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-gray-500 mt-1",
									children: "At least 8 characters"
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-sm font-medium text-gray-900 mb-2",
								children: "Confirm Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: showPassword ? "text" : "password",
								value: confirmPassword,
								onChange: (e) => setConfirmPassword(e.target.value),
								placeholder: "••••••••",
								disabled: loading,
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-start space-x-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: agreeTerms,
									onChange: (e) => setAgreeTerms(e.target.checked),
									className: "w-4 h-4 rounded border-gray-300 text-blue-600 mt-0.5",
									disabled: loading
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm text-gray-700",
									children: [
										"I agree to the",
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
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold",
								disabled: loading,
								children: loading ? "Creating account..." : "Create Account"
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
							"Already have an account?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								className: "text-blue-600 hover:text-blue-700 font-semibold",
								children: "Sign in"
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-xs text-gray-600 mt-6",
				children: "By creating an account, you agree to our terms and accept our privacy policy."
			})]
		})
	});
}
//#endregion
export { RegisterPage as component };
