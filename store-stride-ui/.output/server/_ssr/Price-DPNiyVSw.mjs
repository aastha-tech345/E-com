import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as cn } from "./button-DRsC1qZi.mjs";
import { i as formatPrice, r as discountPercent } from "./Footer-5XIvVsiU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Price-DPNiyVSw.js
var import_jsx_runtime = require_jsx_runtime();
function Price({ price, value, mrp, size = "md", className }) {
	const amount = price ?? value ?? 0;
	const off = mrp ? discountPercent(mrp, amount) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-wrap items-baseline gap-2", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("font-bold tracking-tight", {
				sm: "text-sm",
				md: "text-base",
				lg: "text-2xl"
			}[size]),
			children: formatPrice(amount)
		}), mrp && off > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs text-muted-foreground line-through",
			children: formatPrice(mrp)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-xs font-semibold text-success",
			children: [off, "% off"]
		})] })]
	});
}
//#endregion
export { Price as t };
