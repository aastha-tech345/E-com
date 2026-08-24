import { i as __toESM } from "../_runtime.mjs";
import { n as useFieldArray, r as useForm, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as catalogService, p as useShop } from "./shop-fTXyFsSH.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as AdminSidebar } from "./AdminSidebar-B0zSOLa1.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { i as stringType, n as booleanType, r as objectType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.products.create-qxxpY_gy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var productSchema = objectType({
	name: stringType().min(2, "Name is required"),
	slug: stringType().min(2, "Slug is required"),
	category_id: stringType().min(1, "Category is required"),
	brand_id: stringType().optional(),
	short_description: stringType().optional(),
	description: stringType().optional(),
	is_published: booleanType().default(false),
	variants: arrayType(objectType({
		name: stringType().min(1, "Variant name required"),
		sku: stringType().min(2, "SKU required"),
		price: stringType().transform((v) => parseFloat(v)),
		quantity_available: stringType().transform((v) => parseInt(v)),
		is_default: booleanType().default(false)
	})),
	media: arrayType(objectType({
		media_url: stringType().url("Valid URL required"),
		alt_text: stringType().optional()
	}))
});
function CreateProduct() {
	const { admin } = useShop();
	const navigate = useNavigate();
	const [categories, setCategories] = (0, import_react.useState)([]);
	const [brands, setBrands] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		loadOptions();
	}, []);
	const loadOptions = async () => {
		try {
			const [cats, brs] = await Promise.all([catalogService.categories(), catalogService.brands()]);
			setCategories(cats);
			setBrands(brs);
		} catch (err) {
			console.error("Error loading options:", err);
		}
	};
	const { register, control, handleSubmit, formState: { errors } } = useForm({
		resolver: u(productSchema),
		defaultValues: {
			variants: [{
				name: "Default",
				sku: "",
				price: "0",
				quantity_available: "0",
				is_default: true
			}],
			media: []
		}
	});
	const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
		control,
		name: "variants"
	});
	const { fields: mediaFields, append: appendMedia, remove: removeMedia } = useFieldArray({
		control,
		name: "media"
	});
	const onSubmit = async (data) => {
		setLoading(true);
		try {
			toast.success("Product created successfully");
			navigate({ to: "/admin/products" });
		} catch (err) {
			toast.error("Failed to create product");
			console.error("Error:", err);
		} finally {
			setLoading(false);
		}
	};
	if (!admin) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-screen bg-gray-50 overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminSidebar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "flex-1 overflow-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white border-b border-gray-200 sticky top-0 z-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-8 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold",
						children: "Create Product"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-gray-600 text-sm mt-1",
						children: "Add a new product to your catalog"
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-8 max-w-4xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit(onSubmit),
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white p-6 rounded-lg shadow",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-bold mb-4",
								children: "Basic Information"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-sm font-medium text-gray-900 mb-2",
												children: "Product Name *"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { ...register("name") }),
											errors.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-red-600 text-sm mt-1",
												children: errors.name.message
											})
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-sm font-medium text-gray-900 mb-2",
												children: "Slug *"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { ...register("slug") }),
											errors.slug && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-red-600 text-sm mt-1",
												children: errors.slug.message
											})
										] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-sm font-medium text-gray-900 mb-2",
												children: "Category *"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												...register("category_id"),
												className: "w-full px-3 py-2 border border-gray-300 rounded-lg",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "",
													children: "Select Category"
												}), categories.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: cat.id,
													children: cat.name
												}, cat.id))]
											}),
											errors.category_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-red-600 text-sm mt-1",
												children: errors.category_id.message
											})
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-sm font-medium text-gray-900 mb-2",
											children: "Brand"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											...register("brand_id"),
											className: "w-full px-3 py-2 border border-gray-300 rounded-lg",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: "Select Brand"
											}), brands.map((br) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: br.id,
												children: br.name
											}, br.id))]
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-sm font-medium text-gray-900 mb-2",
										children: "Short Description"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										...register("short_description"),
										className: "w-full px-3 py-2 border border-gray-300 rounded-lg",
										rows: 2
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "block text-sm font-medium text-gray-900 mb-2",
										children: "Full Description"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										...register("description"),
										className: "w-full px-3 py-2 border border-gray-300 rounded-lg",
										rows: 4
									})] })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white p-6 rounded-lg shadow",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-bold mb-4",
									children: "Variants"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-4",
									children: variantFields.map((field, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 border border-gray-200 rounded-lg",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-2 gap-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													...register(`variants.${idx}.name`),
													placeholder: "Variant Name"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													...register(`variants.${idx}.sku`),
													placeholder: "SKU"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-3 gap-4 mt-4",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														...register(`variants.${idx}.price`),
														placeholder: "Price"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														...register(`variants.${idx}.quantity_available`),
														placeholder: "Quantity"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
														className: "flex items-center",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															type: "checkbox",
															...register(`variants.${idx}.is_default`)
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "ml-2 text-sm",
															children: "Default"
														})]
													})
												]
											}),
											variantFields.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												type: "button",
												variant: "outline",
												onClick: () => removeVariant(idx),
												className: "mt-2 text-red-600",
												children: "Remove"
											})
										]
									}, field.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => appendVariant({
										name: "",
										sku: "",
										price: "0",
										quantity_available: "0",
										is_default: false
									}),
									className: "mt-4",
									children: "Add Variant"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white p-6 rounded-lg shadow",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-lg font-bold mb-4",
									children: "Images"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-4",
									children: mediaFields.map((field, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 border border-gray-200 rounded-lg grid grid-cols-2 gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											...register(`media.${idx}.media_url`),
											placeholder: "Image URL"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											...register(`media.${idx}.alt_text`),
											placeholder: "Alt Text"
										}), mediaFields.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											variant: "outline",
											onClick: () => removeMedia(idx),
											className: "mt-2 text-red-600",
											children: "Remove"
										})] })]
									}, field.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => appendMedia({
										media_url: "",
										alt_text: ""
									}),
									className: "mt-4",
									children: "Add Image"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-white p-6 rounded-lg shadow",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									...register("is_published")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 font-medium",
									children: "Publish immediately"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: loading,
								children: loading ? "Creating..." : "Create Product"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => navigate({ to: "/admin/products" }),
								children: "Cancel"
							})]
						})
					]
				})
			})]
		})]
	});
}
//#endregion
export { CreateProduct as component };
