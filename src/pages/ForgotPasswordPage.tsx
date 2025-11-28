import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import { cn } from "../lib/utils";

const ForgotPasswordPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { error: resetError } = await resetPassword(email);

    if (resetError) {
      setError(resetError.message);
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
              Check Your Email
            </h1>
            <p className={cn("mb-6", isDark ? "text-slate-400" : "text-slate-600")}>
              We've sent a password reset link to <strong>{email}</strong>. 
              Click the link in the email to reset your password.
            </p>
            <div className="space-y-3">
              <Link to="/login">
                <Button className="w-full">
                  Back to Login
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <button
                onClick={() => setSuccess(false)}
                className={cn("text-sm", isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900")}
              >
                Didn't receive the email? Try again
              </button>
            </div>
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
                <CardTitle className="text-2xl">Forgot Password?</CardTitle>
                <CardDescription className={isDark ? "text-slate-400" : "text-slate-600"}>
                  No worries, we'll send you reset instructions.
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
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4", isDark ? "text-slate-500" : "text-slate-400")} />
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

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Reset Link
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <Link
                    to="/login"
                    className={cn(
                      "flex items-center justify-center gap-2 text-sm mt-4",
                      isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </Link>
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

export default ForgotPasswordPage;
