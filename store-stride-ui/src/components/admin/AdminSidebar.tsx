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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
        roles: [
          "super_admin",
          "admin",
          "admin_catalog",
          "admin_orders",
          "admin_payments",
          "admin_customers",
          "admin_marketing",
          "admin_support",
          "seller_owner",
        ],
        badge: undefined,
      },
      {
        label: "Catalog",
        icon: Package,
        roles: ["super_admin", "admin_catalog", "seller_owner"],
        submenu: [
          {
            label: "Categories",
            href: "/admin/categories",
            roles: ["super_admin", "admin_catalog"],
          },
          { label: "Brands", href: "/admin/brands", roles: ["super_admin", "admin_catalog"] },
          {
            label: "Products",
            href: "/admin/products",
            roles: ["super_admin", "admin_catalog", "seller_owner"],
          },
          {
            label: "Attributes",
            href: "/admin/attributes",
            roles: ["super_admin", "admin_catalog"],
          },
        ],
      },
      {
        label: "Inventory",
        icon: Tag,
        roles: ["super_admin", "admin_catalog", "seller_owner"],
        submenu: [
          {
            label: "Inventory",
            href: "/admin/inventory",
            roles: ["super_admin", "admin_catalog", "seller_owner"],
          },
          {
            label: "Stock Adjustment",
            href: "/admin/inventory/adjust",
            roles: ["super_admin", "admin_catalog", "seller_owner"],
          },
          {
            label: "Low Stock",
            href: "/admin/inventory/low-stock",
            roles: ["super_admin", "admin_catalog", "seller_owner"],
          },
        ],
      },
      {
        label: "Orders",
        icon: ShoppingCart,
        roles: ["super_admin", "admin_orders", "admin_support", "seller_owner"],
        submenu: [
          {
            label: "Orders",
            href: "/admin/orders",
            roles: ["super_admin", "admin_orders", "seller_owner"],
          },
          {
            label: "Returns & Replacements",
            href: "/admin/returns",
            roles: ["super_admin", "admin_orders", "admin_support"],
          },
        ],
      },
      {
        label: "Customers",
        icon: Users,
        href: "/admin/customers",
        roles: ["super_admin", "admin_customers"],
      },
      {
        label: "Marketing",
        icon: Megaphone,
        roles: ["super_admin", "admin_marketing"],
        submenu: [
          { label: "Coupons", href: "/admin/coupons", roles: ["super_admin", "admin_marketing"] },
          { label: "Banners", href: "/admin/banners", roles: ["super_admin", "admin_marketing"] },
          {
            label: "Promotions",
            href: "/admin/promotions",
            roles: ["super_admin", "admin_marketing"],
          },
        ],
      },
      {
        label: "Reviews",
        icon: Star,
        href: "/admin/reviews",
        roles: ["super_admin"],
      },
      {
        label: "Policy",
        icon: FileText,
        href: "/admin/policy",
        roles: ["super_admin", "admin_support"],
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
    return allItems
      .filter((item) => {
        const userRoles = admin?.roles || [];
        return item.roles.some((role) => userRoles.includes(role));
      })
      .map((item) => ({
        ...item,
        submenu: item.submenu?.filter((subitem) => {
          const userRoles = admin?.roles || [];
          return subitem.roles.some((role) => userRoles.includes(role));
        }),
      }));
  };

  const menuItems = getVisibleMenuItems();

  const isActive = (href: string) => location.pathname === href;

  const NavItem = ({ item }: { item: ReturnType<typeof getVisibleMenuItems>[number] }) => {
    const submenuHasActiveRoute = Boolean(
      "submenu" in item && item.submenu?.some((subitem) => location.pathname === subitem.href),
    );
    const [expanded, setExpanded] = useState(submenuHasActiveRoute);
    const hasSubmenu = "submenu" in item && item.submenu && item.submenu.length > 0;

    if (!hasSubmenu || !("submenu" in item) || !item.submenu) {
      const href = ("href" in item ? item.href : "") || "";
      return (
        <Link
          to={href}
          className={cn(
            "flex items-center gap-3 px-3 py-2 text-[13px] font-medium transition-colors",
            isActive(href)
              ? "bg-blue-50 text-blue-700"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
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
            "flex items-center gap-3 px-3 py-2 text-[13px] font-medium transition-colors w-full",
            expanded || submenuHasActiveRoute
              ? "bg-blue-50 text-blue-700"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
          )}
        >
          <item.icon className="w-5 h-5 flex-shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
          <ChevronDown
            className={cn("w-4 h-4 transition-transform flex-shrink-0", expanded && "rotate-180")}
          />
        </button>
        {(expanded || submenuHasActiveRoute) && (
          <div className="ml-6 mt-1 space-y-0.5 border-l border-slate-200 pl-2">
            {item.submenu.map((subitem) => (
              <Link
                key={subitem.href}
                to={subitem.href}
                className={cn(
                  "block px-3 py-1.5 rounded text-[13px] transition-colors",
                  isActive(subitem.href)
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50",
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
        {isOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
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
          "fixed md:static inset-y-0 left-0 z-40 w-56 bg-white border-r border-slate-200 transition-transform md:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center border-b border-slate-200 px-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900">Store Admin</h1>
              <p className="text-[11px] text-slate-500">Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {menuItems.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}
        </nav>

        {/* User Info Section */}
        <div className="border-t border-slate-200 p-3 space-y-2">
          <div className="px-2 py-1">
            <p className="text-[11px] text-slate-500">Logged in as</p>
            <p className="text-xs font-semibold text-slate-800 truncate">{admin?.full_name}</p>
            <div className="mt-1 inline-flex items-center gap-1 px-2 py-1 bg-blue-50 rounded text-[11px] font-medium text-blue-700">
              {admin?.roles.includes("seller_owner") ? "🏪 Seller" : "👤 Admin"}
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start text-slate-600 transition-colors gap-2"
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
