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
  const [userType, setUserType] = useState<"customer" | "seller">("customer");

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

      let response;
      if (userType === "seller") {
        // For sellers, we'll call the register-seller endpoint
        const apiUrl = import.meta.env["VITE_API_URL"] || "http://localhost:8000/api/v1";
        const apiResponse = await fetch(`${apiUrl}/auth/register-seller`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, full_name: fullName, password }),
        });
        if (!apiResponse.ok) {
          const data = await apiResponse.json();
          throw new Error(data.detail || "Seller registration failed");
        }
        response = await apiResponse.json();
      } else {
        // For customers, use the regular register endpoint
        response = await authService.register(email, fullName, password);
      }

      setUser(response.user, {
        access_token: response.access_token,
        refresh_token: response.refresh_token,
      });

      toast.success(`${userType === "seller" ? "Seller" : "Account"} created successfully!`);
      navigate({ to: "/" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[#f4f7fb] p-3 sm:p-5">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 md:grid-cols-[.9fr_1.1fr]">
        <aside className="relative hidden overflow-hidden bg-[#10233e] p-10 text-white md:flex md:flex-col md:justify-between">
          <div>
            <SiteLogo size="lg" />
            <p className="mt-12 text-xs font-bold uppercase tracking-[0.28em] text-orange-300">Join Store Stride</p>
            <h2 className="mt-4 max-w-sm text-4xl font-bold leading-tight">A better storefront for every kind of ambition.</h2>
            <p className="mt-5 max-w-sm text-sm leading-6 text-slate-300">Shop for what matters or open your own storefront with one secure account.</p>
          </div>
          <p className="text-xs text-slate-400">Your account keeps orders, favorites, and seller tools together.</p>
        </aside>
        <div className="flex items-center justify-center overflow-hidden p-4 sm:p-6">
          <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-4 text-center">
            <SiteLogo size="sm" className="mb-2 md:hidden" />
            <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
            <p className="mt-1 text-sm text-slate-500">Choose how you want to use Store Stride.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-2.5">
            {/* User Type Selection */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-800">
                I want to register as:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label
                  className={`cursor-pointer rounded-lg border-2 p-2 transition ${
                    userType === "customer"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="userType"
                    value="customer"
                    checked={userType === "customer"}
                    onChange={(e) => setUserType(e.target.value as "customer" | "seller")}
                    className="sr-only"
                    disabled={loading}
                  />
                  <div className="text-center">
                    <div className="mb-0.5 text-lg">Shop</div>
                    <div className="text-sm font-medium text-gray-900">Customer</div>
                    <div className="text-xs text-gray-600">Shop & buy</div>
                  </div>
                </label>

                <label
                  className={`cursor-pointer rounded-lg border-2 p-2 transition ${
                    userType === "seller"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="userType"
                    value="seller"
                    checked={userType === "seller"}
                    onChange={(e) => setUserType(e.target.value as "customer" | "seller")}
                    className="sr-only"
                    disabled={loading}
                  />
                  <div className="text-center">
                    <div className="mb-0.5 text-lg">Sell</div>
                    <div className="text-sm font-medium text-gray-900">Seller</div>
                    <div className="text-xs text-gray-600">Sell products</div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-800">Full Name</label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="h-9"
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
                className="h-9"
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
                  className="h-9 pr-14"
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
                className="h-9"
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
              className="h-10 w-full bg-[#10233e] font-semibold text-white hover:bg-[#1a365d]"
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
