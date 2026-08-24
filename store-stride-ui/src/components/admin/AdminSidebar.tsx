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
  ChevronRight,
  Menu,
  X,
  Zap,
  FileText,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useShop } from "@/store/shop";

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { admin, adminLogout } = useShop();

  // Determine which menu items to show based on user role
  const getVisibleMenuItems = () => {
    const allItems = [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin",
        roles: ["super_admin", "admin", "admin_catalog", "admin_orders", "admin_payments", "admin_customers", "admin_marketing", "admin_support", "seller_owner"],
        badge: undefined,
      },
      {
        label: "Catalog",
        icon: Package,
        roles: ["super_admin", "admin_catalog", "seller_owner"],
        submenu: [
          { label: "Categories", href: "/admin/categories", roles: ["super_admin", "admin_catalog"] },
          { label: "Brands", href: "/admin/brands", roles: ["super_admin", "admin_catalog"] },
          { label: "Products", href: "/admin/products", roles: ["super_admin", "admin_catalog", "seller_owner"] },
          { label: "Add Product", href: "/admin/products/create", roles: ["super_admin", "admin_catalog", "seller_owner"] },
          { label: "Attributes", href: "/admin/attributes", roles: ["super_admin", "admin_catalog"] },
        ],
      },
      {
        label: "Inventory",
        icon: Tag,
        roles: ["super_admin", "admin_catalog", "seller_owner"],
        submenu: [
          { label: "Inventory", href: "/admin/inventory", roles: ["super_admin", "admin_catalog", "seller_owner"] },
          { label: "Stock Adjustment", href: "/admin/inventory/adjust", roles: ["super_admin", "admin_catalog", "seller_owner"] },
          { label: "Low Stock", href: "/admin/inventory/low-stock", roles: ["super_admin", "admin_catalog", "seller_owner"] },
        ],
      },
      {
        label: "Orders",
        icon: ShoppingCart,
        roles: ["super_admin", "admin_orders", "seller_owner"],
        submenu: [
          { label: "All Orders", href: "/admin/orders", roles: ["super_admin", "admin_orders", "seller_owner"] },
          { label: "Pending", href: "/admin/orders?status=pending", roles: ["super_admin", "admin_orders", "seller_owner"] },
          { label: "Processing", href: "/admin/orders?status=processing", roles: ["super_admin", "admin_orders", "seller_owner"] },
          { label: "Shipped", href: "/admin/orders?status=shipped", roles: ["super_admin", "admin_orders", "seller_owner"] },
          { label: "Delivered", href: "/admin/orders?status=delivered", roles: ["super_admin", "admin_orders", "seller_owner"] },
        ],
      },
      {
        label: "Customers",
        icon: Users,
        roles: ["super_admin", "admin_customers"],
        submenu: [
          { label: "All Customers", href: "/admin/customers", roles: ["super_admin", "admin_customers"] },
          { label: "Customer Details", href: "/admin/customers/:id", roles: ["super_admin", "admin_customers"] },
        ],
      },
      {
        label: "Marketing",
        icon: Megaphone,
        roles: ["super_admin", "admin_marketing"],
        submenu: [
          { label: "Coupons", href: "/admin/coupons", roles: ["super_admin", "admin_marketing"] },
          { label: "Banners", href: "/admin/banners", roles: ["super_admin", "admin_marketing"] },
          { label: "Promotions", href: "/admin/promotions", roles: ["super_admin", "admin_marketing"] },
        ],
      },
      {
        label: "Reviews",
        icon: Star,
        href: "/admin/reviews",
        roles: ["super_admin"],
      },
      {
        label: "Settings",
        icon: Settings,
        roles: ["super_admin"],
        submenu: [
          { label: "General", href: "/admin/settings", roles: ["super_admin"] },
          { label: "Store Settings", href: "/admin/settings/store", roles: ["super_admin"] },
          { label: "Admin Profile", href: "/admin/profile", roles: ["super_admin"] },
        ],
      },
    ];

    // Filter items based on user roles
    return allItems.filter(item => {
      const userRoles = admin?.roles || [];
      return item.roles.some(role => userRoles.includes(role));
    }).map(item => ({
      ...item,
      submenu: item.submenu?.filter(subitem => {
        const userRoles = admin?.roles || [];
        return subitem.roles.some(role => userRoles.includes(role));
      }),
    }));
  };

  const menuItems = getVisibleMenuItems();

  const isActive = (href: string) => location.pathname === href;

  const NavItem = ({
    item,
  }: {
    item: ReturnType<typeof getVisibleMenuItems>[number];
  }) => {
    const [expanded, setExpanded] = useState(false);
    const hasSubmenu = "submenu" in item && item.submenu && item.submenu.length > 0;

    if (!hasSubmenu || !("submenu" in item) || !item.submenu) {
      const href = "href" in item ? item.href : "";
      return (
        <Link
          to={href}
          className={cn(
            "flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
            isActive(href)
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-500/10"
              : "text-gray-300 hover:bg-gray-700/50 hover:text-gray-100"
          )}
        >
          <item.icon className="w-5 h-5 flex-shrink-0" />
          <span className="flex-1">{item.label}</span>
        </Link>
      );
    }

    return (
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className={cn(
            "flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 w-full",
            expanded 
              ? "bg-gray-700/50 text-gray-100" 
              : "text-gray-300 hover:bg-gray-700/50 hover:text-gray-100"
          )}
        >
          <item.icon className="w-5 h-5 flex-shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform flex-shrink-0",
              expanded && "rotate-180"
            )}
          />
        </button>
        {expanded && (
          <div className="ml-4 mt-1 space-y-1 pl-2 border-l border-gray-700">
            {item.submenu.map((subitem) => (
              <Link
                key={subitem.href}
                to={subitem.href}
                className={cn(
                  "block px-3 py-2 rounded text-sm transition-all duration-200",
                  isActive(subitem.href)
                    ? "bg-blue-600/20 text-blue-400 font-medium border border-blue-500/30"
                    : "text-gray-400 hover:text-gray-100 hover:bg-gray-700/30"
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
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
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
          "fixed md:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700 transition-transform md:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">📦</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Store Admin</h1>
              <p className="text-xs text-gray-400">Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}
        </nav>

        {/* User Info Section */}
        <div className="border-t border-gray-700 p-4 space-y-3">
          <div className="px-3 py-2 rounded-lg bg-gray-800/50">
            <p className="text-xs text-gray-400">Logged in as</p>
            <p className="text-sm font-semibold text-white truncate">{admin?.full_name}</p>
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 rounded text-xs font-medium text-blue-300 border border-blue-500/30">
              {admin?.roles.includes("seller_owner") ? "🏪 Seller" : "👤 Admin"}
            </div>
          </div>
          <Button
            className="w-full justify-start bg-gray-700 hover:bg-gray-600 text-gray-100 border border-gray-600 transition-colors gap-2"
            onClick={() => {
              adminLogout();
              window.location.href = "/admin/login";
            }}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
}
