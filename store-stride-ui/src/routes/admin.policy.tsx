import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MoreVertical, Pencil, Trash2, Upload } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { policyService, type PolicyDocument } from "@/services";
import { useShop } from "@/store/shop";

export const Route = createFileRoute("/admin/policy")({ component: PolicyPage });

function PolicyPage() {
  const { admin } = useShop();
  const [policies, setPolicies] = useState<PolicyDocument[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

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
    if (!file) {
      toast.error("Choose a .txt or .md policy file first.");
      return;
    }
    setUploading(true);
    try {
      const result = await policyService.upload(file, name);
      toast.success(`${result.title} indexed into ${result.chunks} vector chunks.`);
      setFile(null);
      setName("");
      setOpen(false);
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Policy upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout
      title="Policy knowledge base"
      description="Upload policies for Hugging Face vector search."
    >
      <div className="w-full space-y-5">
        <div className="flex items-center justify-between border-b pb-5">
          <div>
            <h1 className="text-xl font-bold">Policies</h1>
            <p className="text-sm text-slate-500">Manage searchable policy documents.</p>
          </div>
          <Button onClick={() => setOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload policy
          </Button>
        </div>
        <DataTable
          columns={[
            { key: "title", label: "Policy name" },
            {
              key: "created_at",
              label: "Created",
              render: (value: string) => new Date(value).toLocaleDateString(),
            },
          ]}
          data={policies}
          searchFields={["title"]}
          emptyMessage="No policies have been indexed yet."
          rowActions={(policy) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Pencil /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash2 /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload policy</DialogTitle>
              <DialogDescription>
                Add a policy name and a UTF-8 text or Markdown document.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Policy name"
              />
              <Input
                type="file"
                accept=".txt,.md,text/plain,text/markdown"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={upload} disabled={!name || !file || uploading}>
                {uploading ? "Embedding..." : "Upload & index"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
