import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Shield,
  CheckCircle,
  ArrowRight,
  Clock,
  Send,
} from "lucide-react";
import NavBar from "../components/landing/NavBar";
import Footer from "../components/landing/Footer";
import SectionContainer from "../components/shared/SectionContainer";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";
import { useTheme } from "../hooks/useTheme";
import { submitContactForm, type ContactFormData } from "../lib/api";
import { cn } from "../lib/utils";

const ContactPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    organizationName: "",
    organizationType: "",
    monthlyClaimVolume: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await submitContactForm(formData as ContactFormData);

    if (!result.success) {
      setError(result.error || "An error occurred. Please try again.");
      setIsSubmitting(false);
      return;
    }

    setFormSubmitted(true);
    setIsSubmitting(false);
  };

  const trustBadges = [
    { label: "HIPAA Compliant", icon: Shield },
    { label: "SOC 2 Type II", icon: CheckCircle },
    { label: "HITRUST Certified", icon: Shield },
    { label: "99.99% Uptime", icon: Clock },
  ];

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        isDark ? "bg-slate-950 text-slate-50" : "bg-white text-slate-900"
      )}
    >
      <NavBar />

      <main className="pt-20 md:pt-24">
        {/* Hero Section */}
        <SectionContainer className={isDark ? "bg-slate-950" : "bg-slate-50"}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-4">Get in Touch</Badge>
            <h1
              className={cn(
                "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4",
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              Let's Transform Your{" "}
              <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                Revenue Cycle
              </span>
            </h1>
            <p
              className={cn(
                "text-lg md:text-xl",
                isDark ? "text-slate-400" : "text-slate-600"
              )}
            >
              Ready to see how ClarityClaim AI can reduce denials and recover
              lost revenue? Fill out the form below or schedule a demo directly.
            </p>
          </motion.div>
        </SectionContainer>

        {/* Contact Form & Info */}
        <SectionContainer className={isDark ? "bg-slate-900/50" : "bg-white"}>
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className={cn("p-6 md:p-8", isDark ? "bg-slate-900/70" : "bg-white")}>
                {formSubmitted ? (
                  <div className="text-center py-12">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500 mb-4">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <h3
                      className={cn(
                        "text-2xl font-bold mb-2",
                        isDark ? "text-white" : "text-slate-900"
                      )}
                    >
                      Thank You!
                    </h3>
                    <p
                      className={cn(
                        "text-base mb-6",
                        isDark ? "text-slate-400" : "text-slate-600"
                      )}
                    >
                      We've received your request. A member of our team will
                      reach out within 24 hours to schedule your personalized
                      demo.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFormSubmitted(false);
                        setFormData({
                          fullName: "",
                          email: "",
                          organizationName: "",
                          organizationType: "",
                          monthlyClaimVolume: "",
                          message: "",
                        });
                      }}
                    >
                      Submit Another Request
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2
                      className={cn(
                        "text-2xl font-bold mb-2",
                        isDark ? "text-white" : "text-slate-900"
                      )}
                    >
                      Request a Demo
                    </h2>
                    <p
                      className={cn(
                        "text-sm mb-6",
                        isDark ? "text-slate-400" : "text-slate-600"
                      )}
                    >
                      Fill out the form below and we'll get back to you within
                      24 hours.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
                          {error}
                        </div>
                      )}

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label
                            className={cn(
                              "text-xs font-medium mb-1.5 block",
                              isDark ? "text-slate-400" : "text-slate-600"
                            )}
                          >
                            Full Name *
                          </label>
                          <Input
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                            placeholder="Jane Doe"
                          />
                        </div>
                        <div>
                          <label
                            className={cn(
                              "text-xs font-medium mb-1.5 block",
                              isDark ? "text-slate-400" : "text-slate-600"
                            )}
                          >
                            Work Email *
                          </label>
                          <Input
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            type="email"
                            placeholder="jane.doe@hospital.org"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          className={cn(
                            "text-xs font-medium mb-1.5 block",
                            isDark ? "text-slate-400" : "text-slate-600"
                          )}
                        >
                          Organization Name *
                        </label>
                        <Input
                          name="organizationName"
                          value={formData.organizationName}
                          onChange={handleInputChange}
                          required
                          placeholder="Regional Medical Center"
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label
                            className={cn(
                              "text-xs font-medium mb-1.5 block",
                              isDark ? "text-slate-400" : "text-slate-600"
                            )}
                          >
                            Organization Type *
                          </label>
                          <Select
                            name="organizationType"
                            value={formData.organizationType}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="" disabled>
                              Select type
                            </option>
                            <option value="Hospital">Hospital</option>
                            <option value="Health System">Health System</option>
                            <option value="Physician Practice">Physician Practice</option>
                            <option value="Clinic">Clinic</option>
                            <option value="FQHC">FQHC</option>
                            <option value="Ambulatory Surgery Center">Ambulatory Surgery Center</option>
                            <option value="Billing Company">Billing Company</option>
                            <option value="Other">Other</option>
                          </Select>
                        </div>
                        <div>
                          <label
                            className={cn(
                              "text-xs font-medium mb-1.5 block",
                              isDark ? "text-slate-400" : "text-slate-600"
                            )}
                          >
                            Monthly Claim Volume *
                          </label>
                          <Select
                            name="monthlyClaimVolume"
                            value={formData.monthlyClaimVolume}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="" disabled>
                              Select volume
                            </option>
                            <option value="< 1,000">&lt; 1,000</option>
                            <option value="1,000 - 5,000">1,000 – 5,000</option>
                            <option value="5,000 - 10,000">5,000 – 10,000</option>
                            <option value="10,000 - 50,000">10,000 – 50,000</option>
                            <option value="50,000+">50,000+</option>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label
                          className={cn(
                            "text-xs font-medium mb-1.5 block",
                            isDark ? "text-slate-400" : "text-slate-600"
                          )}
                        >
                          How can we help? (Optional)
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          className={cn(
                            "flex w-full rounded-xl border px-3 py-2 text-sm min-h-[100px] resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clarity-secondary focus-visible:ring-offset-2",
                            isDark
                              ? "border-slate-700 bg-slate-900/70 text-slate-50 placeholder:text-slate-500 focus-visible:ring-offset-slate-950"
                              : "border-slate-300 bg-white/70 text-slate-900 placeholder:text-slate-400 focus-visible:ring-offset-white"
                          )}
                          placeholder="Tell us about your current challenges with claims management, denials, or revenue cycle..."
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="animate-spin mr-2">⏳</span>
                            Submitting...
                          </>
                        ) : (
                          <>
                            Request Demo
                            <Send className="h-4 w-4" />
                          </>
                        )}
                      </Button>

                      <p
                        className={cn(
                          "text-xs text-center",
                          isDark ? "text-slate-500" : "text-slate-500"
                        )}
                      >
                        By submitting this form, you agree to our{" "}
                        <Link
                          to="/privacy-policy"
                          className="text-clarity-secondary hover:underline"
                        >
                          Privacy Policy
                        </Link>
                        . We respect your privacy and will never spam you.
                      </p>
                    </form>
                  </>
                )}
              </Card>
            </motion.div>

            {/* Contact Info & Schedule Demo */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Schedule Demo Card */}
              <Card
                className={cn(
                  "p-6",
                  isDark
                    ? "bg-gradient-to-br from-clarity-secondary/20 to-slate-900 border-clarity-secondary/30"
                    : "bg-gradient-to-br from-clarity-secondary/10 to-white border-clarity-secondary/20"
                )}
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-clarity-secondary/20 text-clarity-secondary flex-shrink-0">
                    <Calendar className="h-6 w-6" />
                  </span>
                  <div className="flex-1">
                    <h3
                      className={cn(
                        "text-lg font-semibold mb-1",
                        isDark ? "text-white" : "text-slate-900"
                      )}
                    >
                      Prefer to Schedule Directly?
                    </h3>
                    <p
                      className={cn(
                        "text-sm mb-4",
                        isDark ? "text-slate-400" : "text-slate-600"
                      )}
                    >
                      Pick a time that works for you and get a personalized demo
                      with one of our product specialists.
                    </p>
                    <a
                      href="https://cal.com/clarityclaim/demo"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button>
                        Book a Demo
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>

              {/* Contact Details */}
              <Card className={cn("p-6", isDark ? "bg-slate-900/70" : "bg-white")}>
                <h3
                  className={cn(
                    "text-lg font-semibold mb-4",
                    isDark ? "text-white" : "text-slate-900"
                  )}
                >
                  Contact Information
                </h3>

                <div className="space-y-4">
                  <a
                    href="tel:+15551234567"
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-xl transition-colors",
                      isDark
                        ? "hover:bg-slate-800"
                        : "hover:bg-slate-50"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        isDark ? "bg-slate-800" : "bg-slate-100"
                      )}
                    >
                      <Phone className="h-5 w-5 text-clarity-secondary" />
                    </span>
                    <div>
                      <p
                        className={cn(
                          "text-sm font-medium",
                          isDark ? "text-white" : "text-slate-900"
                        )}
                      >
                        Phone
                      </p>
                      <p
                        className={cn(
                          "text-sm",
                          isDark ? "text-slate-400" : "text-slate-600"
                        )}
                      >
                        +1 (555) 123-4567
                      </p>
                    </div>
                  </a>

                  <a
                    href="mailto:hello@clarityclaim.ai"
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-xl transition-colors",
                      isDark
                        ? "hover:bg-slate-800"
                        : "hover:bg-slate-50"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        isDark ? "bg-slate-800" : "bg-slate-100"
                      )}
                    >
                      <Mail className="h-5 w-5 text-clarity-secondary" />
                    </span>
                    <div>
                      <p
                        className={cn(
                          "text-sm font-medium",
                          isDark ? "text-white" : "text-slate-900"
                        )}
                      >
                        Email
                      </p>
                      <p
                        className={cn(
                          "text-sm",
                          isDark ? "text-slate-400" : "text-slate-600"
                        )}
                      >
                        hello@clarityclaim.ai
                      </p>
                    </div>
                  </a>

                  <div
                    className={cn(
                      "flex items-center gap-4 p-3 rounded-xl"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        isDark ? "bg-slate-800" : "bg-slate-100"
                      )}
                    >
                      <MapPin className="h-5 w-5 text-clarity-secondary" />
                    </span>
                    <div>
                      <p
                        className={cn(
                          "text-sm font-medium",
                          isDark ? "text-white" : "text-slate-900"
                        )}
                      >
                        Headquarters
                      </p>
                      <p
                        className={cn(
                          "text-sm",
                          isDark ? "text-slate-400" : "text-slate-600"
                        )}
                      >
                        San Francisco, CA
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Trust Badges */}
              <Card className={cn("p-6", isDark ? "bg-slate-900/70" : "bg-white")}>
                <h3
                  className={cn(
                    "text-lg font-semibold mb-4",
                    isDark ? "text-white" : "text-slate-900"
                  )}
                >
                  Enterprise-Grade Security
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {trustBadges.map((badge) => {
                    const Icon = badge.icon;
                    return (
                      <div
                        key={badge.label}
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-lg",
                          isDark ? "bg-slate-800/50" : "bg-slate-50"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4",
                            isDark ? "text-emerald-400" : "text-emerald-600"
                          )}
                        />
                        <span
                          className={cn(
                            "text-xs font-medium",
                            isDark ? "text-slate-300" : "text-slate-700"
                          )}
                        >
                          {badge.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          </div>
        </SectionContainer>

        {/* FAQ or Additional Info */}
        <SectionContainer className={isDark ? "bg-slate-950" : "bg-slate-50"}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2
              className={cn(
                "text-2xl md:text-3xl font-bold mb-4",
                isDark ? "text-white" : "text-slate-900"
              )}
            >
              Not Ready for a Demo?
            </h2>
            <p
              className={cn(
                "text-base mb-6",
                isDark ? "text-slate-400" : "text-slate-600"
              )}
            >
              Explore our resources to learn more about how ClarityClaim AI can
              transform your revenue cycle.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/product">
                <Button variant="outline">Explore Features</Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline">View Pricing</Button>
              </Link>
              <Link to="/resources">
                <Button variant="outline">Read Case Studies</Button>
              </Link>
            </div>
          </motion.div>
        </SectionContainer>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
