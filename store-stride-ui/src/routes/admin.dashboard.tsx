import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Package, ShoppingCart, Tags, TrendingUp, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/DataTable";
import { StatsCard } from "@/components/admin/StatsCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { analyticsService, catalogService, productService, type AnalyticsSummary } from "@/services";
import { useShop } from "@/store/shop";
import type { Product } from "@/types";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const { admin } = useShop();
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryCount, setCategoryCount] = useState(0);
  const [brandCount, setBrandCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const [analytics, productRows, categories, brands] = await Promise.all([
          analyticsService.summary().catch(() => null),
          productService.adminList().catch(() => []),
          catalogService.categories().catch(() => []),
          catalogService.brands().catch(() => []),
        ]);

        setSummary(analytics);
        setProducts(productRows);
        setCategoryCount(categories.length);
        setBrandCount(brands.length);
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  const stats = useMemo(
    () => ({
      products: summary?.total_products ?? products.length,
      categories: categoryCount,
      brands: brandCount,
      customers: summary?.total_customers ?? 0,
      orders: summary?.total_orders ?? 0,
      revenue: Number(summary?.total_revenue ?? 0),
    }),
    [brandCount, categoryCount, products.length, summary],
  );

  const recentProducts = products.slice(0, 8);
  const lowStockProducts = products.filter((product) => product.stock <= product.minStock).slice(0, 6);

  if (!admin) return null;

  return (
    <AdminLayout title="Dashboard" description={`Welcome back, ${admin.full_name}`}>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatsCard title="Products" value={stats.products} icon={Package} />
          <StatsCard title="Categories" value={stats.categories} icon={Tags} />
          <StatsCard title="Brands" value={stats.brands} icon={Tags} />
          <StatsCard title="Customers" value={stats.customers} icon={Users} />
          <StatsCard title="Orders" value={stats.orders} icon={ShoppingCart} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Recent Products</h2>
                <p className="text-sm text-muted-foreground">
                  Latest products loaded from the admin catalog API
                </p>
              </div>
              <Button onClick={() => navigate({ to: "/admin/products/create" })}>
                Add Product
              </Button>
            </div>

            <DataTable
              columns={[
                {
                  key: "name",
                  label: "Product",
                  render: (_value, product) => (
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0] || "/placeholder.svg"}
                        alt=""
                        className="h-10 w-10 rounded object-cover bg-gray-100"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sku}</p>
                      </div>
                    </div>
                  ),
                },
                { key: "category", label: "Category" },
                {
                  key: "price",
                  label: "Price",
                  render: (value) => `₹${Number(value).toLocaleString("en-IN")}`,
                },
                { key: "stock", label: "Stock" },
                {
                  key: "status",
                  label: "Status",
                  render: (value) => <StatusBadge status={String(value)} />,
                },
              ]}
              data={recentProducts}
              isLoading={loading}
              emptyMessage="No products found"
              searchFields={["name", "sku", "category", "brand"]}
            />
          </div>

          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">₹{stats.revenue.toLocaleString("en-IN")}</p>
                <p className="mt-2 text-sm text-muted-foreground">Total paid revenue from orders</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Catalog Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Published</span>
                  <span className="font-medium">
                    {products.filter((product) => product.status === "active").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Draft</span>
                  <span className="font-medium">
                    {products.filter((product) => product.status === "draft").length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Low stock</span>
                  <span className="font-medium">{lowStockProducts.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Low Stock</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {lowStockProducts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No low-stock products.</p>
                ) : (
                  lowStockProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sku}</p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold">{product.stock}</span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </AdminLayout>
  );
}
