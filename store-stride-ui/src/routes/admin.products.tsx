import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/products")({
  component: AdminProductsLayout,
});

// Product list, creation, and edit screens are nested routes.
function AdminProductsLayout() {
  return <Outlet />;
}
