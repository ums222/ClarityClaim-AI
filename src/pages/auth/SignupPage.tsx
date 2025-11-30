import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Building2, ArrowRight, Loader2, Check } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../contexts/AuthContext";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { toast } from "sonner";

const SignupPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const { signUp, isConfigured } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    organizationName: "",
    organizationType: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    
    if (!formData.organizationName) newErrors.organizationName = "Organization name is required";
    if (!formData.organizationType) newErrors.organizationType = "Organization type is required";
    
    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the terms";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await signUp(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        organization_name: formData.organizationName,
        organization_type: formData.organizationType,
      });
      
      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("Email already registered", {
            description: "Please sign in or use a different email.",
          });
        } else {
          toast.error("Signup failed", {
            description: error.message,
          });
        }
        return;
      }
      
      toast.success("Account created!", {
        description: isConfigured 
          ? "Please check your email to verify your account."
          : "You can now sign in to your account.",
      });
      
      navigate("/login");
    } catch (error) {
      toast.error("Signup failed", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordRequirements = [
    { label: "At least 8 characters", met: formData.password.length >= 8 },
    { label: "Contains a number", met: /\d/.test(formData.password) },
    { label: "Contains uppercase", met: /[A-Z]/.test(formData.password) },
    { label: "Contains special character", met: /[!@#$%^&*]/.test(formData.password) },
  ];

  return (
    <div className={cn("min-h-screen flex", isDark ? "bg-neutral-950" : "bg-neutral-50")}>
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <div className="w-full max-w-md py-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <img
              src={isDark ? "/orbitlogo-dark.svg" : "/orbitlogo.svg"}
              alt="ClarityClaim AI"
              className="h-8 w-auto"
            />
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className={cn("text-2xl font-bold mb-2", isDark ? "text-white" : "text-neutral-900")}>
              Create your account
            </h1>
            <p className={cn("text-sm", isDark ? "text-neutral-400" : "text-neutral-600")}>
              Start your 14-day free trial. No credit card required.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                  First Name
                </label>
                <div className="relative">
                  <User className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
                    isDark ? "text-neutral-500" : "text-neutral-400"
                  )} />
                  <Input
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={cn("pl-10", errors.firstName && "border-red-500")}
                  />
                </div>
                {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                  Last Name
                </label>
                <Input
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                Work Email
              </label>
              <div className="relative">
                <Mail className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
                  isDark ? "text-neutral-500" : "text-neutral-400"
                )} />
                <Input
                  type="email"
                  name="email"
                  placeholder="john@hospital.org"
                  value={formData.email}
                  onChange={handleChange}
                  className={cn("pl-10", errors.email && "border-red-500")}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Organization */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                  Organization
                </label>
                <div className="relative">
                  <Building2 className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
                    isDark ? "text-neutral-500" : "text-neutral-400"
                  )} />
                  <Input
                    name="organizationName"
                    placeholder="Regional Medical Center"
                    value={formData.organizationName}
                    onChange={handleChange}
                    className={cn("pl-10", errors.organizationName && "border-red-500")}
                  />
                </div>
                {errors.organizationName && <p className="text-xs text-red-500 mt-1">{errors.organizationName}</p>}
              </div>
              <div>
                <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                  Type
                </label>
                <Select
                  name="organizationType"
                  value={formData.organizationType}
                  onChange={handleChange}
                  className={errors.organizationType ? "border-red-500" : ""}
                >
                  <option value="" disabled>Select type</option>
                  <option value="hospital">Hospital</option>
                  <option value="health_system">Health System</option>
                  <option value="clinic">Clinic</option>
                  <option value="fqhc">FQHC</option>
                  <option value="other">Other</option>
                </Select>
                {errors.organizationType && <p className="text-xs text-red-500 mt-1">{errors.organizationType}</p>}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                Password
              </label>
              <div className="relative">
                <Lock className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
                  isDark ? "text-neutral-500" : "text-neutral-400"
                )} />
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={cn("pl-10 pr-10", errors.password && "border-red-500")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className={cn("h-4 w-4", isDark ? "text-neutral-500" : "text-neutral-400")} />
                  ) : (
                    <Eye className={cn("h-4 w-4", isDark ? "text-neutral-500" : "text-neutral-400")} />
                  )}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              
              {/* Password requirements */}
              {formData.password && (
                <div className="mt-2 grid grid-cols-2 gap-1">
                  {passwordRequirements.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <Check className={cn(
                        "h-3 w-3",
                        req.met ? "text-emerald-500" : isDark ? "text-neutral-600" : "text-neutral-400"
                      )} />
                      <span className={cn(
                        "text-xs",
                        req.met ? "text-emerald-500" : isDark ? "text-neutral-500" : "text-neutral-500"
                      )}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className={cn("text-sm font-medium mb-1.5 block", isDark ? "text-neutral-300" : "text-neutral-700")}>
                Confirm Password
              </label>
              <div className="relative">
                <Lock className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
                  isDark ? "text-neutral-500" : "text-neutral-400"
                )} />
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={cn("pl-10", errors.confirmPassword && "border-red-500")}
                />
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-neutral-300 text-teal-600 focus:ring-teal-500"
              />
              <label
                htmlFor="terms"
                className={cn("text-sm", isDark ? "text-neutral-400" : "text-neutral-600")}
              >
                I agree to the{" "}
                <Link to="/terms" className="text-teal-500 hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link to="/privacy" className="text-teal-500 hover:underline">Privacy Policy</Link>
              </label>
            </div>
            {errors.terms && <p className="text-xs text-red-500">{errors.terms}</p>}

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Sign in link */}
          <p className={cn("text-sm text-center mt-6", isDark ? "text-neutral-400" : "text-neutral-600")}>
            Already have an account?{" "}
            <Link to="/login" className="text-teal-500 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Image/Branding */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-teal-500 to-teal-700 p-12">
        <div className="max-w-lg text-white">
          <h2 className="text-3xl font-bold mb-4">
            Join 500+ Healthcare Organizations
          </h2>
          <p className="text-lg text-teal-100 mb-8">
            Start recovering lost revenue today. Our AI-powered platform helps healthcare organizations fight claim denials and improve their bottom line.
          </p>
          <div className="space-y-4">
            {[
              "✓ 14-day free trial with full access",
              "✓ No credit card required",
              "✓ Setup in under 24 hours",
              "✓ Dedicated onboarding support",
              "✓ HIPAA compliant & SOC 2 certified",
            ].map((item, idx) => (
              <p key={idx} className="text-teal-100">{item}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
