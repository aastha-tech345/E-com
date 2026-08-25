import { useNavigate, useParams } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import {
  Boxes,
  ChevronLeft,
  CircleDollarSign,
  ImagePlus,
  Layers3,
  Package,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useShop } from "@/store/shop";
import { toast } from "sonner";
import type { Product, ProductStatus } from "@/types";
import { catalogService, type CatalogBrandOption, type CatalogCategoryOption } from "@/services";

export const Route = createFileRoute("/admin/products/$id/edit")({
  component: EditProductPage,
});

function EditProductPage() {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/admin/products/$id/edit" });
  const { admin, hydrated } = useShop();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<CatalogCategoryOption[]>([]);
  const [brands, setBrands] = useState<CatalogBrandOption[]>([]);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    brandId: "",
    category: "",
    shortDescription: "",
    description: "",
    price: 0,
    stock: 0,
    status: "active" as ProductStatus,
  });

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      setLoadingProduct(true);
      try {
        const [record, categoryOptions, brandOptions] = await Promise.all([
          catalogService.adminProduct(id),
          catalogService.categories(),
          catalogService.brands(),
        ]);
        if (!active) return;

        setProduct(record);
        setCategories(categoryOptions);
        setBrands(brandOptions);
        setImageUrls(record.images);
        setFormData({
          name: record.name,
          sku: record.sku,
          brandId: brandOptions.find((brand) => brand.name === record.brand)?.id ?? "",
          category: categoryOptions.find((category) => category.name === record.category)?.id ?? "",
          shortDescription: record.shortDescription,
          description: record.description,
          price: record.price,
          stock: record.stock,
          status: record.status,
        });
      } catch (error) {
        if (active) toast.error(error instanceof Error ? error.message : "Unable to load product.");
      } finally {
        if (active) setLoadingProduct(false);
      }
    };

    void loadProduct();
    return () => {
      active = false;
    };
  }, [id]);

  if (!hydrated) {
    return (
      <AdminLayout>
        <p className="text-sm text-slate-600">Loading product...</p>
      </AdminLayout>
    );
  }

  if (!admin) {
    return null;
  }

  if (loadingProduct) {
    return (
      <AdminLayout>
        <p className="text-sm text-slate-600">Loading product...</p>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">This product could not be found.</p>
          <Button variant="outline" onClick={() => navigate({ to: "/admin/products" })}>
            Back to products
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku || !formData.category) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      await catalogService.updateProduct(product.id, {
        name: formData.name,
        slug: product.slug,
        category_id: formData.category,
        brand_id: formData.brandId || null,
        short_description: formData.shortDescription,
        description: formData.description,
        is_published: formData.status === "active",
        sku: formData.sku,
        price: formData.price,
        quantity_available: formData.stock,
        media: imageUrls
          .map((media_url, sort_order) => ({
            media_url: media_url.trim(),
            alt_text: formData.name,
            sort_order,
          }))
          .filter((media) => media.media_url),
      });
      toast.success("Product updated successfully!");
      navigate({ to: "/admin/products" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update product.");
    }
  };

  const uploadImages = async (selectedFiles: File[]) => {
    if (!selectedFiles.length) return;
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
      toast.success(
        `${uploadedUrls.length} image${uploadedUrls.length === 1 ? "" : "s"} uploaded.`,
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to upload image.");
    } finally {
      setUploadingImages(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mx-auto w-full max-w-[1500px] space-y-4 pb-8">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-500">
              <button
                type="button"
                onClick={() => navigate({ to: "/admin/products" })}
                className="hover:text-blue-700"
              >
                Products
              </button>
              <span>/</span>
              <span className="text-slate-800">Edit Product</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Product</h1>
            <p className="mt-1 text-sm text-slate-500">Update {product.name} in your catalog</p>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/admin/products" })}
            >
              Cancel
            </Button>
            <Button
              form="product-edit-form"
              type="submit"
              className="bg-blue-600 px-5 text-white hover:bg-blue-700"
            >
              Save Changes
            </Button>
          </div>
        </div>

        <form id="product-edit-form" onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Basic Information */}
          <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-blue-50 p-2 text-blue-600">
                <Package className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-slate-900">Basic Information</h3>
                <p className="text-xs text-slate-500">
                  Product name, category, brand, and descriptions
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <Input
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SKU *</label>
                <Input
                  placeholder="SKU-xxxxx"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                <select
                  value={formData.brandId}
                  onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Brand</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-violet-50 p-2 text-violet-600">
                <Layers3 className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-slate-900">Descriptions</h3>
                <p className="text-xs text-slate-500">Help customers understand the product</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description
              </label>
              <Input
                placeholder="Brief product description"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Description
              </label>
              <textarea
                placeholder="Detailed product description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                <CircleDollarSign className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-slate-900">Pricing & Stock</h3>
                <p className="text-xs text-slate-500">
                  Set the selling price and inventory for the default variant
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selling Price (₹) *
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-amber-50 p-2 text-amber-600">
                <Boxes className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-slate-900">Inventory</h3>
                <p className="text-xs text-slate-500">Available quantity for this product</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-orange-50 p-2 text-orange-600">
                <ImagePlus className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-slate-900">Images</h3>
                <p className="text-xs text-slate-500">The first image is displayed as the cover</p>
              </div>
            </div>
            <label className="relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-blue-500 hover:bg-blue-50">
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
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                disabled={uploadingImages}
                onChange={(event) => {
                  const selectedFiles = Array.from(event.currentTarget.files ?? []);
                  event.currentTarget.value = "";
                  void uploadImages(selectedFiles);
                }}
              />
            </label>
            {imageUrls.length > 0 && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-slate-700">
                    {imageUrls.length} image{imageUrls.length === 1 ? "" : "s"} ready to save
                  </p>
                  <p className="text-xs text-slate-500">First image is the cover</p>
                </div>
                <div className="no-scrollbar flex max-h-36 flex-wrap gap-3 overflow-y-auto pr-1">
                  {imageUrls.map((imageUrl, index) => (
                    <div
                      key={imageUrl}
                      className="group relative h-28 w-28 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
                    >
                      <img
                        src={imageUrl}
                        alt={`Product ${index + 1}`}
                        className="block h-full w-full object-cover"
                      />
                      {index === 0 && (
                        <span className="absolute left-2 top-2 rounded bg-slate-900 px-2 py-1 text-[10px] font-medium text-white">
                          Cover
                        </span>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label={`Remove image ${index + 1}`}
                        onClick={() =>
                          setImageUrls((current) =>
                            current.filter((_, itemIndex) => itemIndex !== index),
                          )
                        }
                        className="absolute right-2 top-2 h-7 w-7 bg-white/90 opacity-0 shadow-sm transition group-hover:opacity-100"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-600" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Status */}
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900">Publish Settings</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as ProductStatus })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
