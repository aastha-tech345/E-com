import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useShop } from "@/store/shop";
import { type CatalogBrandOption, catalogService } from "@/services";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/brands")({
  component: AdminBrands,
});

function AdminBrands() {
  const { admin } = useShop();
  const [brands, setBrands] = useState<CatalogBrandOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", slug: "" });

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    setLoading(true);
    try {
      const data = await catalogService.brands();
      setBrands(data);
    } catch (err) {
      console.error("Error loading brands:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!admin) return null;

  const handleCreate = async () => {
    if (!formData.name || !formData.slug) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await catalogService.createBrand(formData);
      await loadBrands();
      setFormData({ name: "", slug: "" });
      setShowForm(false);
      toast.success("Brand created successfully");
    } catch (err) {
      toast.error("Failed to create brand");
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure?")) {
      // TODO: Call API to delete brand
      setBrands(brands.filter((b) => b.id !== id));
      toast.success("Brand deleted");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Brands</h1>
                <p className="text-gray-600 text-sm mt-1">Manage product brands</p>
              </div>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Brand
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Brand</DialogTitle>
                <DialogDescription>Add a reusable product brand.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3">
                <Input
                  placeholder="Brand Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                  placeholder="url-friendly-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate}>Create Brand</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Table */}
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : brands.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center">
              <p className="text-gray-500">No brands found</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Slug</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {brands.map((brand) => (
                    <tr key={brand.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium">{brand.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{brand.slug}</td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(brand.id)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
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
