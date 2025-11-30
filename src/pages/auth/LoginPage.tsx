import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../contexts/AuthContext";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";

const LoginPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isConfigured } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  // Get redirect path from location state
  const from = location.state?.from?.pathname || "/app";

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        // Handle specific error messages
        if (error.message.includes("Invalid login")) {
          toast.error("Invalid credentials", {
            description: "Please check your email and password.",
          });
        } else if (error.message.includes("Email not confirmed")) {
          toast.error("Email not verified", {
            description: "Please check your email for the verification link.",
          });
        } else {
          toast.error("Login failed", {
            description: error.message,
          });
        }
        return;
      }
      
      // Success - navigation happens automatically via auth state change
      // But if we're in demo mode, navigate manually
      if (!isConfigured) {
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.error("Login failed", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("min-h-screen flex", isDark ? "bg-neutral-950" : "bg-neutral-50")}>
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <img
              src={isDark ? "/orbitlogo-dark.svg" : "/orbitlogo.svg"}
              alt="ClarityClaim AI"
              className="h-8 w-auto"
            />
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className={cn("text-2xl font-bold mb-2", isDark ? "text-white" : "text-neutral-900")}>
              Welcome back
            </h1>
            <p className={cn("text-sm", isDark ? "text-neutral-400" : "text-neutral-600")}>
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                Email
              </label>
              <div className="relative">
                <Mail className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
                  isDark ? "text-neutral-500" : "text-neutral-400"
                )} />
                <Input
                  type="email"
                  placeholder="you@organization.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  className={cn("pl-10", errors.email && "border-red-500")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className={cn("text-sm font-medium", isDark ? "text-neutral-300" : "text-neutral-700")}>
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-teal-500 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
                  isDark ? "text-neutral-500" : "text-neutral-400"
                )} />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: undefined });
                  }}
                  className={cn("pl-10 pr-10", errors.password && "border-red-500")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className={cn("h-4 w-4", isDark ? "text-neutral-500" : "text-neutral-400")} />
                  ) : (
                    <Eye className={cn("h-4 w-4", isDark ? "text-neutral-500" : "text-neutral-400")} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-neutral-300 text-teal-600 focus:ring-teal-500"
              />
              <label
                htmlFor="remember"
                className={cn("text-sm", isDark ? "text-neutral-400" : "text-neutral-600")}
              >
                Remember me for 30 days
              </label>
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className={cn("w-full border-t", isDark ? "border-neutral-800" : "border-neutral-200")} />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className={cn("px-2", isDark ? "bg-neutral-950 text-neutral-500" : "bg-neutral-50 text-neutral-500")}>
                Or continue with
              </span>
            </div>
          </div>

          {/* Social login */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" type="button">
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button variant="outline" type="button">
              <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
              </svg>
              Apple
            </Button>
          </div>

          {/* Sign up link */}
          <p className={cn("text-sm text-center mt-6", isDark ? "text-neutral-400" : "text-neutral-600")}>
            Don't have an account?{" "}
            <Link to="/signup" className="text-teal-500 hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Image/Branding */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-teal-500 to-teal-700 p-12">
        <div className="max-w-lg text-white">
          <h2 className="text-3xl font-bold mb-4">
            AI-Powered Claims Management
          </h2>
          <p className="text-lg text-teal-100 mb-8">
            Reduce denials by 35%, increase appeal win rates to 87%, and recover millions in lost revenue with ClarityClaim AI.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "94%", label: "Prediction Accuracy" },
              { value: "87%", label: "Appeal Win Rate" },
              { value: "<3s", label: "Appeal Generation" },
              { value: "$2.3M", label: "Avg. Recovery" },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/10 rounded-lg p-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-teal-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
