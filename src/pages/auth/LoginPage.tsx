import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

const LoginPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get the redirect path from location state
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/app';

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) {
        setError(signInError.message || 'Invalid email or password');
      } else {
        navigate(from, { replace: true });
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn(
      "min-h-screen flex",
      isDark ? "bg-neutral-950" : "bg-neutral-50"
    )}>
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link to="/" className="block mb-8">
            <img
              src={isDark ? '/orbitlogo-dark.svg' : '/orbitlogo.svg'}
              alt="ClarityClaim AI"
              className="h-8 w-auto"
            />
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className={cn(
              "text-2xl font-semibold tracking-tight",
              isDark ? "text-white" : "text-neutral-900"
            )}>
              Welcome back
            </h1>
            <p className={cn(
              "mt-2 text-sm",
              isDark ? "text-neutral-400" : "text-neutral-600"
            )}>
              Sign in to your account to continue
            </p>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex items-center gap-2 p-3 rounded-lg mb-6 text-sm",
                isDark
                  ? "bg-red-500/10 text-red-400 ring-1 ring-red-500/20"
                  : "bg-red-50 text-red-600 ring-1 ring-red-200"
              )}
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className={cn(
                  "block text-sm font-medium mb-1.5",
                  isDark ? "text-neutral-300" : "text-neutral-700"
                )}
              >
                Email address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                disabled={isLoading}
                autoComplete="email"
                autoFocus
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className={cn(
                    "block text-sm font-medium",
                    isDark ? "text-neutral-300" : "text-neutral-700"
                  )}
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className={cn(
                    "text-sm font-medium",
                    isDark
                      ? "text-teal-400 hover:text-teal-300"
                      : "text-teal-600 hover:text-teal-700"
                  )}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2",
                    isDark ? "text-neutral-500 hover:text-neutral-300" : "text-neutral-400 hover:text-neutral-600"
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

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
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

          {/* Sign up link */}
          <p className={cn(
            "mt-8 text-center text-sm",
            isDark ? "text-neutral-400" : "text-neutral-600"
          )}>
            Don't have an account?{' '}
            <Link
              to="/signup"
              className={cn(
                "font-medium",
                isDark
                  ? "text-teal-400 hover:text-teal-300"
                  : "text-teal-600 hover:text-teal-700"
              )}
            >
              Sign up for free
            </Link>
          </p>

          {/* Back to home */}
          <p className={cn(
            "mt-4 text-center text-sm",
            isDark ? "text-neutral-500" : "text-neutral-500"
          )}>
            <Link
              to="/"
              className="hover:underline"
            >
              ← Back to home
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right side - Branding */}
      <div className={cn(
        "hidden lg:flex flex-1 items-center justify-center p-12",
        isDark
          ? "bg-gradient-to-br from-neutral-900 to-neutral-950"
          : "bg-gradient-to-br from-teal-500 to-teal-600"
      )}>
        <div className="max-w-md text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className={cn(
              "mb-8 mx-auto w-20 h-20 rounded-2xl flex items-center justify-center",
              isDark ? "bg-teal-500/20" : "bg-white/20"
            )}>
              <img
                src="/logo-icon.svg"
                alt=""
                className="h-10 w-10"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            
            <h2 className={cn(
              "text-2xl font-semibold mb-4",
              isDark ? "text-white" : "text-white"
            )}>
              Recover Lost Revenue
            </h2>
            
            <p className={cn(
              "text-base mb-8",
              isDark ? "text-neutral-400" : "text-teal-50"
            )}>
              Join hundreds of healthcare organizations using AI to predict denials, 
              optimize submissions, and generate winning appeals.
            </p>

            <div className={cn(
              "grid grid-cols-3 gap-4 p-4 rounded-xl",
              isDark ? "bg-neutral-800/50" : "bg-white/10"
            )}>
              <div>
                <p className={cn(
                  "text-2xl font-bold",
                  isDark ? "text-teal-400" : "text-white"
                )}>
                  35%
                </p>
                <p className={cn(
                  "text-xs",
                  isDark ? "text-neutral-500" : "text-teal-100"
                )}>
                  Fewer Denials
                </p>
              </div>
              <div>
                <p className={cn(
                  "text-2xl font-bold",
                  isDark ? "text-teal-400" : "text-white"
                )}>
                  87%
                </p>
                <p className={cn(
                  "text-xs",
                  isDark ? "text-neutral-500" : "text-teal-100"
                )}>
                  Appeal Win Rate
                </p>
              </div>
              <div>
                <p className={cn(
                  "text-2xl font-bold",
                  isDark ? "text-teal-400" : "text-white"
                )}>
                  2.3s
                </p>
                <p className={cn(
                  "text-xs",
                  isDark ? "text-neutral-500" : "text-teal-100"
                )}>
                  Avg Generation
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
