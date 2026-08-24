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
import { type CatalogCategoryOption, catalogService } from "@/services";
import { useShop } from "@/store/shop";

export const Route = createFileRoute("/admin/categories")({ component: AdminCategories });

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function AdminCategories() {
  const { admin } = useShop();
  const [categories, setCategories] = useState<CatalogCategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterField, setFilterField] = useState("all");
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editing, setEditing] = useState<CatalogCategoryOption | null>(null);
  const pageSize = 10;

  const load = async () => {
    setLoading(true);
    try {
      const result = await catalogService.adminCategories({ q: search, page, pageSize, field: filterField });
      setCategories(result.items);
      setTotal(result.total);
    } catch {
      toast.error("Unable to load categories.");
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
      toast.error("Category name is required.");
      return;
    }
    try {
      const payload = { ...form, slug: slugify(form.name) };
      if (editing) await catalogService.updateCategory(editing.id, payload);
      else await catalogService.createCategory(payload);
      setOpen(false);
      setEditing(null);
      setForm({ name: "", description: "" });
      setPage(1);
      await load();
      toast.success(editing ? "Category updated." : "Category created.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to create category.");
    }
  };
  const edit = (category: CatalogCategoryOption) => {
    setEditing(category);
    setForm({ name: category.name, description: category.description || "" });
    setOpen(true);
  };
  const remove = async (category: CatalogCategoryOption) => {
    try {
      await catalogService.deleteCategory(category.id);
      toast.success("Category deleted.");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete category.");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
          <p className="mt-1 text-sm text-slate-600">Manage product categories</p>
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
          data={categories}
          isLoading={loading}
          searchFields={["name", "slug", "description"]}
          fieldSearchPlaceholder={`Filter by ${filterField === "all" ? "category" : filterField}...`}
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
          searchPlaceholder="Search all categories..."
          addAction={{ label: "Add Category", onClick: () => { setEditing(null); setForm({ name: "", description: "" }); setOpen(true); } }}
          onRefresh={() => void load()}
          pagination={{ page, pageSize, total, onPageChange: setPage }}
          getRowLabel={(category) => category.name}
          actions={[
            { label: "Edit", onClick: edit },
            { label: "Delete", onClick: (category) => void remove(category) },
          ]}
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Category" : "Add Category"}</DialogTitle>
              <DialogDescription>{editing ? "Update this product category." : "Create a reusable product category."}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <Input
                placeholder="Category name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
              <Input
                value={slugify(form.name)}
                readOnly
                className="bg-slate-50 text-slate-500"
                placeholder="Slug is generated automatically"
              />
              <textarea className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Category description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
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
