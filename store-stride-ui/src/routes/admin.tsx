import { createFileRoute, Navigate, Outlet, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { hasAdminAccess, hydrated, isAuthenticated } = useAuth();
  const location = useLocation();
  const isLoginRoute = location.pathname === "/admin/login";

  if (isLoginRoute) {
    return <Outlet />;
  }

  // Session data is restored from browser storage after the initial SSR render.
  // Wait for it before applying access redirects so admin routes do not flash blank.
  if (!hydrated) {
    return <div className="min-h-screen bg-[#f6f8fb]" aria-busy="true" />;
  }

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
