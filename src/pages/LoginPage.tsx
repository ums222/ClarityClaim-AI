import { useState, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/utils';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Get the redirect path from location state, or default to dashboard
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: signInError } = await signIn(email, password);

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Please check your email and confirm your account before signing in.');
        } else {
          setError(signInError.message);
        }
        return;
      }

      // Redirect to the original destination or dashboard
      navigate(from, { replace: true });
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          Sign in to your account
        </h2>
        <p
          className={cn(
            'mt-2 text-center text-sm',
            isDark ? 'text-neutral-400' : 'text-neutral-600'
          )}
        >
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-medium text-teal-500 hover:text-teal-400 transition-colors"
          >
            Sign up for free
          </Link>
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

            {/* Password field */}
            <div>
              <label
                htmlFor="password"
                className={cn(
                  'block text-sm font-medium mb-1.5',
                  isDark ? 'text-neutral-300' : 'text-neutral-700'
                )}
              >
                Password
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
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="Enter your password"
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
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className={cn(
                    'h-4 w-4 rounded border focus:ring-2 focus:ring-teal-500 focus:ring-offset-2',
                    isDark
                      ? 'bg-neutral-800 border-neutral-700 focus:ring-offset-neutral-900'
                      : 'bg-white border-neutral-300 focus:ring-offset-white'
                  )}
                />
                <label
                  htmlFor="remember-me"
                  className={cn(
                    'ml-2 block text-sm',
                    isDark ? 'text-neutral-400' : 'text-neutral-600'
                  )}
                >
                  Remember me
                </label>
              </div>

              <Link
                to="/forgot-password"
                className="text-sm font-medium text-teal-500 hover:text-teal-400 transition-colors"
              >
                Forgot password?
              </Link>
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
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        </div>

        {/* Back to home link */}
        <p
          className={cn(
            'mt-6 text-center text-sm',
            isDark ? 'text-neutral-500' : 'text-neutral-500'
          )}
        >
          <Link
            to="/"
            className="font-medium hover:text-teal-500 transition-colors"
          >
            &larr; Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
