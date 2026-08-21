import { createFileRoute } from "@tanstack/react-router";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useShop } from "@/store/shop";

export const Route = createFileRoute("/admin/banners")({
  component: AdminBanners,
});

function AdminBanners() {
  const { admin } = useShop();

  if (!admin) return null;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-4">
            <h1 className="text-2xl font-bold">Banner Management</h1>
          </div>
        </div>

        <div className="p-8">
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">Banner management module coming soon</p>
          </div>
        </div>
      </main>
    </div>
  );
}
