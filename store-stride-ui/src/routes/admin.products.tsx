import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useShop } from "@/store/shop";
import { productService } from "@/services";
import type { Product } from "@/types";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

function AdminProducts() {
  const { admin } = useShop();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.list({ search });
      setProducts(data.items);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!admin) return null;

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      // TODO: Call API to delete
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold">Products</h1>
                <p className="text-gray-600 text-sm mt-1">Manage your product catalog</p>
              </div>
              <Button onClick={() => navigate({ to: "/admin/products/create" })}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            {/* Search */}
            <div className="flex gap-2">
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  loadProducts();
                }}
                className="max-w-xs"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center">
              <p className="text-gray-500">No products found</p>
              <Button onClick={() => navigate({ to: "/admin/products/create" })} className="mt-4">
                Create First Product
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-gray-500">{product.slug}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{product.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">₹{product.price || "N/A"}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{product.stock}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {product.status === "active" ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate({
                                to: "/admin/products/$id/edit",
                                params: { id: product.id },
                              })
                            }
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
