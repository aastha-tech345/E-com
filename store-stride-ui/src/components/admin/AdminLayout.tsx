import { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function AdminLayout({
  children,
  title,
  description,
}: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader title={title} description={description} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 md:p-8 h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
