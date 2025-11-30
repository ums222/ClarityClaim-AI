import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

const ForgotPasswordPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error: resetError } = await resetPassword(email);
      
      if (resetError) {
        setError(resetError.message || 'Failed to send reset email');
      } else {
        setSuccess(true);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div className={cn(
        "min-h-screen flex items-center justify-center px-4",
        isDark ? "bg-neutral-950" : "bg-neutral-50"
      )}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className={cn(
            "mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center",
            isDark ? "bg-teal-500/20" : "bg-teal-50"
          )}>
            <CheckCircle2 className={cn(
              "h-8 w-8",
              isDark ? "text-teal-400" : "text-teal-600"
            )} />
          </div>
          
          <h1 className={cn(
            "text-2xl font-semibold mb-2",
            isDark ? "text-white" : "text-neutral-900"
          )}>
            Check your email
          </h1>
          
          <p className={cn(
            "mb-6",
            isDark ? "text-neutral-400" : "text-neutral-600"
          )}>
            We've sent a password reset link to <strong>{email}</strong>. 
            Please check your inbox and follow the instructions.
          </p>

          <div className="space-y-3">
            <Link to="/login">
              <Button size="lg" className="w-full">
                Back to login
              </Button>
            </Link>
            
            <p className={cn(
              "text-sm",
              isDark ? "text-neutral-500" : "text-neutral-500"
            )}>
              Didn't receive the email?{' '}
              <button
                type="button"
                className={cn(
                  "font-medium",
                  isDark ? "text-teal-400 hover:text-teal-300" : "text-teal-600 hover:text-teal-700"
                )}
                onClick={() => setSuccess(false)}
              >
                Try again
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center px-4",
      isDark ? "bg-neutral-950" : "bg-neutral-50"
    )}>
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

        {/* Icon */}
        <div className={cn(
          "mb-6 w-14 h-14 rounded-xl flex items-center justify-center",
          isDark ? "bg-neutral-900 ring-1 ring-neutral-800" : "bg-neutral-100"
        )}>
          <Mail className={cn(
            "h-6 w-6",
            isDark ? "text-teal-400" : "text-teal-600"
          )} />
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className={cn(
            "text-2xl font-semibold tracking-tight",
            isDark ? "text-white" : "text-neutral-900"
          )}>
            Forgot your password?
          </h1>
          <p className={cn(
            "mt-2 text-sm",
            isDark ? "text-neutral-400" : "text-neutral-600"
          )}>
            No worries, we'll send you reset instructions.
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

        {/* Form */}
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

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Sending...
              </>
            ) : (
              'Send reset link'
            )}
          </Button>
        </form>

        {/* Back to login */}
        <div className="mt-8">
          <Link
            to="/login"
            className={cn(
              "flex items-center justify-center gap-2 text-sm font-medium",
              isDark
                ? "text-neutral-400 hover:text-white"
                : "text-neutral-600 hover:text-neutral-900"
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
