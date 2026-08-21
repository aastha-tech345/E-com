import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingCart,
  Users,
  Megaphone,
  Star,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useShop } from "@/store/shop";

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { adminLogout } = useShop();

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
      badge: undefined,
    },
    {
      label: "Catalog",
      icon: Package,
      submenu: [
        { label: "Categories", href: "/admin/categories" },
        { label: "Brands", href: "/admin/brands" },
        { label: "Products", href: "/admin/products" },
        { label: "Add Product", href: "/admin/products/create" },
        { label: "Attributes", href: "/admin/attributes" },
      ],
    },
    {
      label: "Inventory",
      icon: Tag,
      submenu: [
        { label: "Inventory", href: "/admin/inventory" },
        { label: "Stock Adjustment", href: "/admin/inventory/adjust" },
        { label: "Low Stock", href: "/admin/inventory/low-stock" },
      ],
    },
    {
      label: "Orders",
      icon: ShoppingCart,
      submenu: [
        { label: "All Orders", href: "/admin/orders" },
        { label: "Pending", href: "/admin/orders?status=pending" },
        { label: "Processing", href: "/admin/orders?status=processing" },
        { label: "Shipped", href: "/admin/orders?status=shipped" },
        { label: "Delivered", href: "/admin/orders?status=delivered" },
      ],
    },
    {
      label: "Customers",
      icon: Users,
      submenu: [
        { label: "All Customers", href: "/admin/customers" },
        { label: "Customer Details", href: "/admin/customers/:id" },
      ],
    },
    {
      label: "Marketing",
      icon: Megaphone,
      submenu: [
        { label: "Coupons", href: "/admin/coupons" },
        { label: "Banners", href: "/admin/banners" },
        { label: "Promotions", href: "/admin/promotions" },
      ],
    },
    {
      label: "Reviews",
      icon: Star,
      href: "/admin/reviews",
    },
    {
      label: "Settings",
      icon: Settings,
      submenu: [
        { label: "General", href: "/admin/settings" },
        { label: "Store Settings", href: "/admin/settings/store" },
        { label: "Admin Profile", href: "/admin/profile" },
      ],
    },
  ];

  const isActive = (href: string) => location.pathname === href;

  const NavItem = ({
    item,
  }: {
    item: (typeof menuItems)[number];
  }) => {
    const [expanded, setExpanded] = useState(false);
    const hasSubmenu = "submenu" in item;

    if (!hasSubmenu) {
      return (
        <Link
          to={item.href!}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
            isActive(item.href!)
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          )}
        >
          <item.icon className="w-5 h-5" />
          <span>{item.label}</span>
        </Link>
      );
    }

    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full",
            "text-gray-700 hover:bg-gray-100"
          )}
        >
          <item.icon className="w-5 h-5" />
          <span className="flex-1 text-left">{item.label}</span>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform",
              expanded && "rotate-180"
            )}
          />
        </button>
        {expanded && (
          <div className="ml-4 mt-2 space-y-1">
            {item.submenu.map((subitem) => (
              <Link
                key={subitem.href}
                to={subitem.href}
                className={cn(
                  "block px-4 py-2 rounded text-sm transition-colors",
                  isActive(subitem.href)
                    ? "bg-blue-100 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {subitem.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar Overlay Mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Store Admin</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              adminLogout();
              window.location.href = "/admin/login";
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
}
