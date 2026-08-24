import { i as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@emotion/react+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@mui/material+[...].mjs";
import { f as useShop, s as chatbotService, u as productService } from "./shop-DLp9rmaL.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { M as Maximize2, d as Star, k as Minimize2, n as X, nt as Bot, p as Sparkles, y as Send } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as Price } from "./Price-EXOzJVUM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ShoppingAssistant-DGNcaMsg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Rating({ value, count, size = 14, className }) {
	if (!value) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-center gap-1.5", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex items-center gap-1 rounded bg-success px-1.5 py-0.5 text-[11px] font-semibold text-success-foreground",
			"aria-label": `Rated ${value} out of 5`,
			children: [value.toFixed(1), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
				size: size - 3,
				className: "fill-current",
				"aria-hidden": true
			})]
		}), count != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-xs text-muted-foreground",
			children: [
				"(",
				count.toLocaleString("en-IN"),
				")"
			]
		})]
	});
}
function StarRow({ value, size = 16 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center gap-0.5",
		"aria-label": `${value} out of 5 stars`,
		children: [
			1,
			2,
			3,
			4,
			5
		].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
			size,
			className: i <= Math.round(value) ? "fill-accent text-accent" : "text-muted-foreground/40",
			"aria-hidden": true
		}, i))
	});
}
var STARTERS = [
	"I need a wireless headphone under ₹3000",
	"Find product ID WH1001",
	"Best rated running shoes"
];
function ShoppingAssistant() {
	const { chat, pushChat, resetChat, addToCart, hydrated } = useShop();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [full, setFull] = (0, import_react.useState)(false);
	const [input, setInput] = (0, import_react.useState)("");
	const [typing, setTyping] = (0, import_react.useState)(false);
	const endRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		endRef.current?.scrollIntoView({ block: "end" });
	}, [
		chat.length,
		typing,
		open
	]);
	const send = async (text) => {
		const value = text.trim();
		if (!value || typing) return;
		setInput("");
		pushChat({
			id: crypto.randomUUID(),
			role: "user",
			text: value
		});
		setTyping(true);
		const reply = await chatbotService.reply(value);
		setTyping(false);
		pushChat(reply);
	};
	if (!hydrated) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [!open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		onClick: () => setOpen(true),
		className: "fixed bottom-5 right-5 z-50 h-12 gap-2 rounded-full px-5 shadow-lg",
		"aria-label": "Open AI shopping assistant",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 17 }), " Ask AI"]
	}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		role: "dialog",
		"aria-label": "AI Shopping Assistant",
		className: cn("fixed z-50 flex flex-col overflow-hidden rounded-xl border bg-card shadow-2xl", full ? "inset-2 sm:inset-6" : "bottom-3 right-3 left-3 h-[70vh] sm:left-auto sm:h-[560px] sm:w-[400px]"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-2 border-b bg-primary px-4 py-3 text-primary-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { size: 18 }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold",
							children: "AI Shopping Assistant"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] opacity-80",
							children: "Mock assistant · always online"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						className: "h-8 w-8 text-primary-foreground hover:bg-primary-foreground/15",
						"aria-label": full ? "Exit fullscreen" : "Fullscreen",
						onClick: () => setFull((f) => !f),
						children: full ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minimize2, { size: 15 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { size: 15 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						className: "h-8 w-8 text-primary-foreground hover:bg-primary-foreground/15",
						"aria-label": "Close assistant",
						onClick: () => setOpen(false),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 16 })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 space-y-4 overflow-y-auto p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-w-[85%] rounded-lg rounded-tl-none bg-muted px-3 py-2 text-sm",
						children: "Hi! I can help you find products, compare prices or look up an order. How can I help?"
					}),
					chat.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1.5",
						children: STARTERS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => void send(s),
							className: "rounded-full border px-3 py-1.5 text-xs hover:bg-muted",
							children: s
						}, s))
					}),
					chat.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatBubble, {
						message: m,
						onAdd: addToCart
					}, m.id)),
					typing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex w-16 justify-center gap-1 rounded-lg bg-muted px-3 py-3",
						children: [
							0,
							1,
							2
						].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground",
							style: { animationDelay: `${i * 120}ms` }
						}, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: endRef })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex items-center gap-2 border-t p-3",
				onSubmit: (e) => {
					e.preventDefault();
					send(input);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "ghost",
						size: "sm",
						onClick: resetChat,
						className: "text-xs",
						children: "Clear"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "assistant-input",
						className: "sr-only",
						children: "Message the assistant"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "assistant-input",
						value: input,
						onChange: (e) => setInput(e.target.value),
						placeholder: "Type your message...",
						autoComplete: "off"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "icon",
						"aria-label": "Send message",
						disabled: !input.trim(),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { size: 16 })
					})
				]
			})
		]
	})] });
}
function ChatBubble({ message, onAdd }) {
	const items = message.products ? productService.byIds(message.products) : [];
	if (message.role === "user") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "ml-auto max-w-[85%] rounded-lg rounded-tr-none bg-primary px-3 py-2 text-sm text-primary-foreground",
		children: message.text
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-w-[85%] rounded-lg rounded-tl-none bg-muted px-3 py-2 text-sm",
				children: message.text
			}),
			items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-3 rounded-lg border p-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: p.images[0],
					alt: "",
					className: "h-16 w-16 rounded object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1 space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-medium",
							children: p.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rating, {
							value: p.rating,
							count: p.reviewCount
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Price, {
							price: p.price,
							mrp: p.mrp,
							size: "sm"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground",
							children: p.stock > 0 ? "In stock" : "Currently unavailable"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1.5 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								className: "h-7 text-xs",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/products/$id",
									params: { id: p.id },
									children: "View Product"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								className: "h-7 text-xs",
								disabled: p.stock <= 0,
								onClick: () => onAdd(p.id),
								children: "Add to Cart"
							})]
						})
					]
				})]
			}, p.id)),
			message.suggestions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1.5",
				children: message.suggestions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full border px-3 py-1 text-xs text-muted-foreground",
					children: s
				}, s))
			})
		]
	});
}
//#endregion
export { ShoppingAssistant as n, StarRow as r, Rating as t };
