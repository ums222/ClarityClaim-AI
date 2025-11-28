import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import { cn } from "../lib/utils";

const ResetPasswordPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { updatePassword } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    const { error: updateError } = await updatePassword(password);

    if (updateError) {
      setError(updateError.message);
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setIsLoading(false);
  };

  if (success) {
    return (
      <div
        className={cn(
          "min-h-screen transition-colors duration-300",
          isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900"
        )}
      >
        <NavBar />
        <main className="pt-20 md:pt-24 pb-16 px-4 flex items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-md"
          >
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500 mb-4">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h1 className={cn("text-2xl font-bold mb-4", isDark ? "text-white" : "text-slate-900")}>
              Password Reset Successfully
            </h1>
            <p className={cn("mb-6", isDark ? "text-slate-400" : "text-slate-600")}>
              Your password has been updated. You can now sign in with your new password.
            </p>
            <Link to="/login">
              <Button>
                Sign In
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900"
      )}
    >
      <NavBar />

      <main className="pt-20 md:pt-24 pb-16 px-4">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className={cn(isDark ? "bg-slate-900/70" : "bg-white")}>
              <CardHeader className="text-center">
                <img
                  src={isDark ? "/orbitlogo-dark.svg" : "/orbitlogo.svg"}
                  alt="ClarityClaim AI"
                  className="h-8 w-auto mx-auto mb-4"
                />
                <CardTitle className="text-2xl">Set New Password</CardTitle>
                <CardDescription className={isDark ? "text-slate-400" : "text-slate-600"}>
                  Enter your new password below.
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
                    <label className={cn("text-xs font-medium mb-1.5 block", isDark ? "text-slate-400" : "text-slate-600")}>
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4", isDark ? "text-slate-500" : "text-slate-400")} />
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={cn("absolute right-3 top-1/2 -translate-y-1/2", isDark ? "text-slate-500 hover:text-slate-400" : "text-slate-400 hover:text-slate-500")}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className={cn("text-xs mt-1", isDark ? "text-slate-500" : "text-slate-500")}>
                      At least 8 characters
                    </p>
                  </div>

                  <div>
                    <label className={cn("text-xs font-medium mb-1.5 block", isDark ? "text-slate-400" : "text-slate-600")}>
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4", isDark ? "text-slate-500" : "text-slate-400")} />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className={cn("absolute right-3 top-1/2 -translate-y-1/2", isDark ? "text-slate-500 hover:text-slate-400" : "text-slate-400 hover:text-slate-500")}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Updating...
                      </>
                    ) : (
                      <>
                        Reset Password
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
