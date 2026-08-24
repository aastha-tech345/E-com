import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { p as useShop } from "./shop-fTXyFsSH.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { Q as CircleCheckBig } from "../_libs/lucide-react.mjs";
import { n as Header, t as Footer } from "./Footer-CVdFw6bt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout.success-Cila5_7P.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CheckoutSuccessPage() {
	const { clearCart } = useShop();
	const cleared = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		if (cleared.current) return;
		cleared.current = true;
		clearCart();
	}, [clearCart]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col bg-white",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex flex-1 items-center justify-center px-4 py-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-md text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "mx-auto mb-4 h-14 w-14 text-green-600" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-bold text-gray-900",
							children: "Payment successful"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-gray-600",
							children: "Stripe confirmed your checkout. Your order flow can now be connected to backend order creation."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex justify-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/orders",
									children: "View Orders"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/products",
									search: { page: 1 },
									children: "Continue Shopping"
								})
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { CheckoutSuccessPage as component };
