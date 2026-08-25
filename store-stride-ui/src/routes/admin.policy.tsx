import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/admin/DataTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { policyService, type PolicyDocument } from "@/services";
import { useShop } from "@/store/shop";

export const Route = createFileRoute("/admin/policy")({ component: PolicyPage });

function PolicyPage() {
  const { admin } = useShop();
  const [policies, setPolicies] = useState<PolicyDocument[]>([]);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [replacementFile, setReplacementFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState<PolicyDocument | null>(null);
  const [search, setSearch] = useState("");
  const [filterField, setFilterField] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const load = async () => {
    try {
      setPolicies(await policyService.list());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load policies.");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  if (!admin) return null;

  const upload = async () => {
    if (uploadFiles.length === 0) {
      toast.error("Choose one or more .txt or .md policy files first.");
      return;
    }
    setUploading(true);
    try {
      let indexedChunks = 0;
      for (const selectedFile of uploadFiles) {
        const uploadName = uploadFiles.length === 1 ? name : "";
        const result = await policyService.upload(selectedFile, uploadName, description);
        indexedChunks += result.chunks;
      }
      toast.success(`${uploadFiles.length} policy file${uploadFiles.length === 1 ? "" : "s"} indexed into ${indexedChunks} vector chunks.`);
      setUploadFiles([]);
      setName("");
      setDescription("");
      setOpen(false);
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Policy upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const updatePolicy = async () => {
    if (!editing || !name.trim()) return;
    try {
      if (replacementFile) {
        const result = await policyService.replaceFile(editing.id, replacementFile, name, description);
        toast.success(`${result.title} re-indexed into ${result.chunks} vector chunks.`);
      } else {
        await policyService.rename(editing.id, name, description);
        toast.success("Policy updated.");
      }
      setEditing(null);
      setName("");
      setDescription("");
      setReplacementFile(null);
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed.");
    }
  };

  const remove = async (policy: PolicyDocument) => {
    try {
      await policyService.delete(policy.id);
      await load();
      toast.success("Policy deleted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed.");
    }
  };

  const filteredPolicies = policies.filter((policy) =>
    (filterField === "all" ? `${policy.title} ${policy.description}` : String(policy[filterField as keyof PolicyDocument] ?? ""))
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const pagedPolicies = filteredPolicies.slice((page - 1) * pageSize, page * pageSize);

  return (
    <AdminLayout>
      <div className="w-full space-y-5">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-bold text-slate-900">Policies</h1>
          <p className="mt-1 text-sm text-slate-600">Manage searchable policy documents.</p>
        </div>
        <DataTable
          columns={[
            { key: "title", label: "Policy name" },
            {
              key: "description",
              label: "Description",
              render: (value: string) => <span className="line-clamp-1 text-slate-600">{value || "-"}</span>,
            },
            {
              key: "created_at",
              label: "Created",
              render: (value: string) => new Date(value).toLocaleDateString(),
            },
          ]}
          data={pagedPolicies}
          searchFields={["title", "description"]}
          fieldSearchPlaceholder={`Filter by ${filterField === "all" ? "policy" : filterField}...`}
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
          filterOptions={[{ label: "All columns", value: "all" }, { label: "Document name", value: "title" }, { label: "Description", value: "description" }, { label: "Created", value: "created_at" }]}
          searchPlaceholder="Search all policies..."
          addAction={{
            label: "Upload policy",
            onClick: () => {
              setName("");
              setDescription("");
              setUploadFiles([]);
              setOpen(true);
            },
          }}
          onRefresh={() => void load()}
          pagination={{ page, pageSize, total: filteredPolicies.length, onPageChange: setPage }}
          getRowLabel={(policy) => policy.title}
          emptyMessage="No policies have been indexed yet."
          actions={[
            {
              label: "Edit",
              onClick: (policy) => {
                setEditing(policy);
                setName(policy.title);
                setDescription(policy.description || "");
                setReplacementFile(null);
              },
            },
            { label: "Delete", onClick: (policy) => void remove(policy) },
          ]}
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload policy</DialogTitle>
              <DialogDescription>
                Add one or more UTF-8 text or Markdown policy documents.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Policy name, used when uploading one file"
              />
              <textarea className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Document description" />
              <Input
                type="file"
                multiple
                accept=".txt,.md,text/plain,text/markdown"
                onChange={(event) => setUploadFiles(Array.from(event.target.files ?? []))}
              />
              {uploadFiles.length > 0 ? (
                <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  {uploadFiles.map((selectedFile) => selectedFile.name).join(", ")}
                </div>
              ) : null}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={upload} disabled={uploadFiles.length === 0 || uploading}>
                {uploading ? "Embedding..." : "Upload & index"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog
          open={Boolean(editing)}
          onOpenChange={(value) => {
            if (!value) {
              setEditing(null);
              setName("");
              setDescription("");
              setReplacementFile(null);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit policy</DialogTitle>
              <DialogDescription>Update the policy name shown in the table.</DialogDescription>
            </DialogHeader>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Policy name"
            />
            <textarea className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Document description" />
            <Input
              type="file"
              accept=".txt,.md,text/plain,text/markdown"
              onChange={(event) => setReplacementFile(event.target.files?.[0] ?? null)}
            />
            <p className="text-xs text-slate-500">Choose a file to replace and re-index this policy, or leave it empty to rename only.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button onClick={() => void updatePolicy()}>{replacementFile ? "Replace & index" : "Save changes"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
