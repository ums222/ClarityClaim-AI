import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select } from '../../components/ui/select';

const SignupPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  const { signUp, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    organizationType: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/app', { replace: true });
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  // Password strength check
  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = passwordStrength(formData.password);
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
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const { error: signUpError } = await signUp(
        formData.email,
        formData.password,
        formData.fullName,
        formData.organizationName || undefined
      );

      if (signUpError) {
        setError(signUpError.message || 'Failed to create account');
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
            We've sent a confirmation link to <strong>{formData.email}</strong>. 
            Please click the link to verify your account.
          </p>

          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full"
              onClick={() => navigate('/login')}
            >
              Go to Login
            </Button>
            
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
              Create your account
            </h1>
            <p className={cn(
              "mt-2 text-sm",
              isDark ? "text-neutral-400" : "text-neutral-600"
            )}>
              Start recovering lost revenue in minutes
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

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className={cn(
                  "block text-sm font-medium mb-1.5",
                  isDark ? "text-neutral-300" : "text-neutral-700"
                )}
              >
                Full name
              </label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Jane Doe"
                required
                disabled={isLoading}
                autoComplete="name"
                autoFocus
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className={cn(
                  "block text-sm font-medium mb-1.5",
                  isDark ? "text-neutral-300" : "text-neutral-700"
                )}
              >
                Work email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@company.com"
                required
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="organizationName"
                  className={cn(
                    "block text-sm font-medium mb-1.5",
                    isDark ? "text-neutral-300" : "text-neutral-700"
                  )}
                >
                  Organization name
                </label>
                <Input
                  id="organizationName"
                  name="organizationName"
                  type="text"
                  value={formData.organizationName}
                  onChange={handleChange}
                  placeholder="Acme Health"
                  disabled={isLoading}
                  autoComplete="organization"
                />
              </div>

              <div>
                <label
                  htmlFor="organizationType"
                  className={cn(
                    "block text-sm font-medium mb-1.5",
                    isDark ? "text-neutral-300" : "text-neutral-700"
                  )}
                >
                  Type
                </label>
                <Select
                  id="organizationType"
                  name="organizationType"
                  value={formData.organizationType}
                  onChange={handleChange}
                  disabled={isLoading}
                >
                  <option value="" disabled>Select type</option>
                  <option value="Hospital">Hospital</option>
                  <option value="Health System">Health System</option>
                  <option value="Clinic">Clinic</option>
                  <option value="FQHC">FQHC</option>
                  <option value="Other">Other</option>
                </Select>
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className={cn(
                  "block text-sm font-medium mb-1.5",
                  isDark ? "text-neutral-300" : "text-neutral-700"
                )}
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                  disabled={isLoading}
                  autoComplete="new-password"
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
              {formData.password && (
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
                Confirm password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>

            <p className={cn(
              "text-xs text-center",
              isDark ? "text-neutral-500" : "text-neutral-500"
            )}>
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="underline hover:no-underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="underline hover:no-underline">
                Privacy Policy
              </Link>
            </p>
          </form>

          {/* Sign in link */}
          <p className={cn(
            "mt-8 text-center text-sm",
            isDark ? "text-neutral-400" : "text-neutral-600"
          )}>
            Already have an account?{' '}
            <Link
              to="/login"
              className={cn(
                "font-medium",
                isDark
                  ? "text-teal-400 hover:text-teal-300"
                  : "text-teal-600 hover:text-teal-700"
              )}
            >
              Sign in
            </Link>
          </p>

          {/* Back to home */}
          <p className={cn(
            "mt-4 text-center text-sm",
            isDark ? "text-neutral-500" : "text-neutral-500"
          )}>
            <Link to="/" className="hover:underline">
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
        <div className="max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className={cn(
              "text-2xl font-semibold mb-6",
              "text-white"
            )}>
              Everything you need to fight claim denials
            </h2>

            <div className="space-y-4">
              {[
                {
                  title: 'AI-Powered Predictions',
                  description: 'Identify high-risk claims before submission',
                },
                {
                  title: 'Automated Appeals',
                  description: 'Generate winning appeal letters in seconds',
                },
                {
                  title: 'Real-Time Analytics',
                  description: 'Track denial trends and recovery rates',
                },
                {
                  title: 'Seamless Integration',
                  description: 'Connect with your existing EHR/EMR systems',
                },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg",
                    isDark ? "bg-neutral-800/50" : "bg-white/10"
                  )}
                >
                  <CheckCircle2 className={cn(
                    "h-5 w-5 mt-0.5 flex-shrink-0",
                    isDark ? "text-teal-400" : "text-teal-100"
                  )} />
                  <div>
                    <p className="font-medium text-white">
                      {feature.title}
                    </p>
                    <p className={cn(
                      "text-sm",
                      isDark ? "text-neutral-400" : "text-teal-100"
                    )}>
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
