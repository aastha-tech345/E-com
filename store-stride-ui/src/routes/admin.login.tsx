import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useShop } from "@/store/shop";
import { authService } from "@/services";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const { setAdmin } = useShop();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email || !password) {
        toast.error("Email and password are required");
        setLoading(false);
        return;
      }

      const response = await authService.login(email, password);

      // Check if user has admin or seller role
      const hasAdminAccess = response.user.roles.some((role: string) =>
        [
          "super_admin",
          "admin",
          "admin_catalog",
          "admin_orders",
          "admin_payments",
          "admin_customers",
          "admin_marketing",
          "admin_support",
          "seller_owner",
        ].includes(role),
      );

      if (!hasAdminAccess) {
        authService.logout();
        toast.error("Admin access denied. Your account does not have admin or seller privileges.");
        setLoading(false);
        return;
      }

      setAdmin(response.user, {
        access_token: response.access_token,
        refresh_token: response.refresh_token,
      });
      navigate({ to: "/admin/dashboard" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Store Admin</h1>
          <p className="text-gray-600 text-sm mt-2">Sign in to your admin panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-6">
          Development login: admin@example.com / Admin123!
        </p>
      </div>
    </div>
  );
}
