import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useShop } from "@/store/shop";
import { authService } from "@/services";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-lg mb-4">
              <span className="text-white text-xl font-bold">S</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Store Stride</h1>
            <p className="text-gray-600 text-sm mt-1">Create your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                I want to register as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`cursor-pointer p-3 rounded-lg border-2 transition ${
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
                    <div className="text-2xl mb-1">🛍️</div>
                    <div className="text-sm font-medium text-gray-900">Customer</div>
                    <div className="text-xs text-gray-600">Shop & buy</div>
                  </div>
                </label>

                <label
                  className={`cursor-pointer p-3 rounded-lg border-2 transition ${
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
                    <div className="text-2xl mb-1">🏪</div>
                    <div className="text-sm font-medium text-gray-900">Seller</div>
                    <div className="text-xs text-gray-600">Sell products</div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Full Name</label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 text-sm"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">At least 8 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Confirm Password
              </label>
              <Input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                required
              />
            </div>

            <label className="flex items-start space-x-2">
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Social Registration (Optional) */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
              <span>Google</span>
            </button>
            <button className="border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
              <span>Apple</span>
            </button>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-6">
          By creating an account, you agree to our terms and accept our privacy policy.
        </p>
      </div>
    </div>
  );
}
