import { o as require_jsx_runtime } from "../_libs/@mui/material+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { C as Plus, O as Minus } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/QuantitySelector-D4bAFoDL.js
var import_jsx_runtime = require_jsx_runtime();
function QuantitySelector({ value, onChange, max = 10, min = 1 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "inline-flex items-center rounded-md border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "icon",
				className: "h-9 w-9 rounded-r-none",
				"aria-label": "Decrease quantity",
				disabled: value <= min,
				onClick: () => onChange(value - 1),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { size: 15 })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "w-10 text-center text-sm font-medium tabular-nums",
				"aria-live": "polite",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				size: "icon",
				className: "h-9 w-9 rounded-l-none",
				"aria-label": "Increase quantity",
				disabled: value >= max,
				onClick: () => onChange(value + 1),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { size: 15 })
			})
		]
	});
}
//#endregion
export { QuantitySelector as t };
