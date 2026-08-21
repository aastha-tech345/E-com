import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { hasAdminAccess, isAuthenticated } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" />;
  }

  // Redirect to home if not admin or seller
  if (!hasAdminAccess()) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
