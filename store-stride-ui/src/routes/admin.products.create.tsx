import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ImagePlus, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useShop } from "@/store/shop";
import {
  type CatalogBrandOption,
  type CatalogCategoryOption,
  catalogService,
  productService,
} from "@/services";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/products/create")({
  component: CreateProduct,
});

const productSchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().min(2, "Slug is required"),
  category_id: z.string().min(1, "Category is required"),
  brand_id: z.string().optional(),
  short_description: z.string().optional(),
  description: z.string().optional(),
  is_published: z.boolean().default(false),
  variants: z.array(
    z.object({
      name: z.string().min(1, "Variant name required"),
      sku: z.string().min(2, "SKU required"),
      price: z.coerce.number().positive("Price must be greater than zero"),
      quantity_available: z.coerce.number().int().nonnegative(),
      is_default: z.boolean().default(false),
    }),
  ),
  media: z.array(
    z.object({
      media_url: z.string().url("Valid URL required"),
      alt_text: z.string().optional(),
    }),
  ),
});

type ProductFormData = z.infer<typeof productSchema>;
type ProductFormInput = z.input<typeof productSchema>;

function CreateProduct() {
  const { admin } = useShop();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CatalogCategoryOption[]>([]);
  const [brands, setBrands] = useState<CatalogBrandOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
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

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormInput, unknown, ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      is_published: true,
      variants: [{ name: "Default", sku: "", price: 0, quantity_available: 0, is_default: true }],
      media: [],
    },
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "variants",
  });

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      const canUseAdminCatalog =
        admin?.roles.includes("super_admin") || admin?.roles.includes("admin_catalog");
      const endpoint = canUseAdminCatalog ? "admin" : "seller";
      await productService.create(
        {
          ...data,
          brand_id: data.brand_id || null,
          short_description: data.short_description || "",
          description: data.description || "",
          variants: data.variants.map((variant) => ({
            ...variant,
            currency: "INR",
          })),
          media: imageUrls.map((media_url, sort_order) => ({
            media_url,
            alt_text: data.name,
            sort_order,
          })),
        },
        endpoint,
      );
      toast.success("Product created successfully");
      navigate({ to: "/admin/products" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create product");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!admin) return null;

  const uploadImages = async (files: FileList | null) => {
    if (!files?.length) return;
    const selectedFiles = Array.from(files);
    if (selectedFiles.some((file) => !file.type.startsWith("image/"))) {
      toast.error("Please select image files only.");
      return;
    }

    setUploadingImages(true);
    try {
      const uploadedUrls = await Promise.all(
        selectedFiles.map((file) => catalogService.uploadProductImage(file)),
      );
      setImageUrls((current) => [...current, ...uploadedUrls]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to upload image.");
    } finally {
      setUploadingImages(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-bold text-slate-900">Create Product</h1>
          <p className="mt-1 text-sm text-slate-600">Add a new product to your catalog</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-5">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-bold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Product Name *
                  </label>
                  <Input {...register("name")} />
                  {errors.name && (
                    <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Slug *</label>
                  <Input {...register("slug")} />
                  {errors.slug && (
                    <p className="text-red-600 text-sm mt-1">{errors.slug.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Category *</label>
                  <select
                    {...register("category_id")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && (
                    <p className="text-red-600 text-sm mt-1">{errors.category_id.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Brand</label>
                  <select
                    {...register("brand_id")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Brand</option>
                    {brands.map((br) => (
                      <option key={br.id} value={br.id}>
                        {br.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Short Description
                </label>
                <textarea
                  {...register("short_description")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Full Description
                </label>
                <textarea
                  {...register("description")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-bold mb-4">Variants</h2>
            <div className="space-y-4">
              {variantFields.map((field, idx) => (
                <div key={field.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-center">
                    <Input
                      className="md:col-span-3"
                      {...register(`variants.${idx}.name`)}
                      placeholder="Variant Name"
                    />
                    <Input
                      className="md:col-span-3"
                      {...register(`variants.${idx}.sku`)}
                      placeholder="SKU"
                    />
                    <Input
                      className="md:col-span-2"
                      type="number"
                      {...register(`variants.${idx}.price`)}
                      placeholder="Price"
                    />
                    <Input
                      className="md:col-span-3"
                      type="number"
                      {...register(`variants.${idx}.quantity_available`)}
                      placeholder="Quantity"
                    />
                    <label className="flex items-center gap-2 whitespace-nowrap md:col-span-1">
                      <input type="checkbox" {...register(`variants.${idx}.is_default`)} />
                      <span className="text-sm">Default</span>
                    </label>
                  </div>
                  {variantFields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeVariant(idx)}
                      className="mt-2 text-red-600"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendVariant({
                  name: "",
                  sku: "",
                  price: 0,
                  quantity_available: 0,
                  is_default: false,
                })
              }
              className="mt-4"
            >
              Add Variant
            </Button>
          </div>

          {/* Media */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="mb-4">
              <h2 className="text-lg font-bold">Images</h2>
              <p className="mt-1 text-sm text-slate-500">
                Upload product photos. The first image is used as the cover.
              </p>
            </div>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-blue-500 hover:bg-blue-50">
              <ImagePlus className="mb-2 h-8 w-8 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">
                {uploadingImages ? "Uploading images..." : "Choose product images"}
              </span>
              <span className="mt-1 text-xs text-slate-500">
                JPG, PNG, WEBP, or GIF up to 5 MB each
              </span>
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                className="sr-only"
                disabled={uploadingImages}
                onChange={(event) => {
                  void uploadImages(event.target.files);
                  event.currentTarget.value = "";
                }}
              />
            </label>
            {imageUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {imageUrls.map((src, index) => (
                  <div
                    key={src}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-100"
                  >
                    <img
                      src={src}
                      alt={`Product upload ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {index === 0 && (
                      <span className="absolute left-2 top-2 rounded bg-slate-900 px-2 py-1 text-[10px] font-medium text-white">
                        Cover
                      </span>
                    )}
                    <button
                      type="button"
                      aria-label={`Remove image ${index + 1}`}
                      onClick={() =>
                        setImageUrls((current) =>
                          current.filter((_, itemIndex) => itemIndex !== index),
                        )
                      }
                      className="absolute right-2 top-2 rounded-md bg-white p-1.5 text-red-600 opacity-0 shadow-sm transition group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Publish */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <label className="flex items-center">
              <input type="checkbox" {...register("is_published")} />
              <span className="ml-2 font-medium">Publish immediately</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Product"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/admin/products" })}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
