import { useNavigate, useParams } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useShop } from "@/store/shop";
import { categories, brands, products } from "@/data/catalog";
import { toast } from "sonner";
import type { ProductStatus } from "@/types";

export const Route = createFileRoute("/admin/products/$id/edit")({
  component: EditProductPage,
});

function EditProductPage() {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/admin/products/$id/edit" });
  const { admin } = useShop();
  const product = products.find((p) => p.id === id);

  const [formData, setFormData] = useState({
    name: product?.name || "",
    sku: product?.sku || "",
    brand: product?.brand || "",
    category: categories.find((c) => c.name === product?.category)?.id || "",
    subcategory: product?.subcategory || "",
    shortDescription: product?.shortDescription || "",
    description: product?.description || "",
    mrp: product?.mrp || 0,
    price: product?.price || 0,
    costPrice: product?.costPrice || 0,
    stock: product?.stock || 0,
    minStock: product?.minStock || 10,
    maxStock: product?.stock || 1000,
    status: product?.status || "active",
    colors: product?.colors?.join(", ") || "",
    sizes: product?.sizes?.join(", ") || "",
  });

  if (!admin || !product) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku || !formData.brand || !formData.category) {
      toast.error("Please fill all required fields");
      return;
    }
    toast.success("Product updated successfully!");
    navigate({ to: "/admin/products" });
  };

  const selectedCategory = categories.find((c) => c.id === formData.category);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate({ to: "/admin/products" })}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-gray-600">{product.name}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Brand *</label>
                <select
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Brand</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.name}>
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
                      subcategory: "",
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
              {selectedCategory && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory
                  </label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Subcategory</option>
                    {selectedCategory.subcategories.map((sub) => (
                      <option key={sub.id} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">MRP (₹) *</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.mrp}
                  onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
                  required
                />
              </div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost Price (₹)
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.costPrice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      costPrice: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Inventory</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Stock</label>
                <Input
                  type="number"
                  placeholder="10"
                  value={formData.minStock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      minStock: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Stock</label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={formData.maxStock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxStock: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Images</h3>
            {product.images.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Current Images</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {product.images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img}
                        alt={`Product ${idx}`}
                        className="w-full h-24 rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-lg"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-2">Drag and drop images here or click to browse</p>
              <p className="text-gray-500 text-sm">
                Supported formats: JPG, PNG, GIF (Max 5MB each)
              </p>
              <Input type="file" multiple accept="image/*" className="mt-4" />
            </div>
          </div>

          {/* Variants */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Variants</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Colors (comma-separated)
              </label>
              <Input
                placeholder="Red, Blue, Black, White"
                value={formData.colors}
                onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sizes (comma-separated)
              </label>
              <Input
                placeholder="S, M, L, XL, XXL"
                value={formData.sizes}
                onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
              />
            </div>
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
            >
              Delete Product
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
