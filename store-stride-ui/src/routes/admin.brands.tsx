import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/DataTable";
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
import { type CatalogBrandOption, catalogService } from "@/services";
import { useShop } from "@/store/shop";

export const Route = createFileRoute("/admin/brands")({ component: AdminBrands });

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function AdminBrands() {
  const { admin } = useShop();
  const [brands, setBrands] = useState<CatalogBrandOption[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editing, setEditing] = useState<CatalogBrandOption | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterField, setFilterField] = useState("all");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const pageSize = 10;
  const load = async () => {
    try {
      setLoading(true);
      const result = await catalogService.adminBrands({ q: search, page, pageSize, field: filterField });
      setBrands(result.items);
      setTotal(result.total);
    } catch {
      toast.error("Unable to load brands.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load();
  }, [page, search, filterField]);
  if (!admin) return null;
  const save = async () => {
    if (!form.name) {
      toast.error("Brand name is required.");
      return;
    }
    try {
      const payload = { ...form, slug: slugify(form.name) };
      if (editing) await catalogService.updateBrand(editing.id, payload);
      else await catalogService.createBrand(payload);
      setOpen(false);
      setEditing(null);
      setForm({ name: "", description: "" });
      setPage(1);
      await load();
      toast.success(editing ? "Brand updated." : "Brand created.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create brand.");
    }
  };
  const edit = (brand: CatalogBrandOption) => {
    setEditing(brand);
    setForm({ name: brand.name, description: brand.description || "" });
    setOpen(true);
  };
  const remove = async (brand: CatalogBrandOption) => {
    try {
      await catalogService.deleteBrand(brand.id);
      toast.success("Brand deleted.");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete brand.");
    }
  };
  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-bold text-slate-900">Brands</h1>
          <p className="mt-1 text-sm text-slate-600">Manage product brands</p>
        </div>
        <DataTable
          columns={[
            { key: "name", label: "Name" },
            { key: "slug", label: "Slug" },
            {
              key: "description",
              label: "Description",
              render: (value: string) => <span className="line-clamp-1 text-slate-600">{value || "-"}</span>,
            },
          ]}
          data={brands}
          isLoading={loading}
          searchFields={["name", "slug", "description"]}
          fieldSearchPlaceholder={`Filter by ${filterField === "all" ? "brand" : filterField}...`}
          onFieldSearch={(query) => {
            setSearch(query);
            setPage(1);
          }}
          onSearch={(query) => {
            setFilterField("all");
            setSearch(query);
            setPage(1);
          }}
          filterLabel="All columns"
          filterValue={filterField}
          onFilterChange={(value) => { setFilterField(value); setPage(1); }}
          filterOptions={[{ label: "All columns", value: "all" }, { label: "Name", value: "name" }, { label: "Slug", value: "slug" }, { label: "Description", value: "description" }]}
          searchPlaceholder="Search all brands..."
          addAction={{ label: "Add Brand", onClick: () => { setEditing(null); setForm({ name: "", description: "" }); setOpen(true); } }}
          onRefresh={() => void load()}
          pagination={{ page, pageSize, total, onPageChange: setPage }}
          getRowLabel={(brand) => brand.name}
          actions={[
            { label: "Edit", onClick: edit },
            { label: "Delete", onClick: (brand) => void remove(brand) },
          ]}
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Brand" : "Add Brand"}</DialogTitle>
              <DialogDescription>{editing ? "Update this product brand." : "Create a product brand."}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <Input
                placeholder="Brand name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
              <Input
                value={slugify(form.name)}
                readOnly
                className="bg-slate-50 text-slate-500"
                placeholder="Slug is generated automatically"
              />
              <textarea className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Brand description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => void save()}>{editing ? "Save Changes" : "Create"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
