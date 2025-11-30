import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { supabase } from '../../lib/supabase';

const ResetPasswordPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const { updatePassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  // Check for valid recovery token in URL
  useEffect(() => {
    const checkSession = async () => {
      if (!supabase) {
        setError('Authentication service unavailable');
        setIsValidToken(false);
        return;
      }

      // Supabase handles the token verification through the URL hash
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        setIsValidToken(false);
      } else {
        setIsValidToken(true);
      }
    };

    checkSession();
  }, []);

  // Password strength check
  const passwordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const strength = passwordStrength(password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-teal-500',
    'bg-green-500',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const { error: updateError } = await updatePassword(password);
      
      if (updateError) {
        setError(updateError.message || 'Failed to update password');
      } else {
        setSuccess(true);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while checking token
  if (isValidToken === null) {
    return (
      <div className={cn(
        "min-h-screen flex items-center justify-center",
        isDark ? "bg-neutral-950" : "bg-neutral-50"
      )}>
        <Loader2 className={cn(
          "h-8 w-8 animate-spin",
          isDark ? "text-teal-400" : "text-teal-600"
        )} />
      </div>
    );
  }

  // Invalid/expired token
  if (!isValidToken) {
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
            isDark ? "bg-red-500/20" : "bg-red-50"
          )}>
            <AlertCircle className={cn(
              "h-8 w-8",
              isDark ? "text-red-400" : "text-red-600"
            )} />
          </div>
          
          <h1 className={cn(
            "text-2xl font-semibold mb-2",
            isDark ? "text-white" : "text-neutral-900"
          )}>
            Invalid or expired link
          </h1>
          
          <p className={cn(
            "mb-6",
            isDark ? "text-neutral-400" : "text-neutral-600"
          )}>
            This password reset link is invalid or has expired. 
            Please request a new one.
          </p>

          <div className="space-y-3">
            <Link to="/forgot-password">
              <Button size="lg" className="w-full">
                Request new link
              </Button>
            </Link>
            
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full">
                Back to login
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

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
            Password updated
          </h1>
          
          <p className={cn(
            "mb-6",
            isDark ? "text-neutral-400" : "text-neutral-600"
          )}>
            Your password has been successfully updated. 
            You can now sign in with your new password.
          </p>

          <Button
            size="lg"
            className="w-full"
            onClick={() => navigate('/login')}
          >
            Sign in
          </Button>
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
          <KeyRound className={cn(
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
            Set new password
          </h1>
          <p className={cn(
            "mt-2 text-sm",
            isDark ? "text-neutral-400" : "text-neutral-600"
          )}>
            Your new password must be at least 8 characters.
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
              htmlFor="password"
              className={cn(
                "block text-sm font-medium mb-1.5",
                isDark ? "text-neutral-300" : "text-neutral-700"
              )}
            >
              New password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                disabled={isLoading}
                autoComplete="new-password"
                autoFocus
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
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            
            {/* Password strength indicator */}
            {password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-colors",
                        i < strength ? strengthColors[strength - 1] : isDark ? "bg-neutral-800" : "bg-neutral-200"
                      )}
                    />
                  ))}
                </div>
                <p className={cn(
                  "text-xs",
                  isDark ? "text-neutral-500" : "text-neutral-500"
                )}>
                  {strength > 0 ? strengthLabels[strength - 1] : 'Enter a password'}
                </p>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className={cn(
                "block text-sm font-medium mb-1.5",
                isDark ? "text-neutral-300" : "text-neutral-700"
              )}
            >
              Confirm new password
            </label>
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              disabled={isLoading}
              autoComplete="new-password"
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
                Updating...
              </>
            ) : (
              'Reset password'
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
