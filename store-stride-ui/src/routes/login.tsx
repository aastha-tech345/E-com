import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useShop } from "@/store/shop";
import { authService } from "@/services";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useShop();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

      setUser(response.user, {
        access_token: response.access_token,
        refresh_token: response.refresh_token,
      });

      toast.success("Welcome back!");
      navigate({ to: "/" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[#f4f7fb] p-3 sm:p-5">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 md:grid-cols-[1.05fr_.95fr]">
        <aside className="relative hidden overflow-hidden bg-[#10233e] p-10 text-white md:flex md:flex-col md:justify-between">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f28b20] text-lg font-black text-slate-950">S</div>
            <p className="mt-12 text-xs font-bold uppercase tracking-[0.28em] text-orange-300">Store Stride</p>
            <h2 className="mt-4 max-w-sm text-4xl font-bold leading-tight">Everything you love, in one thoughtful place.</h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-300">Discover trusted products, simple ordering, and a better way to shop every day.</p>
          </div>
          <p className="text-xs text-slate-400">Secure account access for Store Stride customers.</p>
        </aside>
        <div className="flex items-center justify-center p-5 sm:p-8">
          <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="mb-6 text-center">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#f28b20] text-base font-bold text-slate-950 md:hidden">
              <span className="text-white text-xl font-bold">S</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
            <p className="mt-1 text-sm text-slate-500">Sign in to continue shopping.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-10"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-10 pr-14"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-xs font-medium text-slate-500 hover:text-slate-800"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600"
                  disabled={loading}
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
            </div>

            <Button
              type="submit"
              className="h-10 w-full bg-[#10233e] font-semibold text-white hover:bg-[#1a365d]"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
              Create one
            </Link>
          </p>
          </div>
        </div>
      </div>
    </div>
  );
}
