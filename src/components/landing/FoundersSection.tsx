import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";
import SectionContainer from "../shared/SectionContainer";
import SectionHeader from "../shared/SectionHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";

const founders = [
  {
    role: "Co-Founder & CEO",
    name: "Umidjon Saidkhujaev",
    linkedin: "https://www.linkedin.com/in/usaidkhujaev",
    bio: "Principal Architect and Business Intelligence expert with deep experience in AI/ML-driven analytics. Leads strategic vision, product direction, and enterprise healthcare transformation initiatives.",
  },
  {
    role: "Co-Founder & CTO",
    name: "Fahriddin Salaydinov",
    linkedin: "https://www.linkedin.com/in/fahriddinsr",
    bio: "Technical architect specializing in AI systems, cloud engineering, and large-scale automation. Leads the platform's machine learning, infrastructure, and product engineering.",
  },
  {
    role: "Co-Founder & COO",
    name: "Sherzod Esanov",
    linkedin: "https://www.linkedin.com/in/sherzodesanov",
    bio: "Operations and analytics expert with deep experience in revenue cycle, data strategy, and implementation. Oversees delivery, customer success, and operational excellence.",
  },
];

const FoundersSection = () => {
  return (
    <SectionContainer id="founders"  className="bg-white dark:bg-slate-950">
      <SectionHeader
        eyebrow="FOUNDING TEAM"
        title="Built by Healthcare, AI & Operations Leaders"
        subtitle="A team with complementary strengths—combining healthcare domain expertise, advanced AI engineering, and world-class operational execution."
        align="center"
      />

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {founders.map((f, i) => (
          <motion.div
            key={f.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Card className="flex h-full flex-col bg-slate-900/70 hover:-translate-y-1 hover:shadow-glow-primary transition-all duration-200">
              <CardHeader>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-slate-200">
                    {f.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>

                  <div>
                    <CardTitle className="text-base">{f.name}</CardTitle>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-clarity-secondary">
                      {f.role}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col justify-between">
                <CardDescription className="text-sm text-slate-300">
                  {f.bio}
                </CardDescription>

                <div className="mt-4 flex items-center justify-between">
                  <button
                    className="text-[11px] font-medium text-clarity-accent hover:underline underline-offset-4"
                    type="button"
                  >
                    View full bio →
                  </button>

                  <a
                    href={f.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`LinkedIn profile of ${f.name}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900/70 text-slate-300 hover:text-slate-50 hover:border-slate-500"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </SectionContainer>
  );
};

export default FoundersSection;
