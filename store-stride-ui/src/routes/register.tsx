import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useShop } from "@/store/shop";
import { authService } from "@/services";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { SiteLogo } from "@/components/common/SiteLogo";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { setUser } = useShop();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const validateForm = () => {
    if (!fullName.trim()) {
      toast.error("Full name is required");
      return false;
    }
    if (!email) {
      toast.error("Email is required");
      return false;
    }
    if (!password) {
      toast.error("Password is required");
      return false;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    if (!agreeTerms) {
      toast.error("You must agree to the terms and conditions");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!validateForm()) {
        setLoading(false);
        return;
      }

      const response = await authService.register(email, fullName, password);

      setUser(response.user, {
        access_token: response.access_token,
        refresh_token: response.refresh_token,
      });

      toast.success("Account created successfully!");
      navigate({ to: "/" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[100dvh] items-center justify-center overflow-hidden bg-[#f8f1e6] p-3">
      <div className="grid h-[min(500px,calc(100dvh-1.5rem))] w-full max-w-4xl grid-cols-1 overflow-hidden rounded-2xl border border-[#dcc8aa] bg-[#fffaf2] shadow-2xl shadow-[#7c4a24]/15 md:grid-cols-[.9fr_1.1fr]">
        <aside className="relative hidden overflow-hidden bg-[radial-gradient(circle_at_82%_15%,rgba(221,151,65,.45),transparent_28%),linear-gradient(145deg,#111827_0%,#1f2933_60%,#6b4b2a_100%)] p-8 text-white md:flex md:flex-col md:justify-between">
          <div>
            <SiteLogo size="lg" />
            <p className="mt-7 text-xs font-bold uppercase tracking-[0.28em] text-[#f0ad3d]">Join Store Stride</p>
            <h2 className="mt-3 max-w-sm text-3xl font-bold leading-tight">A better storefront for every kind of ambition.</h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">Shop for what matters or open your own storefront with one secure account.</p>
          </div>
          <p className="text-xs text-slate-400">Your account keeps orders, favorites, and seller tools together.</p>
        </aside>
        <div className="flex items-center justify-center overflow-hidden bg-[#fffdfa] p-4 sm:p-5">
          <div className="w-full max-w-[360px]">
          {/* Logo */}
          <div className="mb-4 text-center">
            <SiteLogo size="sm" className="mb-2 md:hidden" />
            <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
            <p className="mt-1 text-sm text-slate-500">Choose how you want to use Store Stride.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-2.5">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">Full Name</label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="h-9 rounded-lg border-[#ddc8aa] bg-white shadow-none focus-visible:ring-[#a7622d]"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="h-9 rounded-lg border-[#ddc8aa] bg-white shadow-none focus-visible:ring-[#a7622d]"
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
                  className="h-9 rounded-lg border-[#ddc8aa] bg-white pr-14 shadow-none focus-visible:ring-[#a7622d]"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-xs font-medium text-slate-500 hover:text-slate-800"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <p className="mt-0.5 text-xs text-gray-500">At least 8 characters</p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">
                Confirm Password
              </label>
              <Input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="h-9 rounded-lg border-[#ddc8aa] bg-white shadow-none focus-visible:ring-[#a7622d]"
                disabled={loading}
                required
              />
            </div>

            <label className="flex items-start space-x-2 pt-0.5">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 mt-0.5"
                disabled={loading}
              />
              <span className="text-sm text-gray-700">
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>

            <Button
              type="submit"
              className="h-10 w-full rounded-lg bg-[#a7622d] font-semibold text-white shadow-sm shadow-[#7c4a24]/25 hover:bg-[#8d5228]"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign in
            </Link>
          </p>
          </div>
        </div>
      </div>
    </div>
  );
}
