import { useState } from "react";
import { Link } from "react-router-dom";
import SectionContainer from "../shared/SectionContainer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Phone, Mail, CheckCircle } from "lucide-react";
import { Card } from "../ui/card";
import { useTheme } from "../../hooks/useTheme";
import { submitDemoRequest, type DemoRequestData } from "../../lib/api";

const FinalCTASection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    organizationName: "",
    organizationType: "",
    monthlyClaimVolume: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await submitDemoRequest(formData as DemoRequestData);

    if (!result.success) {
      setError(result.error || "An error occurred. Please try again.");
      setIsSubmitting(false);
      return;
    }

    setSubmitted(true);
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <SectionContainer
        id="contact"
        className={isDark ? "bg-neutral-900" : "bg-neutral-50"}
      >
        <div className={`rounded-2xl p-6 md:p-10 ${isDark ? "bg-neutral-950 ring-1 ring-neutral-800" : "bg-white ring-1 ring-neutral-200"}`}>
          <div className="text-center py-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500 mb-4">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h2 className={`text-2xl md:text-3xl font-semibold mb-2 ${isDark ? "text-white" : "text-neutral-900"}`}>
              Thank You!
            </h2>
            <p className={`text-base mb-6 ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
              We've received your demo request. Our team will reach out within 24 hours.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  fullName: "",
                  email: "",
                  organizationName: "",
                  organizationType: "",
                  monthlyClaimVolume: "",
                });
              }}
            >
              Submit Another Request
            </Button>
          </div>
        </div>
      </SectionContainer>
    );
  }

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
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
                  {error}
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
                  />
                </div>
                <div>
                  <label className={`text-xs font-medium ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                    Work Email
                  </label>
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    type="email"
                    placeholder="jane.doe@hospital.org"
                    className="mt-1"
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
                  >
                    <option value="" disabled>Select volume</option>
                    <option value="< 1K">&lt;1K</option>
                    <option value="1K-10K">1K–10K</option>
                    <option value="10K-50K">10K–50K</option>
                    <option value="50K+">50K+</option>
                  </Select>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
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
              <Card className="flex items-center gap-3 p-4">
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${isDark ? "bg-neutral-800" : "bg-neutral-100"}`}>
                  <Phone className="h-4 w-4 text-teal-500" />
                </span>
                <div>
                  <p className={`text-sm font-medium ${isDark ? "text-white" : "text-neutral-900"}`}>Prefer to talk?</p>
                  <p className={`text-xs ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>+1 (555) 123-4567</p>
                </div>
              </Card>

              <Card className="flex items-center gap-3 p-4">
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${isDark ? "bg-neutral-800" : "bg-neutral-100"}`}>
                  <Mail className="h-4 w-4 text-teal-500" />
                </span>
                <div>
                  <p className={`text-sm font-medium ${isDark ? "text-white" : "text-neutral-900"}`}>Email us</p>
                  <p className={`text-xs ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>hello@clarityclaim.ai</p>
                </div>
              </Card>
            </div>

            <p className={`text-xs ${isDark ? "text-neutral-500" : "text-neutral-500"}`}>
              Already a customer?{" "}
              <Link to="/login" className="text-teal-500 hover:underline">
                Sign in
              </Link>
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
