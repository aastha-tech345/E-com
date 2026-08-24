import { useNavigate, useParams } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ChevronLeft, ImagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ConfirmationDialog } from "@/components/admin/ConfirmationDialog";
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
  const { admin } = useShop();
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
  const [confirmDelete, setConfirmDelete] = useState(false);

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
      <div className="space-y-5">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-bold text-slate-900">Edit Product</h1>
          <p className="mt-1 text-sm text-slate-600">{product.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/admin/products" })}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <p className="text-sm text-slate-500">Back to products</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          {/* Basic Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
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
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Description</h3>
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
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>
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
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Inventory</h3>
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
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Images</h3>
            <p className="text-sm text-slate-500">The first image is shown in the product table.</p>
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
            {imageUrls.map((imageUrl, index) => (
              <div key={imageUrl} className="relative inline-block">
                <img
                  src={imageUrl}
                  alt={`Product ${index + 1}`}
                  className="h-24 w-24 rounded-lg border border-slate-200 object-cover"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={`Remove image ${index + 1}`}
                  onClick={() =>
                    setImageUrls((current) => current.filter((_, itemIndex) => itemIndex !== index))
                  }
                  className="absolute right-1 top-1 h-7 w-7 bg-white/90"
                >
                  <Trash2 className="h-3.5 w-3.5 text-red-600" />
                </Button>
              </div>
            ))}
          </div>

          {/* Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Status</h3>
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

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/admin/products" })}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              className="text-red-600 hover:text-red-700 ml-auto"
              onClick={() => setConfirmDelete(true)}
            >
              Delete Product
            </Button>
          </div>
        </form>
        <ConfirmationDialog
          open={confirmDelete}
          title="Delete product?"
          description={`This will soft-delete ${product.name}. It will no longer appear in the catalog.`}
          confirmLabel="Delete Product"
          destructive
          onOpenChange={setConfirmDelete}
          onConfirm={() => {
            void (async () => {
              try {
                await catalogService.deleteProduct(product.id);
                toast.success("Product deleted.");
                navigate({ to: "/admin/products" });
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Unable to delete product.");
              }
            })();
          }}
        />
      </div>
    </AdminLayout>
  );
}
