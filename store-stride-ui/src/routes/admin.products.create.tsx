import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useShop } from "@/store/shop";
import { catalogService } from "@/services";
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
      price: z.string().transform((v) => parseFloat(v)),
      quantity_available: z.string().transform((v) => parseInt(v)),
      is_default: z.boolean().default(false),
    })
  ),
  media: z.array(
    z.object({
      media_url: z.string().url("Valid URL required"),
      alt_text: z.string().optional(),
    })
  ),
});

type ProductFormData = z.infer<typeof productSchema>;

function CreateProduct() {
  const { admin } = useShop();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const [cats, brs] = await Promise.all([
        catalogService.categories(),
        catalogService.brands(),
      ]);
      setCategories(cats);
      setBrands(brs);
    } catch (err) {
      console.error("Error loading options:", err);
    }
  };

  const { register, control, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      variants: [{ name: "Default", sku: "", price: "0", quantity_available: "0", is_default: true }],
      media: [],
    },
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: "variants",
  });

  const { fields: mediaFields, append: appendMedia, remove: removeMedia } = useFieldArray({
    control,
    name: "media",
  });

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      // TODO: Call API to create product
      // await fetch("/api/v1/admin/products", { method: "POST", body: JSON.stringify(data) });
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

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-4">
            <h1 className="text-2xl font-bold">Create Product</h1>
            <p className="text-gray-600 text-sm mt-1">Add a new product to your catalog</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 max-w-4xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-bold mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Slug *
                    </label>
                    <Input {...register("slug")} />
                    {errors.slug && (
                      <p className="text-red-600 text-sm mt-1">{errors.slug.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Category *
                    </label>
                    <select {...register("category_id")} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
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
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Brand
                    </label>
                    <select {...register("brand_id")} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
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
                  <textarea {...register("short_description")} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={2} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Full Description
                  </label>
                  <textarea {...register("description")} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={4} />
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-bold mb-4">Variants</h2>
              <div className="space-y-4">
                {variantFields.map((field, idx) => (
                  <div key={field.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <Input {...register(`variants.${idx}.name`)} placeholder="Variant Name" />
                      <Input {...register(`variants.${idx}.sku`)} placeholder="SKU" />
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <Input {...register(`variants.${idx}.price`)} placeholder="Price" />
                      <Input {...register(`variants.${idx}.quantity_available`)} placeholder="Quantity" />
                      <label className="flex items-center">
                        <input type="checkbox" {...register(`variants.${idx}.is_default`)} />
                        <span className="ml-2 text-sm">Default</span>
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
                    price: "0",
                    quantity_available: "0",
                    is_default: false,
                  })
                }
                className="mt-4"
              >
                Add Variant
              </Button>
            </div>

            {/* Media */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-bold mb-4">Images</h2>
              <div className="space-y-4">
                {mediaFields.map((field, idx) => (
                  <div key={field.id} className="p-4 border border-gray-200 rounded-lg grid grid-cols-2 gap-4">
                    <Input {...register(`media.${idx}.media_url`)} placeholder="Image URL" />
                    <div>
                      <Input {...register(`media.${idx}.alt_text`)} placeholder="Alt Text" />
                      {mediaFields.length > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removeMedia(idx)}
                          className="mt-2 text-red-600"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => appendMedia({ media_url: "", alt_text: "" })}
                className="mt-4"
              >
                Add Image
              </Button>
            </div>

            {/* Publish */}
            <div className="bg-white p-6 rounded-lg shadow">
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
      </main>
    </div>
  );
}
