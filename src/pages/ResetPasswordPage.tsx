import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/utils';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { updatePassword, session } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Check if user has a valid session (from email link)
  useEffect(() => {
    if (!session) {
      // User might not be authenticated yet, wait a bit for session to load
      const timer = setTimeout(() => {
        if (!session) {
          setError('Invalid or expired reset link. Please request a new password reset.');
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [session]);

  // Password validation
  const passwordRequirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Contains a number', met: /\d/.test(password) },
  ];

  const isPasswordValid = passwordRequirements.every((req) => req.met);
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!isPasswordValid) {
      setError('Please ensure your password meets all requirements.');
      return;
    }

    if (!doPasswordsMatch) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await updatePassword(password);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div
        className={cn(
          'min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8',
          isDark ? 'bg-neutral-950' : 'bg-neutral-50'
        )}
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div
            className={cn(
              'py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 border text-center',
              isDark
                ? 'bg-neutral-900 border-neutral-800'
                : 'bg-white border-neutral-200'
            )}
          >
            <div className="mx-auto w-12 h-12 bg-teal-500/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-teal-500" />
            </div>
            <h2
              className={cn(
                'text-xl font-bold mb-2',
                isDark ? 'text-white' : 'text-neutral-900'
              )}
            >
              Password updated
            </h2>
            <p
              className={cn(
                'text-sm mb-6',
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              )}
            >
              Your password has been successfully updated. You can now sign in
              with your new password.
            </p>
            <Button onClick={() => navigate('/dashboard')} className="w-full">
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8',
        isDark ? 'bg-neutral-950' : 'bg-neutral-50'
      )}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <Link to="/" className="flex justify-center">
          <img
            src={isDark ? '/orbitlogo-dark.svg' : '/orbitlogo.svg'}
            alt="ClarityClaim AI"
            className="h-10 w-auto"
          />
        </Link>
        <h2
          className={cn(
            'mt-6 text-center text-2xl font-bold tracking-tight',
            isDark ? 'text-white' : 'text-neutral-900'
          )}
        >
          Set new password
        </h2>
        <p
          className={cn(
            'mt-2 text-center text-sm',
            isDark ? 'text-neutral-400' : 'text-neutral-600'
          )}
        >
          Enter your new password below.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div
          className={cn(
            'py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 border',
            isDark
              ? 'bg-neutral-900 border-neutral-800'
              : 'bg-white border-neutral-200'
          )}
        >
          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Password field */}
            <div>
              <label
                htmlFor="password"
                className={cn(
                  'block text-sm font-medium mb-1.5',
                  isDark ? 'text-neutral-300' : 'text-neutral-700'
                )}
              >
                New password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock
                    className={cn(
                      'h-4 w-4',
                      isDark ? 'text-neutral-500' : 'text-neutral-400'
                    )}
                  />
                </div>
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff
                      className={cn(
                        'h-4 w-4',
                        isDark
                          ? 'text-neutral-500 hover:text-neutral-300'
                          : 'text-neutral-400 hover:text-neutral-600'
                      )}
                    />
                  ) : (
                    <Eye
                      className={cn(
                        'h-4 w-4',
                        isDark
                          ? 'text-neutral-500 hover:text-neutral-300'
                          : 'text-neutral-400 hover:text-neutral-600'
                      )}
                    />
                  )}
                </button>
              </div>

              {/* Password requirements */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1">
                  {passwordRequirements.map((req) => (
                    <div
                      key={req.label}
                      className={cn(
                        'flex items-center gap-2 text-xs',
                        req.met ? 'text-teal-500' : isDark ? 'text-neutral-500' : 'text-neutral-400'
                      )}
                    >
                      <CheckCircle
                        className={cn(
                          'h-3 w-3',
                          req.met ? 'opacity-100' : 'opacity-30'
                        )}
                      />
                      {req.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm password field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className={cn(
                  'block text-sm font-medium mb-1.5',
                  isDark ? 'text-neutral-300' : 'text-neutral-700'
                )}
              >
                Confirm new password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock
                    className={cn(
                      'h-4 w-4',
                      isDark ? 'text-neutral-500' : 'text-neutral-400'
                    )}
                  />
                </div>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={cn(
                    'pl-10',
                    confirmPassword.length > 0 &&
                      (doPasswordsMatch
                        ? 'border-teal-500 focus-visible:ring-teal-500'
                        : 'border-red-500 focus-visible:ring-red-500')
                  )}
                  placeholder="Confirm new password"
                />
              </div>
              {confirmPassword.length > 0 && !doPasswordsMatch && (
                <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
              )}
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading || !isPasswordValid}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Updating password...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Update password
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        </div>

        {/* Back to login link */}
        <p
          className={cn(
            'mt-6 text-center text-sm',
            isDark ? 'text-neutral-500' : 'text-neutral-500'
          )}
        >
          <Link
            to="/login"
            className="font-medium hover:text-teal-500 transition-colors"
          >
            &larr; Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
