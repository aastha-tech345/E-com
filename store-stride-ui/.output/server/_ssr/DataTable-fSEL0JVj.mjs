import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { Q as ChevronLeft, Z as ChevronRight, b as Search } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DataTable-fSEL0JVj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DataTable({ columns, data, onRowClick, actions, searchable = true, searchFields = ["name"], itemsPerPage = 10 }) {
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [currentPage, setCurrentPage] = (0, import_react.useState)(1);
	const filtered = searchable ? data.filter((row) => searchFields.some((field) => String(row[field]).toLowerCase().includes(searchTerm.toLowerCase()))) : data;
	const totalPages = Math.ceil(filtered.length / itemsPerPage);
	const paginatedData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			searchable && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-3 w-4 h-4 text-gray-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Search...",
					value: searchTerm,
					onChange: (e) => {
						setSearchTerm(e.target.value);
						setCurrentPage(1);
					},
					className: "pl-10"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-gray-50 border-b",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [columns.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-left font-semibold text-gray-900",
							style: { width: col.width },
							children: col.label
						}, col.key)), actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-left font-semibold text-gray-900",
							children: "Actions"
						})] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: paginatedData.map((row, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b hover:bg-gray-50 cursor-pointer",
						onClick: () => onRowClick?.(row),
						children: [columns.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-gray-700",
							children: col.render ? col.render(row[col.key], row) : row[col.key]
						}, col.key)), actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 flex gap-2",
							children: actions.map((action, actionIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: (e) => {
									e.stopPropagation();
									action.onClick(row);
								},
								children: action.label
							}, actionIdx))
						})]
					}, idx)) })]
				})
			}),
			totalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-center gap-2 mt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						disabled: currentPage === 1,
						onClick: () => setCurrentPage(currentPage - 1),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-4 h-4" })
					}),
					Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: page === currentPage ? "default" : "outline",
						size: "sm",
						onClick: () => setCurrentPage(page),
						children: page
					}, page)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						disabled: currentPage === totalPages,
						onClick: () => setCurrentPage(currentPage + 1),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-4 h-4" })
					})
				]
			})
		]
	});
}
//#endregion
export { DataTable as t };
