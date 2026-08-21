import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Image,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShop } from "@/store/shop";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const { admin, adminLogout } = useShop();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  if (!admin) {
    return null;
  }

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      label: "Catalog",
      icon: Package,
      submenu: [
        { label: "Products", path: "/admin/products" },
        { label: "Add Product", path: "/admin/products/create" },
        { label: "Categories", path: "/admin/categories" },
        { label: "Subcategories", path: "/admin/subcategories" },
        { label: "Brands", path: "/admin/brands" },
        { label: "Attributes", path: "/admin/product-attributes" },
      ],
    },
    {
      label: "Inventory",
      icon: Package,
      submenu: [
        { label: "Stock", path: "/admin/inventory" },
        { label: "Low Stock", path: "/admin/inventory?filter=low" },
      ],
    },
    {
      label: "Orders",
      icon: ShoppingCart,
      path: "/admin/orders",
    },
    {
      label: "Customers",
      icon: Users,
      path: "/admin/customers",
    },
    {
      label: "Marketing",
      icon: Tag,
      submenu: [
        { label: "Coupons", path: "/admin/coupons" },
        { label: "Banners", path: "/admin/banners" },
        { label: "Reviews", path: "/admin/reviews" },
      ],
    },
    {
      label: "Users",
      icon: Users,
      submenu: [
        { label: "Admin Users", path: "/admin/admin-users" },
        { label: "Roles & Permissions", path: "/admin/admin-users" },
      ],
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/admin/settings",
    },
  ];

  const toggleMenu = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label);
  };

  const handleLogout = () => {
    adminLogout();
    navigate({ to: "/admin/login" });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-slate-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <h1 className="text-xl font-bold">Shop Admin</h1>
              <p className="text-xs text-slate-400">Management Portal</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hover:bg-slate-800 p-2 rounded-lg transition"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item, idx) => (
            <div key={idx}>
              {item.submenu ? (
                <button
                  onClick={() => toggleMenu(item.label)}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-800 transition group"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 group-hover:text-blue-400" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </div>
                  {sidebarOpen && (
                    <ChevronDown
                      className={`w-4 h-4 transition ${
                        expandedMenu === item.label ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>
              ) : (
                <button
                  onClick={() => navigate({ to: item.path! })}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition group"
                >
                  <item.icon className="w-5 h-5 group-hover:text-blue-400" />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              )}

              {/* Submenu */}
              {item.submenu && expandedMenu === item.label && sidebarOpen && (
                <div className="ml-4 mt-2 space-y-1 border-l border-slate-700 pl-4">
                  {item.submenu.map((subitem, subIdx) => (
                    <button
                      key={subIdx}
                      onClick={() => navigate({ to: subitem.path })}
                      className="w-full text-left text-sm p-2 rounded hover:bg-slate-800 transition text-slate-300 hover:text-white"
                    >
                      {subitem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-700 space-y-2">
          {sidebarOpen && (
            <div className="p-2 bg-slate-800 rounded-lg text-sm">
              <p className="font-medium">{admin.name}</p>
              <p className="text-xs text-slate-400">{admin.role}</p>
            </div>
          )}
          <Button
            variant="outline"
            className="w-full text-slate-300 hover:text-white"
            onClick={handleLogout}
            size="sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {sidebarOpen && "Logout"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Admin Dashboard</h2>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
