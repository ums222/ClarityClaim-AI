import SectionContainer from "../shared/SectionContainer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Phone, Mail } from "lucide-react";
import { Card } from "../ui/card";
import { useTheme } from "../../hooks/useTheme";

const FinalCTASection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Demo request submitted");
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
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`text-xs font-medium ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                    Full Name
                  </label>
                  <Input required placeholder="Jane Doe" className="mt-1" />
                </div>
                <div>
                  <label className={`text-xs font-medium ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                    Work Email
                  </label>
                  <Input required type="email" placeholder="jane.doe@hospital.org" className="mt-1" />
                </div>
              </div>

              <div>
                <label className={`text-xs font-medium ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                  Organization Name
                </label>
                <Input required placeholder="Regional Medical Center" className="mt-1" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={`text-xs font-medium ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                    Organization Type
                  </label>
                  <Select defaultValue="" className="mt-1">
                    <option value="" disabled>Select type</option>
                    <option>Hospital</option>
                    <option>Health System</option>
                    <option>Clinic</option>
                    <option>FQHC</option>
                    <option>Other</option>
                  </Select>
                </div>
                <div>
                  <label className={`text-xs font-medium ${isDark ? "text-neutral-400" : "text-neutral-600"}`}>
                    Monthly Claim Volume
                  </label>
                  <Select defaultValue="" className="mt-1">
                    <option value="" disabled>Select volume</option>
                    <option>&lt;1K</option>
                    <option>1K–10K</option>
                    <option>10K–50K</option>
                    <option>50K+</option>
                  </Select>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full">
                Request Demo
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
              <a href="/login" className="text-teal-500 hover:underline">
                Sign in
              </a>
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
