import SectionContainer from "../shared/SectionContainer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { Phone, Mail } from "lucide-react";
import { Card } from "../ui/card";

const FinalCTASection = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Demo request submitted");
  };

  return (
    <SectionContainer id="contact" className="section-bg-cta">
      <div className="rounded-3xl p-6 md:p-10">
        <div className="grid gap-8 md:grid-cols-2 md:items-start">
          {/* LEFT - HEADLINE */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clarity-secondary">
              GET STARTED
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Ready to Stop Losing Revenue?
            </h2>
            <p className="text-sm ">
              Join hundreds of healthcare organizations using ClarityClaim AI to fight denials and
              recover millions.
            </p>
          </div>

          {/* RIGHT - FORM */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-3">

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="text-[11px] font-medium ">
                    Full Name
                  </label>
                  <Input required placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="text-[11px] font-medium ">
                    Work Email
                  </label>
                  <Input
                    required
                    type="email"
                    placeholder="jane.doe@hospital.org"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium ">
                  Organization Name
                </label>
                <Input required placeholder="Regional Medical Center" />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="text-[11px] font-medium ">
                    Organization Type
                  </label>
                  <Select defaultValue="">
                    <option value="" disabled>Select type</option>
                    <option>Hospital</option>
                    <option>Health System</option>
                    <option>Clinic</option>
                    <option>FQHC</option>
                    <option>Other</option>
                  </Select>
                </div>
                <div>
                  <label className="text-[11px] font-medium ">
                    Monthly Claim Volume
                  </label>
                  <Select defaultValue="">
                    <option value="" disabled>Select volume</option>
                    <option>&lt;1K</option>
                    <option>1K\u201310K</option>
                    <option>10K\u201350K</option>
                    <option>50K+</option>
                  </Select>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full mt-2">
                Request Demo
              </Button>

              <p className="text-[11px] text-slate-400 text-center">
                We respect your privacy. No spam, ever.
              </p>
            </form>

            {/* CONTACT INFO BOXES */}
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <Card className="flex items-center gap-3 bg-slate-900/80 p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950">
                  <Phone className="h-4 w-4 text-clarity-secondary" />
                </span>
                <div>
                  <p className="font-semibold">Prefer to talk?</p>
                  <p className="text-xs text-slate-400">+1 (555) 123-4567</p>
                </div>
              </Card>

              <Card className="flex items-center gap-3 bg-slate-900/80 p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950">
                  <Mail className="h-4 w-4 text-clarity-secondary" />
                </span>
                <div>
                  <p className="font-semibold">Email us</p>
                  <p className="text-xs text-slate-400">hello@clarityclaim.ai</p>
                </div>
              </Card>
            </div>

            <p className="text-xs text-slate-400">
              Already a customer?{" "}
              <a href="/login" className="text-clarity-accent underline">
                Sign in
              </a>
            </p>

            <div className="flex flex-wrap gap-2 text-[10px] ">
              <span className="rounded-full border border-slate-700 px-3 py-1">
                HIPAA
              </span>
              <span className="rounded-full border border-slate-700 px-3 py-1">
                SOC 2
              </span>
              <span className="rounded-full border border-slate-700 px-3 py-1">
                99.99% uptime
              </span>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default FinalCTASection;
