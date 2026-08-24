import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  Package,
  Users,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
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
    <AdminLayout>
      <div className="space-y-6">
        <div className="border-b border-slate-200 pb-5">
          <div>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {isSeller ? "🏪 Seller Hub" : "📊 Dashboard"}
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Welcome back, <span className="text-blue-600">{admin.full_name}</span>
                  {isSeller && <span className="text-amber-600 ml-2">(Seller)</span>}
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                  <Download className="w-4 h-4" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div>
          {isSeller ? (
            // Seller-specific dashboard
            <>
              {/* Alert Banner */}
              <div className="mb-8 p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">📈</div>
                  <div>
                    <h3 className="font-semibold text-amber-100">Sales Tip</h3>
                    <p className="text-amber-100/80 text-sm mt-1">
                      Your shop is performing great! Consider adding seasonal items to boost sales
                      further.
                    </p>
                  </div>
                </div>
              </div>

              {/* Seller Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="My Products"
                  value={stats.totalProducts}
                  icon={Package}
                  color="#3b82f6"
                  change={12}
                  positive={true}
                />
                <StatCard
                  title="Total Orders"
                  value={stats.totalOrders}
                  icon={ShoppingCart}
                  color="#f59e0b"
                  change={8}
                  positive={true}
                />
                <StatCard
                  title="Total Customers"
                  value={stats.totalCustomers}
                  icon={Users}
                  color="#ec4899"
                  change={-3}
                  positive={false}
                />
                <StatCard
                  title="Revenue"
                  value={"₹" + (stats.revenue / 100000).toFixed(1) + "L"}
                  icon={TrendingUp}
                  color="#10b981"
                  change={15}
                  positive={true}
                />
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <button className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-6 rounded-lg transition-all transform hover:scale-105 shadow-lg">
                  <div className="text-2xl mb-2">➕</div>
                  <h3 className="font-semibold">Add New Product</h3>
                  <p className="text-sm text-blue-100 mt-1">List your products</p>
                </button>
                <button className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-6 rounded-lg transition-all transform hover:scale-105 shadow-lg">
                  <div className="text-2xl mb-2">📦</div>
                  <h3 className="font-semibold">Manage Inventory</h3>
                  <p className="text-sm text-purple-100 mt-1">Track stock levels</p>
                </button>
                <button className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-6 rounded-lg transition-all transform hover:scale-105 shadow-lg">
                  <div className="text-2xl mb-2">📊</div>
                  <h3 className="font-semibold">View Analytics</h3>
                  <p className="text-sm text-green-100 mt-1">Performance metrics</p>
                </button>
              </div>
            </>
          ) : (
            // Admin-specific dashboard
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Total Products"
                  value={stats.totalProducts}
                  icon={Package}
                  color="#3b82f6"
                  change={5}
                  positive={true}
                />
                <StatCard
                  title="Categories"
                  value={stats.totalCategories}
                  icon={Package}
                  color="#10b981"
                  change={0}
                  positive={true}
                />
                <StatCard
                  title="Total Customers"
                  value={stats.totalCustomers}
                  icon={Users}
                  color="#f59e0b"
                  change={18}
                  positive={true}
                />
                <StatCard
                  title="Total Orders"
                  value={stats.totalOrders}
                  icon={ShoppingCart}
                  color="#ec4899"
                  change={22}
                  positive={true}
                />
              </div>
            </>
          )}

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Revenue Trend</h2>
                  <p className="text-slate-500 text-sm mt-1">Last 6 months performance</p>
                </div>
                <div className="text-3xl">📈</div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#0f172a" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Orders Chart */}
            <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Order Stats</h2>
                  <p className="text-slate-500 text-sm mt-1">Total vs Completed orders</p>
                </div>
                <div className="text-3xl">📊</div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ordersData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#0f172a" }}
                  />
                  <Legend />
                  <Bar dataKey="orders" fill="#3b82f6" name="Total Orders" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="completed" fill="#10b981" name="Completed" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Section - Sales & Top Items */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales by Category */}
            <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Sales by Category</h2>
                  <p className="text-slate-500 text-sm mt-1">Category distribution</p>
                </div>
                <div className="text-3xl">🎯</div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#0f172a" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Orders */}
            <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
                  <p className="text-slate-500 text-sm mt-1">Latest transactions</p>
                </div>
                <div className="text-3xl">🛒</div>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((order) => (
                  <div
                    key={order}
                    className="flex justify-between items-center p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">Order #{1000 + order}</p>
                      <p className="text-slate-500 text-sm">
                        Customer Name • {new Date().toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">
                        ₹{(5999 + order * 1000).toLocaleString()}
                      </p>
                      <span className="inline-block px-3 py-1 mt-2 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                        ✓ Delivered
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
