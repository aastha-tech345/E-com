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
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { useShop } from "@/store/shop";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { admin } = useShop();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalCustomers: 0,
    totalOrders: 0,
    revenue: 0,
  });

  useEffect(() => {
    // TODO: Fetch stats from backend API
    setStats({
      totalProducts: 150,
      totalCategories: 8,
      totalCustomers: 1250,
      totalOrders: 3450,
      revenue: 2500000,
    });
  }, []);

  if (!admin) {
    return null;
  }

  const isSeller = admin.roles.includes("seller_owner");

  const revenueData = [
    { month: "Jan", revenue: 180000, target: 200000 },
    { month: "Feb", revenue: 220000, target: 200000 },
    { month: "Mar", revenue: 200000, target: 200000 },
    { month: "Apr", revenue: 270000, target: 250000 },
    { month: "May", revenue: 250000, target: 250000 },
    { month: "Jun", revenue: 290000, target: 300000 },
  ];

  const ordersData = [
    { month: "Jan", orders: 240, completed: 220 },
    { month: "Feb", orders: 290, completed: 275 },
    { month: "Mar", orders: 200, completed: 185 },
    { month: "Apr", orders: 320, completed: 310 },
    { month: "May", orders: 280, completed: 265 },
    { month: "Jun", orders: 350, completed: 340 },
  ];

  const categoryData = [
    { name: "Electronics", value: 35 },
    { name: "Fashion", value: 25 },
    { name: "Home", value: 20 },
    { name: "Others", value: 20 },
  ];

  const COLORS = ["#3b82f6", "#ec4899", "#f59e0b", "#10b981"];

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    change,
    positive,
  }: {
    title: string;
    value: number | string;
    icon: LucideIcon;
    color: string;
    change?: number;
    positive?: boolean;
  }) => (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-gray-600 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold mt-3 text-gray-900">
              {typeof value === "number" && value > 1000 ? (value / 1000).toFixed(1) + "K" : value}
            </p>
            {change && (
              <div className="mt-3 flex items-center gap-1">
                {positive ? (
                  <ArrowUpRight className="w-4 h-4 text-green-600" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                )}
                <span
                  className={
                    positive
                      ? "text-green-600 text-sm font-medium"
                      : "text-red-600 text-sm font-medium"
                  }
                >
                  {change}% from last month
                </span>
              </div>
            )}
          </div>
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: color + "15" }}
          >
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
          <div className="px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {isSeller ? "🏪 Seller Hub" : "📊 Dashboard"}
                </h1>
                <p className="text-gray-400 text-sm mt-2">
                  Welcome back, <span className="text-blue-400">{admin.full_name}</span>
                  {isSeller && <span className="text-amber-400 ml-2">(Seller)</span>}
                </p>
              </div>
              <div className="flex gap-3">
                <Button className="bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 gap-2">
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

        {/* Content */}
        <div className="p-8">
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
            <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Revenue Trend</h2>
                  <p className="text-gray-400 text-sm mt-1">Last 6 months performance</p>
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#f3f4f6" }}
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
            <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Order Stats</h2>
                  <p className="text-gray-400 text-sm mt-1">Total vs Completed orders</p>
                </div>
                <div className="text-3xl">📊</div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ordersData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#f3f4f6" }}
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
            <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Sales by Category</h2>
                  <p className="text-gray-400 text-sm mt-1">Category distribution</p>
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
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "#f3f4f6" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Orders */}
            <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">Recent Orders</h2>
                  <p className="text-gray-400 text-sm mt-1">Latest transactions</p>
                </div>
                <div className="text-3xl">🛒</div>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((order) => (
                  <div
                    key={order}
                    className="flex justify-between items-center p-4 bg-gray-700/50 border border-gray-600 rounded-lg hover:bg-gray-700 transition"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-white">Order #{1000 + order}</p>
                      <p className="text-gray-400 text-sm">
                        Customer Name • {new Date().toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">
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
      </main>
    </div>
  );
}
