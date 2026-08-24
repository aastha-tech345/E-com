import { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[#f6f8fb]">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader />

        {/* Page Content */}
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
          <div className="min-h-full p-4 md:p-5">{children}</div>
        </main>
      </div>
    </div>
  );
}
