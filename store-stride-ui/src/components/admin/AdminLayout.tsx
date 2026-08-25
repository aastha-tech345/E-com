import { useEffect, useRef, type ReactNode } from "react";
import { useLocation } from "@tanstack/react-router";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const location = useLocation();
  const contentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <div
      className="relative flex h-screen min-h-screen w-full max-w-full overflow-hidden bg-[#f6f8fb]"
      style={{ height: "100dvh" }}
    >
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader />

        {/* Page Content */}
        <main
          ref={contentRef}
          className="no-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden"
        >
          <div className="min-h-full max-w-full p-4 md:p-5">{children}</div>
        </main>
      </div>
    </div>
  );
}
