import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  CheckCircle,
} from "lucide-react";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../hooks/useAuth";
import { cn } from "../lib/utils";

const SignUpPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { signUp, signInWithGoogle } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate password strength
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    const { error: signUpError } = await signUp(email, password, { full_name: fullName });

    if (signUpError) {
      setError(signUpError.message);
      setIsLoading(false);
      return;
    }

    setSuccess(true);
    setIsLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setError("");
    const { error: googleError } = await signInWithGoogle();
    if (googleError) {
      setError(googleError.message);
    }
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
              We've sent a confirmation link to <strong>{email}</strong>. 
              Please click the link to verify your account.
            </p>
            <Link to="/login">
              <Button>
                Go to Login
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
                <CardTitle className="text-2xl">Create Your Account</CardTitle>
                <CardDescription className={isDark ? "text-slate-400" : "text-slate-600"}>
                  Get started with ClarityClaim AI
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
                      Full Name
                    </label>
                    <div className="relative">
                      <User className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4", isDark ? "text-slate-500" : "text-slate-400")} />
                      <Input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Jane Doe"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

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

                  <div>
                    <label className={cn("text-xs font-medium mb-1.5 block", isDark ? "text-slate-400" : "text-slate-600")}>
                      Password
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

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className={cn("w-full border-t", isDark ? "border-slate-800" : "border-slate-200")} />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className={cn("px-2", isDark ? "bg-slate-900 text-slate-500" : "bg-white text-slate-500")}>
                        or continue with
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    size="lg"
                    onClick={handleGoogleSignUp}
                  >
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="h-4 w-4 mr-2" />
                    Sign up with Google
                  </Button>

                  <p className={cn("text-center text-sm mt-4", isDark ? "text-slate-500" : "text-slate-500")}>
                    Already have an account?{" "}
                    <Link to="/login" className="text-clarity-secondary hover:underline font-medium">
                      Sign In
                    </Link>
                  </p>

                  <p className={cn("text-xs text-center", isDark ? "text-slate-600" : "text-slate-400")}>
                    By creating an account, you agree to our{" "}
                    <Link to="/terms-of-service" className="text-clarity-secondary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy-policy" className="text-clarity-secondary hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
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

export default SignUpPage;
