import { Bell, ChevronDown, LogOut, Monitor, Moon, Settings as SettingsIcon, Sun, User } from "lucide-react";
import { useEffect, useState } from "react";
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
import { cn } from "@/lib/utils";
import { useShop } from "@/store/shop";

export function AdminHeader() {
  const { admin, adminLogout } = useShop();
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");

  useEffect(() => {
    const savedTheme = (localStorage.getItem("app-theme") as "light" | "dark" | "system" | null) ?? "light";
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (nextTheme: "light" | "dark" | "system") => {
    const dark = nextTheme === "dark" || (nextTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
  };

  const changeTheme = (nextTheme: "light" | "dark" | "system") => {
    setTheme(nextTheme);
    localStorage.setItem("app-theme", nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="flex h-14 items-center justify-end px-4 md:px-6">
        {/* Right: Search, Notifications, Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search */}
          <div className={cn("hidden md:flex items-center gap-2 transition-all w-[280px]")}>
            <Input
              placeholder="Search products, orders, customers..."
              className="h-8 px-3 text-xs"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Change application theme">
                {theme === "dark" ? <Moon className="h-4 w-4" /> : theme === "system" ? <Monitor className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Application theme</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => changeTheme("light")} className="gap-2"><Sun className="h-4 w-4" /> Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeTheme("dark")} className="gap-2"><Moon className="h-4 w-4" /> Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeTheme("system")} className="gap-2"><Monitor className="h-4 w-4" /> System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="h-9 w-9 relative">
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
                      .map((n) => n[0])
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
