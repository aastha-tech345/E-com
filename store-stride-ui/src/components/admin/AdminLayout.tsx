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
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <AdminHeader title={title} description={description} />

          {/* Page Content */}
          <main className="flex-1 overflow-auto">
            <div className="p-6 md:p-8 h-full">{children}</div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
