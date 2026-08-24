import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { Z as CircleX } from "../_libs/lucide-react.mjs";
import { n as Header, t as Footer } from "./Footer-CVdFw6bt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout.cancel-bqJ15Ppd.js
var import_jsx_runtime = require_jsx_runtime();
function CheckoutCancelPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col bg-white",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex flex-1 items-center justify-center px-4 py-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-md text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "mx-auto mb-4 h-14 w-14 text-red-600" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-bold text-gray-900",
							children: "Payment cancelled"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-gray-600",
							children: "Your cart is still available. You can try Stripe Checkout again whenever you are ready."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex justify-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/checkout",
									children: "Return to Checkout"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/cart",
									children: "View Cart"
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
export { CheckoutCancelPage as component };
