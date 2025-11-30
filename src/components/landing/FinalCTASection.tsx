import { useState } from "react";
import SectionContainer from "../shared/SectionContainer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Phone, Mail, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Card } from "../ui/card";
import { useTheme } from "../../hooks/useTheme";
import { api, type DemoRequestData } from "../../lib/api";

const FinalCTASection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const [formData, setFormData] = useState<DemoRequestData>({
    fullName: "",
    email: "",
    organizationName: "",
    organizationType: "",
    monthlyClaimVolume: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear status when user starts typing
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await api.submitDemoRequest(formData);
      
      setSubmitStatus({
        type: "success",
        message: response.message || "Demo request submitted successfully! We'll be in touch soon.",
      });
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        organizationName: "",
        organizationType: "",
        monthlyClaimVolume: "",
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus({ type: null, message: "" });
      }, 5000);
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        axiosError.message ||
        "Failed to submit demo request. Please try again later.";
      
      setSubmitStatus({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionContainer
      id="contact"
      className={isDark ? "bg-neutral-900" : "bg-neutral-50"}
    >
      <div className={`rounded-2xl p-6 md:p-10 ${isDark ? "bg-neutral-950 ring-1 ring-neutral-800" : "bg-white ring-1 ring-neutral-200"}`}>
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          {/* LEFT - HEADLINE */}
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-wider text-teal-500">
              Get Started
            </p>
            <h2 className={`text-3xl md:text-4xl font-semibold tracking-tight ${isDark ? "text-white" : "text-neutral-900"}`}>
              Ready to Stop Losing Revenue?
            </h2>
            <p className={`text-base ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              Join hundreds of healthcare organizations using ClarityClaim AI to fight denials and recover millions.
            </p>
          </div>

          {/* RIGHT - FORM */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Status Messages */}
              {submitStatus.type && (
                <div
                  className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
                    submitStatus.type === "success"
                      ? isDark
                        ? "bg-teal-500/10 text-teal-400 ring-1 ring-teal-500/20"
                        : "bg-teal-50 text-teal-700 ring-1 ring-teal-500/20"
                      : isDark
                      ? "bg-red-500/10 text-red-400 ring-1 ring-red-500/20"
                      : "bg-red-50 text-red-700 ring-1 ring-red-500/20"
                  }`}
                >
                  {submitStatus.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  )}
                  <p className="text-xs">{submitStatus.message}</p>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`text-xs font-medium ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                    Full Name
                  </label>
                  <Input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    placeholder="Jane Doe"
                    className="mt-1"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className={`text-xs font-medium ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                    Work Email
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="jane.doe@hospital.org"
                    className="mt-1"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className={`text-xs font-medium ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                  Organization Name
                </label>
                <Input
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleInputChange}
                  required
                  placeholder="Regional Medical Center"
                  className="mt-1"
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`text-xs font-medium ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                    Organization Type
                  </label>
                  <Select
                    name="organizationType"
                    value={formData.organizationType}
                    onChange={handleInputChange}
                    className="mt-1"
                    disabled={isSubmitting}
                  >
                    <option value="" disabled>Select type</option>
                    <option value="Hospital">Hospital</option>
                    <option value="Health System">Health System</option>
                    <option value="Clinic">Clinic</option>
                    <option value="FQHC">FQHC</option>
                    <option value="Other">Other</option>
                  </Select>
                </div>
                <div>
                  <label className={`text-xs font-medium ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                    Monthly Claim Volume
                  </label>
                  <Select
                    name="monthlyClaimVolume"
                    value={formData.monthlyClaimVolume}
                    onChange={handleInputChange}
                    className="mt-1"
                    disabled={isSubmitting}
                  >
                    <option value="" disabled>Select volume</option>
                    <option value="<1K">&lt;1K</option>
                    <option value="1K–10K">1K–10K</option>
                    <option value="10K–50K">10K–50K</option>
                    <option value="50K+">50K+</option>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Request Demo"
                )}
              </Button>

              <p className={`text-xs text-center ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
                We respect your privacy. No spam, ever.
              </p>
            </form>

            {/* Contact info */}
            <div className="grid gap-3 md:grid-cols-2">
              <a href="tel:+15551234567" className="block">
                <Card className="flex items-center gap-3 p-4 cursor-pointer hover:ring-2 hover:ring-teal-500/50 transition-all">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${isDark ? "bg-neutral-800" : "bg-neutral-100"}`}>
                    <Phone className="h-4 w-4 text-teal-500" />
                  </span>
                  <div>
                    <p className={`text-sm font-medium ${isDark ? "text-white" : "text-neutral-900"}`}>Prefer to talk?</p>
                    <p className={`text-xs ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>+1 (555) 123-4567</p>
                  </div>
                </Card>
              </a>

              <a href="mailto:hello@clarityclaim.ai" className="block">
                <Card className="flex items-center gap-3 p-4 cursor-pointer hover:ring-2 hover:ring-teal-500/50 transition-all">
                  <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${isDark ? "bg-neutral-800" : "bg-neutral-100"}`}>
                    <Mail className="h-4 w-4 text-teal-500" />
                  </span>
                  <div>
                    <p className={`text-sm font-medium ${isDark ? "text-white" : "text-neutral-900"}`}>Email us</p>
                    <p className={`text-xs ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>hello@clarityclaim.ai</p>
                  </div>
                </Card>
              </a>
            </div>

            <p className={`text-xs ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
              Already a customer?{" "}
              <button 
                onClick={() => window.open('mailto:support@clarityclaim.ai?subject=Customer%20Login%20Access', '_blank')}
                className="text-teal-500 hover:underline"
              >
                Contact support for access
              </button>
            </p>

            <div className="flex flex-wrap gap-2">
              {["HIPAA", "SOC 2", "99.99% uptime"].map((badge) => (
                <span 
                  key={badge}
                  className={`text-[10px] rounded-full px-2.5 py-1 ${isDark ? "bg-neutral-800 text-neutral-400" : "bg-neutral-100 text-neutral-600"}`}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default FinalCTASection;
