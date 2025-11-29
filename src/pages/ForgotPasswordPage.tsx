import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/utils';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { resetPassword } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: resetError } = await resetPassword(email);

      if (resetError) {
        setError(resetError.message);
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
              Check your email
            </h2>
            <p
              className={cn(
                'text-sm mb-6',
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              )}
            >
              We've sent a password reset link to <strong>{email}</strong>. Please
              check your inbox and follow the instructions to reset your password.
            </p>
            <Link to="/login">
              <Button className="w-full">Back to Sign In</Button>
            </Link>
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
          Reset your password
        </h2>
        <p
          className={cn(
            'mt-2 text-center text-sm',
            isDark ? 'text-neutral-400' : 'text-neutral-600'
          )}
        >
          Enter your email address and we'll send you a link to reset your
          password.
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
            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className={cn(
                  'block text-sm font-medium mb-1.5',
                  isDark ? 'text-neutral-300' : 'text-neutral-700'
                )}
              >
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail
                    className={cn(
                      'h-4 w-4',
                      isDark ? 'text-neutral-500' : 'text-neutral-400'
                    )}
                  />
                </div>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
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
                  Sending reset link...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Send reset link
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
