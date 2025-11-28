import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  CheckCircle,
} from "lucide-react";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import { cn } from "../lib/utils";

const LoginPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const { user, signIn, signInWithGoogle } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.message || "Invalid email or password. Please try again.");
      setIsLoading(false);
      return;
    }

    // Successful login - will redirect via useEffect
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError("");
    const { error: googleError } = await signInWithGoogle();
    if (googleError) {
      setError(googleError.message);
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900"
      )}
    >
      <NavBar />

      <main className="pt-20 md:pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
            {/* Left - Login Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="order-2 lg:order-1"
            >
              <Card
                className={cn(
                  "max-w-md mx-auto",
                  isDark ? "bg-slate-900/70" : "bg-white"
                )}
              >
                <CardHeader className="text-center">
                  <img
                    src={isDark ? "/orbitlogo-dark.svg" : "/orbitlogo.svg"}
                    alt="ClarityClaim AI"
                    className="h-8 w-auto mx-auto mb-4"
                  />
                  <CardTitle className="text-2xl">Welcome Back</CardTitle>
                  <CardDescription
                    className={isDark ? "text-slate-400" : "text-slate-600"}
                  >
                    Sign in to your ClarityClaim AI dashboard
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
                        {error}
                      </div>
                    )}

                    <div>
                      <label
                        className={cn(
                          "text-xs font-medium mb-1.5 block",
                          isDark ? "text-slate-400" : "text-slate-600"
                        )}
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail
                          className={cn(
                            "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
                            isDark ? "text-slate-500" : "text-slate-400"
                          )}
                        />
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@organization.com"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label
                          className={cn(
                            "text-xs font-medium",
                            isDark ? "text-slate-400" : "text-slate-600"
                          )}
                        >
                          Password
                        </label>
                        <Link
                          to="/forgot-password"
                          className="text-xs text-clarity-secondary hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock
                          className={cn(
                            "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
                            isDark ? "text-slate-500" : "text-slate-400"
                          )}
                        />
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={cn(
                            "absolute right-3 top-1/2 -translate-y-1/2",
                            isDark
                              ? "text-slate-500 hover:text-slate-400"
                              : "text-slate-400 hover:text-slate-500"
                          )}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="remember"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-300 dark:border-slate-700"
                      />
                      <label
                        htmlFor="remember"
                        className={cn(
                          "text-sm",
                          isDark ? "text-slate-400" : "text-slate-600"
                        )}
                      >
                        Remember me for 30 days
                      </label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Signing in...
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </Button>

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div
                          className={cn(
                            "w-full border-t",
                            isDark ? "border-slate-800" : "border-slate-200"
                          )}
                        />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span
                          className={cn(
                            "px-2",
                            isDark
                              ? "bg-slate-900 text-slate-500"
                              : "bg-white text-slate-500"
                          )}
                        >
                          or continue with
                        </span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      size="lg"
                      onClick={handleGoogleSignIn}
                    >
                      <img
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        className="h-4 w-4 mr-2"
                      />
                      Sign in with Google
                    </Button>

                    <p
                      className={cn(
                        "text-center text-sm mt-4",
                        isDark ? "text-slate-500" : "text-slate-500"
                      )}
                    >
                      Don't have an account?{" "}
                      <Link
                        to="/signup"
                        className="text-clarity-secondary hover:underline font-medium"
                      >
                        Sign Up
                      </Link>
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right - Features */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="order-1 lg:order-2 text-center lg:text-left"
            >
              <Badge className="mb-4">
                <Shield className="w-3 h-3 mr-1" />
                Secure Access
              </Badge>
              <h1
                className={cn(
                  "text-3xl md:text-4xl font-bold mb-4",
                  isDark ? "text-white" : "text-slate-900"
                )}
              >
                Your AI-Powered Claims Dashboard Awaits
              </h1>
              <p
                className={cn(
                  "text-lg mb-8",
                  isDark ? "text-slate-400" : "text-slate-600"
                )}
              >
                Access real-time denial predictions, appeal status, and revenue
                analytics—all in one secure platform.
              </p>

              <div className="space-y-4">
                {[
                  "Real-time denial risk predictions",
                  "One-click appeal generation",
                  "Revenue recovery tracking",
                  "Equity analytics dashboard",
                  "Executive KPIs and reporting",
                ].map((feature) => (
                  <div
                    key={feature}
                    className={cn(
                      "flex items-center gap-3",
                      "justify-center lg:justify-start"
                    )}
                  >
                    <CheckCircle className="h-5 w-5 text-clarity-secondary flex-shrink-0" />
                    <span
                      className={isDark ? "text-slate-300" : "text-slate-700"}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className={cn(
                  "mt-8 p-4 rounded-xl flex items-center gap-3",
                  "justify-center lg:justify-start",
                  isDark ? "bg-slate-900/50" : "bg-slate-100"
                )}
              >
                <Shield className="h-5 w-5 text-emerald-500" />
                <span
                  className={cn(
                    "text-sm",
                    isDark ? "text-slate-400" : "text-slate-600"
                  )}
                >
                  Protected by enterprise-grade security (HIPAA, SOC 2, HITRUST)
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
