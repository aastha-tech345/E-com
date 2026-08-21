import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useShop } from "@/store/shop";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { admin } = useShop();

  // Redirect to login if not authenticated
  if (!admin) {
    return <Navigate to="/admin/login" />;
  }

  return <Outlet />;
}
