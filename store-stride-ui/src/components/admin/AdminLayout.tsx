import { ReactNode } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const theme = createTheme({
    palette: { primary: { main: "#2167c9" }, background: { default: "#f6f8fb", paper: "#ffffff" } },
    shape: { borderRadius: 8 },
    typography: { fontFamily: '"DM Sans", "Segoe UI", sans-serif' },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="flex h-screen bg-[#f6f8fb] overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content Area */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Header */}
          <AdminHeader />

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-4 md:p-5 h-full">{children}</div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
