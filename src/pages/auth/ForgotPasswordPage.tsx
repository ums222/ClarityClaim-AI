import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";

const ForgotPasswordPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = () => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email format");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) return;
    
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual Supabase password reset
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setIsSubmitted(true);
      toast.success("Reset link sent!", {
        description: "Check your email for the password reset link.",
      });
    } catch (error) {
      toast.error("Failed to send reset link", {
        description: "Please try again or contact support.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("min-h-screen flex items-center justify-center p-8", isDark ? "bg-neutral-950" : "bg-neutral-50")}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
          <img
            src={isDark ? "/orbitlogo-dark.svg" : "/orbitlogo.svg"}
            alt="ClarityClaim AI"
            className="h-8 w-auto"
          />
        </Link>

        {!isSubmitted ? (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className={cn("text-2xl font-bold mb-2", isDark ? "text-white" : "text-neutral-900")}>
                Forgot your password?
              </h1>
              <p className={cn("text-sm", isDark ? "text-neutral-400" : "text-neutral-600")}>
                No worries, we'll send you reset instructions.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                      setError("");
                    }}
                    className={cn("pl-10", error && "border-red-500")}
                  />
                </div>
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send reset link
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </>
        ) : (
          /* Success state */
          <div className="text-center">
            <div className={cn(
              "flex h-16 w-16 items-center justify-center rounded-full mx-auto mb-6",
              isDark ? "bg-teal-500/20" : "bg-teal-100"
            )}>
              <CheckCircle2 className="h-8 w-8 text-teal-500" />
            </div>
            <h1 className={cn("text-2xl font-bold mb-2", isDark ? "text-white" : "text-neutral-900")}>
              Check your email
            </h1>
            <p className={cn("text-sm mb-6", isDark ? "text-neutral-400" : "text-neutral-600")}>
              We sent a password reset link to<br />
              <span className="font-medium">{email}</span>
            </p>
            <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-500")}>
              Didn't receive the email?{" "}
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-teal-500 hover:underline"
              >
                Click to resend
              </button>
            </p>
          </div>
        )}

        {/* Back to login */}
        <Link
          to="/login"
          className={cn(
            "flex items-center justify-center gap-2 mt-6 text-sm",
            isDark ? "text-neutral-400 hover:text-white" : "text-neutral-600 hover:text-neutral-900"
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
