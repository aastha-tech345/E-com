import { useState } from "react";
import { useLocation } from "@tanstack/react-router";
import {
  Bell,
  Search,
  Menu,
  ChevronDown,
  LogOut,
  Settings as SettingsIcon,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { useShop } from "@/store/shop";

interface AdminHeaderProps {
  title?: string;
  description?: string;
}

const routeTitles: Record<string, { title: string; breadcrumbs: Array<{ label: string; href?: string }> }> = {
  "/admin": { title: "Dashboard", breadcrumbs: [{ label: "Admin" }, { label: "Dashboard" }] },
  "/admin/products": { title: "Products", breadcrumbs: [{ label: "Admin" }, { label: "Catalog", href: "#" }, { label: "Products" }] },
  "/admin/products/create": { title: "Add Product", breadcrumbs: [{ label: "Admin" }, { label: "Catalog", href: "#" }, { label: "Products", href: "/admin/products" }, { label: "Add Product" }] },
  "/admin/categories": { title: "Categories", breadcrumbs: [{ label: "Admin" }, { label: "Catalog", href: "#" }, { label: "Categories" }] },
  "/admin/brands": { title: "Brands", breadcrumbs: [{ label: "Admin" }, { label: "Catalog", href: "#" }, { label: "Brands" }] },
  "/admin/attributes": { title: "Attributes", breadcrumbs: [{ label: "Admin" }, { label: "Catalog", href: "#" }, { label: "Attributes" }] },
  "/admin/inventory": { title: "Inventory", breadcrumbs: [{ label: "Admin" }, { label: "Inventory" }] },
  "/admin/orders": { title: "Orders", breadcrumbs: [{ label: "Admin" }, { label: "Orders" }] },
  "/admin/customers": { title: "Customers", breadcrumbs: [{ label: "Admin" }, { label: "Customers" }] },
  "/admin/coupons": { title: "Coupons", breadcrumbs: [{ label: "Admin" }, { label: "Marketing", href: "#" }, { label: "Coupons" }] },
  "/admin/promotions": { title: "Promotions", breadcrumbs: [{ label: "Admin" }, { label: "Marketing", href: "#" }, { label: "Promotions" }] },
  "/admin/settings": { title: "Settings", breadcrumbs: [{ label: "Admin" }, { label: "Settings" }] },
};

export function AdminHeader({ title, description }: AdminHeaderProps) {
  const location = useLocation();
  const { admin, adminLogout } = useShop();
  const [searchOpen, setSearchOpen] = useState(false);

  const currentRoute = routeTitles[location.pathname] || {
    title: title || "Page",
    breadcrumbs: [{ label: "Admin" }, { label: title || "Page" }],
  };

  const displayTitle = title || currentRoute.title;
  const breadcrumbs = currentRoute.breadcrumbs;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-16 px-6 md:px-8 gap-4">
        {/* Left: Breadcrumb & Title */}
        <div className="flex-1 min-w-0">
          <Breadcrumb className="hidden md:flex mb-1">
            <BreadcrumbList>
              {breadcrumbs.map((crumb, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  {idx > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {crumb.href ? (
                      <BreadcrumbLink href={crumb.href} className="text-xs">
                        {crumb.label}
                      </BreadcrumbLink>
                    ) : (
                      <span className="text-xs font-medium">{crumb.label}</span>
                    )}
                  </BreadcrumbItem>
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-lg md:text-2xl font-bold text-foreground truncate">
            {displayTitle}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-1 hidden md:block truncate">
              {description}
            </p>
          )}
        </div>

        {/* Right: Search, Notifications, Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search */}
          <div className={cn(
            "hidden md:flex items-center gap-2 transition-all",
            searchOpen ? "w-48" : "w-auto"
          )}>
            {searchOpen ? (
              <Input
                placeholder="Search..."
                className="h-9 px-3 text-sm"
                autoFocus
                onBlur={() => setSearchOpen(false)}
              />
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 relative"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 h-9 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-xs font-semibold">
                    {admin?.full_name
                      ?.split(" ")
                      .map(n => n[0])
                      .join("")
                      .toUpperCase() || "AD"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start text-xs">
                  <span className="font-medium">{admin?.full_name || "Admin"}</span>
                  <span className="text-muted-foreground capitalize">
                    {admin?.roles[0]?.replace(/_/g, " ") || "Admin"}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 ml-1 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col gap-1">
                <span className="font-semibold">{admin?.full_name || "Admin"}</span>
                <span className="text-xs text-muted-foreground font-normal">
                  {admin?.email || "admin@example.com"}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <SettingsIcon className="h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                onClick={() => {
                  adminLogout();
                  window.location.href = "/admin/login";
                }}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
