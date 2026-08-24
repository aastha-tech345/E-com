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
import { type CatalogAttribute, catalogService } from "@/services";
import { useShop } from "@/store/shop";

export const Route = createFileRoute("/admin/product-attributes")({
  component: AdminAttributesPage,
});

const emptyForm = { name: "", slug: "", attribute_type: "select", valuesText: "" };

function AdminAttributesPage() {
  const { admin } = useShop();
  const [attributes, setAttributes] = useState<CatalogAttribute[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<CatalogAttribute | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const pageSize = 10;

  const load = async () => {
    setLoading(true);
    try {
      const result = await catalogService.adminAttributes({
        q: search,
        page,
        pageSize,
        sortBy,
        sortOrder,
      });
      setAttributes(result.items);
      setTotal(result.total);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load attributes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [page, search, sortBy, sortOrder]);

  if (!admin) return null;

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (attribute: CatalogAttribute) => {
    setEditing(attribute);
    setForm({
      name: attribute.name,
      slug: attribute.slug,
      attribute_type: attribute.attribute_type,
      valuesText: attribute.values.join(", "),
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error("Name and slug are required.");
      return;
    }
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      attribute_type: form.attribute_type,
      values: form.valuesText.split(",").map((value) => value.trim()).filter(Boolean),
    };
    try {
      if (editing) {
        await catalogService.updateAttribute(editing.id, payload);
        toast.success("Attribute updated.");
      } else {
        await catalogService.createAttribute(payload);
        setPage(1);
        toast.success("Attribute created.");
      }
      setOpen(false);
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save attribute.");
    }
  };

  const remove = async (attribute: CatalogAttribute) => {
    try {
      await catalogService.deleteAttribute(attribute.id);
      toast.success("Attribute deleted.");
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete attribute.");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-bold text-slate-900">Product Attributes</h1>
          <p className="mt-1 text-sm text-slate-600">Manage product attributes and variants</p>
        </div>
        <DataTable
          columns={[
            { key: "name", label: "Attribute Name", sortable: true },
            { key: "slug", label: "Slug", sortable: true },
            { key: "attribute_type", label: "Type", sortable: true },
            {
              key: "values",
              label: "Values",
              render: (values: string[]) => (
                <div className="flex flex-wrap gap-1">
                  {values.slice(0, 3).map((value) => (
                    <span key={value} className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700">
                      {value}
                    </span>
                  ))}
                  {values.length > 3 && <span className="px-1 py-1 text-xs text-slate-500">+{values.length - 3}</span>}
                </div>
              ),
            },
            {
              key: "created_at",
              label: "Created",
              sortable: true,
              render: (value: string) => new Date(value).toLocaleDateString(),
            },
          ]}
          data={attributes}
          isLoading={loading}
          searchFields={["name", "slug", "attribute_type", "values"]}
          onSearch={(query) => {
            setSearch(query);
            setPage(1);
          }}
          filterLabel="All columns"
          filterOptions={["All columns"]}
          searchPlaceholder="Search all attributes..."
          addAction={{ label: "Add Attribute", onClick: openCreate }}
          onRefresh={() => void load()}
          pagination={{ page, pageSize, total, onPageChange: setPage }}
          getRowLabel={(attribute) => attribute.name}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={(column, order) => {
            setSortBy(column);
            setSortOrder(order);
            setPage(1);
          }}
          actions={[
            { label: "Edit", onClick: openEdit },
            { label: "Delete", onClick: remove },
          ]}
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Attribute" : "Add Attribute"}</DialogTitle>
              <DialogDescription>Define a reusable product attribute and its available values.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <Input placeholder="Attribute name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              <Input placeholder="attribute-slug" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} />
              <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.attribute_type} onChange={(event) => setForm({ ...form, attribute_type: event.target.value })}>
                <option value="select">Select</option>
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
              </select>
              <Input placeholder="Values separated by commas, e.g. Red, Blue" value={form.valuesText} onChange={(event) => setForm({ ...form, valuesText: event.target.value })} />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => void save()}>{editing ? "Save Changes" : "Create Attribute"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
